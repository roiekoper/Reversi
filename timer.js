export default class Timer {
  constructor (gameId) {
    this.seconds = 0;
    this.gameId = gameId;
    this.render();
    setInterval(this.timeHandler.bind(this), 1000)
  }

  timeHandler = () => {
    this.seconds++;
    this.minElement.textContent = `${pad(parseInt(this.seconds / 60))}`;
    this.secondsElement.textContent = `${pad(parseInt(this.seconds % 60))}`;
  };

  render () {
    const timeContainer = document.createElement('div');
    timeContainer.className = 'time-container';

    const timeTitle = document.createElement('h2');
    timeTitle.className = 'time-title';
    timeTitle.textContent = 'Time: ';


    const minElement = document.createElement('h2');
    minElement.className = 'time-minutes';
    minElement.textContent = pad(this.seconds);
    this.minElement = minElement;

    const pointsElement = document.createElement('h2');
    pointsElement.textContent = ':';

    const secondsElement = document.createElement('h2');
    secondsElement.className = 'time-seconds';
    secondsElement.textContent = pad(this.seconds);
    this.secondsElement = secondsElement;

    timeContainer.appendChild(timeTitle);
    timeContainer.appendChild(minElement);
    timeContainer.appendChild(pointsElement);
    timeContainer.appendChild(secondsElement);
    document.getElementById(`game-${this.gameId}`).insertAdjacentElement('afterbegin',timeContainer);
  }
}

function pad(d) {
  return (d < 10) ? '0' + d.toString() : d.toString();
}