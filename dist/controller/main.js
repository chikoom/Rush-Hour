import { Renderer } from '../views/Renderer.js'
import { SoundRender } from '../views/SoundRender.js'
import { GameManager } from '../models/GameManager.js'

const gameManager = new GameManager()
const renderer = new Renderer()
const gameSound = new SoundRender()

const socketItem = {
  socket: null,
  roomID: null,
}

const init = () => {
  renderer.renderPreScreen()
}

const handlePreScreenClick = () => {
  renderer.renderHomeScreen()
  gameSound.playSound('music-game')
}

const handleStartClick = () => {
  renderer.renderMenu(gameManager.gamePrefs)
}

const handleMenuSelection = function () {
  gameManager.gamePrefs[$(this).attr('data-name')] = $(this).attr('data-pref')
  renderer.renderMenu(gameManager.gamePrefs)
}

const handleGridInputSize = function () {
  gameManager.gamePrefs.numberOfRows = $('#xsize').val()
  gameManager.gamePrefs.numberOfCols = $('#ysize').val()
  renderer.renderMenu(gameManager.gamePrefs)
}

const handleStart = async () => {
  if (
    gameManager.gamePrefs.numberOfPlayers === '2' &&
    gameManager.gamePrefs.netMode === 'remote'
  ) {
    gameManager.newGame()
    socketItem.socket = await gameManager.newRemoteGame()
    handleSocketListners(socketItem.socket)
  } else {
    gameManager.newGame()
  }
  $(document).keypress(handleKeyPress)
  renderer.render(gameManager.gameMatrix.gameState)
}

init()

const handleKeyPress = event => {
  let keycode = event.keyCode ? event.keyCode : event.which
  if (socketItem.socket) {
    socketItem.socket.emit('move', {
      roomID: socketItem.roomID,
      move: [socketItem.socket.id, gameManager.controlMapping[keycode].d],
    })
  } else {
    gameManager.gameMatrix.movePlayer(
      gameManager.controlMapping[keycode].p,
      gameManager.controlMapping[keycode].d
    )
    renderer.render(gameManager.gameMatrix.getGameState())
    if (gameManager.gameMatrix.getGameState().hitPlayer !== 'none')
      gameSound.playSound(
        `${gameManager.gameMatrix.getGameState().hitPlayer}-${
          Math.floor(Math.random() * 17) + 1
        }`
      )
  }
}

$('body').on('click', '#pre-screen', handlePreScreenClick)
$('body').on('click', '#click-to-start', handleStartClick)
$('body').on('click', '.menu-selection', handleMenuSelection)
$('body').on('change', '.home-input-size', handleGridInputSize)
$('body').on('click', '#btn-drive', handleStart)
$('body').on('click', '#play-again', handleStartClick)
$('body').on('click', '#main-menu', handlePreScreenClick)

const handleSocketListners = socket => {
  socket.on('welcome', msg => {
    console.log(msg)
    renderer.renderServerMsg(msg)
  })
  socket.on('waiting', msg => {
    console.log(msg)
    renderer.renderServerMsg(msg)
  })
  socket.on('connected', msg => {
    console.log(msg)
    renderer.renderServerMsg(msg)
  })
  socket.on('ready', data => {
    console.log(data)
    socketItem.roomID = data.roomID
    renderer.renderServerMsg(data.msg)
    renderer.render(data.gameState)
  })
  socket.on('move', data => {
    console.log(data)
    socketItem.roomID = data.roomID
    if (data.gameState.hitPlayer !== 'none')
      gameSound.playSound(
        `${data.gameState.hitPlayer}-${Math.floor(Math.random() * 17) + 1}`
      )

    renderer.render(data.gameState)
  })
}
