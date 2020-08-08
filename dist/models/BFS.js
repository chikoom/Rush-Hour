export class BFS {
  constructor() {}
  checkBlockedItems() {
    console.log('checking blocked items')
    this.print()

    const exploreNeighbouts = (row, col) => {
      for (let i = 0; i < 4; i++) {
        let newRow = row + directionRows[i]
        let newCol = col + directionCols[i]

        if (newRow < 0 || newCol < 0) continue
        if (newRow >= numOfRows || newCol >= numOfCols) continue

        if (visitedMatrix[newRow][newCol] === true) continue
        if (this.matrix[newRow][newCol] === 'x') continue

        rowQueue.enqueue(newRow)
        colQueue.enqueue(newCol)
        visitedMatrix[newRow][newCol] = true
      }
    }

    const colQueue = new Queue()
    const rowQueue = new Queue()
    const numOfRows = this.height
    const numOfCols = this.width
    const startRow = 0
    const startCol = 0
    let reachedOtherPlayer = false
    let coinsFound = 0
    const visitedMatrix = []
    for (let i = 0; i < numOfCols; i++) {
      visitedMatrix.push([])
    }
    const directionRows = [-1, 1, 0, 0]
    const directionCols = [0, 0, 1, -1]

    rowQueue.enqueue(startRow)
    colQueue.enqueue(startCol)
    visitedMatrix[startRow][startCol] = true

    while (!rowQueue.isEmpty()) {
      let row = rowQueue.dequeue()
      let col = colQueue.dequeue()
      console.log(this.matrix[row][col])
      if (
        this.matrix[row][col] instanceof Player &&
        row !== startRow &&
        col !== startCol
      ) {
        reachedOtherPlayer = true
      }
      if (this.matrix[row][col] === 'c') {
        coinsFound++
      }
      exploreNeighbouts(row, col)
    }

    console.log('coins found', coinsFound)
    console.log('other player found', reachedOtherPlayer)

    return this.gameState.numberOfCoins === coinsFound && reachedOtherPlayer
  }
}
