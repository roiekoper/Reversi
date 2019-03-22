export default class SoundPlayer {
    constructor(soundSrcName) {
        this.sound = document.createElement("audio");
        this.sound.src = soundSrcName;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
    }

    play = () => {
        this.sound.play();
      }
    stop = () => {
        this.sound.pause();
      }
}