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

router.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId });
    
        if (!user || !user.password) {
            throw new Error("Invalid credentials");
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw new Error("Invalid credentials");
        }

        const token = jwt.sign({ userId: user._id }, 'secret-key', {
            expiresIn: '1d'
        });

        res.status(200).cookie("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        }).json({ message: "Login successful", user });

    } catch (e) {
        res.status(400).send(e.message);
    }
});

router.post('/logout', (req, res) => {
    res.cookie("token", "", { expires: new Date(0)}).json({ message: "Logout successful" });
});

module.exports = router;