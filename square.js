export default class Square {
    constructor(x, y, squareClicked) {
        this.x = x;
        this.y = y;
        this.color = null;
        this.circleElement = null;
        this.potentialGainElement = null;
        this.squareClicked = squareClicked;
        this.render();

        return this;
    }

    render = () => {
        let squareElement = document.createElement('div');
        squareElement.className = 'square';
        squareElement.setAttribute('data-x', this.x);
        squareElement.setAttribute('data-y', this.y);
        this.squareElement = squareElement;
        squareElement.onclick = () => {
            this.squareClicked(this.squareClickedHandler.bind(this), this)
        };
    };


    squareClickedHandler = (color) => {
        this.changeColorTo(color);
    };

    changeColorTo = (color) => {
        this.color = color;
        if (!this.circleElement)
            this.appendCircle(color);
        else
            this.setCircleColor(color);
    };


    appendCircle = (color) => {
        let circleElement = document.createElement('div');
        circleElement.className = 'circle';
        circleElement.setAttribute('style', `background-color:${color}`);
        this.squareElement.setAttribute('data-circled', 'true');
        this.circleElement = this.squareElement.appendChild(circleElement);
    };

    setCircleColor = (color) => {
        if (this.circleElement)
            this.circleElement.setAttribute('style', `background-color:${color}`);
        else
            this.appendCircle(color);
    };

    /* Potential gain */
    appendPotentialGainNumber(num = 0) {
        let potentialGainElem = document.createElement('h2');
        potentialGainElem.className = 'potential-gain';
        this.potentialGainElement = this.squareElement.appendChild(potentialGainElem);
    }

    setPotentialGain = (num = 0) => {
        // Init
        if (!this.potentialGainElement)
            this.appendPotentialGainNumber(num);

        // Hide show element
        if (num === 0) {
            this.potentialGainElement.style.visibility = 'hidden';
        } else {
            this.potentialGainElement.style.visibility = 'visible';
        }
        // Set font size
        this.potentialGainElement.style.fontsize = `${Math.min(25 + num * 7, 60)}px`;
        this.potentialGainElement.style.opacity = Math.min(0.3 * num, 1.0);

        // Finally, set potential gain
        this.potentialGainElement.innerHTML = `${num}`;
    };

    isEmpty = () => {
        return this.color === null;
    };

    isOpponentColor = (color) => {
        return this.color !== color;
    };
}