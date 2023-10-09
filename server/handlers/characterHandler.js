const fs = require("fs");

const path = "server/sql/character/";

module.exports.handleFetchCharacterById = async function (id, res, pool) {
  try {
    const query = fs.readFileSync(path + "selectCharacterById.sql", "utf8");
    const result = await pool.query(query, [id]);

    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(result.rows));
  } catch (error) {
    console.error("Error fetching character by id:", error);
  }
};

module.exports.handleInsertCharacterByPlayerId = function (req, res, pool) {
  try {
    const data = req.body;
    const player_id = data.player_id;
    const query = fs.readFileSync(
      path + "insertCharacterByPlayerid.sql",
      "utf8"
    );

    pool
      .query(query, [player_id])
      .then(() => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: `Character inserted successfully.`,
          })
        );
      })
      .catch((error) => {
        console.error("Error inserting new Character: ", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
      });
  } catch (error) {
    console.error("Error parsing Character table:", error);
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Bad Request" }));
  }
};

module.exports.handleUpdateCharacterNameById = function (req, res, pool) {
  try {
    const data = req.body;
    const player_id = data.player_id;
    const new_name = data.new_name;
    const query = fs.readFileSync(path + "updateCharacterNameById.sql", "utf8");

    pool
      .query(query, [new_name, player_id])
      .then(() => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: `Character name updated successfully. New Character name: ${new_name}`,
          })
        );
      })
      .catch((error) => {
        console.error(
          "Error updating character name in characterHandler.js line 35:",
          error
        );
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
      });
    // .finally(() => {
    //   // Close the database pool
    //   pool.end();
    // });
  } catch (error) {
    console.error("Error parsing character data:", error);
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Bad Request" }));
  }
};
