/* ==================================
    Middleware
=====================================*/

//Bring in JWT to use for authentication
const jwt = require("jsonwebtoken");
const addGame = require("../models/addGame");

//Check if username exists ===============================================
const User = require("../models/users");

async function checkUserName(req, res, next) {
  const usernameToFind = req.body.userName;
  console.log(usernameToFind);
  const locateUsername = await User.findOne({ userName: usernameToFind });
  if (locateUsername) {
    console.log("user exists");
    res.status(409).send("Username is taken");
  } else {
    console.log("user does not exist");
    next();
  }
}

//Get user by Id ==========================================================
async function getUserById(req, res, next) {
  let user;
  const userToFind = req.body.userId;

  const locateUser = await User.findOne({ _id: userToFind });
  if (locateUser === null) {
    res.status(404).send("User not found in database");
  }
  //If user is in database, pass on user info
  console.log(locateUser);
  res.user = locateUser;
  next();
}

//Get created game by Id ==================================================
async function getGameById(req, res, next) {
  let editGame;
  console.log(req.params.id, "request body");
  const gameToFind = req.params.id;
  const locateGameToEdit = await addGame.findOne({ _id: gameToFind });
  //If game isn't found in database, send 404 response
  if (locateGameToEdit === null) {
    res.status(404).send("Game not found");
  } else {
    //If game is found, pass along game info
    console.log(gameToFind, "game to find - from middleware");
    console.log(locateGameToEdit, "locateGameToEdit - from middleware");
    editGame = locateGameToEdit;
    res.editGame = editGame;
    next();
  }
}

//JSON web token authentication ===============================================
function checkToken(req, res, next) {
  if (req.headers["authorization"] !== undefined) {
    let token = req.headers["authorization"].split(" ")[1];
    try {
      if (jwt.verify(token, "jwt-secret")) {
        next();
      } else {
        res.status(403).send({ msg: "Your token was not verified." });
      }
    } catch (err) {
      res.send({ msg: "There was an error in the token authentication" });
    }
  } else {
    res.status(401).send("You do not have permission to view this.");
  }
}

module.exports = { checkUserName, getUserById, checkToken, getGameById };
