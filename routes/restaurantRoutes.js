const express = require('express');
const { createRestaurantController, getAllRestaurantsController, getRestaurantByIdController, deleteRestaurant } = require('../controller/restaurantController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create', authMiddleware, createRestaurantController);

router.get('/getAll', getAllRestaurantsController);

router.get('/get/:id', getRestaurantByIdController);

router.delete('/delete/:id', authMiddleware, deleteRestaurant);

module.exports = router; 