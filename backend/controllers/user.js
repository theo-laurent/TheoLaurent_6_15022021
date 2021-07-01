const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

exports.signup = function (req, res, next) {
  bcrypt
    .hash(req.body.password, 10)
    .then(function (hash) {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(function () {
          res.status(201).json({ message: "Utilisateur créé" });
        })
        .catch(function (error) {
          res.status(400).json({ error });
        });
    })
    .catch(function (error) {
      res.status(500).json({ error });
    });
};

exports.login = function (req, res, next) {
  User.findOne({ email: req.body.email })
    .then(function (user) {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé" });
      } else {
        bcrypt.compare(req.body.password, user.password).then(function (valid) {
          if (!valid) {
            return res.status(401).json({ error: "mot de passe incorrect" });
          } else {
            res.status(200).json({
              userId: user._id,
              token: jwt.sign({ userId: user._id }, "TOKEN", {
                expiresIn: "12h",
              }),
            });
          }
        });
      }
    })
    .catch(function (error) {
      res.status(500).json({ error });
    });
};
