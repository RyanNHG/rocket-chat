const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const api = require('./api')
const views = require('./views')
const db = require('./db')
const middleware = require('./middleware')

// Variables
const PORT = process.env.PORT || 3000
const SECRET = process.env.SECRET || 'secret'

// Database initialization
if (db.isEmpty()) {
  db.init({
    users: []
  })
}

// Authentication initialization
passport.use(new LocalStrategy((username, password, cb) => {
  const user = db.getByQuery('users', { username, password })
  (user !== undefined)
    ? cb(null, user)
    : cb(null, false)
}))

passport.serializeUser((user, cb) => {
  cb(null, user._id)
})

passport.deserializeUser((id, cb) => {
  const user = db.getById('users', id)
  (user !== undefined)
    ? cb(null, user)
    : cb(`User not found with id: ${id}`)
})

// App initialization
const app = express()
app.use(bodyParser.json())
app.use(passport.initialize())
app.use(passport.session())

// API
app.post('/api/users', api.users.post)
app.post('')

// Views
app.get('/', views.home)
app.get('/:friend', views.chat)

app.listen(PORT, () => 
  console.log(`Rocket chat ready at http://localhost:${PORT}`)
)