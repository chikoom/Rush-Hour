//changed
class Player {
  constructor(id, number, nickname, position, moveDirection) {
    this.id = id
    this.number = number || 0
    this.nickname = nickname
    this.score = 0
    this.position = { x: position.x, y: position.y }
    this.moveDirection = moveDirection
    this.room
    this.isAlive = true
  }
}

module.exports.Player = Player
