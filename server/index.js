import http from "http";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import pkg from "pg";
const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname);

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

  // Handle incoming HTTP requests here
  if (req.url === "/") {
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
  } else if (req.url === "/quests") {
    // Query the database and return quest data
    pool.query("SELECT * FROM quests", (err, result) => {
      if (err) {
        console.error("Error executing database query:", err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      } else {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(result.rows));
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
