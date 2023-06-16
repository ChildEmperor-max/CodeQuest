export function handleFetchQuest(req, res, pool) {
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
}

export function handleUpdateQuestStatus(req, res, pool) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      const questData = JSON.parse(body);
      const questTitle = questData.quest_title;
      const newQuestStatus = questData.quest_status;
      pool.query(
        "SELECT id FROM quest WHERE quest_title = $1",
        [questTitle],
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

          pool
            .query("UPDATE quest SET quest_status = $1 WHERE id = $2", [
              newQuestStatus,
              questId,
            ])
            .then(() => {
              console.log("Data updated successfully");
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({ message: "Quest status updated successfully" })
              );
            })
            .catch((error) => {
              console.error("Error updating data:", error);
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Internal Server Error" }));
            });
          // .finally(() => {
          //   // Close the database pool
          //   pool.end();
          // });
        }
      );
    } catch (error) {
      console.error("Error parsing quest data:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Bad Request" }));
    }
  });
}

export function handleInsertQuest(req, res, pool) {
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
          // Insert the quest data into the database table
          pool.query(
            "INSERT INTO quest (quest_title, quest_description, quest_status, quest_type) VALUES ($1, $2, $3, $4)",
            [questTitle, questDescription, questStatus, questType],
            (err) => {
              if (err) {
                console.error("Error creating new quest:", err);
                res.writeHead(500, {
                  "Content-Type": "application/json",
                });
                res.end(JSON.stringify({ error: "Internal Server Error" }));
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
    } catch (error) {
      console.error("Error parsing quest data:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Bad Request" }));
    }
  });
}
