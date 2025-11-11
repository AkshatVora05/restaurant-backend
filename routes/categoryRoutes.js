const express = require('express');
const { createCategoryController, getAllCategories, updateCategoryController, deleteCategoryController } = require('../controller/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create', authMiddleware, createCategoryController);

router.get('/getAll', getAllCategories);

router.put('/update/:id', authMiddleware, updateCategoryController);

router.delete('/delete/:id', authMiddleware, deleteCategoryController);

module.exports = router;