export default class PopUp {
    constructor(gameElement, message, statistics, newGameHandler, players) {
        this.gameElement = gameElement;
        this.message = message;
        this.statistics = statistics;
        this.element = null;
        this.newGameHandler = newGameHandler;
        this.players = players;

        this.render();
    }

    render() {
        this.element = document.createElement('div');
        this.element.classList.add('popup');

        let titleElement = document.createElement('h1');
        titleElement.innerHTML = this.message;

        let statisticsElement = document.createElement('h2');
        statisticsElement.textContent = 'Statistics:';

        let newGameContainerElement = document.createElement('div');
        newGameContainerElement.classList.add('button-container');

        let newGameButtonElement = document.createElement('button');
        newGameButtonElement.textContent = 'New Game';
        newGameButtonElement.onclick = () => {
            this.newGameHandler(this);
        };

        newGameContainerElement.appendChild(newGameButtonElement);
        this.element.appendChild(titleElement);
        this.element.appendChild(statisticsElement);
        this.element.appendChild(newGameContainerElement);
        this.gameElement.insertBefore(this.element,this.gameElement.firstChild);
    }

    destroy = () => {
        this.element.remove();
    }
}
