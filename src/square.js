export default class Square {
  constructor (y, x, squareClicked) {
    this.x = x
    this.y = y
    this.color = null
    this.circleElement = null
    this.squareElement = null
    this.potentialGainElement = null
    this.squareClicked = squareClicked
    this.render()

    return this
  }

  render () {
    let squareElement = document.createElement('div')
    squareElement.className = 'square'
    squareElement.setAttribute('data-x', this.x)
    squareElement.setAttribute('data-y', this.y)
    squareElement.setAttribute('data-circled', 'false')
    squareElement.setAttribute('is-showing-gain', 'false')
    this.squareElement = squareElement
    squareElement.onclick = () => {
      this.squareClicked(this.squareClickedHandler.bind(this), this)
    }
  };

  squareClickedHandler (color) {
    this.changeColorTo(color)
  };

  changeColorTo (color) {
    this.color = color
    if (!this.circleElement)
      this.appendCircle(color)
    else
      this.setCircleColor(color)
  };

  appendCircle (color) {
    let circleElement = document.createElement('div')
    circleElement.className = 'circle'
    circleElement.setAttribute('style', `background-color:${color}`)
    this.squareElement.setAttribute('data-circled', 'true')
    this.circleElement = this.squareElement.appendChild(circleElement)
  };

  setCircleColor (color) {
    if (this.circleElement)
      this.circleElement.setAttribute('style', `background-color:${color}`)
    else
      this.appendCircle(color)
  };

  /* Potential gain */
  appendPotentialGainNumber (num, isHidden = false) {
    const styleNum = num + 1 // skip zero to show zero on screen
    this.potentialGainElement = document.createElement('h2')
    this.potentialGainElement.className = 'potential-gain'
    this.squareElement.appendChild(this.potentialGainElement)

    // Set font size
    this.potentialGainElement.style.fontsize = `${Math.min(25 + styleNum * 7, 50)}px`
    this.potentialGainElement.style.opacity = Math.min(0.2 * styleNum, 1.0)
    this.potentialGainElement.innerHTML = `${num}`

    if (isHidden) {
      this.hidePotentialGainElement()
    } else {
      this.showPotentialGainElement()
    }
  };

  removePotentialGainElement () {
    if (this.potentialGainElement) {
      this.potentialGainElement.remove()
      this.squareElement.setAttribute('is-showing-gain', 'false')
    }
  };

  hidePotentialGainElement () {
    if (this.potentialGainElement) {
      this.potentialGainElement.style.visibility = 'hidden'
      this.squareElement.setAttribute('is-showing-gain', 'false-hidden')
    }
  };

  showPotentialGainElement () {
    if (this.potentialGainElement) {
      this.potentialGainElement.style.visibility = 'visible'
      this.squareElement.setAttribute('is-showing-gain', 'true')
    }
  };

  isEmpty () {
    return this.color === null
  };

  isOpponentColor (color) {
    return this.color !== color
  };
}
