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

module.exports.handleFetchNpcQuestStatus = async function (req, res, pool) {
  try {
    const npcId = req.params.npcId;
    const playerId = req.params.playerId;
    const query = fs.readFileSync(path + "selectStatusByNpcId.sql", "utf8");
    const result = await pool.query(query, [npcId, playerId]);

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

module.exports.handleInsertAllQuestProgress = async function (req, res, pool) {
  try {
    const dataArray = req.body.all_quest;
    const player_id = req.body.player_id;

    const insertQuestProgress = fs.readFileSync(
      path + "insertQuestProgress.sql",
      "utf8"
    );

    const queryPromises = [];

    dataArray.forEach(async (data) => {
      const quest_id = data.quest_id;
      const quest_status = quest_id === 3 ? "inactive" : "locked";

      const resultNpcDialog = await pool.query(
        "SELECT npc_id, dialog_id from quest WHERE quest_id = $1",
        [quest_id]
      );
      const npc_id = resultNpcDialog.rows[0].npc_id;
      const dialog_id = resultNpcDialog.rows[0].dialog_id;

      // Push the query promise into the array
      queryPromises.push(
        pool.query(insertQuestProgress, [
          quest_id,
          quest_status,
          player_id,
          npc_id,
          dialog_id,
        ])
      );
    });

    await Promise.all(queryPromises);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: true }));
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
    const updateLockedStatus = fs.readFileSync(
      path + "updateLockedStatus.sql",
      "utf8"
    );

    await pool.query(updateQuestProgress, [quest_status, player_id, quest_id]);

    if (quest_status === "completed") {
      await pool.query(updateLockedStatus, [player_id, quest_id]);
    }

    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: "success" }));
  } catch (error) {
    console.error("Error parsing player_quests data:", error);
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Bad Request" }));
  }
};
