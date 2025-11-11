const restaurantModel = require("../models/restaurantModel");

const createRestaurantController = async (req, res) => {
    try{
        const {
            title,
            imageUrl,
            foods,
            time,
            pickup,
            delivery,
            isOpen,
            logoUrl,
            rating,
            ratingCount,
            code,
            coords
        } = req.body;

        if(!title || !coords){
            return res.status(400).json({
                "success": false,
                "message": "Please provide address and title"
            });
        }

        // const newRestaurant = new restaurantModel({
        //     title,
        //     imageUrl,
        //     foods,
        //     time,
        //     pickup,
        //     delivery,
        //     isOpen,
        //     logoUrl,
        //     rating,
        //     ratingCount,
        //     code,
        //     coords
        // });

        // await restaurantModel.save();

        const isMatch = await restaurantModel.findOne({code});

        if(isMatch){
            return res.status(409).json({
                "success": false,
                "message": "Restaurant already exists"
            });
        }

        await restaurantModel.create({
            title,
            imageUrl,
            foods,
            time,
            pickup,
            delivery,
            isOpen,
            logoUrl,
            rating,
            ratingCount,
            code,
            coords
        });

        res.status(200).json({
            "success": true,
            "message": "New restaurant created successfully"
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            "success": false,
            "message": "An error occured in create api"
        }) 
    }
};

const getAllRestaurantsController = async (req, res) => {
    try{
        const restaurants = await restaurantModel.find({});

        if(restaurants == 0){
            return res.status(404).json({
                "success": false,
                "message": "No restaurants found"
            });
        }

        res.status(200).json({
            "success": true,
            "totalRestaurants": restaurants.length,
            restaurants
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            "success": false,
            "message": "An error occured in get restaurants api"
        })
    }
}

const getRestaurantByIdController = async (req, res) => {
    try{
        const id = req.params.id;

        const isMatch = await restaurantModel.findById({_id: id});

        if(!isMatch){
            return res.status(404).json({
                "success": false,
                "message": "No such restaurant found"
            });
        }

        res.status(200).json({
            "success": true,
            "message": "Restaurant found",
            isMatch
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            "success": false,
            "message": "An error occured in get restaurant by id api"
        });
    }
}

const deleteRestaurant = async (req, res) => {
    try{
        const id = req.params.id;

        const isMatch = await restaurantModel.findOne({_id: id});

        if(!isMatch){
            return res.status(500).json({
                "success": false,
                "message": "Restaurant not found or already deleted"
            })
        }

        await restaurantModel.findByIdAndDelete({_id: id});

        res.status(200).json({
            "success": true,
            "message": "Restaurant deleted successfully"
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            "success": false,
            "message": "An error occured in delete restaurant api"
        })
    }
}

module.exports = { createRestaurantController, getAllRestaurantsController, getRestaurantByIdController, deleteRestaurant };