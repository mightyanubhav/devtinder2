const express = require('express')
const router = express.Router()
const User = require('../database/user_schema')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

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

router.post('/login', async(req, res) =>{
    try{
        // first authenticate user
        // check for email & check the password 
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user){
            throw new Error("invalid credentials")
        }
        const match = await bcrypt.compare(password, user.password);
        if(!match){
            throw new Error("invalid credentials")
        }
        // send jwt token cookie

        const token = jwt.sign({userId: user._id}, "Secret_Key", {expiresIn: '1d'})
        res.cookie("token", token).json({ message: "Login successful", token });

        // response with login successful .
        res.send("login successful")
    }catch(e){
        res.status(400).json({message:e.message} )
    }
})
router.post('/logout', (req, res) => {
    res.cookie("token", "", { expires: new Date(0), httpOnly: true }).json({ message: "Logout successful" });
});

module.exports = router;