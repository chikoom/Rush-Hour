export class Renderer {
  constructor() {
    this.templates = {
      homescreen: Handlebars.compile($(`#homescreen-template`).html()),
      gameArea: Handlebars.compile($(`#gameArea-template`).html()),
      scorebar: Handlebars.compile($(`#scorebar-template`).html()),
      menu: Handlebars.compile($(`#menu-template`).html()),
      serverMsg: Handlebars.compile($(`#serverMsg-template`).html()),
      gameOver: Handlebars.compile($(`#gameover-template`).html()),
      preScreen: Handlebars.compile($(`#preScreen-template`).html()),
    }
  }
  render(gameState) {
    if (gameState.screen === 'gameArea') {
      this.renderBoard(gameState.matrix)
      this.renderScore(gameState)
      if (gameState.winner) {
        this.renderGameOver(gameState.winner)
      }
    }
  }
  renderGameOver(winnerPlayer) {
    console.log('winner render', winnerPlayer)
    const gameOverHTML = this.templates.gameOver({
      winnerPlayer,
    })
    $('#root-container').append(gameOverHTML)
  }
  renderServerMsg(msg) {
    console.log(msg)
    const serverMsgHTML = this.templates.serverMsg({ msg })
    $('.server-msg-container').remove()
    $('#root-container').append(serverMsgHTML)
  }
  renderBoard(matrix) {
    console.log(matrix)
    const gameAreaHTML = this.templates.gameArea({ matrix })
    $('#root-container').empty().append(gameAreaHTML)
  }
  renderHomeScreen() {
    const homescreenHTML = this.templates.homescreen()
    $('#root-container').empty().append(homescreenHTML)
  }
  renderMenu(gamePrefs) {
    console.log('Game prefs', gamePrefs)
    const menuHTML = this.templates.menu({ gamePrefs })
    $('#click-to-start').hide()
    $('.homescreen-selection').remove()
    $('.homescreen').append(menuHTML)
  }
  renderScore(gameState) {
    console.log('game state', gameState)
    const scorebarHTML = this.templates.scorebar({
      gameState,
    })
    $('#root-container').append(scorebarHTML)
  }
  renderPreScreen() {
    const preScreenHTML = this.templates.preScreen({})
    $('#root-container').empty().append(preScreenHTML)
  }
}

Handlebars.registerHelper('printHelper', function (opts) {
  if (typeof this === 'object') {
    return `player-${this.number} direction-${this.moveDirection}`
  } else if (opts.fn(this) === 'x') {
    return `obstacle building-1`
  } else if (opts.fn(this) === 'c') {
    return `obstacle coin-1`
  }
  return opts.fn(this)
})

Handlebars.registerHelper('if_eq', function (a, b, opts) {
  if (a == b) {
    return opts.fn(this)
  } else {
    return opts.inverse(this)
  }
})

Handlebars.registerHelper('PlayerScore', function (a, opts) {
  return Object.values(this.gameState.players).filter(
    player => player.number === a
  )[0].score
})
