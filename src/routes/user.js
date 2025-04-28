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
          .populate('sender', 'firstName lastName profileImage emailId');

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

userRouter.get('/feed', authenticate, async (req, res) => {
    try {
        const loggedInUserId = req.user.userId;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Fetch connections & sent/received requests
        const connectionRequests = await Status.find({
            $or: [
                { sender: loggedInUserId },
                { reciever: loggedInUserId }
            ],
            status: { $in: ['accepted', 'interested'] }
        });

        // Create a Set of user IDs to hide from feed
        const hideUsersFromFeed = new Set();
        connectionRequests.forEach(req => {
            hideUsersFromFeed.add(req.sender.toString());
            hideUsersFromFeed.add(req.reciever.toString());
        });
        hideUsersFromFeed.add(loggedInUserId); // Exclude self

        // Query users not in hideUsersFromFeed
        const users = await User.find({
            _id: {
                $nin: Array.from(hideUsersFromFeed)
            }
        })
        .select('firstName lastName email age gender profileImage')// Customize as needed
        .skip(skip)
        .limit(limit);

        res.json({ users });

    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});



module.exports = userRouter