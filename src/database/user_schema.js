const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({

    profileImage: {
        type: String,  // Stores the image URL
        required: false
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
        lowercase: true,
    },
    emailId: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    mobileNo:{
        type: String,
        required: true,
    },
},{timestamps: true})

const User = mongoose.model('User', userSchema)

module.exports = User;
