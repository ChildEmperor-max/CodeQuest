const fs = require("fs");
const SQL_PATH = "server/sql/items/";

module.exports.handleFetchAllItems = function (req, res, pool) {
  const selectAllItems = fs.readFileSync(
    SQL_PATH + "selectAllItems.sql",
    "utf8"
  );
  pool.query(selectAllItems, (err, result) => {
    if (err) {
      console.error("Error fetching help table:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result.rows));
    }
  });
};
