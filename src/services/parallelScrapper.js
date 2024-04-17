import { quoteScrapper } from "../utils/quoteScrapper.js";
import { Queue } from "./queue.js";

export class ParallelScrapper {
  constructor() {
    this.urlQueue = new Queue();
    this.workerMap = new Map();
  }

  createWorker(workerId, filePath, url) {
    const worker = new Worker(filePath, {
      workerData: {
        url: url,
        id: workerId,
      },
    });

    workers.set(`worker${workerId}`, worker);

    worker.on("message", (data) => {
      console.log(`Data from URL ${workerId}`, data);
    });

    worker.on("error", (error) => {
      console.log(`Error on ${id} worker`, error);
    });
  }
  async sendMessage(workerId) {
    console.log(workerId)
  }
}
