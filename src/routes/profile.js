const express = require('express')
const profileRouter = express.Router();
const { authenticate } = require('../utils/validations')
const User = require('../database/user_schema')
const bcrypt = require('bcrypt');


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
  
const jwt = require('jsonwebtoken');

profileRouter.post('/forgot-password', async (req, res) => {
  try {
    const { emailId } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) return res.status(404).send("User not found");

    // Create a short-lived reset token
    const resetToken = jwt.sign(
      { userId: user._id },
      'Reset_Secret_Key',
      { expiresIn: '15m' } // valid for 15 mins
    );

    // You would send this link via email, but we'll return it for now
    const resetLink = `http://localhost:7777/profile/reset-password/${resetToken}`;

    res.json({
      message: "Password reset link generated.",
      resetLink // In production, you’d email this!
    });

  } catch (e) {
    res.status(400).send("Error: " + e.message);
  }
});

profileRouter.post('/reset-password/:token', async (req, res) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
  
      if (!password) return res.status(400).send("New password required");
  
      // Verify token
      const decoded = jwt.verify(token, 'Reset_Secret_Key');
      const user = await User.findById(decoded.userId);
  
      if (!user) return res.status(404).send("User not found");
  
      // Hash and save new password
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
  
      await user.save();
  
      res.json({ message: "Password has been updated successfully." });
  
    }catch (e) {
        console.error(e); // ⬅️ see the actual issue in console
        if (e.name === "TokenExpiredError") {
          return res.status(400).send("Token has expired");
        }
        if (e.name === "JsonWebTokenError") {
          return res.status(400).send("Invalid token");
        }
        res.status(400).send("Something went wrong");
      }
      
  });
  

module.exports = profileRouter;