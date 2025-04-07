const express = require('express')
const requestRouter = express.Router()
const { authenticate } = require('../utils/validations')
const User = require('../database/user_schema')
const Status = require('../database/status_schema')
const mongoose = require('mongoose');

requestRouter.post('/send/:status/:userId',authenticate, async(req, res) =>{
    try{
        const{ status , userId } = req.params
        const user = await User.findById(req.user.userId);
        // check if the status is either interested, or ignored
        if(!['interested','ignored'].includes(status)){
            throw new Error("invalid status")
        }
        
         // ✅ Validate ObjectId format
         if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error("Invalid user ID format");
        }

        // ✅ Check if the target user exists
        const receiverUser = await User.findById(userId);
        if (!receiverUser) {
            throw new Error("Receiver user does not exist");
        }

        const existingStatus = await Status.findOne({
            $or: [
                {sender: user._id, reciever: userId},
                {sender: userId, reciever: user._id}
            ]
        })
        if(existingStatus){
            throw new Error ("user exist before")
        }
        const data = new Status({
            sender: user._id,
            reciever: userId,
            status: status,
        })

        await data.save();
        res.send(status + " applied")

    }catch(e){
        res.status(400).json({message: e.message})
    }
})

requestRouter.post('/review/:status/:userId', authenticate, async(req, res)=>{
    const {status, userId} = req.params
    const user = await User.findById(req.user.userId)

    if(!['accepted','rejected'].includes(status)){
        throw new Error("invalid status")
    }


})

module.exports = requestRouter