import { Matrix } from './Matrix.js'
import { Player } from './Player.js'
export class GameMatrix extends Matrix {
  constructor(rows, cols) {
    this.gameMode = '1'
    super(rows, cols)
    this.width = cols
    this.height = rows
    this.playerIds = 1
    this.players = {}
    this.startingPositions = [
      { x: 0, y: 0 },
      { x: rows - 1, y: cols - 1 },
    ]
  }
  createPlayers(playersInfo) {
    playersInfo.forEach((player, index) => {
      const newPlayer = new Player(player.id, player.nickname, {
        x: this.startingPositions[index].x,
        y: this.startingPositions[index].y,
      })
      this.players[newPlayer.id] = newPlayer
      this.alter(newPlayer.position.x, newPlayer.position.y, newPlayer.id)
    })
  }
  createWalls() {
    let numberOfWalls = Math.floor((this.width * this.height) / 3)
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
    for (let rowI in this.matrix) {
      for (let colI in this.matrix[rowI]) {
        if (this.get(colI, rowI) === '.') {
          this.alter(colI, rowI, 'c')
        }
      }
    }
  }
  newGame() {
    this.createPlayers([
      {
        id: this.playerIds++,
        nickname: 'idan',
      },
      {
        id: this.playerIds++,
        nickname: 'idan',
      },
    ])
    this.createWalls()
    this.createCoins()
    return this.matrix
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
      }
      this.alter(newPositionX, newPositionY, playerId)
      this.players[playerId].position.x = newPositionX
      this.players[playerId].position.y = newPositionY
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
