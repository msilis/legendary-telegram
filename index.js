const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DATABASE_URL, {dbName: "SuzukiGroup"});
mongoose.set('strictQuery', true);
const db = mongoose.connection;
db.on('error', (error)=>console.error(error));
db.once('open', ()=>console.log("Connected to database."));

const groupRouter = require('./routes/groupClassRoutes');

app.use(bodyParser.json());
app.use("/", groupRouter);
app.use(express.json());


app.listen(port, ()=> console.log(`Listening on ${port}`));