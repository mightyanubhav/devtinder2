const express = require('express')
const app = express()
const PORT = 7777;
const router = require('./src/routes/auth')
const { connect } = require('./src/database/db_connect')

app.use('/', router)


async function main(){
    await connect()

    app.listen(PORT, ()=>{
        console.log(`server up and running at port ${PORT}`)
    })

}
main()