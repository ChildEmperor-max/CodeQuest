const fs = require("fs");
const path = "server/sql/playerQuests/";

module.exports.handleFetchQuestsByPlayerId = async function (
  playerId,
  res,
  pool
) {
  try {
    const query = fs.readFileSync(path + "selectQuestByPlayerId.sql", "utf8");
    const result = await pool.query(query, [playerId]);

    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(result.rows));
  } catch (error) {
    console.error("Error executing query:", error);
  }
};

module.exports.handleFetchQuestByQuestId = async function (
  playerId,
  questId,
  res,
  pool
) {
  try {
    const query = fs.readFileSync(path + "selectQuestByQuestId.sql", "utf8");
    const result = await pool.query(query, [playerId, questId]);

    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(result.rows));
  } catch (error) {
    console.error("Error executing query:", error);
  }
};

module.exports.handleFetchNpcQuestStatus = async function (npcId, res, pool) {
  try {
    const query = fs.readFileSync(path + "selectStatusByNpcId.sql", "utf8");
    const result = await pool.query(query, [npcId]);

    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(result.rows));
  } catch (error) {
    console.error("Error executing query:", error);
  }
};

module.exports.handleInsertQuestProgress = async function (req, res, pool) {
  try {
    const data = req.body;
    const player_id = data.player_id;
    const quest_status = data.quest_status;
    const quest_id = data.quest_id;
    const insertQuestProgress = fs.readFileSync(
      path + "insertQuestProgress.sql",
      "utf8"
    );

    const resultNpcDialog = await pool.query(
      "SELECT npc_id, dialog_id from quest WHERE quest_id = $1",
      [quest_id]
    );
    const npc_id = resultNpcDialog.rows[0].npc_id;
    const dialog_id = resultNpcDialog.rows[0].dialog_id;

    await pool.query(insertQuestProgress, [
      quest_id,
      quest_status,
      player_id,
      npc_id,
      dialog_id,
    ]);
  } catch (error) {
    console.error("Error parsing player_quests data:", error);
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Bad Request" }));
  }
};

module.exports.handleUpdateQuestProgress = async function (req, res, pool) {
  try {
    const data = req.body;
    const player_id = data.player_id;
    const quest_status = data.quest_status;
    const quest_id = data.quest_id;
    const updateQuestProgress = fs.readFileSync(
      path + "updateQuestProgress.sql",
      "utf8"
    );

    await pool.query(updateQuestProgress, [quest_status, player_id, quest_id]);
  } catch (error) {
    console.error("Error parsing player_quests data:", error);
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Bad Request" }));
  }
};
