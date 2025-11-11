const userModel = require("../models/userModel");
const bcrypt = require('bcryptjs');
const redisClient = require('../utils/redisClient');
const { generateOTP, sendVerificationEmail } = require('../utils/emailService');

const OTP_EXPIRY_SECONDS = 600;
const OTP_COOLDOWN_SECONDS = 60;

const getUserController = async (req, res) => {
    try{
        const user = await userModel.findById({_id: req.body.user});
        // To hide id use: const user = await userModel.findById({_id: req.body.user}, {_id: 0});
        if(!user){
            return res.status(404).json({
                "success": false,
                "message": "User not found"
            });
        }

        user.password = undefined;

        res.status(200).json({
            "success": true,
            "message": "User get successful",
            user
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            "success": false,
            "message": "An error occured in user api"
        });
    }
}

const updateUserController = async (req, res) => {
    try{
        const user = await userModel.findById({_id: req.body.user});

        if(!user){
            return res.status(404).json({
                "success": false,
                "message": "User not found"
            })
        }

        const {username, address, phone} = req.body;
        if(username) user.username = username;
        if(address) user.address = address;
        if(phone) user.phone = phone;

        await user.save();
        res.status(200).json({
            "success": true,
            "message": "User details saved successfully",
            user
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            "success": false,
            "message": "An error occured in update user api"
        })
    }
}

const resetPasswordOtpController = async (req, res) => {
    try{
        const { email, newPassword } = req.body;

        if(!email || !newPassword){
            return res.status(400).json({
                "success": false,
                "message": "Please enter a mail id and password"
            });
        }

        const isMatch = await userModel.findOne({email});

        if(!isMatch){
            return res.status(404).json({
                "success": false,
                "message": "User not found"
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
        const newHashedPassword = await bcrypt.hash(newPassword, salt);

        const otp = generateOTP();

        const userData = JSON.stringify({
            email,
            password: newHashedPassword,
            otp
        });

        await redisClient.setEx(`otp:${email}`, OTP_EXPIRY_SECONDS, userData);
        await redisClient.setEx(`cooldown:${email}`, OTP_COOLDOWN_SECONDS, "1");

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
            "message": "OTP sent to your email. Proceed to reset the password."
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            "success": false,
            "status": "An error occured in reset password otp api"
        });
    }
}

const resetPasswordController = async (req, res) => {
    try{
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

        const isMatch = await userModel.findOne({email});

        if(!isMatch){
            return res.status(404).json({
                success: "User not found"
            });
        }

        await userModel.updateOne(
            { email: userData.email },
            { $set: { password: userData.password } }
        );

        isMatch.password = undefined;

        await redisClient.del(`otp:${email}`);
        await redisClient.del(`cooldown:${email}`);

        res.status(200).json({
            "success": true,
            "message": "Password updated successfully",
            isMatch
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            "success": false,
            "message": "An error occured in update password api"
        });
    }
}

const updatePasswordController = async (req, res) => {
    try{
        const id = req.body.user;
        const user = await userModel.findById({_id: id});

        if(!user){
            return res.status(404).json({
                "success": false,
                "message": "User not found"
            });
        }

        const {oldPassword, newPassword} = req.body;

        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if(!isMatch){
            return res.status(401).json({
                "success": false,
                "Message": "Old password is incorrect"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = newHashedPassword;

        await user.save();

        res.status(200).json({
            "success": true,
            "message": "Password updated successfully"
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            "success": false,
            "message": "An error occured in update password api"
        })
    }
}

const deleteUserController = async (req, res) => {
    try{
        const id = req.params.id;

        const user = await userModel.findById({_id: id});

        if(!user){
            return res.status(404).json({
                "success": false,
                "message": "User doesn't exist or already deleted"
            })
        }

        await userModel.findByIdAndDelete({_id: id});
        
        res.status(200).json({
            "success": false,
            "message": "Account deleted successfully"
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            "success": false,
            "message": "An error occured in delete user api"
        });
    }
}

module.exports = { getUserController, updateUserController, resetPasswordController, updatePasswordController, deleteUserController, resetPasswordOtpController };