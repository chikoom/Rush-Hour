export class Queue {
  constructor() {
    this.items = []
    this.length = 0
  }
  print() {
    console.log(this.items)
  }
  enqueue(item) {
    this.items.push(item)
    return item
  }
  isEmpty() {
    return this.items.length === 0
  }
  peek() {
    if (this.isEmpty()) return null
    return this.items[0]
  }
  dequeue() {
    if (this.isEmpty()) return null
    return this.items.shift()
  }
}
