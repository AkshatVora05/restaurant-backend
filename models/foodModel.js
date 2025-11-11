const mongoose = require('mongoose');

const foodSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Food title is required']
    },
    description: {
        type: String,
        required: [true, 'Food description is required']
    },
    price: {
        type: Number,
        required: [true, 'Food price is required']
    },
    imageUrl: {
        type: String,
        default: "https://png.pngtree.com/png-vector/20220623/ourmid/pngtree-food-logo-png-image_5296974.png"
    },
    foodTags: {
        type: String
    },
    category: {
        type: String
    },
    code: {
        type: String
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: [true, 'Restaurant is required']
    },
    rating: {
        type: Number,
        default: 5,
        min: 1,
        max: 5
    },
    ratingCount: {
        type: Number
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Foods", foodSchema);