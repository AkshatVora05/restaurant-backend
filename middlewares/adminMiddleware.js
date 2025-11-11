const userModel = require('../models/userModel');

module.exports = async (req, res, next) => {
    try{
        const user = await userModel.findById(req.body.id);
        if(user.userType !== "admin"){
            return res.status(401).json({
                "success": false,
                "message": "Only admin access"
            });
        }
        next();
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            "success": false,
            "message": "Unauthorized access"
        })
    }
}