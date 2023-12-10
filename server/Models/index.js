const { Sequelize, DataTypes } = require("sequelize");

// const sequelize = new Sequelize(
//   `postgres://postgres:admin@localhost:5432/CodeQuest`,
//   { dialect: "postgres" }
// );

const sequelize = new Sequelize(
  `postgres://eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxpam16ZGZkcHNhYmhwd3FsZm5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE1MDQzNzcsImV4cCI6MjAxNzA4MDM3N30.YJPUGL7jXFlf6SG_mE_k4cR9aVtnlUFNGqfVjnVb8ZM@https://lijmzdfdpsabhpwqlfnh.supabase.co/CodeQuest`,
  { dialect: "postgres" }
);

//checking if connection is done
sequelize
  .authenticate()
  .then(() => {
    console.log(`Database connected to CodeQuest`);
  })
  .catch((err) => {
    console.log(err);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//connecting to model
db.players = require("./userModel")(sequelize, DataTypes);

//exporting the module
module.exports = db;
