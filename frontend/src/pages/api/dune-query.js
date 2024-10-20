// pages/api/dune-query.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  let userAddress;

  if (req.method === "GET") {
    userAddress = req.query.userAddress;
  } else {
    // POST
    userAddress = req.body.userAddress;
  }

  if (!userAddress) {
    return res.status(400).json({ error: "User address is required" });
  }

  const flaskAppUrl = process.env.FLASK_APP_URL || "http://localhost:5051";
  const url = `${flaskAppUrl}/query`;

  try {
    const flaskResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userAddress }),
    });

    if (!flaskResponse.ok) {
      throw new Error(
        `Flask app responded with status: ${flaskResponse.status} and message: ${flaskResponse.statusText}`
      );
    }

    const data = await flaskResponse.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error querying Flask app:", error);
    res.status(500).json({ error: "Failed to query Flask app" });
  }
}
