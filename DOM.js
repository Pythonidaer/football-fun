import data from './data/2023pprTop300.js'

let ranking = 1
function adjustDragZone() {
  const element = document.querySelector(`#cardContainer .card300`)
  const dragZone = document.getElementById(`dragZone`)
  dragZone.style.width = `${element.offsetWidth}px`
  console.log(element.offsetWidth)
}
function createCard(data) {
  const card = document.createElement('div')
  card.classList.add('card')
  card.classList.add(`card${ranking}`)
  card.classList.add('draggable')
  card.id = `card${ranking}`
  card.draggable = true

  card.style.gridArea = `card${ranking}`

  // Create card content
  const overallStats = document.createElement('div')
  overallStats.classList.add('overall-stats')

  const overallRanking = document.createElement('p')
  overallRanking.textContent = data.overallRanking

  const positionalRanking = document.createElement('p')
  positionalRanking.textContent = data.positionalRanking

  const teamName = document.createElement('p')
  teamName.textContent = data.teamName

  const playerName = document.createElement('div')
  playerName.classList.add('players-name')

  const playerNameParagraph = document.createElement('p')
  playerNameParagraph.textContent = data.playerName

  // Set background color based on positionalRanking pattern
  const rankingPattern = data.positionalRanking.charAt(1) // Get the character after '('
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

// Get the container element
const container = document.getElementById('cardContainer')

data.forEach((player) => {
  const card = createCard(player)
  container.appendChild(card)
  ranking++
})

adjustDragZone()

// let img = new Image()
// img.src = './assets/football.gif'

/* DRAG AND DROP FUNCTIONALITY */

const draggables = document.querySelectorAll('.draggable')
const containers = document.querySelectorAll('.container')

draggables.forEach((draggable) => {
  draggable.addEventListener('dragstart', () => {
    // console.log('drag start')
    draggable.classList.add('dragging')
  })

  draggable.addEventListener('dragend', () => {
    draggable.classList.remove('dragging')
    console.log('check lists')
    testR()
    checkElementsInNestedArrays(singleCol, arrayOfArrays)
    adjustDragZone()
  })
})

containers.forEach((container) => {
  container.addEventListener('dragover', (e) => {
    e.preventDefault()
    // const afterElement = getDragAfterElement(container, e.clientY)
    // const draggable = document.querySelector('.dragging')
    // if (afterElement == null) {
    //   container.appendChild(draggable)
    // } else {
    //   container.insertBefore(draggable, afterElement)
    // }
    const draggable = document.querySelector('.dragging')
    container.appendChild(draggable)
  })
})

/* DRAG AND DROP END */

/* GREYED ROWS START */
const rowsToGrey = document.querySelectorAll('#cardContainer .card')
// console.log(rowsToGrey)
let snakeRows = []
rowsToGrey.forEach((card) => {
  snakeRows.push(card)
})
// console.log(snakeRows)

// Initialize an empty array to store arrays of 12 elements each
const arrayOfArrays = []
// const arrayOfArraysIds = []

// Initialize an empty subarray
let subarray = []
// let subarrayId = []

// Loop through the elements in the inputArray
for (let i = 0; i < snakeRows.length; i++) {
  // Add the current element to the subarray
  //   subarray.push(snakeRows[i])
  subarray.push(snakeRows[i].id)

  // Check if the subarray has reached a length of 12
  if (subarray.length === 12 || i === snakeRows.length - 1) {
    // If the subarray has 12 elements or it's the last element of inputArray, push it into arrayOfArrays
    arrayOfArrays.push(subarray)
    // arrayOfArraysIds.push(subarrayId)

    // Reset the subarray to start a new one
    subarray = []
  }
}

console.log(arrayOfArrays)

// Initialize an empty array to store the extracted phrases
const extractedPhrases = []

// Loop through the arrays within arrayOfArrays
for (let i = 0; i < arrayOfArrays.length; i++) {
  const subarray = arrayOfArrays[i]

  // Loop through the elements in the subarray
  for (let j = 0; j < subarray.length; j++) {
    const element = subarray[j]
    // console.log(element)

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

// console.log(extractedPhrases)

// Need a function that checks #dragZone .card container when a drag event occurs
// need to repeat a lot of the above code for each card, but I don't need 12 rows just 1
// When I compare one array to the other nested array, if card1 is in [card1... card12] add a class to that entire row else remove it
let singleCol = []
const testR = () => {
  const cardDeterminingGrey = document.querySelectorAll('#dragZone .card')
  console.log(cardDeterminingGrey.length)
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
  //   console.log(singleCol)
  //   singleCol = []
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
            element.classList.add('presumedUnavailable') // Replace 'your-class-name' with the class you want to add
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
          element.classList.remove('presumedUnavailable') // Remove the class
        })
      })
    }
  }
}
