import data from './data/2023pprTop300.js'

let ranking = 1
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

// Initialize an empty subarray
let subarray = []

// Loop through the elements in the inputArray
for (let i = 0; i < snakeRows.length; i++) {
  // Add the current element to the subarray
  subarray.push(snakeRows[i])

  // Check if the subarray has reached a length of 12
  if (subarray.length === 12 || i === snakeRows.length - 1) {
    // If the subarray has 12 elements or it's the last element of inputArray, push it into arrayOfArrays
    arrayOfArrays.push(subarray)

    // Reset the subarray to start a new one
    subarray = []
  }
}

// console.log(arrayOfArrays)

// Initialize an empty array to store the extracted phrases
// const extractedPhrases = []

// // Loop through the arrays within arrayOfArrays
// for (let i = 0; i < arrayOfArrays.length; i++) {
//   const subarray = arrayOfArrays[i]

//   // Loop through the elements in the subarray
//   for (let j = 0; j < subarray.length; j++) {
//     const element = subarray[j]

//     // Convert the DOM element to a string using outerHTML
//     const elementString =
//       element instanceof HTMLElement ? element.outerHTML : element.toString()

//     // Use regular expressions to extract the card patterns (e.g., card#, card##, or card###)
//     const matches = elementString.match(/\bcard\d+\b/g)

//     // Check if matches were found
//     if (matches && matches.length > 0) {
//       // Add the captured card patterns to the extractedPhrases array
//       extractedPhrases.push(...matches)
//     }
//   }
// }

// console.log(extractedPhrases)

// function getDragAfterElement(container, y) {
//   const draggableElements = [
//     ...container.querySelectorAll('.draggable:not(.dragging)'),
//   ]

//   return draggableElements.reduce((closest, child) => {
//     const box = child.getBoundingClientRect()
//     const offset = y - box.top - box.height / 2
//     if (offset < 0 && offset > closest.offset) {
//       return { offset: offset, element: child }
//     } else {
//       return closest
//     }
//   })
// }

/*
function dragstart_handler(ev) {
  //   ev.dataTransfer.setDragImage(img, 10, 10)
  // Add the target element's id to the data transfer object
  console.log('dragging has started')
  ev.dataTransfer.dropEffect = 'move'
  ev.dataTransfer.setData('text/plain', ev.target.id)
  //   ev.dataTransfer.setData('text/plain', ev.target.outerHTML)
  console.log(ev.target) // the card target is the DOM element itself, in this case the card
  //   console.log(ev.target.innerHTML) // this is only the card's inner contents, not the card itself
  console.log(ev.target.outerHTML)
  console.log(ev.target.classList)
  console.log(ev.dataTransfer)
}

function dragover_handler(ev) {
  ev.preventDefault()
  ev.dataTransfer.dropEffect = 'move'
}
function drop_handler(ev) {
  ev.preventDefault()
  // Get the id of the target and add the moved element to the target's DOM
  //   const dragZone = document.getElementById('dragZone')
  //   console.log(dragZone)
  const data = ev.dataTransfer.getData('text/plain')
  //   ev.target.appendChild(document.getElementById(data))
  ev.target.appendChild(document.getElementById(data))
}

window.addEventListener('DOMContentLoaded', () => {
  // Get all elements with the "card" class
  const cardElements = document.querySelectorAll('.card')

  // Loop through the card elements and add the dragstart event listener
  cardElements.forEach((element) => {
    element.addEventListener('dragstart', dragstart_handler)
    element.addEventListener('dragover', dragover_handler)
    // element.addEventListener('dragend', drop_handler)
  })

  const dragZone = document.getElementById('dragZone')
  dragZone.addEventListener('dragend', drop_handler)
})
*/

/*
console.log(data)
*/

// function getPattern() {
//   let players = 300
//   let j = 1
//   for (let i = 1; i <= players; i++) {
//     console.log(`"card${i}"`)
// if (j % 2 != 0) {
//   console.log(
//     `card${i} card${i + 1} card${i + 2} card${i + 3} card${i + 4} card${
//       i + 5
//     } card${i + 6} card${i + 7} card${i + 8} card${i + 9} card${
//       i + 10
//     } card${i + 11}`
//   )
//   j++
// } else {
//   console.log(
//     `card${i} card${i + 1} card${i + 2} card${i + 3} card${i + 4} card${
//       i + 5
//     } card${i + 6} card${i + 7} card${i + 8} card${i + 9} card${
//       i + 10
//     } card${i + 11}`
//       .split(' ')
//       .reverse()
//       .join(' ')
//   )
//   j++
// }
// console.log(
//   `.card${i} {
//         grid-area: card${i}
//     }`
// )
//   }
// }
// getPattern()
