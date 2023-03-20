/* ==================================
    Middleware
=====================================*/

//Bring in JWT to use for authentication
const jwt = require("jsonwebtoken");

//Check if username exists ===============================================
const User = require("../models/users");

async function checkUserName(req, res, next) {
  const usernameToFind = req.body.userName;
  console.log(usernameToFind);
  const locateUsername = await User.findOne({ userName: usernameToFind });
  if (locateUsername) {
    console.log("user exists");
    res.status(409).send("Username is taken");
  } else {
    console.log("user does not exist");
    next();
  }
}

//Get user by Id ==========================================================
async function getUserById(req, res, next) {
  let user;
  const userToFind = req.body.userId;

  const locateUser = await User.findOne({ _id: userToFind });
  if (locateUser === null) {
    res.status(404).send("User not found in database");
  }
  //If user is in database, pass on user info
  console.log(locateUser);
  res.user = locateUser;
  next();
}

//JSON web token authentication
function checkToken(req, res, next) {
  let token = req.headers("authorization").split(" ")[1];
  try {
    if (jwt.verify(token, "jwt-secret")) {
      req.userId = req.body.userId;
      next();
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = { checkUserName, getUserById };
