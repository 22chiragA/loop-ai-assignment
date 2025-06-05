const { v4: uuidv4 } = require("uuid");
const { mockExternalApi, delay } = require("./utils");
const { saveIngestion, updateBatchStatus } = require("./storage");

const queue = [];

function enqueueIngestion(ids, priority, ingestionId) {
  const createdAt = Date.now();
  const batches = [];

  for (let i = 0; i < ids.length; i += 3) {
    const batchIds = ids.slice(i, i + 3);
    batches.push({
      batch_id: uuidv4(),
      ids: batchIds,
      status: "yet_to_start",
    });
  }

  queue.push({
    ingestionId,
    priority,
    createdAt,
    batches,
  });


  queue.sort((a, b) => {
    const prioMap = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    if (prioMap[a.priority] !== prioMap[b.priority]) {
      return prioMap[a.priority] - prioMap[b.priority];
    }
    return a.createdAt - b.createdAt;
  });

  saveIngestion(ingestionId, batches);
}

async function processQueue() {
  if (queue.length === 0) return;

  const job = queue[0];
  const batch = job.batches.find((b) => b.status === "yet_to_start");
  if (!batch) {
    queue.shift();
    return;
  }

  batch.status = "triggered";
  updateBatchStatus(job.ingestionId, batch.batch_id, "triggered");

  const promises = batch.ids.map(async (id) => {
    await delay(1000); 
    await mockExternalApi(id);
  });

  await Promise.all(promises);
  updateBatchStatus(job.ingestionId, batch.batch_id, "completed");
}

setInterval(processQueue, 5000);

module.exports = { enqueueIngestion };
