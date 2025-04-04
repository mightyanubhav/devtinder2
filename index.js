const express = require('express')
const app = express()
const PORT = 7777;
const router = require('./src/routes/auth')
const { connect } = require('./src/database/db_connect')

const bodyParser = require('body-parser')
app.use(bodyParser.json())

app.use('/', router)


async function main(){
    await connect()

    app.listen(PORT, ()=>{
        console.log(`server up and running at port ${PORT}`)
    })

}
main()