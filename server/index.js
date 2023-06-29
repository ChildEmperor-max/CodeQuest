import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import bodyParser from "body-parser";
import cors from "cors";

import pkg from "pg";
const { Pool } = pkg;

import { handleSubmittedJavaAnswer } from "./handlers/javaHandler.js";
import {
  handleInsertDialog,
  handleFetchDialog,
  handleFetchDialogById,
} from "./handlers/dialogHandler.js";
import {
  handleInsertNpc,
  handleFetchNpc,
  fetchNpcQuestDialog,
  fetchNpcQuestDialogById,
  handleFetchNpcDataByName,
} from "./handlers/npcHandler.js";
import {
  handleInsertQuest,
  handleFetchQuest,
  handleUpdateQuestStatus,
  handleFetchQuestById,
  handleFetchCompletedQuests,
  handleFetchCompletedQuestCount,
} from "./handlers/questHandler.js";
import { handleFetchAchievements } from "./handlers/achievementsHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "CodeQuest",
  password: "admin",
  port: 5432, // default PostgreSQL port
});

const app = express();

// Set CORS headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  next();
});

app.use(bodyParser.json());
app.use(cors());

app.post("/npc", (req, res) => {
  handleInsertNpc(req, res, pool);
});

app.post("/quests", (req, res) => {
  handleInsertQuest(req, res, pool);
});

app.post("/quests-update", (req, res) => {
  handleUpdateQuestStatus(req, res, pool);
});

app.post("/dialog", (req, res) => {
  handleInsertDialog(req, res, pool);
});

app.post("/execute-java", (req, res) => {
  handleSubmittedJavaAnswer(req, res, pool);
});

app.get("/npc", (req, res) => {
  handleFetchNpc(req, res, pool);
});

app.get("/npc-quest-dialog", (req, res) => {
  fetchNpcQuestDialog(req, res, pool);
});

app.get("/npc-get-quest-dialog/:id", (req, res) => {
  const id = req.params.id;
  fetchNpcQuestDialogById(id, res, pool);
});

app.get("/npc/get-npc/:name", (req, res) => {
  const name = req.params.name;
  handleFetchNpcDataByName(name, res, pool);
});

app.get("/quests/get-quest/:name", (req, res) => {
  const name = req.params.name;
  handleFetchQuestById(name, res, pool);
});

app.get("/dialog/get-dialog/:name", (req, res) => {
  const name = req.params.name;
  handleFetchDialogById(name, res, pool);
});

app.get("/quests", (req, res) => {
  handleFetchQuest(req, res, pool);
});

app.get("/quests/completed", (req, res) => {
  handleFetchCompletedQuests(req, res, pool);
});

app.get("/quests/completed/count", (req, res) => {
  handleFetchCompletedQuestCount(req, res, pool);
});

app.get("/dialog", (req, res) => {
  handleFetchDialog(req, res, pool);
});

app.get("/achievements", (req, res) => {
  handleFetchAchievements(req, res, pool);
});

app.get("/", (req, res) => {
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
});

app.use((req, res) => {
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
