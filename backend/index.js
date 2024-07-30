const express = require('express')
const app = express()
require("dotenv").config()
const cors=require('cors')
const port = 3300
const mongoDB = require('./db')
const userRouter=require('./routes/userRouter')
const adminRouter=require('./routes/adminRouter')

mongoDB()

app.use(cors({ credentials: true, origin: 'http://localhost:3000',methods:"GET,POST,PUT,PATCH,DELETE" }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "http://localhost:3000")
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type,Accept')
  next()
})

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/about', (req, res) => {
  res.send('About Page!')
})

app.use('/api', userRouter)
// app.use('/api',require('./routes/displayData'))
app.use('/api/admin',adminRouter)


// app.use('/api', require('./routes/Upload'))
// app.use('/api', require('./routes/Vehicle'))


app.listen(port, () => {
  console.log(`Connected in Port Number, ${port}`)
})