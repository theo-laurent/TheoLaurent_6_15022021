const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const helmet = require("helmet");
const session = require("express-session");

const saucesRoutes = require("./routes/saucesRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

mongoose
  .connect(
    "mongodb+srv://theomaxiboss:POWAsram123456.@cluster1.d7epn.mongodb.net/SoPekocko?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
  )
  .then(function () {
    console.log("Connexion à MongoDB réussie");
  })
  .catch(function () {
    console.log("Connextion à MongoDB échouée");
  });

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-with, Content, Accept, Content-type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(helmet());

app.set("trust proxy", 1);
let datecookie = new Date(Date.now() + 60 * 60 * 1000);
app.use(
  session({
    secret: "cookieSuperS3cr3t",
    name: "sessionId",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true, httpOnly: true, expires: datecookie },
  })
);

app.use(bodyParser.json());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/sauces", saucesRoutes);

app.use("/api/auth", userRoutes);

module.exports = app;
