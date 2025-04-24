const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const router = require('./src/routes/auth')
const profileRouter = require('./src/routes/profile')
const requestRouter = require('./src/routes/request')
const userRouter = require('./src/routes/user')
const { connect } = require('./src/database/db_connect')

const PORT = 7777

// ✅ CORS: Must be before routes
app.use(cors({
  origin: 'http://localhost:5173', // only allow this origin
  credentials: true                // required for cookies
}))

// ✅ Parsing
app.use(cookieParser())
app.use(bodyParser.json())

// ✅ Routes
app.use('/', router)
app.use('/profile', profileRouter)
app.use('/request', requestRouter)
app.use('/user', userRouter)

async function main() {
  await connect()
  app.listen(PORT, () => {
    console.log(`server up and running at port ${PORT}`)
  })
}
main()
