const express = require('express')
const path = require('path')
const http = require('http').createServer()
require('dotenv').config()

const app = express()
app.use(express.static(path.join(__dirname, '../dist')))
app.use(express.static(path.join(__dirname, '../node_modules')))

const io = require('socket.io')(http)
// io.on('connection', socket => {
//   socket.emit('welcome', 'Server: You are connected to socket server')
//   console.log('New client connected')
// })

const gameRooms = ['test']

let connections = 0
io.of('/rushGame').on('connection', socket => {
  socket.emit('welcome', 'Welcome to rush game!')
  socket.emit('id', connections++)
  console.log('New client connected')
  socket.on('joinRoom', room => {
    if (gameRooms.includes(room)) {
      socket.join(room)
      io.of('/rushGame').emit('newUser', 'new user has joined')
      return socket.emit('joinSuccess', 'You joined the room')
    } else {
      return socket.emit('err', 'No room')
    }
  })
})

io.listen(3031, () => {
  console.log(`SERVER UP AND AWAY : ${PORT}`)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`SERVER UP AND AWAY : ${PORT}`)
})
