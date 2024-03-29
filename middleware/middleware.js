/* ==================================
    Middleware
=====================================*/

//Bring in JWT to use for authentication
const jwt = require("jsonwebtoken");
const addGame = require("../models/addGame");
const addVoteGame = require("../models/addVoteGame");
const { ObjectId } = require("mongoose").Types;

//Check if username exists ===============================================
const User = require("../models/users");
const googleUser = require("../models/googleUser");

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

async function getGoogleUser(req, res, next) {
  console.log(req.body, "req.body from getGoogleUser");
  const googleUserToFind = req.body.googleUserId;
  console.log(googleUserToFind, "googleUserToFind");
  const locateGoogleUser = await googleUser.findOne({ _id: googleUserToFind });
  console.log(locateGoogleUser, "locateGoogleUser");
  if (locateGoogleUser === null) {
    res.status(404).send("Google User not found in database");
    return;
  }
  res.googleUser = locateGoogleUser;
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

    editGame = locateGameToEdit;
    res.editGame = editGame;
    next();
  }
}

//Check if user has already voted on game

async function checkUserVote(req, res, next) {
  let voteGame;
  const userIdToCheck = req.body.userId;
  const checkGameId = req.body.gameId;
  console.log("userIdToCheck:", userIdToCheck);
  console.log("checkGameId:", checkGameId);
  const gameIdToCheck = new ObjectId(checkGameId);
  const locateUserInVoteRecord = await addVoteGame.findOne({
    _id: gameIdToCheck,
    voteUsers: { $elemMatch: { $eq: userIdToCheck } },
  });
  console.log(locateUserInVoteRecord, "locateUserInVoteRecord");
  //If userId is found, return that user already has voted on game

  if (locateUserInVoteRecord !== null) {
    console.log("User already voted");
    res.status(409).send({ msg: "User has already voted for this game" });
  } else {
    //If user isn't found, pass along vote info
    console.log("User has NOT voted on this game");
    (voteGame = req.body), (res.voteGame = voteGame);
    next();
  }
}

//JSON web token authentication ===============================================

function checkToken(req, res, next) {
  if (req.cookies && req.cookies.jwt) {
    let token = req.cookies.jwt;

    try {
      if (jwt.verify(token, "jwt-secret")) {
        next();
      } else {
        res.status(403).send({ msg: "Your token was not verified." });
      }
    } catch (err) {
      res
        .status(401)
        .send({ msg: "There was an error in the token authentication" });
    }
  } else {
    res.status(401).send({ msg: "You are not authorized to view this." });
  }
}

module.exports = {
  checkUserName,
  getUserById,
  checkToken,
  getGameById,
  checkUserVote,
  getGoogleUser,
};
