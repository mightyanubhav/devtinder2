const express = require('express')
const requestRouter = express.Router()
const { authenticate } = require('../utils/validations')
const User = require('../database/user_schema')

requestRouter.post('/send/:status/:userId',authenticate, async(req, res) =>{
    const{ status , userId } = req.params
    const user = await User.findById(req.user.userId);
    
})


module.exports = requestRouter