export default class Square {
    constructor(y, x, squareClicked) {
        this.x = x;
        this.y = y;
        this.color = null;
        this.circleElement = null;
        this.squareElement = null;
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
    appendPotentialGainNumber = (num) => {
        const styleNum = num + 1; // skip zero to show zero on screen
        this.potentialGainElement = document.createElement('h2');
        this.potentialGainElement.className = 'potential-gain';
        this.squareElement.appendChild(this.potentialGainElement);

        // Set font size
        this.potentialGainElement.style.fontsize = `${Math.min(25 + styleNum * 7, 60)}px`;
        this.potentialGainElement.style.opacity = Math.min(0.2 * styleNum, 1.0);
        this.potentialGainElement.innerHTML = `${num}`;
    };

    removePotentialGainElement = () => {
        this.potentialGainElement && this.potentialGainElement.remove();
    };

    isEmpty = () => {
        return this.color === null;
    };

    isOpponentColor = (color) => {
        return this.color !== color;
    };
}
