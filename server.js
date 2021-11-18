const express = require('express');
const app = express()
require('dotenv').config()
const method_override = require('method-override')
const PORT = process.env.PORT
const mongoose  = require('mongoose')
const mongoURI = process.env.MONGOURI
const db = mongoose.connection


const session = require('express-session')

// Connect to Mongo
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, ()=> {
      console.log('database connected')
  })
  
db.on('error', (err) => { console.log('ERROR: ', err) })
db.on('connected', () => { console.log('mongo connected') })
db.on('disconnected', () => { console.log('mongo disconnected')})
  
app.use(express.static("public"))
app.use(express.urlencoded({extended: false}))
app.use(method_override('_method'))




console.log('Here\'s SESSION_SECRET')
console.log(process.env.SESSION_SECRET)

// now we can set up our session with our secret
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, // default more info: https://www.npmjs.com/package/express-session#resave
    saveUninitialized: false // default  more info: https://www.npmjs.com/package/express-session#resave
  }))


app.use((req, res, next) => {
  res.locals.currentUser = req.session.currentUser
  next()
})

app.get('/check-session-property', (req, res) => {
  if (req.session.someProperty) {
    res.send(req.session.someProperty)
  } else {
    res.send("We haven't set anything yet!")
  }
})

app.get('/set-session-property/:value', (req, res) => {
  
  req.session.someProperty = req.params.value
  res.redirect('/messenger')
})


const messengerController = require('./controllers/messengerController')
app.use('/messenger', messengerController)

const userController = require('./controllers/userController')
app.use('/users', userController)

app.listen(PORT, () => {  
  console.log("Well done, now I am listening...")  
})  