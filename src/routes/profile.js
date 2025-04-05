const express = require('express')
const profileRouter = express.Router();
const { authenticate } = require('../utils/validations')
const User = require('../database/user_schema')

profileRouter.get('/view',authenticate, async(req, res)=>{
    // check the jwt token is valid or not 
    // if authenticated then proceed to bring the user
    const user = await User.findById(req.user.userId);

    res.send(user)
})

module.exports = profileRouter;