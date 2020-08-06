export class Renderer {
  constructor() {
    this.templates = {
      homescreem: Handlebars.compile($(`#homescreen-template`).html()),
      gameArea: Handlebars.compile($(`#gameArea-template`).html()),
      scorebar: Handlebars.compile($(`#scorebar-template`).html()),
      menu: Handlebars.compile($(`#menu-template`).html()),
    }
  }
  render(screen, gameState, gamePrefs) {}
  renderBoard(matrix) {
    const gameAreaHTML = this.templates.gameArea({ matrix })
    $('#root-container').empty().append(gameAreaHTML)
  }
  renderHomeScreen() {
    const homescreenHTML = this.templates.homescreem()
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
    const scorebarHTML = this.templates.scorebar({ gameState })
    $('#root-container').append(scorebarHTML)
  }
}

Handlebars.registerHelper('printHelper', function (opts) {
  if (typeof this === 'object') {
    console.log(this)
    return `player-${this.id} direction-${this.moveDirection}`
  } else if (opts.fn(this) === 'x') {
    return `obstacle building-1`
  } else if (opts.fn(this) === 'c') {
    return `obstacle coin-1`
  }
  return opts.fn(this)
})

Handlebars.registerHelper('if_eq', function (a, b, opts) {
  console.log(a)
  console.log(b)
  if (a == b) {
    return opts.fn(this)
  } else {
    return opts.inverse(this)
  }
})
