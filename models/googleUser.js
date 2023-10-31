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
