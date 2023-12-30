const fs = require("fs");

const path = "server/sql/character/";

const OPERATION = {
  ADD: "add",
  MINUS: "minus",
  TIMES: "times",
  DIVIDE: "divide",
};

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

module.exports.handleFetchCodeProfile = async function (id, res, pool) {
  try {
    const query = fs.readFileSync(
      path + "selectCharacterCodeProfile.sql",
      "utf8"
    );
    const result = await pool.query(query, [id]);

    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(result.rows));
  } catch (error) {
    console.error("Error fetching character by id:", error);
  }
};

module.exports.handleFetchCharacterItems = async function (
  playerId,
  res,
  pool
) {
  try {
    const selectCharacterItems = fs.readFileSync(
      path + "selectCharacterItems.sql",
      "utf8"
    );
    const result = await pool.query(selectCharacterItems, [playerId]);

    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(result.rows));
  } catch (error) {
    console.error("handleFetchCharacterItems:", error);
  }
};

module.exports.handleFetchItemsById = async function (req, res, pool) {
  try {
    const playerId = req.params.playerId;
    const itemId = req.params.itemId;
    const selectCharacterItemById = fs.readFileSync(
      path + "selectCharacterItemById.sql",
      "utf8"
    );
    const result = await pool.query(selectCharacterItemById, [
      playerId,
      itemId,
    ]);

    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(result.rows));
  } catch (error) {
    console.error("handleFetchCharacterItems:", error);
  }
};

module.exports.handleFetchCharacterByLevelRank = async function (
  req,
  res,
  pool
) {
  try {
    const playerId = req.params.playerId;
    const query = fs.readFileSync(
      path + "selectCharacterByLevelRank.sql",
      "utf8"
    );
    const result = await pool.query(query, [playerId]);

    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(result.rows));
  } catch (error) {
    console.error("Error fetching character by id:", error);
  }
};

module.exports.handleFetchCharactersByLevel = async function (req, res, pool) {
  try {
    const query = "SELECT * FROM character ORDER BY level DESC LIMIT 10";
    const result = await pool.query(query);

    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(result.rows));
  } catch (error) {
    console.error("Error fetching characters by level:", error);
  }
};

module.exports.handleInsertCharacterByPlayerId = function (req, res, pool) {
  try {
    const data = req.body;
    const player_id = data.player_id;
    const default_char_name = "Player_" + data.player_id;
    const query = fs.readFileSync(
      path + "insertCharacterByPlayerid.sql",
      "utf8"
    );

    pool
      .query(query, [player_id, default_char_name])
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
  } catch (error) {
    console.error("Error parsing character data:", error);
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Bad Request" }));
  }
};

module.exports.handleUpdateCharacterBioById = function (req, res, pool) {
  try {
    const data = req.body;
    const player_id = data.player_id;
    const new_bio = data.new_bio;
    const query = fs.readFileSync(path + "updateCharacterBioById.sql", "utf8");

    pool
      .query(query, [new_bio, player_id])
      .then(() => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: `Character bio updated successfully. Bio: ${new_bio}`,
          })
        );
      })
      .catch((error) => {
        console.error(
          "Error updating character bio in characterHandler.js:",
          error
        );
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
      });
  } catch (error) {
    console.error("Error parsing character data:", error);
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Bad Request" }));
  }
};

const updateXp = async (pool, player_id, gained_xp) => {
  try {
    const resultCurrentXp = await pool.query(
      "SELECT xp->'current_xp' as current_xp from character WHERE player_id = $1",
      [player_id]
    );
    const resultMaxXp = await pool.query(
      "SELECT xp->'max_xp' as max_xp from character WHERE player_id = $1",
      [player_id]
    );

    let totalGainedXp = resultCurrentXp.rows[0].current_xp + gained_xp;
    let max_xp = resultMaxXp.rows[0].max_xp;

    await pool.query(
      `UPDATE character SET xp = jsonb_set(xp, '{current_xp}', '${totalGainedXp}') WHERE player_id = $1`,
      [player_id]
    );

    while (totalGainedXp >= max_xp) {
      console.log("LEVEL UP!");
      totalGainedXp = totalGainedXp - max_xp;
      const resultLevel = await pool.query(
        "SELECT level from character WHERE player_id = $1",
        [player_id]
      );
      let currentLevel = resultLevel.rows[0].level;
      const updatedLevel = currentLevel + 1;

      const updateLevelQuery = fs.readFileSync(
        path + "updateLevel.sql",
        "utf8"
      );
      await pool.query(updateLevelQuery, [player_id, updatedLevel]);

      await pool.query(
        `UPDATE character SET xp = jsonb_set(xp, '{current_xp}', '${totalGainedXp}') WHERE player_id = $1`,
        [player_id]
      );

      await pool.query(
        `UPDATE character SET xp = jsonb_set(xp, '{max_xp}', '${Math.ceil(
          max_xp * 1.5
        )}') WHERE player_id = $1`,
        [player_id]
      );
    }

    return { message: "success" };
  } catch (error) {
    console.error("Error parsing character data:", error);
    return { message: "error" };
  }
};

module.exports.handleUpdateCurrentXp = async function (req, res, pool) {
  try {
    const data = req.body;
    const player_id = data.player_id;
    const gained_xp = data.gained_xp;

    const response = await updateXp(pool, player_id, gained_xp);

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
  } catch (error) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Bad Request" }));
  }
};

const updateGold = async (pool, player_id, gained_gold, operation) => {
  try {
    const resultCurrentGold = await pool.query(
      "SELECT gold from character WHERE player_id = $1",
      [player_id]
    );

    let totalGainedGold;
    switch (operation) {
      case OPERATION.ADD:
        totalGainedGold = resultCurrentGold.rows[0].gold + gained_gold;
        break;
      case OPERATION.MINUS:
        totalGainedGold = resultCurrentGold.rows[0].gold - gained_gold;
        break;
      case OPERATION.TIMES:
        totalGainedGold = resultCurrentGold.rows[0].gold * gained_gold;
        break;
      case OPERATION.DIVIDE:
        totalGainedGold = resultCurrentGold.rows[0].gold / gained_gold;
        break;
      default:
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
        break;
    }

    await pool.query(
      `UPDATE character SET gold = '${totalGainedGold}' WHERE player_id = $1`,
      [player_id]
    );
    return { message: "success" };
  } catch (error) {
    console.error("Error parsing character data:", error);
    return { message: "error" };
  }
};

module.exports.handleUpdateGold = async function (req, res, pool) {
  try {
    const data = req.body;
    const player_id = data.player_id;
    const gained_gold = data.gained_gold;
    const operation = data.operation;

    const response = await updateGold(pool, player_id, gained_gold, operation);

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
  } catch (error) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Bad Request" }));
  }
};

module.exports.handleUpdateMaxXp = function (req, res, pool) {
  try {
    const data = req.body;
    const player_id = data.player_id;
    const new_max_xp = data.new_max_xp;
    const query = fs.readFileSync(path + "updateMaxXp.sql", "utf8");

    pool
      .query(query, [player_id, new_max_xp])
      .then(() => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: `Character data updated successfully`,
          })
        );
      })
      .catch((error) => {
        console.error(
          "Error updating character data in characterHandler.js:",
          error
        );
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
      });
  } catch (error) {
    console.error("Error parsing character data:", error);
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Bad Request" }));
  }
};

module.exports.handleUpdateXp = function (req, res, pool) {
  try {
    const data = req.body;
    const player_id = data.player_id;
    const new_current_xp = data.new_current_xp;
    const new_max_xp = data.new_max_xp;

    const update_current_xp = fs.readFileSync(
      path + "updateCurrentXp.sql",
      "utf8"
    );
    const update_max_xp = fs.readFileSync(path + "updateMaxXp.sql", "utf8");

    pool.query(
      update_current_xp,
      [player_id, new_current_xp],
      (err, result) => {
        if (err) {
          console.error("Error updating current xp:", err);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Internal Server Error" }));
          return;
        }
        pool.query(update_max_xp, [player_id, new_max_xp], (err, result) => {
          if (err) {
            console.error("Error updating max xp:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Internal Server Error" }));
            return;
          }
        });
      }
    );
  } catch (error) {
    console.error("Error parsing character data:", error);
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Bad Request" }));
  }
};

module.exports.handleUpdateLevel = function (req, res, pool) {
  try {
    const data = req.body;
    const player_id = data.player_id;
    const new_level = data.new_level;

    pool.query(
      "SELECT level from character WHERE player_id = $1",
      [player_id],
      (err, result) => {
        if (err) {
          returnError(err, res);
        }
        let currentLevel = result.rows[0].level;
        const updatedLevel = currentLevel + 1;

        const updateLevel = fs.readFileSync(path + "updateLevel.sql", "utf8");
        pool.query(updateLevel, [player_id, updatedLevel], (err, result) => {
          if (err) {
            returnError(err, res);
          }
          res.writeHead(201, {
            "Content-Type": "application/json",
          });
          res.end(
            JSON.stringify({
              message: "level updated successfully",
            })
          );
        });
      }
    );
  } catch (error) {
    console.error("Error parsing character data:", error);
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Bad Request" }));
  }
};

module.exports.handleUpdateInventory = function (req, res, pool) {
  try {
    const data = req.body;
    const playerId = data.playerId;
    const itemId = data.itemId;
    const itemCount = data.itemCount;
    const updateInventory = fs.readFileSync(
      path + "updateInventory.sql",
      "utf8"
    );

    pool
      .query(updateInventory, [playerId, itemId, itemCount])
      .then(() => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: `Character data updated successfully`,
          })
        );
      })
      .catch((error) => {
        console.error(
          "Error updating character data in characterHandler.js:",
          error
        );
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
      });
  } catch (error) {
    console.error("Error parsing character data:", error);
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Bad Request" }));
  }
};

module.exports.handleUpdateAvatarPath = async function (
  req,
  res,
  pool,
  avatar_path
) {
  try {
    const playerId = req.params.playerId;
    const query = fs.readFileSync(path + "updateAvatarPath.sql", "utf8");
    console.log("playerId: " + playerId + "\nAvatar path: " + avatar_path);

    await pool.query(query, [playerId, avatar_path]);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        avatar_path: avatar_path,
        message: `Character Avatar updated succesfully`,
      })
    );
  } catch (error) {
    console.error(
      "Error updating character avatar in characterHandler.js:",
      error
    );
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
};

module.exports.handleUpdateCharacterAchievements = function (req, res, pool) {
  try {
    const data = req.body;
    const player_id = data.player_id;
    const achievement_id = data.achievement_id;

    const updateCharacterAchievements = fs.readFileSync(
      path + "updateCharacterAchievements.sql",
      "utf8"
    );
    pool.query(
      updateCharacterAchievements,
      [player_id, parseInt(achievement_id)],
      (err, result) => {
        if (err) {
          returnError(err, res);
        }
        res.writeHead(201, {
          "Content-Type": "application/json",
        });
        res.end(
          JSON.stringify({
            message: "level updated successfully",
          })
        );
      }
    );
  } catch (error) {
    console.error("Error parsing character data:", error);
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Bad Request" }));
  }
};

module.exports.handleUpdateExecutes = function (req, res, pool) {
  try {
    const data = req.body;
    const player_id = data.player_id;

    pool.query(
      "SELECT code_profile->'executes' as executes FROM character WHERE player_id = $1",
      [player_id],
      (err, result) => {
        if (err) {
          returnError(err, res);
        }
        let currentExecutes = result.rows[0].executes;
        const updatedExecutes = currentExecutes + 1;

        const updateExecutes = fs.readFileSync(
          path + "updateExecutes.sql",
          "utf8"
        );
        pool.query(
          updateExecutes,
          [player_id, updatedExecutes],
          (err, result) => {
            if (err) {
              returnError(err, res);
            }
            res.writeHead(201, {
              "Content-Type": "application/json",
            });
            res.end(
              JSON.stringify({
                message: "level updated successfully",
              })
            );
          }
        );
      }
    );
  } catch (error) {
    console.error("Error parsing character data:", error);
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Bad Request" }));
  }
};

module.exports.handleUpdateErrors = function (req, res, pool) {
  try {
    const data = req.body;
    const player_id = data.player_id;

    pool.query(
      "SELECT code_profile->'errors' as errors FROM character WHERE player_id = $1",
      [player_id],
      (err, result) => {
        if (err) {
          returnError(err, res);
        }
        let currentErrors = result.rows[0].errors;
        const updatedErrors = currentErrors + 1;

        const updateErrors = fs.readFileSync(path + "updateErrors.sql", "utf8");
        pool.query(updateErrors, [player_id, updatedErrors], (err, result) => {
          if (err) {
            returnError(err, res);
          }
          res.writeHead(201, {
            "Content-Type": "application/json",
          });
          res.end(
            JSON.stringify({
              message: "level updated successfully",
            })
          );
        });
      }
    );
  } catch (error) {
    console.error("Error parsing character data:", error);
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Bad Request" }));
  }
};

function returnError(err, res) {
  console.error(err);
  res.writeHead(500, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Internal Server Error" }));
  return;
}
