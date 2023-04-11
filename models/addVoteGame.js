const mongoose = require("mongoose");

const addVoteGameSchema = new mongoose.Schema({
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
    yesVote: {
        type: Number,
        required: true
    },
    noVote: {
        type: Number,
        required: true
    },
    voteUsers: {
        type: Array,
        required: true
    }
}, {collection: "voteGames"});

module.exports = mongoose.model("AddVoteGame", addVoteGameSchema)