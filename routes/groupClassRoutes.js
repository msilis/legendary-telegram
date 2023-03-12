const express = require("express");
const router = express.Router();
const Piece = require("../models/pieces");
const User = require("../models/users");
const { checkUserName } = require("../middleware/middleware");

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
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    country: req.body.country,
    email: req.body.email,
    userName: req.body.userName,
    password: req.body.password,
  });
  
  try {
    await newUser.save();
    res.status(201).send("User created");
  } catch (err) {
    console.log(err);
  }
});

/* =======================================
|||||||||| Login User ||||||||||||||||||||
========================================== */
router.post("/login", async (req, res)=>{
  const usr = req.body.userName;
  const pwd = req.body.password;
  try{
    const loginUser = await User.findOne({userName: usr, password: pwd});
    if(!loginUser){
      res.status(401).send("Username or password incorrect!")
    }else if(loginUser != null){
      res.status(200).send("User sucessfully logged in!")
    }
  }catch(err){
    console.log(err)
  }
})

/* ======================================
||||||| Get technique tags ||||||||||||||
========================================= */

router.get('/tags', async (req, res)=>{
  const getTags = await Piece.find({}, {techniqueTags:1, _id:0});
  res.status(200).json(getTags)
})


/* ======================================
||||||||||| Technique Tag Query |||||||||
========================================= */
router.post("/techniqueSearch", async (req, res)=>{
  const tagToSearch = req.body.tagToSearch;
  console.log(req.body.tagToSearch)
  try{
    const getPieces = await Piece.find({techniqueTags: tagToSearch});
    res.status(200).json(getPieces);
  }catch(err){
    res.status(500).send("There was a server error")
  }
})


module.exports = router;
