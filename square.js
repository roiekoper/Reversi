export default class Square {
    constructor(x, y, squareClicked) {
        this.x = x;
        this.y = y;
        this.color = null;
        this.circleElement = null;
        this.squareClicked = squareClicked;
        this.render()
    }

    render() {
        let squareElement = document.createElement('div');
        squareElement.className = 'square';
        squareElement.setAttribute('data-x', this.x);
        squareElement.setAttribute('data-y', this.y);
        this.squareElement = squareElement;
        squareElement.onclick = () => {
            this.squareClicked(this.squareClickedHandler.bind(this))
        };
        return squareElement
    }

    squareClickedHandler = (color) => {
        this.color = color;
        if(!this.circleElement)
            this.appendCircle(color);
    };

    appendCircle(color) {
        let circleElement = document.createElement('div');
        circleElement.className = 'circle';
        circleElement.setAttribute('style', `background-color:${color}`);
        this.squareElement.setAttribute('data-circled', 'true');
        this.circleElement = this.squareElement.appendChild(circleElement)
    }

    setCircleColor = (color) => {
        if (this.circleElement)
            this.circleElement.setAttribute('style', `background-color:${color}`);
        else
            this.appendCircle(color);
    };
}