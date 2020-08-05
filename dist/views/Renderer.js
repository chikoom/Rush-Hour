export class Renderer {
  constructor() {
    this.templates = {
      homescreem: Handlebars.compile($(`#homescreen-template`).html()),
      gameArea: Handlebars.compile($(`#gameArea-template`).html()),
      scorebar: Handlebars.compile($(`#scorebar-template`).html()),
    }
  }
  renderBoard(matrix) {
    const gameAreaHTML = this.templates.gameArea({ matrix })
    $('#root-container').empty().append(gameAreaHTML)
  }
  renderHomeScreen() {
    const homescreenHTML = this.templates.homescreem()
    $('#root-container').empty().append(homescreenHTML)
  }
  renderScore(gameState) {
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
