const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({

    profileImage: {
        type: String,  // Stores the image URL
        required: false
    },
    firstName: {
        type: String,
        trim: true,
        required: true,
    },
    lastName: {
        type: String,
        trim : true,
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
        lowercase: true,
        trim: true,
        validate: {
            validator: function (v){
                return ["male", "female", "others"].includes(v)
            },
            message: "gender can either be male , female or others"
        }
    },
    emailId: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true,
        validate: {
            validator: function (value) {
              return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: 'Invalid email address format',
        },
    },
    password: {
        type: String,
        required: true,
    },
    mobileNo:{
        type: String,
        required: true,
        min: [10, "enter correct number"],
        
    },
},{timestamps: true})

const User = mongoose.model('User', userSchema)

module.exports = User;
