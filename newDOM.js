import data from './data/2023pprTop300.js'

class Card {
  constructor(data, ranking) {
    this.data = data
    this.ranking = ranking
    this.element = this.createCardElement()
    this.addEventListeners()
  }

  createCardElement() {
    const card = document.createElement('div')
    card.classList.add('card')
    card.classList.add(`card${this.ranking}`)
    card.classList.add('draggable')
    card.id = `card${this.ranking}`
    card.draggable = true
    card.style.gridArea = `card${this.ranking}`

    // Create card content
    const overallStats = document.createElement('div')
    overallStats.classList.add('overall-stats')

    const overallRanking = document.createElement('p')
    overallRanking.textContent = this.data.overallRanking

    const positionalRanking = document.createElement('p')
    positionalRanking.textContent = this.data.positionalRanking

    const teamName = document.createElement('p')
    teamName.textContent = this.data.teamName

    const playerName = document.createElement('div')
    playerName.classList.add('players-name')

    const playerNameParagraph = document.createElement('p')
    playerNameParagraph.textContent = this.data.playerName

    // Set background color based on positionalRanking pattern
    const rankingPattern = this.data.positionalRanking.charAt(1) // Get the character after '('
    switch (rankingPattern) {
      case 'Q':
        card.style.backgroundColor = 'rgb(225, 14, 23)'
        break
      case 'W':
        card.style.backgroundColor = 'rgb(1, 149, 71)'
        break
      case 'R':
        card.style.backgroundColor = 'rgb(1, 159, 230)'
        break
      case 'T':
        card.style.backgroundColor = 'rgb(248, 148, 2)'
        break
      case 'D':
        card.style.backgroundColor = 'rgb(255, 239, 3)'
        overallRanking.style.color = 'black'
        teamName.style.color = 'black'
        positionalRanking.style.color = 'black'
        playerNameParagraph.style.color = 'black'
        break
      case 'K':
        card.style.backgroundColor = 'rgb(230, 0, 126)'
        break
      default:
        // Set a default color or no background color for other cases
        break
    }

    overallStats.appendChild(overallRanking)
    overallStats.appendChild(positionalRanking)
    overallStats.appendChild(teamName)

    playerName.appendChild(playerNameParagraph)

    // Append content to the card
    card.appendChild(overallStats)
    card.appendChild(playerName)

    return card
  }

  addEventListeners() {
    this.element.addEventListener('dragstart', () => {
      this.element.classList.add('dragging')
    })

    this.element.addEventListener('touchstart', (e) => {
      e.preventDefault()
    })

    this.element.addEventListener('touchmove', (e) => {
      e.preventDefault()
    })

    this.element.addEventListener('touchend', (e) => {
      e.preventDefault()
    })

    this.element.addEventListener('dragend', () => {
      this.element.classList.remove('dragging')
    })
  }
}

// Get the container element
const container = document.getElementById('cardContainer')

data.forEach((player, index) => {
  const card = new Card(player, index + 1)
  container.appendChild(card.element)
})

/* DRAG AND DROP FUNCTIONALITY */

const draggables = document.querySelectorAll('.draggable')
const containers = document.querySelectorAll('.container')

draggables.forEach((draggable) => {
  draggable.addEventListener('dragstart', () => {
    draggable.classList.add('dragging')
  })

  draggable.addEventListener('touchstart', (e) => {
    e.preventDefault()
  })

  draggable.addEventListener('touchmove', (e) => {
    e.preventDefault()
  })

  draggable.addEventListener('touchend', (e) => {
    e.preventDefault()
  })

  draggable.addEventListener('dragend', () => {
    draggable.classList.remove('dragging')
  })
})

let isDragging = false
let draggedElement = null
let correctCard
let dragToColumn

containers.forEach((container) => {
  container.addEventListener('dragover', (e) => {
    e.preventDefault()
    const draggable = document.querySelector('.dragging')
    container.appendChild(draggable)
  })

  container.addEventListener('touchstart', (e) => {
    // Prevent default touch behavior to avoid conflicts
    e.preventDefault()

    const touch = e.touches[0]
    draggedElement = touch.target
    if (draggedElement === null) {
      draggedElement = touch.target.firstChild
    } else {
      correctCard = draggedElement.closest('.card')
      console.log(draggedElement)
      console.log(correctCard)
    }

    // Mark that an element is being dragged
    isDragging = true

    // Store initial touch coordinates for calculating movement
    draggedElement.initialX = touch.clientX
    draggedElement.initialY = touch.clientY

    // Optionally, you can add a class to the dragged element for styling purposes
    draggedElement.classList.add('dragging')
  })

  container.addEventListener('touchmove', (e) => {
    e.preventDefault()

    if (isDragging) {
      const touch = e.touches[0]

      // Calculate the distance moved from the initial touch point
      const deltaX = touch.clientX - draggedElement.initialX
      const deltaY = touch.clientY - draggedElement.initialY
    }
  })

  container.addEventListener('touchend', (e) => {
    e.preventDefault()

    const touchEnd = e.changedTouches[0]
    console.log(touchEnd)
    if (document.elementFromPoint(touchEnd.pageX, touchEnd.pageY) === null) {
      dragToColumn = document
        .elementFromPoint(touchEnd.clientX, touchEnd.clientY)
        .closest('.container')
    } else {
      dragToColumn = document
        .elementFromPoint(touchEnd.pageX, touchEnd.pageY)
        .closest('.container')
    }

    if (dragToColumn != null && correctCard != null) {
      dragToColumn.append(correctCard)
    }
    if (isDragging) {
      // Remove the dragging class and reset the draggedElement
      draggedElement.classList.remove('dragging')
      draggedElement = null
      isDragging = false
    }
  })
})

/* GREYED ROWS START */
const rowsToGrey = document.querySelectorAll('#cardContainer .card')
let snakeRows = []
rowsToGrey.forEach((card) => {
  snakeRows.push(card)
})

// Initialize an empty array to store arrays of 12 elements each
const arrayOfArrays = []

// Initialize an empty subarray
let subarray = []

// Loop through the elements in the inputArray
for (let i = 0; i < snakeRows.length; i++) {
  subarray.push(snakeRows[i].id)

  // Check if the subarray has reached a length of 12
  if (subarray.length === 12 || i === snakeRows.length - 1) {
    // If the subarray has 12 elements or it's the last element of inputArray, push it into arrayOfArrays
    arrayOfArrays.push(subarray)

    // Reset the subarray to start a new one
    subarray = []
  }
}

// Initialize an empty array to store the extracted phrases
const extractedPhrases = []

// Loop through the arrays within arrayOfArrays
for (let i = 0; i < arrayOfArrays.length; i++) {
  const subarray = arrayOfArrays[i]

  // Loop through the elements in the subarray
  for (let j = 0; j < subarray.length; j++) {
    const element = subarray[j]
    // console.log(element);

    // Convert the DOM element to a string using outerHTML
    const elementString =
      element instanceof HTMLElement ? element.outerHTML : element.toString()

    // Use regular expressions to extract the card patterns (e.g., card#, card##, or card###)
    const matches = elementString.match(/\bcard\d+\b/g)

    // Check if matches were found
    if (matches && matches.length > 0) {
      // Add the captured card patterns to the extractedPhrases array
      extractedPhrases.push(...matches)
    }
  }
}

let singleCol = []

// Implement the checkElementsInDragZone and checkElementsInNestedArrays methods here

/* This code does not correctly implement the checkelementsin dragzone and checkelements in nested arrays */
const checkElementsInDragZone = () => {
  const cardDeterminingGrey = document.querySelectorAll('#dragZone .card')
  if (cardDeterminingGrey.length == 0) {
    singleCol = []
  } else {
    singleCol = []
    cardDeterminingGrey.forEach((card) => {
      if (!singleCol.includes(card.id)) {
        singleCol.push(card.id)
      }
    })
  }
}

const checkElementsInNestedArrays = (arrayToCheck, arrayToSearch) => {
  for (let i = 0; i < arrayToSearch.length; i++) {
    let matchFound = false // Track if a match is found in the nested array
    for (let j = 0; j < arrayToCheck.length; j++) {
      if (arrayToSearch[i].includes(arrayToCheck[j])) {
        matchFound = true // Set matchFound to true if a match is found

        // Loop through the elements in the nested array and add a class
        arrayToSearch[i].forEach((className) => {
          const elementsWithClass = document.querySelectorAll(
            `#cardContainer .${className}`
          )
          elementsWithClass.forEach((element) => {
            element.classList.add('presumedUnavailable')
          })
        })

        // No need to continue checking arrayToCheck if a match is found
        break
      }
    }

    // If no match is found in the nested array, remove the class
    if (!matchFound) {
      arrayToSearch[i].forEach((className) => {
        const elementsWithClass = document.querySelectorAll(
          `#cardContainer .${className}`
        )
        elementsWithClass.forEach((element) => {
          element.classList.remove('presumedUnavailable')
        })
      })
    }
  }
}
