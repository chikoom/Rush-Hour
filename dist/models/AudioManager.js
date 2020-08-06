export class AudioManager {
  constructor() {
    this.musicPath = '../style/assets/sounds/music-1.mp3'
    this.musicPlayer = new Audio()
    this.musicPlayer.src = this.musicPath
    this.musicStarted = false
    this.musicPlayer.loop = true
    this.peopleSounds = {
      men: {},
      women: {},
    }
    for (let i = 1; i < 18; i++) {
      this.peopleSounds.men[i] = new Audio()
      this.peopleSounds.men[i].src = `../style/assets/sounds/m${i}.mp3`
    }
    for (let i = 1; i < 10; i++) {
      this.peopleSounds.women[i] = new Audio()
      this.peopleSounds.women[i].src = `../style/assets/sounds/f${i}.mp3`
    }
  }
  playMusic = () => {
    this.musicPlayer.play()
  }
  initAudioPlayer() {
    audio = new Audio()
    audio.play()
    playbtn = document.getElementById('playpausebtn')
    mutebtn = document.getElementById('mutebtn')
    // Add Event Handling
    playbtn.addEventListener('click', playPause)
    mutebtn.addEventListener('click', mute)
  }
  playPause() {
    if (audio.paused) {
      audio.play()
      playbtn.style.background = 'url(images/pause.png) no-repeat'
    } else {
      audio.pause()
      playbtn.style.background = 'url(images/play.png) no-repeat'
    }
  }
  mute() {
    if (audio.muted) {
      audio.muted = false
      mutebtn.style.background = 'url(images/speaker.png) no-repeat'
    } else {
      audio.muted = true
      mutebtn.style.background = 'url(images/speaker_muted.png) no-repeat'
    }
  }
}

var audio, playbtn, mutebtn, seek_bar

//window.addEventListener('load', initAudioPlayer)
