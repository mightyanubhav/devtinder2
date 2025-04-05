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

profileRouter.patch('/edit', authenticate, async (req, res) => {
    try {
      const user = await User.findById(req.user.userId);
      if (!user) return res.status(404).send("User not found");
  
      // ✅ Only these fields are allowed to be edited
      const editableFields = ['firstName', 'lastName', 'age', 'gender', 'mobileNo'];
  
      // ❌ These fields are not allowed to be changed
      const disallowedFields = ['emailId', 'password', '_id', 'createdAt', 'updatedAt'];
  
      // 🚨 Check if any disallowed field is present in the request
      const invalidFields = Object.keys(req.body).filter(key => disallowedFields.includes(key));
      if (invalidFields.length > 0) {
        return res.status(400).json({ 
          error: `You are not allowed to update these fields: ${invalidFields.join(', ')}` 
        });
      }
  
      // ✅ Apply valid updates
      editableFields.forEach(field => {
        if (req.body[field] !== undefined) {
          user[field] = req.body[field];
        }
      });
  
      const updatedUser = await user.save();
  
      res.json({
        message: "Profile updated successfully",
        user: updatedUser
      });
  
    } catch (e) {
      res.status(400).send("Error: " + e.message);
    }
  });
  
  

module.exports = profileRouter;