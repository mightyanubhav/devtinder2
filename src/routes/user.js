const express = require('express')
const userRouter = express.Router()
const { authenticate } = require('../utils/validations')
const User = require('../database/user_schema')
const Status = require('../database/status_schema')

userRouter.get('/requests',authenticate,  async (req, res)=>{
    try{
        const user = await User.findById(req.user.userId);

        //now authenticate get all the requests that has reciever as user._id
        const data = await Status.find({
            reciever: user._id, 
            status: 'interested'
        })

        res.send(data)
    }catch(e){
        res.status(400).json({message: e.message})
    }
})



module.exports = userRouter