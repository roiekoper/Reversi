export default class Statistics {
  constructor (detailsContainerElement = null, existingStatistics = null) {
    this.detailsContainerElement = detailsContainerElement
    this.playTurnCounter = 0
    this.playTurnCounterElement = null
    this.avgPlayerTurnTime = 0
    this.avgPlayerTurnTimeElement = null
    this.playerCounter2DisksLeft = 0
    this.playerCounter2DisksLeftElement = null
    this.playerTurnedDiskCounter = 0
    this.playerTurnedDiskCounterElement = null
    this.existingStatistics = existingStatistics

    this.updateWithExistingStatistics()

    if (detailsContainerElement != null) {
      this.render()
    }
  }

  render () {
    let statisticsElement = document.createElement('div')
    statisticsElement.className = 'statistics-container'

    let playTurnCounterContainerElement = document.createElement('div')
    playTurnCounterContainerElement.className = 'label-container'
    let playTurnCounterElementLabel = document.createElement('h3')
    playTurnCounterElementLabel.className = 'label'
    playTurnCounterElementLabel.innerHTML = 'Total turns:'
    this.playTurnCounterElement = document.createElement('h3')
    this.playTurnCounterElement.innerHTML = `${this.playTurnCounter}`
    playTurnCounterContainerElement.appendChild(playTurnCounterElementLabel)
    playTurnCounterContainerElement.appendChild(this.playTurnCounterElement)

    let avgPlayerTurnTimeContainerElement = document.createElement('div')
    avgPlayerTurnTimeContainerElement.className = 'label-container'
    let avgPlayerTurnTimeElementLabel = document.createElement('h3')
    avgPlayerTurnTimeElementLabel.className = 'label'
    avgPlayerTurnTimeElementLabel.innerHTML = 'Player avg response time:'
    this.avgPlayerTurnTimeElement = document.createElement('h3')
    this.avgPlayerTurnTimeElement.innerHTML = `${this.avgPlayerTurnTime}`
    avgPlayerTurnTimeContainerElement.appendChild(avgPlayerTurnTimeElementLabel)
    avgPlayerTurnTimeContainerElement.appendChild(this.avgPlayerTurnTimeElement)

    let playerCounter2DisksLeftContainerElement = document.createElement('div')
    playerCounter2DisksLeftContainerElement.className = 'label-container'
    let playerCounter2DisksLeftElementLabel = document.createElement('h3')
    playerCounter2DisksLeftElementLabel.className = 'label'
    playerCounter2DisksLeftElementLabel.innerHTML = 'Player 2 disks left occurrences:'
    this.playerCounter2DisksLeftElement = document.createElement('h3')
    this.playerCounter2DisksLeftElement.innerHTML = `${this.playerCounter2DisksLeft}`
    playerCounter2DisksLeftContainerElement.appendChild(playerCounter2DisksLeftElementLabel)
    playerCounter2DisksLeftContainerElement.appendChild(this.playerCounter2DisksLeftElement)

    let playerTurnedDiskCounterContainerElement = document.createElement('div')
    playerTurnedDiskCounterContainerElement.className = 'label-container'
    let playerTurnedDiskCounterElementLabel = document.createElement('h3')
    playerTurnedDiskCounterElementLabel.className = 'label'
    playerTurnedDiskCounterElementLabel.innerHTML = 'Player score:'
    this.playerTurnedDiskCounterElement = document.createElement('h3')
    this.playerTurnedDiskCounterElement.innerHTML = `${this.playerTurnedDiskCounter}`
    playerTurnedDiskCounterContainerElement.appendChild(playerTurnedDiskCounterElementLabel)
    playerTurnedDiskCounterContainerElement.appendChild(this.playerTurnedDiskCounterElement)

    statisticsElement.appendChild(playTurnCounterContainerElement)
    statisticsElement.appendChild(avgPlayerTurnTimeContainerElement)
    statisticsElement.appendChild(playerCounter2DisksLeftContainerElement)
    statisticsElement.appendChild(playerTurnedDiskCounterContainerElement)

    this.detailsContainerElement.appendChild(statisticsElement)
  };

  updateValueByKey (key, value) {
    this[key] = value
    if (this[`${key}Element`]) {
      this[`${key}Element`].innerHTML = value
    }
  };

  reset () {
    ['playTurnCounter', 'avgPlayerTurnTime', 'playerCounter2DisksLeft', 'playerTurnedDiskCounter'].forEach((key) => {
      this[key] = 0
      this.updateValueByKey(key, 0)
    })
  }

  updateWithExistingStatistics () {
    if (this.existingStatistics) {
      [
        'playTurnCounter', 'avgPlayerTurnTime',
        'playerCounter2DisksLeft', 'playerTurnedDiskCounter'
      ].forEach((key) => {
        this[key] = this.existingStatistics[key]
      })
    }
  };
}
