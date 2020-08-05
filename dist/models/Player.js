export class Player {
  constructor(id, nickname, position, moveDirection) {
    this.id = id
    this.nickname = nickname
    this.score = 0
    this.position = { x: position.x, y: position.y }
    this.moveDirection = moveDirection
  }
}