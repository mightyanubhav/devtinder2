const express = require('express')
const router = express.Router()

router.post('/signup', (req, res)=>{
    res.send("signup request send")
})

module.exports = router;