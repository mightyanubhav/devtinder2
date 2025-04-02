const express = require('express')
const app = express()
const PORT = 7777;
const router = require('./src/routes/auth')

app.use('/', router)

app.listen(PORT, ()=>{
    console.log(`server up and running at port ${PORT}`)
}, )
