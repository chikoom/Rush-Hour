import { GameMatrix } from '../models/GameMatrix.js'
import { NewGameMatrix } from '../models/NewGameMatrix.js'
import { Renderer } from '../views/Renderer.js'

const gameMatrix = new NewGameMatrix(5, 5)
const renderer = new Renderer()

const controlMapping = {
  119: { p: 1, d: 'up' },
  97: { p: 1, d: 'left' },
  115: { p: 1, d: 'down' },
  100: { p: 1, d: 'right' },
  105: { p: 2, d: 'up' },
  106: { p: 2, d: 'left' },
  107: { p: 2, d: 'down' },
  108: { p: 2, d: 'right' },
}

const init = () => {
  renderer.renderBoard(gameMatrix.newGame())
}
init()

const handleKeyPress = event => {
  let keycode = event.keyCode ? event.keyCode : event.which
  gameMatrix.movePlayer(controlMapping[keycode].p, controlMapping[keycode].d)
  renderer.renderBoard(gameMatrix.getMatrix())
}

$(document).keypress(handleKeyPress)
