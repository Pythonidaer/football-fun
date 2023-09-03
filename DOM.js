import data from './data/2023pprTop300.js'
console.log(data)

function createCard(data) {
  const card = document.createElement('div')
  card.classList.add('card')

  // Create card content
  const rankings = document.createElement('div')
  rankings.classList.add('rankings')

  const overallRanking = document.createElement('p')
  overallRanking.classList.add('overall-ranking')
  overallRanking.textContent = data.overallRanking

  const positionalRanking = document.createElement('p')
  positionalRanking.classList.add('positional-ranking')
  positionalRanking.textContent = data.positionalRanking

  const teamName = document.createElement('p')
  teamName.classList.add('team-name')
  teamName.textContent = data.teamName

  rankings.appendChild(overallRanking)
  rankings.appendChild(positionalRanking)
  rankings.appendChild(teamName)

  const playerName = document.createElement('p')
  playerName.classList.add('player-name')
  playerName.textContent = data.playerName

  // Append content to the card
  card.appendChild(rankings)
  card.appendChild(playerName)

  return card
}

// Get the container element
const container = document.getElementById('cardContainer')

data.forEach((player) => {
  const card = createCard(player)
  container.appendChild(card)
})
