const mongoose = require("mongoose");

const saveGameSchema = new mongoose.Schema({
    gameName: {
        type: String,
        require: true
    },
    gameText: {
        type: String,
        require: true
    },
    saveUser: {
        type: String,
        require: true
    }
}, {collection: "savedGames"});

module.exports = mongoose.model("SaveGame", saveGameSchema);