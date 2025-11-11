const mongoose = require("mongoose");
const foodModel = require("../models/foodModel");
const orderModel = require("../models/orderModel");

const createFoodController = async (req, res) => {
    try{
        const { 
            title, 
            description,
            price,
            imageUrl,
            foodTags,
            category,
            code,
            isAvailable,
            restaurant,
            rating
        } = req.body;

        if(!title || !description || !price || !restaurant){
            return res.status(500).json({
                "success": false,
                "message": "Please fill the mandatory fields"
            });
        }

        const isMatch = await foodModel.findOne({title, restaurant});

        if(isMatch){
            return res.status(409).json({
                "success": false,
                "message": "Food item already exists for the given restaurant"
            });
        }

        const newFood = new foodModel({
            title, 
            description,
            price,
            imageUrl,
            foodTags,
            category,
            code,
            isAvailable,
            restaurant,
            rating
        });

        await newFood.save();

        res.status(201).json({
            "success": true,
            "message": "New food saved successfully",
            newFood
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            "success": false,
            "message": "An error occured in create food api"
        })
    }
}

const getAllFoodController = async (req, res) => {

    try{
        const food = await foodModel.distinct("title");

        if(food.length == 0){
            return res.status(404).json({
                "success": false,
                "message": "No food item found"
            });
        }

        res.status(200).json({
            "success": true,
            "foodCount": food.length,
            food
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            "success": false,
            "message": "An error occured in get food api"
        });
    }
}

const getSingleFoodController = async (req, res) => {
    try{
        const id = req.params.id;

        const food = await foodModel.findById(id);

        if(!food){
            return res.status(400).json({
                "success": false,
                "message": "Invalid food id"
            });
        }

        res.status(200).json({
            "success": true,
            "message": "Food item fetched successfully",
            food
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            "success": false,
            "message": "An error ocured in get food by id api"
        })
    }
}

const getFoodByRestaurantController = async (req, res) => {
    try{
        const id = req.params.id;

        if(!id){
            return res.status(400).json({
                "success": false,
                "message": "Invalid restaurant id"
            });
        }

        const food = await foodModel.find({restaurant: id});

        if(!food){
            return res.status(404).json({
                "success": false,
                "message": "Given restaurant has no food items or restaurant does not exists"
            });
        }

        res.status(200).json({
            "success": true,
            "foodCount": food.length,
            food
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            "success": false,
            "message": "An error occured in get food by restaurant api"
        })
    }
}

const updateFoodController = async (req, res) => {
    try{
        const id = req.params.id;

        if(!id){
            return res.status(400).json({
                "success": false,
                "message": "Invalid food id"
            });
        }

        const food = await foodModel.findById(id);

        if(!food){
            return res.status(404).json({
                "success": false,
                "message": "No such food item found"
            });
        }

        const {
            title, 
            description,
            price,
            imageUrl,
            foodTags,
            category,
            code,
            isAvailable,
            restaurant,
            rating
        } = req.body;

        const updatedFood = await foodModel.findByIdAndUpdate(id, {
            title, 
            description,
            price,
            imageUrl,
            foodTags,
            category,
            code,
            isAvailable,
            restaurant,
            rating
        }, {new: true});

        res.status(201).json({
            "success": true,
            "message": "Fields updated successfully",
            updatedFood
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            "success": false,
            "message": "An error occured in update food api"
        });
    }
}

const deleteFoodController = async (req, res) => {
    try{
        const id = req.params.id;

        if(!id){
            return res.status(400).json({
                "success": false,
                "message": "Invalid food id"
            });
        }

        const isMatch = await foodModel.findById(id);

        if(!isMatch){
            return res.status(404).json({
                "success": false,
                "message": "Food item not found or already deleted"
            });
        }

        await foodModel.findByIdAndDelete(id);

        res.status(200).json({
            "success": true,
            "message": "Food item deleted successfully"
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            "success": false,
            "message": "An error occured in delete food api"
        })
    }
}

const placeOrderController = async (req, res) => {
    try{
        const { cart } = req.body;
        
        if(!cart){
            return res.status(400).json({
                "success": false,
                "message": "Please add food to card or choose the payment method"
            });
        }

        let total = 0;

        cart.map((i) => {
            total += i.price;
        });

        const newOrder = new orderModel({
            foods: cart,
            payment: total,
            buyer: req.body.id
        });

        await newOrder.save();

        res.status(201).json({
            "success": true,
            "message": "Order placed successfully",
            newOrder
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            "success": false,
            "message": "An error occured in place order api"
        });
    }
}

const orderStatusController = async (req, res) => {
    try{
        const id = req.params.id;

        if(!id){
            return res.status(404).json({
                "success": false,
                "message": "Invalid order id"
            });
        }

        const { status } = req.body;

        const order = await orderModel.findByIdAndUpdate(id, {status}, {new: true});

        res.status(200).json({
            "success": true,
            "message": "Order status updated successfully"
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            "success": false,
            "message": "An error occured in order status api"
        })
    }
}

module.exports = { createFoodController, getAllFoodController, getSingleFoodController, getFoodByRestaurantController, updateFoodController, deleteFoodController, placeOrderController, orderStatusController }