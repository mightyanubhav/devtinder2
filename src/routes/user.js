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
        }).populate('sender', 'firstName lastName');

        res.send(data)
    }catch(e){
        res.status(400).json({message: e.message})
    }
})
userRouter.get('/connections', authenticate, async (req, res) => {
    try {
        const userId = req.user.userId;

        const connectionRequests = await Status.find({
            $or: [
                { sender: userId },
                { reciever: userId }
            ],
            status: 'accepted'
        }).populate("reciever", 'firstName lastName')
          .populate("sender", 'firstName lastName');

        const data = connectionRequests.map(x => {
            // Return the *other* user
            if (x.sender._id.toString() === userId.toString()) {
                return x.reciever;
            } else {
                return x.sender;
            }
        });

        res.json({ connections: data });

    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});




module.exports = userRouter