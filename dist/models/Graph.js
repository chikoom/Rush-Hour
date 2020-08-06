export class Graph {
  constructor(noOfVertices) {
    this.noOfVertices = noOfVertices
    this.AdjList = new Map()
  }
  addVertex(v) {
    this.AdjList.set(v, [])
  }
  addEdge(vert1, vert2) {
    this.AdjList.get(vert1).push(vert2)
    this.AdjList.get(vert2).push(vert1)
  }
  printGraph() {
    var get_keys = this.AdjList.keys()
    for (var i of get_keys) {
      var get_values = this.AdjList.get(i)
      var conc = ''
      for (var j of get_values) conc += j + ' '
      console.log(i + ' -> ' + conc)
    }
  }

  // bfs(v)
  // dfs(v)
}
// Using the above implemented graph class
var g = new Graph(6)
var vertices = ['A', 'B', 'C', 'D', 'E', 'F']

// adding vertices
for (var i = 0; i < vertices.length; i++) {
  g.addVertex(vertices[i])
}

// adding edges
g.addEdge('A', 'B')
g.addEdge('A', 'D')
g.addEdge('A', 'E')
g.addEdge('B', 'C')
g.addEdge('D', 'E')
g.addEdge('E', 'F')
g.addEdge('E', 'C')
g.addEdge('C', 'F')

// prints all vertex and
// its adjacency list
// A -> B D E
// B -> A C
// C -> B E F
// D -> A E
// E -> A D F C
// F -> E C
g.printGraph()
