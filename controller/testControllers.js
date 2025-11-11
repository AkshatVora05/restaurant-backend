const testUserController = (req, res) => {
    try{
        res.status(200).json({
            "success": true,
            "message": "Test user Data API"
        })
    }
    catch(err){
        console.log("An error occured in test api");
    }
}

module.exports = {testUserController};