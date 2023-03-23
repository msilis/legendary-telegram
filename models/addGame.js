const mongoose = require("mongoose");

const addGameSchema = new mongoose.Schema({
    gameName: {
        type: String,
        required: true
    },
    gameText: {
        type: String,
        required: true
    },
    gameTechnique: {
        type: Array,
        required: true
    },
    gamePieces: {
        type: Array,
        required: true
    },
    saveUser: {
        type: String,
        required: true
    }
}, {collection: "newGames"});

module.exports = mongoose.model("AddGame", addGameSchema);