const express = require("express");
const router = express.Router();
const Piece = require("../models/pieces");
const User = require("../models/users");


router.get("/", async (req, res) => {
  const allPieces = await Piece.find({});
  console.log(allPieces);

  res.status(201).json(allPieces);
});

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

router.post("/addUser", async (req, res)=>{
    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        country: req.body.country,
        userName: req.body.userName,
        password: req.body.password
    });
    try{
        await newUser.save();
        res.status(201).send("User created")
    }catch (err){
        console.log(err)
    }
});

module.exports = router;
