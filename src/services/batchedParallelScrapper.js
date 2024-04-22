import { Worker } from "worker_threads";

export default class ParallelBatchScrapper {
  constructor(capacity, urlList, workerScript) {
    this.urlList = urlList;
    this.workerPromises = new Map();
    this.workersPoolCapacity = capacity;
    this.workerScript = workerScript;
    this.batchedUrls = [];

    this.batchURL();

    console.log("Scrapper Initialized with batched URLs...");
  }

  batchURL() {
    const batchSize = Math.ceil(this.urlList.length / this.workersPoolCapacity);
    for (let i = 0; i < this.workersPoolCapacity; i++) {
      const start = i * batchSize;
      const end = start + batchSize;
      this.batchedUrls.push(this.urlList.slice(start, end));
    }
  }

  startScrapper() {
    return Promise.all(
      this.batchedUrls.map((batchUrls) => this.addTask(batchUrls))
    );
  }

  addTask(batchUrls) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(this.workerScript);

      this.workerPromises.set(worker.threadId, { resolve, reject });

      worker.postMessage({ urls: batchUrls, id: worker.threadId });

      worker.on("message", (message) => {
        console.log(`Message from worker ${worker.threadId}`, message);
        this.resolveTask(message);
      });

      worker.on("error", (error) => {
        console.log(`Error from worker ${worker.threadId}`, error);
        reject(error);
      });
    });
  }

  resolveTask(message) {
    const taskPromise = this.workerPromises.get(message.thread);

    if (taskPromise) {
      taskPromise.resolve(message.data);

      console.log(`Promise Resolved!`);
      this.workerPromises.delete(message.thread);
    } else {
      console.log(`Task Promises with id ${message.thread} not found!`);
    }
  }
}
