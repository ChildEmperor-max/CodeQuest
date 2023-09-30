const fs = require("fs");

module.exports.handleFetchHelp = function (req, res, pool) {
  // Query the database to fetch all help
  pool.query("SELECT * FROM help", (err, result) => {
    if (err) {
      console.error("Error fetching help table:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    } else {
      // Send the help data as the response
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result.rows));
    }
  });
};

module.exports.handleFetchHelpById = function (id, res, pool) {
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
};

module.exports.handleFetchHelpByDialogId = async function (id, res, pool) {
  try {
    const query = fs.readFileSync("server/sql/viewHelpDialogById.sql", "utf8");
    const result = await pool.query(query, [id]);

    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(result.rows));
  } catch (error) {
    console.error("Error executing query:", error);
  }
};
