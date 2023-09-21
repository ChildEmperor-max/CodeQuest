import fs from "fs";

export function handleFetchHelp(req, res, pool) {
  // Query the database to fetch all dialogs
  pool.query("SELECT * FROM help", (err, result) => {
    if (err) {
      console.error("Error fetching help table:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    } else {
      // Send the dialog data as the response
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result.rows));
    }
  });
}

export function handleFetchHelpById(id, res, pool) {
  pool
    .query("SELECT * FROM help WHERE id = $1", [id])
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
