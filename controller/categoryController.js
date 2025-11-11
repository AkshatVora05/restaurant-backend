const categoryModel = require("../models/categoryModel");

const createCategoryController = async (req, res) => {
    try{
        const {title, imageUrl} = req.body;

        if(!title){
            return res.status(409).json({
                "success": false,
                "message": "Title is required"
            });
        }

        const isMatch = await categoryModel.findOne({title});

        if(isMatch){
            res.status(409).json({
                "success": false,
                "message": "Category already exists"
            });
        }

        await categoryModel.create({
            title,
            imageUrl
        });

        res.status(201).json({
            "success": true,
            "message": "Category created successfully"
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            "success": false,
            "message": "An error occured in create category api"
        })
    }
}

const getAllCategories = async (req, res) => {
    try{
        const categories = await categoryModel.find();

        if(categories.length == 0){
            return res.status(404).json({
                "success": false,
                "message": "There are no categories available to display"
            });
        }

        res.status(200).json({
            "success": true,
            "totalCategories": categories.length,
            categories
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            "success": false,
            "message": "An error occured in get all categories api"
        })
    }
}

const updateCategoryController = async (req, res) => {
    try{
        const id = req.params.id;
        const { title, imageUrl } = req.body;

        const matchById = await categoryModel.findById(id);

        if(!matchById){
            res.status(404).json({
                "success": false,
                "message": "Category not found"
            });
        }
        
        const isMatch = await categoryModel.findOne({title});

        if(isMatch){
            return res.status(500).json({
                "success": false,
                "message": "Title is already in use"
            })
        }

        const updateCategory = await categoryModel.findByIdAndUpdate(id, {title, imageUrl}, {new: true});

        res.status(200).json({
            "success": true,
            "message": "Title update successfully"
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
        "success": false,
        "message": "An error occured in update category api"
        });
    }
}

const deleteCategoryController = async (req, res) => {
    try{
        const id = req.params.id;

        const isMatch = await categoryModel.findById(id);

        if(!isMatch){
            return res.status(404).json({
                "success": false,
                "message": "Category doesn't exist or already deleted"
            });
        }

        await categoryModel.findByIdAndDelete(id);

        res.status(200).json({
            "success": true,
            "message": "Category deleted successfully"
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            "success": false,
            "message": "An error occured in delete category api"
        })
    }
}

module.exports = { createCategoryController, updateCategoryController, deleteCategoryController, getAllCategories };