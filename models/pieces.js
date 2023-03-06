const mongoose = require("mongoose");

const piecesSchema = new mongoose.Schema({
    book: {
        type: Number,
        require: true
    },
    pieceName: {
        type: String,
        require: true
    },
    techniqueTags: {
        type: Array,
        require: true
    }
}, {collection: "pieces"});

module.exports = mongoose.model('Piece', piecesSchema);