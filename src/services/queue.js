class Queue {
  constructor() {
    this.items = [];
  }
  isEmpty() {
    return this.items.length === 0;
  }
  enqueue(val) {
    this.items.push(val);
    return `${val} inserted!`
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

