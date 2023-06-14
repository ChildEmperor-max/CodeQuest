import http from "http";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import pkg from "pg";
const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname);

let npcCreated = false;

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
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const npcData = JSON.parse(body);

        // Check if NPC with the same name already exists in the database
        pool.query(
          "SELECT * FROM npc WHERE npc_name = $1",
          [npcData.npc_name],
          (err, result) => {
            if (err) {
              console.error("Error checking existing NPCs:", err);
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Internal Server Error" }));
              return; // Return here to avoid sending multiple responses
            }

            if (result.rows.length > 0) {
              // NPC with the same name already exists
              res.writeHead(409, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "NPC already exists" }));
              return; // Return here to avoid inserting duplicate NPC
            }

            // Insert the NPC data into the database table
            pool.query(
              "INSERT INTO npc (npc_name) VALUES ($1)",
              [npcData.npc_name],
              (err) => {
                if (err) {
                  console.error("Error creating new NPC:", err);
                  res.writeHead(500, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ error: "Internal Server Error" }));
                  return; // Return here to avoid sending multiple responses
                }

                res.writeHead(201, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({ message: "NPC created successfully" })
                );
              }
            );
          }
        );
      } catch (error) {
        console.error("Error parsing NPC data:", error);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Bad Request" }));
      }
    });
  } else if (req.url === "/quests" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const questData = JSON.parse(body);

        // Check if the quest with the same title already exists in the database
        pool.query(
          "SELECT id FROM quest WHERE quest_title = $1",
          [questData.quest_title],
          (err, result) => {
            if (err) {
              console.error("Error checking existing quests:", err);
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Internal Server Error" }));
              return; // Return here to avoid sending multiple responses
            }

            if (result.rows.length > 0) {
              // Quest with the same title already exists
              res.writeHead(409, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Quest already exists" }));
              return; // Return here to avoid inserting duplicate quest
            }

            // Continue with inserting the quest data
            const assignedNpc = questData.assigned_npc;
            const questTitle = questData.quest_title;
            const questDescription = questData.quest_description;
            const questStatus = questData.quest_status;
            const questType = questData.quest_type;

            // Check if NPC with the same name already exists in the database
            pool.query(
              "SELECT id FROM npc WHERE npc_name = $1",
              [assignedNpc],
              (err, result) => {
                if (err) {
                  console.error("Error checking existing NPCs:", err);
                  res.writeHead(500, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ error: "Internal Server Error" }));
                  return; // Return here to avoid sending multiple responses
                }

                if (result.rows.length === 0) {
                  // NPC does not exist
                  res.writeHead(404, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ error: "NPC not found" }));
                  return; // Return here to avoid inserting invalid quest
                }

                const npcId = result.rows[0].id;

                // Insert the quest data into the database table
                pool.query(
                  "INSERT INTO quest (npc_id, quest_title, quest_description, quest_status, quest_type) VALUES ($1, $2, $3, $4, $5)",
                  [npcId, questTitle, questDescription, questStatus, questType],
                  (err) => {
                    if (err) {
                      console.error("Error creating new quest:", err);
                      res.writeHead(500, {
                        "Content-Type": "application/json",
                      });
                      res.end(
                        JSON.stringify({ error: "Internal Server Error" })
                      );
                      return; // Return here to avoid sending multiple responses
                    }

                    res.writeHead(201, { "Content-Type": "application/json" });
                    res.end(
                      JSON.stringify({ message: "Quest created successfully" })
                    );
                  }
                );
              }
            );
          }
        );
      } catch (error) {
        console.error("Error parsing quest data:", error);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Bad Request" }));
      }
    });
  } else if (req.url === "/dialog" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const dialogData = JSON.parse(body);

        const assignedNpc = dialogData.npc_name;
        const dialog = dialogData.dialog;
        const quest_title = dialogData.quest_title;

        // Check if the dialog already exists in the database
        pool.query(
          "SELECT id FROM dialog WHERE dialog = $1",
          [dialog],
          (err, result) => {
            if (err) {
              console.error("Error checking existing Dialogs:", err);
              console.log("[LOG]: Error checking dialog table");
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Internal Server Error" }));
              return; // Return here to avoid sending multiple responses
            }

            if (result.rows.length > 0) {
              // Dialog already exists
              console.log("[LOG]: Dialog already exists");
              res.writeHead(409, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Dialog already exists" }));
              return; // Return here to avoid inserting duplicate dialog
            }

            // Check if the NPC exists
            pool.query(
              "SELECT id FROM quest WHERE quest_title = $1",
              [quest_title],
              (err, result) => {
                if (err) {
                  console.error("Error checking existing NPCs:", err);
                  res.writeHead(500, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ error: "Internal Server Error" }));
                  return; // Return here to avoid sending multiple responses
                }

                if (result.rows.length === 0) {
                  // NPC does not exist
                  res.writeHead(404, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ error: "NPC not found" }));
                  return; // Return here to avoid inserting invalid dialog
                }

                const quest_id = result.rows[0].id;

                // Insert the dialog data into the database table
                pool.query(
                  "INSERT INTO dialog (dialog, quest_id) VALUES ($1, $2)",
                  [dialog, quest_id],
                  (err) => {
                    if (err) {
                      console.error("Error creating new dialog:", err);
                      res.writeHead(500, {
                        "Content-Type": "application/json",
                      });
                      res.end(
                        JSON.stringify({ error: "Internal Server Error" })
                      );
                      return; // Return here to avoid sending multiple responses
                    }

                    res.writeHead(201, { "Content-Type": "application/json" });
                    res.end(
                      JSON.stringify({ message: "Dialog created successfully" })
                    );
                  }
                );
              }
            );
          }
        );
      } catch (error) {
        console.error("Error parsing dialog data:", error);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Bad Request" }));
      }
    });
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
  } else if (req.url === "/quests") {
    // Query the database and return quest data
    pool.query("SELECT * FROM quest", (err, result) => {
      if (err) {
        console.error("Error executing database query:", err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      } else {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(result.rows));
      }
    });
  } else if (req.url === "/npc") {
    // Query the database and return quest data
    pool.query("SELECT * FROM npc", (err, result) => {
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
