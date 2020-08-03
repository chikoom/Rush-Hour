export class Renderer {
  constructor() {
    this.templates = {
      gameArea: Handlebars.compile($(`#gameArea-template`).html()),
    }
  }
  renderBoard(matrix) {
    const gameAreaHTML = this.templates.gameArea({ matrix })
    $('#gameArea').empty().append(gameAreaHTML)
  }
}

Handlebars.registerHelper('dateFormater', function (opts) {
  const dateObject = new Date(opts.fn(this))
  return `${dateObject.getDate()}/${dateObject.getMonth()}/${dateObject.getFullYear()}`
})
