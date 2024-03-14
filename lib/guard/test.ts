function generateCombinations(test: { [key: string]: string[] }): string[][] {
  let combinations: string[][] = [[]]
  Object.keys(test).forEach((key) => {
    const newCombinations: string[][] = []
    test[key].forEach((value) => {
      combinations.forEach((combination) => {
        newCombinations.push([...combination, `${key}-${value}`])
      })
    })
    combinations = newCombinations
  })

  return combinations
}

const test = {
  size: ['xs', 's', 'm', 'l', 'xl'],
  color: ['red', 'green', 'blue'],
  material: ['wood', 'plastic', 'metal'],
}

console.log(generateCombinations(test))
