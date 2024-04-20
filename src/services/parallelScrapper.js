import { Worker } from "worker_threads";
import Queue from "./queue.js";

export default class ParallelScrapper {
  constructor(capacity, workerScript) {
    this.urlQueue = new Queue();
    this.workerMap = new Map();
    this.workerPromises = new Map();
    this.workersPoolCapacity = capacity;
    this.workerScript = workerScript;

    this.initializeWorkers();

    console.log("Scrapper Initialized...");
  }

  initializeWorkers() {
    for (let i = 0; i < this.workersPoolCapacity; i++) {
      const worker = new Worker(this.workerScript);

      this.workerMap.set(worker, true);
    }
  }

  handleWorkerMessage(worker, message) {
    console.log(`Message from worker ${worker.threadId}`);
    this.handleFinishWorkerTask(worker);
  }

  handleWorkerError(worker, error) {
    console.log(`Error from worker ${worker.threadId}`, error);
    this.handleFinishWorkerTask(worker);
  }

  handleFinishWorkerTask(worker) {
    this.workerMap.set(worker, true);
    console.log(`Worker with id ${worker.threadId} is free to work!`);

    const queueItem = this.urlQueue.dequeue();

    if (queueItem) {
      const { url, resolve, reject } = queueItem;
      const taskId = Math.random().toString(36).substring(7);
      this.assignTaskToWorker(worker, url, taskId);
      this.workerPromises.set(taskId, { resolve, reject });
    } else {
      console.log(`Terminating Thread Worker ${worker.threadId}`);
      worker.terminate();
    }
  }

  assignTaskToWorker(worker, url, taskId) {
    this.workerMap.set(worker, false);
    worker.postMessage({ url, id: worker.threadId, taskId });
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

  resolveTask(message) {
    const taskPromise = this.workerPromises.get(message.taskId);

    if (taskPromise) {
      taskPromise.resolve(message);

      console.log(`Promise Resolved!`);
      this.workerPromises.delete(message.taskId);
    } else {
      console.log(`Task Promises with id ${message.taskId} not found!`);
    }
  }

  addTask(url) {
    return new Promise((resolve, reject) => {
      const availableWorker = this.findAvailableWorker();

      if (availableWorker) {
        const taskId = Math.random().toString(36).substring(7);
        this.assignTaskToWorker(availableWorker, url, taskId);

        this.workerPromises.set(taskId, { resolve, reject });

        availableWorker.on("message", (message) => {
          this.handleWorkerMessage(availableWorker, message);
          this.resolveTask(message);
        });

        availableWorker.on("error", (error) => {
          this.handleWorkerError(availableWorker, error);
        });
      } else {
        this.urlQueue.enqueue({ url, resolve, reject });
      }
    }).catch((error) => {
      console.log("Error: ", error);
    });
  }
}
