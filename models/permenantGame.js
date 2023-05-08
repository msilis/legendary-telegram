const mongoose = require("mongoose");

const addPermenantGameSchema = new mongoose.Schema({
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
    },
    username: {
        type: String,
        required: false
    }


}, {collection: "gameIdeas"});

module.exports = mongoose.model("AddPermenantGame", addPermenantGameSchema);