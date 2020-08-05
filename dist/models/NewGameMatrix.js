import { Matrix } from './Matrix.js'
import { Player } from './Player.js'
import { ComputerPlayer } from './ComputerPlayer.js'

export class NewGameMatrix extends Matrix {
  constructor(rows, cols) {
    super(rows, cols)
    this.gameMode = '1player'
    this.compMode = 'min'
    this.netMode = 'local'
    this.width = cols
    this.height = rows
    this.playerIds = 1
    this.players = {}
    this.numberOfCoins = 0
    this.startingPositions = [
      { x: 0, y: 0 },
      { x: rows - 1, y: cols - 1 },
    ]
  }
  getGameState() {
    return {
      players: this.players,
      numebrOfCoins: this.numberOfCoins,
    }
  }
  generateMatrix(rows, cols) {
    const matrix = []
    for (let r = 0; r < rows; r++) {
      const row = []
      for (let c = 0; c < cols; c++) {
        row.push('.')
      }
      matrix.push(row)
    }
    return matrix
  }
  newGame() {
    this.matrix = this.generateMatrix(this.width, this.height)
    if (this.gameMode === '1player') {
      this.createPlayers([
        {
          id: this.playerIds++,
          nickname: 'idan',
          type: 'human',
        },
        {
          id: this.playerIds++,
          nickname: 'lenovo',
          type: 'comp',
        },
      ])
    } else if (this.gameMode === '2players') {
      this.createPlayers([
        {
          id: this.playerIds++,
          nickname: 'idan',
          type: 'human',
        },
        {
          id: this.playerIds++,
          nickname: 'kundofon',
          type: 'human',
        },
      ])
    }

    this.createWalls()
    this.createCoins()
    return this.matrix
  }
  createPlayers(playersInfo) {
    playersInfo.forEach((player, index) => {
      const initMove = index == 1 ? 'left' : 'right'
      let newPlayer = ''
      if (player.type === 'human') {
        newPlayer = new Player(
          player.id,
          player.nickname,
          {
            x: this.startingPositions[index].x,
            y: this.startingPositions[index].y,
          },
          initMove
        )
      } else if (player.type === 'comp') {
        newPlayer = new ComputerPlayer(
          this.compMode,
          player.id,
          player.nickname,
          {
            x: this.startingPositions[index].x,
            y: this.startingPositions[index].y,
          },
          initMove
        )
      } else if (player.type === 'net') {
      }

      this.players[newPlayer.id] = newPlayer
      this.alter(newPlayer.position.x, newPlayer.position.y, newPlayer)
    })
  }
  createWalls() {
    let numberOfWalls = Math.floor((this.width * this.height) / 4)
    while (numberOfWalls) {
      let randomX = Math.floor(Math.random() * this.width)
      let randomY = Math.floor(Math.random() * this.height)
      if (
        !this.checkPlayerColusion(1, randomX, randomY) &&
        !this.checkPlayerColusion(2, randomX, randomY)
      ) {
        this.alter(randomX, randomY, 'x')
        numberOfWalls--
      }
    }
  }
  createCoins() {
    this.numberOfCoins = 0
    for (let rowI in this.matrix) {
      for (let colI in this.matrix[rowI]) {
        if (this.get(colI, rowI) === '.') {
          this.alter(colI, rowI, 'c')
          this.numberOfCoins++
        }
      }
    }
  }

  movePlayer(playerId, direction) {
    let offsetX = direction === 'right' ? 1 : 0
    offsetX = direction === 'left' ? -1 : offsetX
    let offsetY = direction === 'down' ? 1 : 0
    offsetY = direction === 'up' ? -1 : offsetY

    let newPositionX = this.players[playerId].position.x + offsetX
    let newPositionY = this.players[playerId].position.y + offsetY

    if (
      !this.checkOutbounds(newPositionX, newPositionY) &&
      !this.checkPlayerColusion(playerId, newPositionX, newPositionY) &&
      !this.checkWallColusion(newPositionX, newPositionY)
    ) {
      this.alter(
        this.players[playerId].position.x,
        this.players[playerId].position.y,
        '.'
      )
      if (this.checkCoinTake(newPositionX, newPositionY)) {
        this.players[playerId].score++
        console.log(
          `Player ${playerId} took a coin! - Score: ${this.players[playerId].score}`
        )
        this.numberOfCoins--
      }

      if (!this.coinsLeft()) {
        console.log('GameOver')
      }
      this.alter(newPositionX, newPositionY, this.players[playerId])
      this.players[playerId].position.x = newPositionX
      this.players[playerId].position.y = newPositionY
      this.players[playerId].moveDirection = direction
    } else {
      console.log(`Can't move`)
    }
  }
  checkCoinTake(posX, posY) {
    if (this.get(posX, posY) === 'c') {
      return true
    }
    return false
  }
  coinsLeft() {
    return this.numberOfCoins > 0 ? true : false
  }
  checkWallColusion(posX, posY) {
    if (this.get(posX, posY) === 'x') {
      console.log('Player Wall Colusion')
      return true
    }
    return false
  }
  checkPlayerColusion(playerId, posX, posY) {
    for (const [pID, player] of Object.entries(this.players)) {
      if (
        playerId !== pID &&
        player.position.x === posX &&
        player.position.y === posY
      ) {
        console.log('Player colusion')
        return true
      }
    }
    return false
  }
  checkOutbounds(posX, posY) {
    if (
      posX < 0 ||
      posX > this.width - 1 ||
      posY < 0 ||
      posY > this.height - 1
    ) {
      console.log('Out of bounds')
      return true
    }
    return false
  }
  getMatrix() {
    return this.matrix
  }
}
