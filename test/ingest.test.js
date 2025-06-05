const axios = require("axios");

const API = "http://localhost:5000";

async function runTest() {
  console.log("🔄 Starting test...");

  const res1 = await axios.post(`${API}/ingest`, {
    ids: [1, 2, 3, 4, 5],
    priority: "MEDIUM",
  });

  const res2 = await axios.post(`${API}/ingest`, {
    ids: [6, 7, 8, 9],
    priority: "HIGH",
  });

  const id1 = res1.data.ingestion_id;
  const id2 = res2.data.ingestion_id;

  console.log("✅ Ingested", { id1, id2 });

  await new Promise((r) => setTimeout(r, 16000)); // Wait for 3 batch intervals

  const status1 = await axios.get(`${API}/status/${id1}`);
  const status2 = await axios.get(`${API}/status/${id2}`);

  console.log("Status MEDIUM:", status1.data);
  console.log("Status HIGH:", status2.data);
}

runTest();
