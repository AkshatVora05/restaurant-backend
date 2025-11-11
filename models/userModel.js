const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true, "username is required"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "email is required"]
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    address: {
        type: Array
    },
    phone: {
        type: String,
        required: [true, "Number is required"]
    },
    userType: {
        type: String,
        required: [true, "User type is required"],
        default: "client",
        enum: ['client', 'admin', 'vendor', 'vendor']
    },
    profile: {
        type: String,
        default: "https://www.google.com/imgres?q=ddefault%20profile%20pic&imgurl=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F90%2Fde%2F25%2F90de257fdac14d35d66a81ab8e282cad.jpg&imgrefurl=https%3A%2F%2Fwww.pinterest.com%2Fivyrose555%2Fdefault-pfp%2F&docid=jvcMBADuZmzlcM&tbnid=H_JDb1kpksOWdM&vet=12ahUKEwiakLT1jNuQAxUFTmwGHcSnByAQM3oECBwQAA..i&w=750&h=750&hcb=2&ved=2ahUKEwiakLT1jNuQAxUFTmwGHcSnByAQM3oECBwQAA"
    }
},
{ timestamps: true });

module.exports = mongoose.model("User", userSchema)