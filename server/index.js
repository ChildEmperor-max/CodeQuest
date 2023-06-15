import http from "http";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import pkg from "pg";
const { Pool } = pkg;

import {
  handleInsertDialog,
  handleFetchDialog,
} from "./handlers/dialogHandler.js";
import { handleInsertNpc, handleFetchNpc } from "./handlers/npcHandler.js";
import {
  handleInsertQuest,
  handleFetchQuest,
} from "./handlers/questHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "CodeQuest",
  password: "admin",
  port: 5432, // default PostgreSQL port
});

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  if (req.method === "OPTIONS") {
    // Handle preflight request
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With,content-type",
    });
    res.end();
    return;
  }

  if (req.url === "/npc" && req.method === "POST") {
    handleInsertNpc(req, res, pool);
  } else if (req.url === "/npc") {
    handleFetchNpc(req, res, pool);
  } else if (req.url === "/quests" && req.method === "POST") {
    handleInsertQuest(req, res, pool);
  } else if (req.url === "/quests") {
    handleFetchQuest(req, res, pool);
  } else if (req.url === "/dialog" && req.method === "POST") {
    handleInsertDialog(req, res, pool);
  } else if (req.url === "/dialog" && req.method === "GET") {
    handleFetchDialog(req, res, pool);
  } else if (req.url === "/") {
    const filePath = "index.html";
    fs.readFile(filePath, (err, content) => {
      if (err) {
        console.error("Error reading file:", err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(content);
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
