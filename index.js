const express = require('express')
const app = express()
const PORT = 7777;
const router = require('./src/routes/auth')
const profileRouter = require('./src/routes/profile')
const { connect } = require('./src/database/db_connect')

const bodyParser = require('body-parser')
app.use(bodyParser.json())

var cookieParser = require('cookie-parser')
app.use(cookieParser())

app.use('/', router)
app.use('/profile', profileRouter)



async function main(){
    await connect()

    app.listen(PORT, ()=>{
        console.log(`server up and running at port ${PORT}`)
    })

}
main()