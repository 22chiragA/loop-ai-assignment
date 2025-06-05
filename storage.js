const ingestions = {};

function saveIngestion(id, batches) {
  ingestions[id] = { id, batches };
}

function getIngestionStatus(id) {
  const record = ingestions[id];
  if (!record) return null;

  const allStatuses = record.batches.map((b) => b.status);
  let status = "yet_to_start";
  if (allStatuses.every((s) => s === "completed")) {
    status = "completed";
  } else if (allStatuses.some((s) => s === "triggered" || s === "completed")) {
    status = "triggered";
  }

  return {
    ingestion_id: id,
    status,
    batches: record.batches,
  };
}

function updateBatchStatus(ingestionId, batchId, status) {
  const ingestion = ingestions[ingestionId];
  if (!ingestion) return;

  const batch = ingestion.batches.find((b) => b.batch_id === batchId);
  if (batch) {
    batch.status = status;
  }
}

module.exports = {
  saveIngestion,
  getIngestionStatus,
  updateBatchStatus,
};
