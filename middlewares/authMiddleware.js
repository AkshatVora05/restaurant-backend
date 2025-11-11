const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err){
                return res.status(500).json({
                    "success": false,
                    "message": "Unauthorized user"
                });
            }
            else{
                req.body.user = decoded.user;
                next();
            }
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            "success": false,
            "message": "An error occured in auth API"
        })
    }
}