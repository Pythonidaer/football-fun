const http = require('http')
const fs = require('fs').promises // Use promises version of fs
const pdf = require('pdf-parse')

async function getPdfText(pdfPath) {
  try {
    const data = await fs.readFile(pdfPath)
    const pdfData = await pdf(data)
    return pdfData.text
  } catch (error) {
    throw new Error(`Error reading or parsing the PDF file: ${error}`)
  }
}

function extractPlayerData(text) {
  const lines = text.trim().split('\n')
  const nonEmptyLines = lines.filter((line) => line.trim() !== '')
  const top80Lines = nonEmptyLines.slice(0, 81)
  const newArray = top80Lines.map((line) => line.replace(/^\d+\.\s*/, ''))
  newArray.splice(67, 1)

  const regex = /\((\w+\d+)\)([^()]+)/g
  const resultArray = []

  for (const input of newArray) {
    const phrases = []
    let match
    while ((match = regex.exec(input)) !== null) {
      phrases.push(`(${match[1]}), ${match[2].split('$')[0]}`)
    }
    resultArray.push(phrases)
  }

  const maxLength = Math.max(...resultArray.map((arr) => arr.length))
  const finalArray = []
  let overallRank = 1

  for (let i = 0; i < maxLength; i++) {
    for (const nestedArray of resultArray) {
      if (i < nestedArray.length) {
        finalArray.push(`${overallRank}., ${nestedArray[i]}`)
      }
      overallRank++
    }
  }

  return finalArray
}

function convertToCardObjects(finalArray) {
  const cardObjects = finalArray.map((player) => {
    const [overallRanking, ...rest] = player.split(', ')

    let positionalRanking = rest[0] || 'N/A'
    let playerName = rest[1] || 'Unknown'
    let teamName = rest[2] || 'Unknown'

    return {
      overallRanking,
      positionalRanking,
      playerName,
      teamName,
    }
  })

  console.log('Parsed Card Objects:', cardObjects) // Logging the parsed objects
  return cardObjects
}

const server = http.createServer(async (req, res) => {
  if (req.url === '/pdf') {
    const pdfPath = './assets/football2024.pdf'

    try {
      const pdfText = await getPdfText(pdfPath)
      const playerCards = extractPlayerData(pdfText)
      const cardObjects = convertToCardObjects(playerCards)

      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(cardObjects))
    } catch (error) {
      console.error(error.message)
      res.statusCode = 500
      res.end('Internal Server Error')
    }
  } else {
    res.statusCode = 404
    res.end('Not Found')
  }
})

const port = 3005
server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
