import fs from 'node:fs'

function convertJsonArrayToMultiline(inputFilePath: string, outputFilePath: string): void {
  const jsonString = fs.readFileSync(inputFilePath, 'utf8')
  const jsonArray = JSON.parse(jsonString)

  for (const jsonObject of jsonArray) {
    const formattedJsonString = JSON.stringify(jsonObject, null, 2)
    fs.writeFileSync(outputFilePath, formattedJsonString, { flag: 'a' })
  }
}

// Example usage
const inputFilePath = 'path/to/your/input.json'
const outputFilePath = 'path/to/your/output.json'

convertJsonArrayToMultiline(inputFilePath, outputFilePath)
