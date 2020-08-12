const express = require('express')
const path = require('path')
const Queue = require('./game/classes/Queue')
const NewGameMatrix = require('./game/classes/ServerGameMatrix')
const util = require('util')
require('dotenv').config()

const app = express()
app.use(express.static(path.join(__dirname, '../dist')))
app.use(express.static(path.join(__dirname, '../node_modules')))

const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => {
  console.log(`SERVER UP AND AWAY : ${PORT}`)
})

const gameRooms = {
  fullRooms: new Map(),
  waitingRoom: new Queue(),
  currentRoomID: 1,
}

const io = require('socket.io')(server)

io.of('/rushGame').on('connection', socket => {
  socket.emit('welcome', 'Connected to server! Waiting for opponent')
  let playerID = socket.id
  if (!gameRooms.waitingRoom.peek()) {
    const gameMatrix = new NewGameMatrix(10, 10)
    gameMatrix.newGame(playerID)

    gameRooms.waitingRoom.enqueue({
      roomId: ++gameRooms.currentRoomID,
      gameMatrix: gameMatrix,
    })

    socket.join(gameRooms.currentRoomID)

    io.of('/rushGame')
      .to(gameRooms.currentRoomID)
      .emit('waiting', 'waiting for new player')
  } else {
    const waitingRoomObject = gameRooms.waitingRoom.dequeue()
    const waitingRoomID = waitingRoomObject.roomId
    socket.join(waitingRoomID)

    waitingRoomObject.gameMatrix.gameState.players[0].id = playerID
    waitingRoomObject.gameMatrix.gameState.players[playerID] =
      waitingRoomObject.gameMatrix.gameState.players[0]
    delete waitingRoomObject.gameMatrix.gameState.players[0]
    io.of('/rushGame')
      .to(waitingRoomID)
      .emit('connected', 'the game will start soon...')
    gameRooms.fullRooms.set(waitingRoomID, waitingRoomObject)

    io.of('/rushGame').to(waitingRoomID).emit('ready', {
      roomID: waitingRoomID,
      msg: 'Game ready',
      gameState: waitingRoomObject.gameMatrix.gameState,
    })
  }

  socket.on('move', data => {
    gameRooms.fullRooms
      .get(data.roomID)
      .gameMatrix.movePlayer(data.move[0], data.move[1])

    io.of('/rushGame')
      .to(data.roomID)
      .emit('move', {
        roomID: data.roomID,
        msg: 'Game move',
        gameState: gameRooms.fullRooms.get(data.roomID).gameMatrix.gameState,
      })
  })
})
