const express = require("express");
const router = express.Router();
const Piece = require("../models/pieces");
const User = require("../models/users");
const Game = require("../models/games")
const SaveGame = require("../models/saveGame")
const { checkUserName, getUserById } = require("../middleware/middleware");
const saveGame = require("../models/saveGame");

/* =========================================
||||||||||| Get all pieces ||||||||| |||||||
============================================ */
router.get("/", async (req, res) => {
  const allPieces = await Piece.find({});
  console.log(allPieces);

  res.status(201).json(allPieces);
});

/* ===========================================
||||||||||| Add new piece to database ||||||||
============================================== */
router.post("/newPiece", async (req, res) => {
  console.log(req.body);

  const addPiece = new Piece({
    book: req.body.book,
    pieceName: req.body.pieceName,
    techniqueTags: req.body.techniqueTags,
  });
  try {
    const sendPiece = await addPiece.save();
    res.status(200).json(sendPiece);
  } catch (err) {
    console.log(err);
  }
});

/* =========================================
||||||||||| Add new user to database |||||||
============================================ */
router.post("/addUser", checkUserName, async (req, res) => {
  console.log(req.body);
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
      console.log(loginUser)
      res.status(200).send({ firstName: loginUser.firstName, lastName: loginUser.lastName, email: loginUser.email, userId: loginUser._id});
    }
  } catch (err) {
    console.log(err);
  }
});

/* ======================================
||||||| Get technique tags ||||||||||||||
========================================= */

router.get("/tags", async (req, res) => {
  const getTags = await Piece.find({}, { techniqueTags: 1, _id: 0 });
  res.status(200).json(getTags);
});

/* ======================================
||||||||||| Technique Tag Query |||||||||
========================================= */
router.post("/techniqueSearch", async (req, res) => {
  const tagToSearch = req.body.tagToSearch;
  console.log(req.body.tagToSearch);
  try {
    const getPieces = await Piece.find({ techniqueTags: tagToSearch });
    res.status(200).json(getPieces);
  } catch (err) {
    res.status(500).send("There was a server error");
  }
});

/* =======================================
||||||||| Get Games|||||||||||||||||||||||
========================================== */
router.get("/gameSearch", async (req, res)=>{
  const gameIdeas = [];
  try{
    const getGameIdeas = await Game.find({});
    console.log(getGameIdeas)
    console.log(getGameIdeas.length, "length")
    gameIdeas.push(getGameIdeas)
    res.status(200).json(gameIdeas);
  }catch(err){
    console.log(err)
    res.status(500).send("There was a server error")
  }
})

/* =======================================
||||||||| Get Random Game ||||||||||||||||
========================================== */

router.get("/randomGame", async (req, res)=>{
  const randomGameIdeas = [];
  
  try{
    const getGameIdeas = await Game.find({});
    randomGameIdeas.push(getGameIdeas);
    const randomIdea = Math.floor(Math.random()* randomGameIdeas[0].length)
    console.log(randomGameIdeas[0][randomIdea], "This should be the random idea")
    console.log(randomGameIdeas[0].length, "Length")
    console.log(randomIdea, "Random Index")
    res.status(200).json(randomGameIdeas[0][randomIdea])
  }catch(err){
    console.log(err)
  }
}
)

/* =======================================
||||||||| Save Game ||||||||||||||||||||||
========================================== */

router.post("/saveGame", async (req, res)=>{
  
  const saveGame = new SaveGame({
    gameName: req.body.gameName,
    gameText: req.body.gameText,
    saveUser: req.body.saveUser
  });
  try{
    const addSaveGame = await saveGame.save();
    res.status(201).json(addSaveGame);
  }catch(err){
    console.log(err)
  }

});

/* ========================================
|||||||||| Get user's saved games |||||||||
=========================================== */

router.post("/getSavedGames", async (req, res)=>{
  const userId = req.body.saveUser;
  try{
    const findUserGames = await saveGame.find({ saveUser: userId });
    console.log(findUserGames)
    res.status(200).json(findUserGames);

  }catch(err){
    console.log(err)
  }
});

/* =======================================
|||||||||| Delete Saved Game ||||||||||||| 
==========================================*/

router.post("/deleteSavedGame", async (req, res)=>{
  console.log(req.body)
  const gameIdToDelete = req.body.gameToDelete;
  console.log(gameIdToDelete)
  try{
    const deleteSavedGame = await saveGame.deleteOne({ _id: gameIdToDelete})
    res.status(200).json(deleteSavedGame)
  }catch(err){
    console.log(err)
  }
});

/* =======================================
|||||||||| Update User Info  ||||||||||||| 
==========================================*/

router.patch("/updateUser", getUserById, async (req, res)=>{
  console.log(req.body)
  if(req.body.firstName != null){
    res.user.firstName = req.body.firstName
  }
  if(req.body.lastname != null){
    res.user.lastName = req.body.lastName
  }
  if(req.body.email != null){
    res.user.email = req.body.email
  }

  try{
    const update = await res.user.save();
    console.log("updated")
    res.status(200).send({ firstName: update.firstName, lastName: update.lastName, email: update.email})
  }catch(err){
    console.log(err)
  }
})



module.exports = router;
