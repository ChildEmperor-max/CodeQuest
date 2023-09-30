module.exports.handleFetchAchievements = function (req, res, pool) {
  pool.query("SELECT * FROM achievements ORDER BY id ASC", (err, result) => {
    if (err) {
      console.error("Error executing database query:", err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
    } else {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(result.rows));
    }
  });
};
