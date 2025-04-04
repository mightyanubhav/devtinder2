const express = require('express')
const router = express.Router()
const User = require('../database/user_schema')
const bcrypt = require('bcrypt');

router.post('/signup', async(req, res)=>{
    
    const { profileImage, firstName, lastName, age, gender, emailId, password, mobileNo } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const input = {
        profileImage, 
        firstName, 
        lastName, 
        age,
        gender, 
        emailId, 
        password: hashedPassword, 
        mobileNo
    }

    const user = new User(input)
    await user.save()
    res.send("signup request completed")
})

module.exports = router;