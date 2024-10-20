// pages/api/dune-query.js
import { DuneClient } from "@duneanalytics/client-sdk";

export default async function handler(req, res) {
  const client = await new DuneClient("PF3BDOYpoPbhet7ALEnSwONvj5eUx5En");
  try {
    const executionResult = await client.getLatestResult({
      queryId: 4180381,
    });
    res.status(200).json(executionResult.result?.rows);
  } catch (error) {
    console.error("Error running query:", error);
    res.status(500).json({ error: "Failed to fetch data from Dune Analytics" });
  }
}
