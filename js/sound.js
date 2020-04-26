const sound = new Vue({
  el: "#sound",
  data: {
    allowSound: false,
    backgroundMusic: audio.supermario3,
    gameSounds: audio,
  },
  methods: {
    soundOn: function () {
      this.allowSound = true;
      this.startMusic();
    },
    soundOff: function () {
      this.allowSound = false;
      this.stopMusic();
    },
    startMusic: function () {
      if (this.allowSound) {
        if (this.backgroundMusic) {
          this.backgroundMusic.play();
        }
        this.backgroundMusic.loop = true;
      }
    },
    stopMusic: function () {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
      this.backgroundMusic.loop = false;
    },
  },
});
