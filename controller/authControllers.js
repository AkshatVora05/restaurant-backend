const userModel = require("../models/userModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const redisClient = require('../utils/redisClient');
const { generateOTP, sendVerificationEmail } = require('../utils/emailService');

const OTP_EXPIRY_SECONDS = 600;
const OTP_COOLDOWN_SECONDS = 60;

const sendOtpController = async (req, res) => {
    try {
        const { username, email, password, phone, address } = req.body;

        if (!username || !email || !password || !phone) {
            return res.status(400).json({
                "success": false, "message": "Please provide all required details"
            });
        }

        const existing = await userModel.findOne({ "email": email });
        if (existing) {
            return res.status(409).json({
                "success": false, "message": "User already exists"
            });
        }

        const cooldownKey = `cooldown:${email}`;
        const isCoolingDown = await redisClient.get(cooldownKey);

        if (isCoolingDown) {
            const ttl = await redisClient.ttl(cooldownKey);
            return res.status(429).json({
                success: false,
                message: `Please wait ${ttl} seconds before requesting another OTP.`
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const otp = generateOTP();

        const userData = JSON.stringify({
            username,
            email,
            password: hashedPassword,
            phone,
            address,
            otp
        });
        
        await redisClient.setEx(`otp:${email}`, OTP_EXPIRY_SECONDS, userData);

        await redisClient.setEx(cooldownKey, OTP_COOLDOWN_SECONDS, "1");

        const emailSent = await sendVerificationEmail(email, otp);

        if (!emailSent) {
            await redisClient.del(`otp:${email}`);
            await redisClient.del(`cooldown:${email}`);
            return res.status(500).json({
                "success": false,
                "message": "Failed to send verification email. Try again."
            });
        }

        res.status(200).json({
            "success": true,
            "message": "Verification code sent to your email. Proceed to verification."
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            "success": false,
            "message": "An error occured in send otp controller api"
        });
    }
}

const registerController = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                "success": false,
                "message": "Please provide email and OTP"
            });
        }

        const redisKey = `otp:${email}`;
        const redisData = await redisClient.get(redisKey);

        if (!redisData) {
            return res.status(400).json({
                "success": false,
                "message": "OTP expired or invalid. Please request a new registration."
            });
        }

        const userData = JSON.parse(redisData);

        if (otp !== userData.otp) {
            return res.status(401).json({
                "success": false,
                "message": "Invalid OTP. Please check the code."
            });
        }

        const existing = await userModel.findOne({ "email": email });

        if (existing) {
            await redisClient.del(redisKey);
            return res.status(409).json({
                "success": false,
                "message": "User already exists"
            });
        }

        const user = new userModel({
            username: userData.username,
            email: userData.email,
            password: userData.password,
            address: userData.address,
            phone: userData.phone,
        });

        await user.save();

        await redisClient.del(`otp:${email}`);
        await redisClient.del(`cooldown:${email}`);

        res.status(201).send({
            "success": true,
            "message": "User registered and verified successfully"
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            "success": false,
            "message": "An error occurred in user registration api"
        });
    }
}

const loginController = async (req, res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                "success": false,
                "message": "Fill all the details"
            });
        }

        const user = await userModel.findOne({email});

        if(!user){
            return res.status(404).json({
                "success": false,
                "message": "User doesn't exists"
            });
        }

        const compare = await bcrypt.compare(password, user.password);

        if(!compare){
            return res.status(401).json({
                "success": false,
                "message": "Incorrect password"
            });
        }

        const token = jwt.sign({user: user._id}, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        user.password = undefined;
        res.status(200).json({
            "success": true,
            "message": "Login successfull",
            token,
            user
        });
    }
    catch(err){
        console.error("Login API error:", err);
        res.status(500).json({
            "success": false,
            "message": "An error occured in user login api"
        })
    }
}

module.exports = { sendOtpController, registerController, loginController};