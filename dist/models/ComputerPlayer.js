import { ComputerLogic } from '../models/ComputerLogic.js'
import { Player } from '../models/Player.js'
export class ComputerPlayer extends Player {
  constructor(compLevel, id, nickname, position, moveDirection) {
    super(id, nickname, position, moveDirection)
    this.brain = new ComputerLogic(compLevel)
  }
  computerMove(gameData) {
    this.brain.nextMove(gameData)
  }
}
