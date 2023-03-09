/* ==================================
    Middleware
=====================================*/

//Check if username exists
const User = require("../models/users")

async function checkUserName(req,res,next){
    const usernameToFind = req.body.userName;
    console.log(usernameToFind)
    const locateUsername = await User.findOne({userName: usernameToFind})
    if(locateUsername){
        console.log('user exists')
        res.status(409).send("Username is taken")
    }else{
        console.log('user does not exist')
        next()
    }
}

module.exports = { checkUserName }