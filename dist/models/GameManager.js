import { GameMatrix } from './GameMatrix.js'

export class GameManager {
  constructor() {
    this._gamePrefs = {
      numberOfRows: 10,
      numberOfCols: 10,
      numberOfPlayers: '1',
      compMode: 'min',
      netMode: 'local',
      gameType: 'free',
      players: [
        {
          id: 1,
          number: 1,
          nickname: 'idan',
          type: 'human',
        },
        {
          id: 2,
          number: 2,
          nickname: 'kundofon',
          type: 'human',
        },
      ],
    }
    this._controlMapping = {
      119: { p: 1, d: 'up' },
      97: { p: 1, d: 'left' },
      115: { p: 1, d: 'down' },
      100: { p: 1, d: 'right' },
      105: { p: 2, d: 'up' },
      106: { p: 2, d: 'left' },
      107: { p: 2, d: 'down' },
      108: { p: 2, d: 'right' },
    }
    this.socket = {}
    this.gameMatrix = {}
  }

  get gamePrefs() {
    return this._gamePrefs
  }

  get controlMapping() {
    return this._controlMapping
  }

  newGame() {
    this.gameMatrix = new GameMatrix(this._gamePrefs)
  }

  async newRemoteGame() {
    if (
      this._gamePrefs.numberOfPlayers === '2' &&
      this._gamePrefs.netMode === 'remote'
    ) {
      this.socket = io('https://rush-driver.herokuapp.com/rushGame')
      return this.socket
    }
  }
}
