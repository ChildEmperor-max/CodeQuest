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

module.exports.handleInsertQuestProgress = function (req, res, pool) {
  try {
    const data = req.body;
    const player_id = data.player_id;
    const quest_status = data.quest_status;
    const quest_id = data.quest_id;
    const query = fs.readFileSync(path + "insertQuestProgress.sql", "utf8");

    pool
      .query(query, [quest_id, quest_status, player_id])
      .then(() => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: `Quest inserted successfully.`,
          })
        );
      })
      .catch((error) => {
        console.error(
          "Error inserting new Quest in player_quests table: ",
          error
        );
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
      });
  } catch (error) {
    console.error("Error parsing player_quests data:", error);
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Bad Request" }));
  }
};

module.exports.handleUpdateQuestProgress = function (req, res, pool) {
  try {
    const data = req.body;
    const player_id = data.player_id;
    const quest_status = data.quest_status;
    const quest_id = data.quest_id;
    const query = fs.readFileSync(path + "updateQuestProgress.sql", "utf8");

    pool
      .query(query, [quest_status, player_id, quest_id])
      .then(() => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: `Quest updated successfully.`,
          })
        );
      })
      .catch((error) => {
        console.error("Error updating Quest in player_quests table: ", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
      });
  } catch (error) {
    console.error("Error parsing player_quests data:", error);
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Bad Request" }));
  }
};
