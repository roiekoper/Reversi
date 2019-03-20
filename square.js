export default class Square {
  constructor (x, y, squareClicked) {
    this.x = x
    this.y = y
    this.squareClicked = squareClicked
    this.render()
  }

  render () {
    let squareElement = document.createElement('div')
    squareElement.className = 'square'
    squareElement.setAttribute('data-x', this.x)
    squareElement.setAttribute('data-y', this.y)
    this.squareElement = squareElement
    squareElement.onclick = () => {
      this.squareClicked(this.squareClickedHandler.bind(this))
    }
    return squareElement
  }

  squareClickedHandler = (color) => {
    const circleElement = this.squareElement.querySelectorAll('.circle')[0]

    console.log(circleElement)
    if (!circleElement) {
      let circleElement = document.createElement('div')
      circleElement.className = 'circle'
      circleElement.setAttribute('style', `background-color:${color}`)
      this.squareElement.appendChild(circleElement)
    }
  }
}