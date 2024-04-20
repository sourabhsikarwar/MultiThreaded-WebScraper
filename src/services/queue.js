export default class Queue {
  constructor() {
    this.items = [];
  }
  isEmpty() {
    return this.items.length === 0;
  }
  enqueue(val) {
    this.items.push(val);
    return `${val} inserted!`;
  }
  dequeue() {
    if (this.isEmpty()) {
      console.log("Queue is empty!")
      return null
    }
    return this.items.shift();
  }
  peek() {
    if (this.isEmpty()) {
      console.log("Queue is empty!")
      return null
    }
    return this.items[0];
  }
  printQueue() {
    console.log("Printing items in the queue...")
    for(let item of this.items){
      console.log(item)
    }
  }
}
