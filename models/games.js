const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
    gameName: {
        type: String,
        require: true
    },
    gameTechnique: {
        type: Array,
        require: true
    },
    gameText: {
        type: String,
        require: true
    },
    gamePieces: {
        type: Array,
        required: false
    },
    gameGoal: {
        type: String,
        required: true
    }

}, {collection: "gameIdeas"});

module.exports = mongoose.model("Game", gameSchema)