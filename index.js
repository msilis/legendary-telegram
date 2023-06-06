const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const cron = require("node-cron");
const http = require("http");

mongoose.connect(process.env.DATABASE_URL, { dbName: "SuzukiGroup" });
mongoose.set("strictQuery", true);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database."));

const groupRouter = require("./routes/groupClassRoutes");
app.use(cookieParser());
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://10.128.172.126:5173",
    "http://127.0.0.1:8080",
  ],
  credentials: true,
};
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use("/", groupRouter);
app.use(express.json());

//node-cron to keep server from going to sleep
cron.schedule("/14 * * * *", () => {
  http.get("https://group-class-backend.onrender.com");
});

app.listen(port, () => console.log(`Listening on ${port}`));
