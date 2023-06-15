export function handleFetchDialog(req, res, pool) {
  // Query the database to fetch all dialogs
  pool.query("SELECT * FROM dialog", (err, result) => {
    if (err) {
      console.error("Error fetching dialog table:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    } else {
      // Send the dialog data as the response
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result.rows));
    }
  });
}

export function handleInsertDialog(req, res, pool) {
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
          // Insert the dialog data into the database table
          pool.query(
            "INSERT INTO dialog (dialog) VALUES ($1)",
            [dialog],
            (err) => {
              if (err) {
                console.error("Error creating new dialog:", err);
                res.writeHead(500, {
                  "Content-Type": "application/json",
                });
                res.end(JSON.stringify({ error: "Internal Server Error" }));
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
    } catch (error) {
      console.error("Error parsing dialog data:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Bad Request" }));
    }
  });
}
