import { GameMatrix } from '../models/GameMatrix.js'
import { NewGameMatrix } from '../models/NewGameMatrix.js'
import { Renderer } from '../views/Renderer.js'
import { AudioManager } from '../models/AudioManager.js'

const gameMatrix = new NewGameMatrix(10, 10)
const renderer = new Renderer()
const audio = new AudioManager()

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
  gameMatrix.gamePrefs.gameMode = $(this).attr('data-gameMode')
  renderer.renderMenu(gameMatrix.getGamePrefs())
}

const handleCompSelect = function () {
  $('.home-button-comp.active').removeClass('active')
  $(this).addClass('active')

  gameMatrix.gamePrefs.compMode = $(this).attr('data-compMode')
  renderer.renderMenu(gameMatrix.getGamePrefs())
}

const handleNetworkSelect = function () {
  gameMatrix.gamePrefs.netMode = $(this).attr('data-netMode')
  renderer.renderMenu(gameMatrix.getGamePrefs())
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

const handleBodyClick = () => {
  gameMatrix.playMusic()
}

const handleStartClick = () => {
  renderer.renderMenu(gameMatrix.getGamePrefs())
}

$('body').on('click', '#click-to-start', handleStartClick)
$('body').on('click', handleBodyClick)
$('body').on('click', '.home-button-network', handleNetworkSelect)
$('body').on('click', '.home-button-comp', handleCompSelect)
$('body').on('click', '.home-button-players', handlePlayerSelect)
$('body').on('click', '#btn-start', handleStart)
$(document).keypress(handleKeyPress)
