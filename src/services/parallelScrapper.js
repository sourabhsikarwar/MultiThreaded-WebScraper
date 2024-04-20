import { Worker } from "worker_threads";
import Queue from "./queue.js";

export default class ParallelScrapper {
  constructor(capacity, workerScript) {
    this.urlQueue = new Queue();
    this.workerMap = new Map();
    this.workersPoolCapacity = capacity;
    this.workerScript = workerScript;

    this.initializeWorkers();

    console.log("Scrapper Initialized...");
  }

  initializeWorkers() {
    for (let i = 0; i < this.workersPoolCapacity; i++) {
      const worker = new Worker(this.workerScript);

      worker.on("message", this.handleWorkerMessage.bind(this, worker));
      worker.on("error", this.handleWorkerError.bind(this, worker));

      this.workerMap.set(worker, true);
    }
  }

  handleWorkerMessage(worker, message) {
    console.log(`Message from worker ${worker.threadId}`, message);
    this.handleFinishWorkerTask(worker);
  }

  handleWorkerError(worker, error) {
    console.log(`Error from worker ${worker.threadId}`, error);
    this.handleFinishWorkerTask(worker);
  }

  handleFinishWorkerTask(worker) {
    this.workerMap.set(worker, true);
    console.log(`Worker with id ${worker.threadId} is free to work!`);

    const url = this.urlQueue.dequeue();

    if (url) {
      this.assignTaskToWorker(worker, url);
    } else {
      console.log(`Terminating Thread Worker ${worker.threadId}`);
      worker.terminate();
    }
  }

  assignTaskToWorker(worker, url) {
    this.workerMap.set(worker, false);
    worker.postMessage({ url, id: worker.threadId });
  }

  findAvailableWorker() {
    // TODO: Optimizing it to O(1)
    const entriesArray = Array.from(this.workerMap);
    const availableWorker = entriesArray.find(([key, value]) => value === true);

    if (availableWorker) {
      return availableWorker[0] ? availableWorker[0] : null;
    }
    return null;
  }

  addTask(url) {
    const availableWorker = this.findAvailableWorker();

    if (availableWorker) {
      this.assignTaskToWorker(availableWorker, url);
    } else {
      this.urlQueue.enqueue(url);
    }
  }



  getScrappedData() {}

  shutdownScrapper() {

  }
}
