export default class Queue {
  queueSize = 4;
  // Setting the queue to be 4
  // so that maximum of 4 worker threads can be created parallely

  constructor() {
    this.items = [];
  }
  isEmpty() {
    return this.items.length === 0;
  }
  isFull() {
    return this.items.length === this.queueSize;
  }
  enqueue(val) {
    this.items.push(val);
    return `${val} inserted!`;
  }
  dequeue() {
    if (this.isEmpty()) {
      return "Underflow!";
    }
    return this.items.shift();
  }
  peek() {
    if (this.isEmpty()) {
      return "No item in the list!";
    }
    return this.items[0];
  }
  printQueue() {
    return this.items;
  }
}
