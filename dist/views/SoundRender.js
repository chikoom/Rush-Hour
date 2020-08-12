export class SoundRender {
  constructor() {
    this.soundlibURL = '../style/assets/sounds/'

    this.soundPlayers = new Map()

    this.loadSounds([
      {
        name: `music-game`,
        path: `../style/assets/sounds/new-sounds/music-game.mp3`,
      },
    ])
    this.soundPlayers.get('music-game').loop = true
    for (let i = 1; i <= 17; i++) {
      this.loadSounds([
        {
          name: `male-${i}`,
          path: `../style/assets/sounds/new-sounds/male-${i}.mp3`,
        },
      ])
    }
    for (let i = 1; i <= 9; i++) {
      this.loadSounds([
        {
          name: `female-${i}`,
          path: `../style/assets/sounds/new-sounds/female-${i}.mp3`,
        },
      ])
    }
    this.musicPlayer = new Audio()

    this.peopleSounds = {
      men: {},
      women: {},
    }

    this.musicPlayer.src = this.musicPath
    this.musicPath = '../style/assets/sounds/music-1.mp3'

    this.musicPlayer.src = this.musicPath
    this.musicStarted = false
    this.musicPlayer.loop = true

    for (let i = 1; i < 18; i++) {
      this.peopleSounds.men[i] = new Audio()
      this.peopleSounds.men[i].src = `../style/assets/sounds/m${i}.mp3`
    }
    for (let i = 1; i < 10; i++) {
      this.peopleSounds.women[i] = new Audio()
      this.peopleSounds.women[i].src = `../style/assets/sounds/f${i}.mp3`
    }
  }
  loadSounds(sounds) {
    sounds.forEach(sound =>
      this.soundPlayers.set(sound.name, new Audio(sound.path))
    )
  }
  playSound(soundName) {
    this.soundPlayers.get(soundName).play()
  }

  playPause() {
    if (audio.paused) {
      audio.play()
    } else {
      audio.pause()
    }
  }
  mute() {
    this.soundPlayers.forEach(sound => (sound.muted = !sound.muted))
  }
}
