import { Matrix } from './Matrix.js'
import { Player } from './Player.js'
import { ComputerPlayer } from './ComputerPlayer.js'
import { AudioManager } from '../models/AudioManager.js'

export class NewGameMatrix extends Matrix {
  constructor(rows, cols) {
    super(rows, cols)

    this.width = cols
    this.height = rows
    this.playerIds = 1
    this.startingPositions = [
      { x: 0, y: 0 },
      { x: rows - 1, y: cols - 1 },
    ]
    this.audio = new AudioManager()
    this.gameState = {
      screen: '',
      players: {},
      numberOfCoins: 0,
      matrix: this.matrix,
    }
    this.gamePrefs = {
      gameMode: '1player',
      compMode: 'min',
      netMode: 'local',
    }
  }
  getGamePrefs() {
    return this.gamePrefs
  }
  getGameState() {
    return this.gameState
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
    if (
      this.gamePrefs.gameMode === '2players' &&
      this.gamePrefs.netMode === 'remote'
    ) {
      return
    }

    this.matrix = this.generateMatrix(this.width, this.height)
    if (this.gamePrefs.gameMode === '1player') {
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
    } else if (this.gamePrefs.gameMode === '2players') {
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

      this.gameState.players[newPlayer.id] = newPlayer
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
    this.gameState.numberOfCoins = 0
    for (let rowI in this.matrix) {
      for (let colI in this.matrix[rowI]) {
        if (this.get(colI, rowI) === '.') {
          this.alter(colI, rowI, 'c')
          this.gameState.numberOfCoins++
        }
      }
    }
  }

  movePlayer(playerId, direction) {
    let offsetX = direction === 'right' ? 1 : 0
    offsetX = direction === 'left' ? -1 : offsetX
    let offsetY = direction === 'down' ? 1 : 0
    offsetY = direction === 'up' ? -1 : offsetY

    let newPositionX = this.gameState.players[playerId].position.x + offsetX
    let newPositionY = this.gameState.players[playerId].position.y + offsetY

    if (
      !this.checkOutbounds(newPositionX, newPositionY) &&
      !this.checkPlayerColusion(playerId, newPositionX, newPositionY) &&
      !this.checkWallColusion(newPositionX, newPositionY)
    ) {
      this.alter(
        this.gameState.players[playerId].position.x,
        this.gameState.players[playerId].position.y,
        '.'
      )
      if (this.checkCoinTake(newPositionX, newPositionY)) {
        this.gameState.players[playerId].score++
        console.log(
          `Player ${playerId} took a coin! - Score: ${this.gameState.players[playerId].score}`
        )
        this.gameState.numberOfCoins--
      }

      if (!this.coinsLeft()) {
        console.log('GameOver')
      }
      this.alter(newPositionX, newPositionY, this.gameState.players[playerId])
      this.gameState.players[playerId].position.x = newPositionX
      this.gameState.players[playerId].position.y = newPositionY
      this.gameState.players[playerId].moveDirection = direction
    } else {
      console.log(`Can't move`)
    }
  }
  checkCoinTake(posX, posY) {
    if (this.get(posX, posY) === 'c') {
      let randomSound = Math.floor(Math.random() * 18) + 1
      this.audio.peopleSounds.men[randomSound].play()
      return true
    }
    return false
  }
  coinsLeft() {
    return this.gameState.numberOfCoins > 0 ? true : false
  }
  checkWallColusion(posX, posY) {
    if (this.get(posX, posY) === 'x') {
      console.log('Player Wall Colusion')
      return true
    }
    return false
  }
  checkPlayerColusion(playerId, posX, posY) {
    for (const [pID, player] of Object.entries(this.gameState.players)) {
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
  playMusic() {
    if (!this.audio.musicStarted) {
      this.audio.musicStarted = true
      this.audio.playMusic()
    }
  }
}
