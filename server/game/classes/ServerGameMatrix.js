const { Matrix } = require('./Matrix')
const { Player } = require('./ServerPlayer')
const Queue = require('./Queue')

class NewGameMatrix extends Matrix {
  constructor(rows, cols) {
    super(rows, cols)
    this.numberOfCols = cols
    this.numberOfRows = rows
    this.playerIds = 1
    this.startingPositions = [
      { x: 0, y: 0 },
      { x: rows - 1, y: cols - 1 },
    ]

    this.gameState = {
      winner: null,
      hitPlayer: 'none',
      screen: 'gameArea',
      players: {},
      numberOfCoins: 0,
      matrix: this.matrix,
    }
  }
  getGameState() {
    return this.gameState
  }
  clearMatrix() {
    for (let rowIndex in this.matrix) {
      for (let itemIndex in this.matrix[rowIndex]) {
        if (!(this.matrix[rowIndex][itemIndex] instanceof Player))
          this.matrix[rowIndex][itemIndex] = '.'
      }
    }
  }
  checkBlockedItems() {
    const exploreNeighbouts = (row, col) => {
      for (let i = 0; i < 4; i++) {
        let newRow = row + directionRows[i]
        let newCol = col + directionCols[i]
        if (newRow < 0 || newCol < 0) continue
        if (newRow >= this.numberOfRows || newCol >= this.numberOfCols) continue
        if (visitedMatrix[newRow][newCol] === true) continue
        if (this.matrix[newRow][newCol] === 'x') continue
        rowColQueue.enqueue([newRow, newCol])
        visitedMatrix[newRow][newCol] = true
      }
    }
    const rowColQueue = new Queue()
    const [startRow, startCol] = [0, 0]
    rowColQueue.enqueue([startRow, startCol])
    const visitedMatrix = []
    for (let i = 0; i < this.numberOfCols; i++) visitedMatrix.push([])
    visitedMatrix[startRow][startCol] = true

    const directionRows = [-1, 1, 0, 0]
    const directionCols = [0, 0, 1, -1]
    let reachedOtherPlayer = false
    let coinsFound = 0

    while (!rowColQueue.isEmpty()) {
      let [row, col] = rowColQueue.dequeue()
      reachedOtherPlayer =
        this.matrix[row][col] instanceof Player &&
        row !== startRow &&
        col !== startCol
      coinsFound = this.matrix[row][col] === 'c' ? ++coinsFound : coinsFound
      exploreNeighbouts(row, col)
    }
    return this.gameState.numberOfCoins === coinsFound && reachedOtherPlayer
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
  newGame(playerId) {
    this.gameState.matrix = this.generateMatrix(
      this.numberOfCols,
      this.numberOfRows
    )
    this.createPlayers([
      {
        id: playerId,
        number: 1,
        nickname: 'idan',
        type: 'net',
      },
      {
        id: 0,
        number: 2,
        nickname: 'kundofon',
        type: 'net',
      },
    ])
    let isMatrixGood = false
    while (!isMatrixGood) {
      this.createWalls()
      this.createCoins()
      isMatrixGood = this.checkBlockedItems()
      if (!isMatrixGood) this.clearMatrix()
    }
    this.gameState.matrix = this.matrix
    return this.gameState.matrix
  }
  createPlayers(playersInfo) {
    playersInfo.forEach((player, index) => {
      const initMove = index == 1 ? 'left' : 'right'
      let newPlayer = ''
      newPlayer = new Player(
        player.id,
        player.number,
        player.nickname,
        {
          x: this.startingPositions[index].x,
          y: this.startingPositions[index].y,
        },
        initMove
      )
      this.gameState.players[newPlayer.id] = newPlayer
      this.alter(newPlayer.position.x, newPlayer.position.y, newPlayer)
    })
  }
  createWalls() {
    let numberOfWalls = Math.floor((this.numberOfCols * this.numberOfRows) / 4)
    while (numberOfWalls) {
      let randomX = Math.floor(Math.random() * this.numberOfCols)
      let randomY = Math.floor(Math.random() * this.numberOfRows)
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
    for (let rowI in this.gameState.matrix) {
      for (let colI in this.gameState.matrix[rowI]) {
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
        this.gameState.numberOfCoins--
        this.gameState.hitPlayer = 'male'
      } else {
        this.gameState.hitPlayer = 'none'
      }

      if (!this.coinsLeft()) {
        this.gameState.winner = this.getLeader()
      }
      this.alter(newPositionX, newPositionY, this.gameState.players[playerId])
      this.gameState.players[playerId].position.x = newPositionX
      this.gameState.players[playerId].position.y = newPositionY
      this.gameState.players[playerId].moveDirection = direction
    } else {
    }
  }
  getLeader() {
    let leader = { score: 0 }
    Object.values(this.gameState.players).forEach(player => {
      if (player.score > leader.score) leader = player
    })
    return leader
  }
  checkCoinTake(posX, posY) {
    if (this.get(posX, posY) === 'c') {
      let randomSound = Math.floor(Math.random() * 17) + 1
      return true
    }
    return false
  }
  coinsLeft() {
    return this.gameState.numberOfCoins > 0 ? true : false
  }
  checkWallColusion(posX, posY) {
    if (this.get(posX, posY) === 'x') {
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
        return true
      }
    }
    return false
  }
  checkOutbounds(posX, posY) {
    if (
      posX < 0 ||
      posX > this.numberOfCols - 1 ||
      posY < 0 ||
      posY > this.numberOfRows - 1
    ) {
      return true
    }
    return false
  }
  getMatrix() {
    return this.gameState.matrix
  }
}

module.exports = NewGameMatrix
