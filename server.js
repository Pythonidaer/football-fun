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
  return finalArray.map((player) => {
    const [overallRanking, positionalRanking, playerName, teamName] =
      player.split(', ')
    return {
      overallRanking,
      positionalRanking,
      playerName,
      teamName,
    }
  })
}

const server = http.createServer(async (req, res) => {
  if (req.url === '/pdf') {
    const pdfPath = './assets/football2.pdf'

    try {
      const pdfText = await getPdfText(pdfPath)
      const playerCards = extractPlayerData(pdfText)
      const cardObjects = convertToCardObjects(playerCards)
      console.dir(cardObjects, { maxArrayLength: null })

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

/*
OLD CODE BELOW. Above refactored with ChatGPT
*/
// const http = require('http')
// const fs = require('fs')
// const pdf = require('pdf-parse')

// const server = http.createServer((req, res) => {
//   if (req.url === '/pdf') {
//     const pdfPath = './football.pdf'

//     fs.readFile(pdfPath, (error, data) => {
//       if (error) {
//         console.error('Error reading the PDF file:', error)
//         res.statusCode = 500
//         res.end('Internal Server Error')
//         return
//       }

//       pdf(data)
//         .then((pdfData) => {
//           const text = pdfData.text
//           const lines = text.trim().split('\n')

//           // Filter out empty lines
//           const nonEmptyLines = lines.filter((line) => line.trim() !== '')

//           // Select the top 80 lines
//           const top80Lines = nonEmptyLines.slice(0, 81)
//           const newArray = top80Lines.map((line) =>
//             line.replace(/^\d+\.\s*/, '')
//           )

//           newArray.splice(67, 1)

//           const regex = /\((\w+\d+)\)([^()]+)/g

//           const resultArray = []

//           for (const input of newArray) {
//             const phrases = []
//             let match
//             while ((match = regex.exec(input)) !== null) {
//               phrases.push(`(${match[1]}), ${match[2].split('$')[0]}`)
//             }
//             resultArray.push(phrases)
//           }

//           const maxLength = Math.max(...resultArray.map((arr) => arr.length))

//           // Initialize the final ordered array
//           const finalArray = []
//           let overallRank = 1
//           // Loop through each index
//           for (let i = 0; i < maxLength; i++) {
//             // Loop through each nested array
//             for (const nestedArray of resultArray) {
//               // Check if the current index exists in the nested array
//               if (i < nestedArray.length) {
//                 finalArray.push(`${overallRank}., ${nestedArray[i]}`)
//               }
//               overallRank++
//             }
//           }

//           const finalArrayToObj = (finalArr) => {
//             let splitArr = []
//             finalArr.forEach((player) => {
//               splitArr.push(player.split(', '))
//             })
//             const cardObjects = splitArr.map((arr) => ({
//               overallRanking: arr[0],
//               positionalRanking: arr[1],
//               playerName: arr[2],
//               teamName: arr[3],
//             }))
//             return cardObjects
//           }

//           const playerCards = finalArrayToObj(finalArray)
//           console.dir(finalArray, { maxArrayLength: null })

//           res.setHeader('Content-Type', 'application/json')

//           res.end(JSON.stringify(playerCards))
//         })
//         .catch((error) => {
//           console.error('Error parsing the PDF:', error)
//           res.statusCode = 500
//           res.end('Internal Server Error')
//         })
//     })
//   } else {
//     res.statusCode = 404
//     res.end('Not Found')
//   }
// })

// const port = 3005
// server.listen(port, () => {
//   console.log(`Server is running on port ${port}`)
// })

// function orderPlayerValues(inputString) {
//   const playerEntries = inputString.split('. ')
//   const orderedValues = []

//   for (const entry of playerEntries) {
//     const values = entry.split('. ')
//     values.forEach((value, i) => {
//       orderedValues[i] = orderedValues[i] || []
//       orderedValues[i].push(value)
//     })
//   }

//   return orderedValues.map((column) => column.join(' '))
// }
