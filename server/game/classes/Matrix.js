class Matrix {
  constructor(rows, cols) {
    this.matrix = this.generateMatrix(rows, cols)
  }
  generateMatrix(rows, cols) {
    const matrix = []
    for (let r = 0; r < rows; r++) {
      const row = []
      for (let c = 0; c < cols; c++) {
        row.push('-')
      }
      matrix.push(row)
    }
    return matrix
  }
  get(colNum, rowNum) {
    return this.matrix[rowNum][colNum]
  }
  print() {
    let str = ''
    this.matrix.forEach(row => {
      row.forEach(col => {
        str += col + '\t'
      })
      str += '\n'
    })
  }
  printRow(rowNum) {
    this.matrix[rowNum].forEach(col => {
      console.log(col)
    })
  }
  printColumn(colNum) {
    this.matrix.forEach(row => {
      row.forEach((col, index) => {
        if (index === colNum) console.log(col)
      })
    })
  }
  alter(col, row, newNum) {
    this.matrix[row][col] = newNum
  }
  findCoordinate = value => {
    const objToReturn = {}
    this.matrix.forEach((row, rIndex) => {
      row.forEach((col, cIndex) => {
        if (col === value) {
          objToReturn.x = cIndex
          objToReturn.y = rIndex
        }
      })
    })
    return objToReturn
  }
}

module.exports.Matrix = Matrix
