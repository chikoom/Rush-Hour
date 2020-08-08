const express = require('express')
const path = require('path')
const Queue = require('./game/classes/Queue')
const NewGameMatrix = require('./game/classes/ServerGameMatrix')
const util = require('util')
require('dotenv').config()

const app = express()
app.use(express.static(path.join(__dirname, '../dist')))
app.use(express.static(path.join(__dirname, '../node_modules')))

const gameRooms = {
  fullRooms: new Map(),
  waitingRoom: new Queue(),
  currentRoomID: 1,
}

const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => {
  console.log(`SERVER UP AND AWAY : ${PORT}`)
})

const io = require('socket.io')(server)

io.of('/rushGame').on('connection', socket => {
  socket.emit('welcome', 'Connected to server! Waiting for opponent')
  console.log('New client connected')

  let playerID = socket.id
  console.log('New client ID', playerID)
  console.log('Searching Game Room')

  if (!gameRooms.waitingRoom.peek()) {
    const gameMatrix = new NewGameMatrix(8, 8)
    gameMatrix.newGame(playerID)

    gameRooms.waitingRoom.enqueue({
      roomId: ++gameRooms.currentRoomID,
      gameMatrix: gameMatrix,
    })

    socket.join(gameRooms.currentRoomID)
    console.log(`Added To queue | ROOM ID ${gameRooms.currentRoomID}`)
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

    console.log(`Added To Waiting Room | ID ${waitingRoomID}`)
    console.log(`ROOM FULL`)
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
    console.log('Move Player', socket.id)
    console.log('to', data.move)
    console.log('In room', data.roomID)

    console.log(
      util.inspect(gameRooms.fullRooms, { showHidden: true, depth: 99 })
    )

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

  //console.log('Full Rooms', gameRooms.fullRooms)

  // if (gameRooms.includes(room)) {
  //   socket.join(room)
  //   io.of('/rushGame').emit('newUser', 'new user has joined')
  //   return socket.emit('joinSuccess', 'You joined the room')
  // } else {
  //   return socket.emit('err', 'No room')
  // }

  // socket.emit('id', UserId++)

  // socket.on('joinRoom', room => {
  //   if (gameRooms.includes(room)) {
  //     socket.join(room)
  //     io.of('/rushGame').emit('newUser', 'new user has joined')
  //     return socket.emit('joinSuccess', 'You joined the room')
  //   } else {
  //     return socket.emit('err', 'No room')
  //   }
  // })
})

// io.listen(3031, () => {
//   console.log(`SERVER UP AND AWAY : ${PORT}`)
// })
