export default class Timer {
    constructor(gameId) {
        this.seconds = 0;
        this.gameId = gameId;
        this.render();
        this.interval = setInterval(this.timeHandler.bind(this), 1000); // tick every 1 sec
    }

    timeHandler = () => {
        this.seconds++;
        this.minElement.textContent = `${pad(parseInt(this.seconds / 60))}`;
        this.secondsElement.textContent = `${pad(parseInt(this.seconds % 60))}`;
    };

    reset = () => {
        this.seconds = -1;
        this.timeHandler();
        this.interval = setInterval(this.timeHandler.bind(this), 1000); // tick every 1 sec
    };

    pause = () => {
        window.clearInterval(this.interval);
    };

    render() {
        const timeContainer = document.createElement('div');
        timeContainer.className = 'time-container';

        const timeTitle = document.createElement('h3');
        timeTitle.className = 'time-title';
        timeTitle.textContent = 'Time: ';


        const minElement = document.createElement('h3');
        minElement.className = 'time-minutes';
        minElement.textContent = pad(this.seconds);
        this.minElement = minElement;

        const pointsElement = document.createElement('h3');
        pointsElement.textContent = ':';

        const secondsElement = document.createElement('h3');
        secondsElement.className = 'time-seconds';
        secondsElement.textContent = pad(this.seconds);
        this.secondsElement = secondsElement;

        timeContainer.appendChild(timeTitle);
        timeContainer.appendChild(minElement);
        timeContainer.appendChild(pointsElement);
        timeContainer.appendChild(secondsElement);
        document.querySelector(`#game-container-${this.gameId} .details-container`)
            .insertAdjacentElement('afterbegin', timeContainer);
    }
}

function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
}