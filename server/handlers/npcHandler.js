const fs = require("fs");
const path = "server/sql/npc/";

function handleUpdateNpcQuestDialog(req, res, pool) {
  try {
    const data = req.body;
    const npc_id = data.npc_id;
    const quest_id = data.quest_id;
    const dialog_id = data.dialog_id;
    const playerId = data.player_id;
    const query = fs.readFileSync(path + "updateNpcQuestDialog.sql", "utf8");

    pool
      .query(query, [npc_id, quest_id, dialog_id])
      .then(() => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: `NPC updated successfully.`,
          })
        );
      })
      .catch((error) => {
        console.error("Error updating NPC in NPC table: ", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
      });
  } catch (error) {
    console.error("Error parsing NPC data:", error);
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Bad Request" }));
  }
}

function fetchNpcQuestDialog(req, res, pool) {
  const sqlQuery = fs.readFileSync("server/sql/viewNpcQuestDialog.sql", "utf8");
  pool
    .query(sqlQuery)
    .then((result) => {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(result.rows));
    })
    .catch((error) => {
      console.error("Error executing query:", error);
    });
}

function handleFetchNpcByQuestId(questId, res, pool) {
  const sqlQuery = fs.readFileSync(
    "server/sql/npc/selectNpcByQuestId.sql",
    "utf8"
  );
  pool
    .query(sqlQuery, [questId])
    .then((result) => {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(result.rows));
    })
    .catch((error) => {
      console.error("Error executing query:", error);
    });
}

function handleFetchIdByName(name, res, pool) {
  pool
    .query("SELECT id FROM npc WHERE TRIM(npc_name) = $1", [name])
    .then((result) => {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(result.rows));
    })
    .catch((err) => {
      console.error("Error executing database query:", err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
    });
}

function handleFetchNpcById(id, res, pool) {
  pool
    .query("SELECT * FROM npc WHERE id = $1", [id])
    .then((result) => {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(result.rows));
    })
    .catch((err) => {
      console.error("Error executing database query:", err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
    });
}

async function fetchNpcQuestDialogById(id, res, pool) {
  try {
    const query = fs.readFileSync(
      "server/sql/viewNpcQuestDialogById.sql",
      "utf8"
    );
    const result = await pool.query(query, [id]);

    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(result.rows));
  } catch (error) {
    console.error("Error executing query:", error);
  }
}

async function handleFetchNpcDataByName(req, res, pool) {
  try {
    const name = req.params.name;
    const playerId = parseInt(req.params.playerId, 10);

    if (isNaN(playerId)) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Invalid playerId");
      return;
    }

    const selectNpcByName = fs.readFileSync(
      "server/sql/npc/selectNpcByName.sql",
      "utf8"
    );

    const result = await pool.query(selectNpcByName, [playerId, name]);
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(result.rows));
  } catch (err) {
    console.error("Error handling NPC data request:", err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
}

function handleFetchNpc(req, res, pool) {
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
}

function handleInsertNpc(req, res, pool) {
  try {
    const npcData = req.body;
    checkAndGetAllData(
      "npc",
      "npc_name",
      "*",
      npcData.npc_name,
      pool,
      (err, exists) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Internal Server Error" }));
          return;
        }

        if (exists) {
          res.writeHead(409, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "NPC already exists" }));
          return;
        }

        pool.query(
          "SELECT id FROM quest WHERE quest_title = $1",
          [npcData.quest_title],
          (err, result) => {
            if (err) {
              console.error("Error checking Quest ID:", err);
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Internal Server Error" }));
              return;
            }
            if (result.rows.length === 0) {
              res.writeHead(404, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Quest not found" }));
              return;
            }
            const questId = result.rows[0].id;

            pool.query(
              "SELECT id FROM dialog WHERE dialog = $1",
              [npcData.dialog],
              (err, result) => {
                if (err) {
                  console.error("Error checking Dialog ID:", err);
                  res.writeHead(500, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ error: "Internal Server Error" }));
                  return;
                }
                if (result.rows.length === 0) {
                  res.writeHead(404, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ error: "Dialog not found" }));
                  return;
                }
                const dialogId = result.rows[0].id;

                pool.query(
                  "INSERT INTO npc (npc_name, quest_id, dialog_id) VALUES ($1, $2, $3)",
                  [npcData.npc_name, questId, dialogId],
                  (err) => {
                    if (err) {
                      console.error("Error creating new NPC:", err);
                      res.writeHead(500, {
                        "Content-Type": "application/json",
                      });
                      res.end(
                        JSON.stringify({ error: "Internal Server Error" })
                      );
                      return;
                    }

                    res.writeHead(201, {
                      "Content-Type": "application/json",
                    });
                    res.end(
                      JSON.stringify({ message: "NPC created successfully" })
                    );
                  }
                );
              }
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
}

function checkAndGetAllData(
  tableName,
  columnName,
  data,
  value,
  pool,
  callback
) {
  pool.query(
    `SELECT ${data} FROM ${tableName} WHERE ${columnName} = $1`,
    [value],
    (err, result) => {
      if (err) {
        console.error(`Error checking existing ${tableName}:`, err);
        callback(err, false);
      } else if (result.rows.length > 0) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    }
  );
}

module.exports = {
  fetchNpcQuestDialog,
  handleFetchIdByName,
  handleFetchNpcById,
  fetchNpcQuestDialogById,
  handleFetchNpcDataByName,
  handleFetchNpc,
  handleInsertNpc,
  handleUpdateNpcQuestDialog,
  handleFetchNpcByQuestId,
};
