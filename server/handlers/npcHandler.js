import fs from "fs";

export function fetchNpcQuestDialog(req, res, pool) {
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

export function handleFetchNpc(req, res, pool) {
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
}

export function handleInsertNpc(req, res, pool) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      const npcData = JSON.parse(body);
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
            return; // Return here to avoid sending multiple responses
          }

          if (exists) {
            // NPC with the same name already exists
            res.writeHead(409, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "NPC already exists" }));
            return; // Return here to avoid inserting duplicate NPC
          }

          pool.query(
            "SELECT id FROM quest WHERE quest_title = $1",
            [npcData.quest_title],
            (err, result) => {
              if (err) {
                console.error("Error checking Quest ID:", err);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Internal Server Error" }));
                return; // Return here to avoid sending multiple responses
              }
              if (result.rows.length === 0) {
                // NPC does not exist
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Quest not found" }));
                return; // Return here to avoid inserting invalid quest
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
                    return; // Return here to avoid sending multiple responses
                  }
                  if (result.rows.length === 0) {
                    // NPC does not exist
                    res.writeHead(404, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Dialog not found" }));
                    return; // Return here to avoid inserting invalid quest
                  }
                  const dialogId = result.rows[0].id;

                  // Insert the NPC data into the database table
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
                        return; // Return here to avoid sending multiple responses
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
  });
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
        // Data already exists
        callback(null, true);
      } else {
        // Data does not exist
        callback(null, false);
      }
    }
  );
}
