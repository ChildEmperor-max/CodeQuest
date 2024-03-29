const express = require("express");
const fs = require("fs");
const dotenv = require("dotenv").config();
const { fileURLToPath } = require("url");
const { dirname, join } = require("path");
const cors = require("cors");
const { Sequelize } = require("sequelize");
const cookieParser = require("cookie-parser");
const db = require("./Models");
const userRoutes = require("./Routes/userRoutes");
const bodyParser = require("body-parser");

const multer = require("multer");
const { Pool } = require("pg");

const { handleSubmittedJavaAnswer } = require("./handlers/javaHandler.js");

const {
  handleInsertDialog,
  handleFetchDialog,
  handleFetchDialogById,
  handleFetchDialogByNpcId,
  handleFetchDialogByBranch,
} = require("./handlers/dialogHandler.js");

const {
  handleInsertNpc,
  handleFetchNpc,
  handleFetchNpcById,
  fetchNpcQuestDialog,
  fetchNpcQuestDialogById,
  handleFetchNpcDataByName,
  handleFetchIdByName,
  handleUpdateNpcQuestDialog,
  handleFetchNpcByQuestId,
} = require("./handlers/npcHandler.js");

const {
  handleInsertQuest,
  handleFetchQuest,
  handleUpdateQuestStatus,
  handleFetchQuestById,
  handleFetchCompletedQuests,
  handleFetchCompletedQuestCount,
} = require("./handlers/questHandler.js");

const {
  handleFetchAchievements,
  handleFetchAchievementById,
} = require("./handlers/achievementsHandler.js");

const {
  handleFetchHelp,
  handleFetchHelpById,
  handleFetchHelpByDialogId,
} = require("./handlers/helpHandler.js");

const {
  handleFetchCharacterById,
  handleUpdateCharacterNameById,
  handleInsertCharacterByPlayerId,
  handleUpdateCharacterBioById,
  handleUpdateCurrentXp,
  handleUpdateMaxXp,
  handleUpdateXp,
  handleUpdateLevel,
  handleFetchCharactersByLevel,
  handleFetchCharacterByLevelRank,
  handleUpdateInventory,
  handleUpdateGold,
  handleUpdateAvatarPath,
  handleUpdateExecutes,
  handleUpdateErrors,
  handleFetchCodeProfile,
  handleUpdateCharacterAchievements,
  handleFetchItemsById,
  handleFetchCharacterItems,
} = require("./handlers/characterHandler.js");

const { handleFetchPlayerByEmail } = require("./handlers/playerHandler.js");
const {
  handleInsertQuestProgress,
  handleUpdateQuestProgress,
  handleFetchQuestsByPlayerId,
  handleFetchQuestByQuestId,
  handleFetchNpcQuestStatus,
  handleInsertAllQuestProgress,
  handleFetchQuestsByQuestStatus,
} = require("./handlers/playerQuestHandler");
const { handleFetchAllItems } = require("./handlers/itemsHandler.js");

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

const PORT = process.env.PORT || 8000;
require("dotenv").config();
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "CodeQuest",
  password: "admin",
  port: 5432, // default PostgreSQL port
});

// const pool = new Pool({
//   user: "postgres",
//   host: "db.lijmzdfdpsabhpwqlfnh.supabase.co",
//   database: "CodeQuest",
//   password: "zGTyOIYJDL3vVUu6",
//   port: 5432, // default PostgreSQL port
// });

const app = express();
//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//routes for the user API

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

app.use(cors());
app.use("/api/users", userRoutes);

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

app.get("/npc/get-npc/:name/:playerId", (req, res) => {
  handleFetchNpcDataByName(req, res, pool);
});

app.get("/npc/get-npc-id/:id", (req, res) => {
  const name = req.params.name;
  handleFetchIdByName(name, res, pool);
});

app.get("/quests/get-quest/:id", (req, res) => {
  const id = req.params.id;
  handleFetchQuestById(id, res, pool);
});

app.get("/dialog/get-dialog/:name", (req, res) => {
  const name = req.params.name;
  handleFetchDialogById(name, res, pool);
});

app.get("/dialog/get-dialog-by-id/:id", (req, res) => {
  const npc_id = req.params.id;
  handleFetchDialogByNpcId(npc_id, res, pool);
});

app.get("/quests", (req, res) => {
  handleFetchQuest(req, res, pool);
});

app.get("/quests/completed", (req, res) => {
  handleFetchCompletedQuests(req, res, pool);
});

app.get("/quests/completed/count/:playerId", (req, res) => {
  handleFetchCompletedQuestCount(req, res, pool);
});

app.get("/dialog", (req, res) => {
  handleFetchDialog(req, res, pool);
});

app.get("/achievements", (req, res) => {
  handleFetchAchievements(req, res, pool);
});

app.get("/help", (req, res) => {
  handleFetchHelp(req, res, pool);
});

app.get("/help/:id", (req, res) => {
  const id = req.params.id;
  handleFetchHelpById(id, res, pool);
});

app.get("/help/get-help-dialog/:id", (req, res) => {
  const id = req.params.id;
  handleFetchHelpByDialogId(id, res, pool);
});

app.get("/dialog/get-dialog-branch/:branch", (req, res) => {
  const branch = req.params.branch;
  handleFetchDialogByBranch(branch, res, pool);
});

app.get("/npc/get-npc-by-id/:id", (req, res) => {
  const id = req.params.id;
  handleFetchNpcById(id, res, pool);
});

app.get("/character/:id", (req, res) => {
  const id = req.params.id;
  handleFetchCharacterById(id, res, pool);
});

app.post("/character/update/name", (req, res) => {
  handleUpdateCharacterNameById(req, res, pool);
});

app.post("/character/update/bio", (req, res) => {
  handleUpdateCharacterBioById(req, res, pool);
});

app.post("/character/update/level", (req, res) => {
  handleUpdateLevel(req, res, pool);
});

app.post("/character/update/xp", (req, res) => {
  handleUpdateXp(req, res, pool);
});

app.post("/character/update/current_xp", (req, res) => {
  handleUpdateCurrentXp(req, res, pool);
});

app.post("/character/update/gold", (req, res) => {
  handleUpdateGold(req, res, pool);
});

app.post("/character/update/max_xp", (req, res) => {
  handleUpdateMaxXp(req, res, pool);
});

app.post("/character/insert", (req, res) => {
  handleInsertCharacterByPlayerId(req, res, pool);
});

app.get("/player/get-by-email/:email", (req, res) => {
  const email = req.params.email;
  handleFetchPlayerByEmail(email, res, pool);
});

app.get("/character/select/level", (req, res) => {
  handleFetchCharactersByLevel(req, res, pool);
});

app.get("/player-quest/select/quest/:playerId/:questId", (req, res) => {
  const playerId = req.params.playerId;
  const questId = req.params.questId;
  handleFetchQuestByQuestId(playerId, questId, res, pool);
});

app.post("/player-quest/insert/progress/", (req, res) => {
  handleInsertQuestProgress(req, res, pool);
});

app.post("/player-quest/insert/all/progress/", (req, res) => {
  handleInsertAllQuestProgress(req, res, pool);
});

app.post("/player-quest/update/progress/", (req, res) => {
  handleUpdateQuestProgress(req, res, pool);
});

app.post("/npc/update/quest-dialog", (req, res) => {
  handleUpdateNpcQuestDialog(req, res, pool);
});

app.get("/player-quest/select/npc-quest/:npcId/:playerId", (req, res) => {
  handleFetchNpcQuestStatus(req, res, pool);
});

app.get("/player-quest/select/quests/:playerId/:questStatus", (req, res) => {
  handleFetchQuestsByQuestStatus(req, res, pool);
});

app.get("/quests/select/npc/:questId/:playerId", (req, res) => {
  handleFetchNpcByQuestId(req, res, pool);
});

app.get("/player-quest/select/quests/:id", (req, res) => {
  const id = req.params.id;
  handleFetchQuestsByPlayerId(id, res, pool);
});

app.get("/character/select/level/:playerId", (req, res) => {
  handleFetchCharacterByLevelRank(req, res, pool);
});

app.get("/quests/select/npc/:questId/:playerId", (req, res) => {
  handleFetchNpcByQuestId(req, res, pool);
});

app.post("/character/update/executes", (req, res) => {
  handleUpdateExecutes(req, res, pool);
});

app.post("/character/update/errors", (req, res) => {
  handleUpdateErrors(req, res, pool);
});

app.get("/achievements/select/:id", (req, res) => {
  handleFetchAchievementById(req, res, pool);
});

app.post("/character/update/achievements", (req, res) => {
  handleUpdateCharacterAchievements(req, res, pool);
});

app.post("/character/select/code-profile/:playerId", (req, res) => {
  handleFetchCodeProfile(req.params.playerId, res, pool);
});

app.post("/character/update/item", (req, res) => {
  handleUpdateInventory(req, res, pool);
});

app.get("/character/select/inventory/:playerId", (req, res) => {
  handleFetchCharacterItems(req.params.playerId, res, pool);
});

app.get("/character/select/inventory/:playerId/:itemId", (req, res) => {
  handleFetchItemsById(req, res, pool);
});

app.get("/items", (req, res) => {
  handleFetchAllItems(req, res, pool);
});

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "server/uploads");
  },
  filename: (req, file, callBack) => {
    const ext = file.originalname.split(".").pop();
    const fileName = `${req.params.playerId}.${ext}`;
    callBack(null, fileName);
  },
});

let upload = multer({ storage: storage });

app.post(
  "/profile/uploadImage/:playerId",
  upload.single("file"),
  (req, res, next) => {
    const file = req.file;
    console.log(file.filename);
    if (!file) {
      const error = new Error("No File");
      error.httpStatusCode = 400;
      return next(error);
    }
    handleUpdateAvatarPath(req, res, pool, "server/uploads/" + file.filename);
  }
);

app.get("/game", (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
