const fs = require("fs");

const path = "server/sql/player/";

module.exports.handleFetchPlayerByEmail = async function (email, res, pool) {
  try {
    const query = fs.readFileSync(path + "selectPlayerByEmail.sql", "utf8");
    const result = await pool.query(query, [email]);

    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(result.rows));
  } catch (error) {
    console.error("Error executing query:", error);
  }
};
