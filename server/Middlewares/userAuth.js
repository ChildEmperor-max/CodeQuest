//importing modules
const express = require("express");
const db = require("../Models");
//Assigning db.users to User variable
const Player = db.players;

//Function to check if username or email already exist in the database
//this is to avoid having two users with the same username and email
const savePlayer = async (req, res, next) => {
  //search the database to see if user exist
  try {
    // const username = await Player.findOne({
    //   where: {
    //     userName: req.body.userName,
    //   },
    // });
    // //if username exist in the database respond with a status of 409
    // if (username) {
    //   return res.json(409).send("username already taken");
    // }
    console.log("Body: ", req.body);
    console.log("EMAIL: ", req.body.email);
    //checking if email already exist
    const emailcheck = await Player.findOne({
      where: {
        email: req.body.email,
      },
    });

    //if email exist in the database respond with a status of 409
    if (emailcheck) {
      return res.status(409).json({ message: "E-mail already exists!" });
    }

    next();
  } catch (error) {
    console.log("[SAVING PLAYER]", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//exporting module
module.exports = {
  savePlayer,
};
