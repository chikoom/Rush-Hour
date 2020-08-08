class Queue {
  constructor(){
    this.queue = []
    this.length = 0
  }
  print(){
    console.log(this.queue) 
  }
  enqueue(item){
    this.length = this.queue.unshift(item)
    return item
  }
  isEmpty(){
    return (this.length === 0)
  }
  peek(){
    return this.queue[this.length-1] || null
  }
  dequeue(){
    const objToReturn = this.queue[this.length-1]
    this.queue[this.length-1] = null
    this.length--
    this.queue.length = this.length
    return objToReturn
  }
}



module.exports = Queue