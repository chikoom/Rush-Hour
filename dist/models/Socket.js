export class Socket {
  constructor() {
    this.serverURL = 'http://localhost:3031/rushGame'
    this.socket = io.connect(this.serverURL)
    this.roomID = ''
  }
  connectToServer() {
    this.socket = io.connect(this.serverURL)

    this.socket.on('roomID', roomID => {
      this.roomID = roomID
      console.log(`Recieved room ID : ${this.roomID}`)
    })

    this.socket.on('gotData', data => {
      console.log(`Recieved Data : ${data}`)
    })
  }
  findRoom() {
    socket.emit('joinRoom', 'test')
  }
  sendData(gameData) {
    socket.emit('gameData', gameData)
  }
}

// socket.on('welcome', data => {
//   console.log(data)
// })

// socket.on('id', data => {
//   console.log(data)
// })

// socket.on('err', data => {
//   console.log(data)
// })

// socket.on('joinSuccess', data => {
//   console.log(data)
// })

// socket.on('newUser', data => {
//   console.log(data)
// })
