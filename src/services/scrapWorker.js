import { workerData, isMainThread, parentPort } from "worker_threads";
import { quoteScrapper } from "../utils/quoteScrapper.js";

if (!isMainThread) {
  parentPort.on("message", async (task) => {
    console.log(task.url, `Assigned the url to Worker ${task.id}!`);
    const results = await quoteScrapper(task.url);

    parentPort.postMessage({
      url: task.url,
      data: results,
    });
  });
}
