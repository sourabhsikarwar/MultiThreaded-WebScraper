import { isMainThread, parentPort } from "worker_threads";
import { quoteBatchScrapper } from "../utils/quoteBatchScrapper.js";

if (!isMainThread) {
  parentPort.on("message", async (task) => {
    console.log(`Assigned the batch of url to Worker ${task.id}!`);
    const results = await quoteBatchScrapper(task.urls);

    parentPort.postMessage({
      thread: task.id,
      data: results,
    });
  });
}
