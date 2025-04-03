const express = require('express')
const router = express.Router()
const User = require('../database/user_schema')

router.post('/signup', async(req, res)=>{
    const input = {
        profileImage: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Ffree-photos-vectors%2Fprofile&psig=AOvVaw0VcAaL8v7N65T0mfbgMUBy&ust=1743789257848000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCMCVmKy3vIwDFQAAAAAdAAAAABAE",
        firstName: 'Anubhav',
        lastName: 'Shukla',
        age: 24,
        gender: "male",
        emailId: "kumaranubhav691@gmail.com",
        password: "password",
        mobileNo: "7493824269"
    }

    const user = new User(input)

    await user.save()
    res.send("signup request completed")
})

module.exports = router;