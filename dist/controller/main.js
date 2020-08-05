import { GameMatrix } from '../models/GameMatrix.js'
import { NewGameMatrix } from '../models/NewGameMatrix.js'
import { Renderer } from '../views/Renderer.js'

const gameMatrix = new NewGameMatrix(8, 8)
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

const handleStart = () => {
  renderer.renderBoard(gameMatrix.newGame())
  renderer.renderScore(gameMatrix.getGameState())
}

const handlePlayerSelect = function () {
  $('.home-button-players.active').removeClass('active')
  $(this).addClass('active')
  gameMatrix.gameMode = $(this).attr('data-gameMode')
}

const handleCompSelect = function () {
  $('.home-button-comp.active').removeClass('active')
  $(this).addClass('active')

  gameMatrix.compMode = $(this).attr('data-gameMode')
}

const handleNetworkSelect = function () {
  $('.home-button-network.active').removeClass('active')
  $(this).addClass('active')

  gameMatrix.netMode = $(this).attr('data-gameMode')
}

const init = () => {
  renderer.renderHomeScreen()
}
init()

const handleKeyPress = event => {
  let keycode = event.keyCode ? event.keyCode : event.which
  gameMatrix.movePlayer(controlMapping[keycode].p, controlMapping[keycode].d)
  renderer.renderBoard(gameMatrix.getMatrix())
  renderer.renderScore(gameMatrix.getGameState())
}

$('body').on('click', '.home-button-network', handleNetworkSelect)
$('body').on('click', '.home-button-comp', handleCompSelect)
$('body').on('click', '.home-button-players', handlePlayerSelect)
$('body').on('click', '#btn-start', handleStart)
$(document).keypress(handleKeyPress)
