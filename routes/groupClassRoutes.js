const express = require("express");
const router = express.Router();
const Piece = require("../models/pieces");
const User = require("../models/users");
const Game = require("../models/games");
const SaveGame = require("../models/saveGame");
const AddGame = require("../models/addGame");
const AddVoteGame = require("../models/addVoteGame");
const AddPermenantGame = require("../models/permenantGame");
const GoogleUser = require("../models/googleUser");
const jwt = require("jsonwebtoken");

const {
  checkUserName,
  getUserById,
  checkToken,
  getGameById,
  checkUserVote,
} = require("../middleware/middleware");

router.get("/", (req, res) => {
  res.status(200).send("You have reached the right place!");
});

/* =========================================
||||||||||| Get all pieces ||||||||| |||||||
============================================ */
router.get("/getPieces", async (req, res) => {
  try {
    const allPieces = await Piece.find({});
    const mongoose = require("mongoose");

    const googleUserSchema = new mongoose.Schema(
      {
        fullName: {
          type: String,
          require: true,
        },
        email: {
          type: String,
          require: true,
        },
      },
      { collection: "googleUsers" }
    );

    module.exports = mongoose.model("GoogleUser", googleUserSchema);
    res.status(201).json(allPieces);
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "There was an error getting the pieces" });
  }
});

/* ===========================================
||||||||||| Add new piece to database ||||||||
============================================== */
router.post("/newPiece", checkToken, async (req, res) => {
  console.log(req.body);

  const addPiece = new Piece({
    book: req.body.book,
    pieceName: req.body.pieceName,
    techniqueTags: req.body.techniqueTags,
  });
  try {
    const sendPiece = await addPiece.save();
    res.status(200).json(sendPiece);
    return;
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "There was an error adding a new piece." });
  }
});

// Check if user exists

router.post("/checkGoogleUser", async (req, res) => {
  const userToCheck = req.body.email;
  try {
    const findUser = await GoogleUser.findOne({ email: userToCheck });
    if (findUser) {
      let token = jwt.sign(
        {
          userName: usr,
        },
        "jwt-secret",
        {
          algorithm: "HS256",
        }
      );
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.status(200).json(findUser);
    } else {
      res.status(404).send({ msg: "User not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "There was a server error" });
  }
});

// Add new Google user to database

router.post("/addGoogleUser", async (req, res) => {
  const addGoogleUser = new GoogleUser({
    fullName: req.body.name,
    email: req.body.email,
  });
  console.log(addGoogleUser, "addGoogleUser");
  try {
    const addGoogleUserToDatabase = await addGoogleUser.save();
    res.status(201).send(addGoogleUserToDatabase);
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "There was an error adding the Google user." });
  }
});

/* =========================================
||||||||||| Add new user to database |||||||
============================================ */
router.post("/addUser", checkUserName, async (req, res) => {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    country: req.body.country,
    email: req.body.email,
    userName: req.body.userName,
    password: req.body.password,
  });

  try {
    await user.save();
    res.status(201).send("User created");
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "There was an error adding the user." });
  }
});

router.post("loginGoogleUser", async (req, res) => {
  const googleUser = req.body.email;
  const googleToken = req.body.token;

  try {
    const checkGoogleUser = await GoogleUser.findOne({ email: googleUser });
    if (!checkGoogleUser) {
      res.status(404).send("User not found");
    } else if (checkGoogleUser != null) {
      let token = jwt.sign(
        {
          userName: usr,
        },
        "jwt-secret",
        {
          algorithm: "HS256",
        }
      );
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.status(200).json({
        email: checkGoogleUser.email,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

/* =======================================
|||||||||| Login User ||||||||||||||||||||
========================================== */
router.post("/login", async (req, res) => {
  const usr = req.body.userName;
  const pwd = req.body.password;

  try {
    const loginUser = await User.findOne({ userName: usr, password: pwd });
    if (!loginUser) {
      res.status(401).send("Username or password incorrect!");
    } else if (loginUser != null) {
      let token = jwt.sign(
        {
          userName: usr,
        },
        "jwt-secret",
        {
          algorithm: "HS256",
        }
      );
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.status(200).json({
        firstName: loginUser.firstName,
        lastName: loginUser.lastName,
        email: loginUser.email,
        userId: loginUser._id,
        username: loginUser.userName,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "There was an error logging in." });
  }
});

/* ======================================
||||||| Get technique tags ||||||||||||||
========================================= */

router.get("/tags", async (req, res) => {
  try {
    const getTags = await Piece.find({}, { techniqueTags: 1, _id: 0 });
    res.status(200).json(getTags);
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "There was a server error." });
  }
});

/* ======================================
||||||||||| Technique Tag Query |||||||||
========================================= */
router.post("/techniqueSearch", async (req, res) => {
  const tagToSearch = req.body.tagToSearch;
  try {
    const getPieces = await Piece.find({ techniqueTags: tagToSearch });
    res.status(200).json(getPieces);
  } catch (err) {
    res
      .status(500)
      .send("There was an error getting technique tags for pieces");
  }
});

/* =======================================
|||||||||| Game Technique ||||||||||||||||
========================================== */

router.get("/gameTechniques", async (req, res) => {
  try {
    const getGameTechniques = await Game.find({}, { gameTechnique: 1, _id: 0 });
    res.status(200).json(getGameTechniques);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ msg: "There was an error getting the game techniques." });
  }
});

/* =======================================
||||||||| Get Games|||||||||||||||||||||||
========================================== */
router.get("/gameSearch", async (req, res) => {
  const gameIdeas = [];
  try {
    const getGameIdeas = await Game.find({});
    res.status(200).json(getGameIdeas);
  } catch (err) {
    console.log(err);
    res.status(500).send("There was an error searching for games");
  }
});

/* =======================================
||||||||| Get Random Game ||||||||||||||||
========================================== */

router.get("/randomGame", checkToken, async (req, res) => {
  const randomGameIdeas = [];

  try {
    const getGameIdeas = await Game.find({});
    randomGameIdeas.push(getGameIdeas);
    const randomIdea = Math.floor(Math.random() * randomGameIdeas[0].length);
    res.status(200).json(randomGameIdeas[0][randomIdea]);
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "There was an error getting the random game" });
  }
});

/* =======================================
||||||||| Save Game ||||||||||||||||||||||
========================================== */

router.post("/saveGame", async (req, res) => {
  const saveGame = new SaveGame({
    gameName: req.body.gameName,
    gameText: req.body.gameText,
    saveUser: req.body.saveUser,
  });
  try {
    const addSaveGame = await saveGame.save();
    res.status(201).json(addSaveGame);
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "There was an error saving the game" });
  }
});

/* ========================================
|||||||||| Get user's saved games |||||||||
=========================================== */

router.post("/getSavedGames", async (req, res) => {
  const userId = req.body.saveUser;
  try {
    const findUserGames = await SaveGame.find({ saveUser: userId });
    res.status(200).json(findUserGames);
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "There was an error getting saved games" });
  }
});

/* ========================================
||||||| Get User's Created Games |||||||||||
==========================================*/

router.post("/getUserCreatedGames", async (req, res) => {
  const userId = req.body.userId;
  try {
    const findCreatedGames = await AddGame.find({ saveUser: userId });

    res.status(200).json(findCreatedGames);
  } catch (err) {
    res.status(500).send("There was an error with the server");
  }
});

/* =========================================
||||||||| Get User's Created Game by ID|||||
============================================ */

router.get("/getOneUserGame/:id", getGameById, async (req, res) => {
  console.log(res.editGame.gameName, "should be game name");
  res.status(200).send(res.editGame);
});

/* =======================================
|||||||||| Delete Saved Game ||||||||||||| 
==========================================*/

router.post("/deleteSavedGame", async (req, res) => {
  const gameIdToDelete = req.body.gameToDelete;
  try {
    const deleteSavedGame = await SaveGame.deleteOne({ _id: gameIdToDelete });
    res.status(200).json(deleteSavedGame);
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "There was an error deleting the game" });
  }
});

/* ========================================
|||||||||| Edit Created Game ||||||||||||||
=========================================== */

router.patch("/editCreated/:id", getGameById, async (req, res) => {
  if (req.body.gameName !== null) {
    res.editGame.gameName = req.body.gameName;
  }
  if (req.body.gamePieces !== null) {
    res.editGame.gamePieces = req.body.gamePieces;
  }
  if (req.body.gameTechnique !== null) {
    res.editGame.gameTechnique = req.body.gameTechnique;
  }
  if (req.body.gameText !== null) {
    res.editGame.gameText = req.body.gameText;
  }

  res.editGame.saveUser = req.body.saveUser;
  console.log(res.editGame, "res body");
  try {
    const updateGame = await res.editGame.save();

    res.status(200).send(updateGame);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
});

/* =======================================
|||||||||| Update User Info  ||||||||||||| 
==========================================*/

router.patch("/updateUser", getUserById, checkToken, async (req, res) => {
  if (req.body.firstName != null) {
    res.user.firstName = req.body.firstName;
  }
  if (req.body.lastName != null) {
    res.user.lastName = req.body.lastName;
  }
  if (req.body.email != null) {
    res.user.email = req.body.email;
  }

  try {
    const update = await res.user.save();
    console.log("updated");
    res.status(200).send({
      firstName: update.firstName,
      lastName: update.lastName,
      email: update.email,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("There was an error with the server");
  }
});

/* ========================================
||||||||| Add Game ||||||||||||||||||||||||
=========================================== */

router.post("/addGame", async (req, res) => {
  const addGame = new AddGame({
    gameName: req.body.gameName,
    gameText: req.body.gameText,
    gameTechnique: req.body.gameTechnique,
    gamePieces: req.body.gamePieces,
    saveUser: req.body.saveUser,
    username: req.body.username,
  });
  try {
    const saveAddGame = await addGame.save();
    res.status(201).send(saveAddGame);
    console.log("New Game Added");
  } catch (err) {
    res.status(500).send({
      msg: "There was an error with the server while trying to add the game.",
    });
  }
});

/* =========================================
||||||||| Add game for voting |||||||||||||||
============================================ */

router.post("/addGameForVote", async (req, res) => {
  const addVoteGame = new AddVoteGame({
    gameName: req.body.gameName,
    gameText: req.body.gameText,
    gameTechnique: req.body.gameTechnique,
    gamePieces: req.body.gamePieces,
    saveUser: req.body.saveUser,
    username: req.body.username,
    yesVote: req.body.yesVote,
    noVote: req.body.noVote,
  });
  try {
    const saveAddVoteGame = await addVoteGame.save();
    res.status(201).send(saveAddVoteGame);
    console.log("Game submitted for voting");
  } catch (err) {
    res
      .status(500)
      .send({ msg: "There was an error submitting the game to voting." });
  }
});

/* =========================================
|||||||| Get Vote Games ||||||||||||||||||||
============================================ */

router.post("/gamesForVote", checkToken, async (req, res) => {
  try {
    const getGamesForVote = await AddVoteGame.find();
    console.log(getGamesForVote, "getGamesForVote");
    res.status(200).json(getGamesForVote);
  } catch (err) {
    res
      .status(500)
      .send({ msg: "There was an error getting the games for vote." });
  }
});

/* ==========================================
||||||||| Track votes |||||||||||||||||||||||
============================================= */

router.post("/trackVote", checkUserVote, checkToken, async (req, res) => {
  /* 0 is no vote, 1 is yes vote */
  let whichVote;
  const filter = { _id: req.body.gameId };
  const options = { upsert: false };
  if (req.body.updateVoteValue === 0) {
    whichVote = {
      $set: {
        noVote: req.body.noVote,
      },
      $push: { voteUsers: req.body.userId },
      $inc: {
        noVote: 1,
      },
    };
  } else if (req.body.updateVoteValue === 1) {
    whichVote = {
      $set: {
        yesVote: req.body.yesVote,
      },
      $push: { voteUsers: req.body.userId },
      $inc: {
        yesVote: 1,
      },
    };
  }
  try {
    const voteUpdate = await AddVoteGame.updateOne(filter, whichVote, options);
    const getVoteTotal = await AddVoteGame.findOne({ _id: req.body.gameId });
    //Add game here
    if (getVoteTotal.yesVote >= 22) {
      const addToPermenantCollection = await AddPermenantGame.create({
        gameName: getVoteTotal.gameName,
        gameText: getVoteTotal.gameText,
        gameTechnique: getVoteTotal.gameTechnique,
        gamePieces: getVoteTotal.gamePieces,
        saveUser: getVoteTotal.saveUser,
        username: getVoteTotal.username,
      });
      const deleteAfterVote = await AddVoteGame.deleteOne({
        _id: req.body.gameId,
      });
      console.log(
        deleteAfterVote,
        "Game has been deleted from vote collection"
      );
      res.status(202).send(addToPermenantCollection);
      console.log("Should have been added to permenant collection");
    } else {
      res.status(201).json(voteUpdate);
    }
  } catch (err) {
    res.status(500).send({ msg: "There was an error updating the vote count" });
  }
});

/* =========================================
|||||||||| Get only votes ||||||||||||||||||
============================================ */

router.get("/getVoteTotals", async (req, res) => {
  try {
    const getVotes = await AddVoteGame.find(
      {},
      { _id: 1, yesVote: 1, noVote: 1 }
    );
    console.log(getVotes, "from getVotes");
    res.status(200).json(getVotes);
  } catch (err) {
    res
      .status(500)
      .send({ msg: "There was an error getting the votes for games" });
    console.log(err);
  }
});

/* ==========================================
||||||||| Find all games user has voted on |||
============================================= */

router.post("/getUserVotes", async (req, res) => {
  const userToCheck = req.body.userId;
  try {
    const findUserVotedGames = await AddVoteGame.find({
      voteUsers: { $elemMatch: { $eq: userToCheck } },
    }).select("_id");
    if (findUserVotedGames === null) {
      res.status(404).send({ msg: "No games found that user has voted on" });
    } else {
      res.status(200).json(findUserVotedGames);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      msg: "There was an error fetching the games a user has voted on.",
    });
  }
});

/* =========================================
|||||||||| Get Game Techniques |||||||||||||
============================================ */

router.get("/getGameTechniques", async (req, res) => {
  try {
    const getGameTags = await Game.find({}, { gameTechnique: 1, _id: 0 });
    res.status(200).json(getGameTags);
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "There was an error fetching techniques" });
  }
});

/* =========================================
|||||||||| Delete Created Game |||||||||||||
=========================================== */
router.post("/deleteCreated", async (req, res) => {
  const createdGameToDelete = req.body.gameToDelete;
  try {
    const deleteCreatedGame = await AddGame.deleteOne({
      _id: createdGameToDelete,
    });
    res.status(201).send(deleteCreatedGame);
  } catch (err) {
    res.status(500).send({ msg: "There was an errir with the server." });
  }
});

module.exports = router;
