const Sauce = require("../models/Sauce");
const fs = require("fs");

exports.createSauce = function (req, res, next) {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    userLiked: [],
    userDisliked: [],
  });
  sauce
    .save()
    .then(function () {
      res.status(201).json({ message: "Sauce ajoutée !" });
    })
    .catch(function (error) {
      console.log(error);
      res.status(400).json({ error });
    });
};

exports.getAllSauces = function (req, res, next) {
  Sauce.find()
    .then(function (sauces) {
      res.status(200).json(sauces);
    })
    .catch(function (error) {
      res.status(400).json({ error });
    });
};

exports.getOneSauce = function (req, res, next) {
  Sauce.findOne({ _id: req.params.id })
    .then(function (sauce) {
      res.status(200).json(sauce);
    })
    .catch(function (error) {
      res.status(404).json({ error });
    });
};

exports.deleteSauce = function (req, res, next) {
  console.log(1);
  Sauce.findOne({ _id: req.params.id })
    .then(function (sauce) {
      console.log(2);
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, function () {
        console.log(3);
        Sauce.deleteOne({ _id: req.params.id })
          .then(function () {
            console.log(4);
            res.status(200).json({ message: "Sauce supprimée !" });
          })
          .catch(function (error) {
            console.log("error1");
            res.status(404).json({ error });
          });
      });
    })
    .catch(function (error) {
      console.log("error2");
      res.status(500).json({ error });
    });
};

exports.modifySauce = function (req, res, next) {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(function () {
      res.status(200).json({ message: "Sauce modifiée" });
    })
    .catch(function (error) {
      res.status(404).json({ error });
    });
};

exports.likeSauce = function (req, res, next) {
  let like = req.body.like;
  let userId = req.body.userId;
  let sauceId = req.params.id;

  if (like === 1) {
    Sauce.updateOne(
      {
        _id: sauceId,
      },
      {
        $push: {
          userLiked: userId,
        },
        $inc: {
          likes: +1,
        },
      }
    )
      .then(function () {
        res.status(200).json({ message: "J'aime ajouté" });
      })
      .catch(function (error) {
        res.status(400).json({ error });
      });
  } else if (like === -1) {
    Sauce.updateOne(
      {
        _id: sauceId,
      },
      {
        $push: {
          userDisliked: userId,
        },
        $inc: {
          dislikes: +1,
        },
      }
    )
      .then(function () {
        res.status(200).json({ message: "Je n'aime pas ajouté" });
      })
      .catch(function (error) {
        res.status(400).json({ error });
      });
  } else if (like === 0) {
    Sauce.findOne({
      _id: sauceId,
    })
      .then(function (sauce) {
        if (sauce.userLiked.includes(userId)) {
          Sauce.updateOne(
            {
              _id: sauceId,
            },
            {
              $pull: {
                userLiked: userId,
              },
              $inc: {
                likes: -1,
              },
            }
          )
            .then(function () {
              res.status(200).json({ message: "Like retiré !" });
            })
            .catch(function (error) {
              res.status(400).json({ error });
            });
        }
        if (sauce.userDisliked.includes(userId)) {
          Sauce.updateOne(
            {
              _id: sauceId,
            },
            {
              $pull: {
                userDisliked: userId,
              },
              $inc: {
                dislikes: -1,
              },
            }
          )
            .then(function () {
              res.status(200).json({ message: "Dislike retiré !" });
            })
            .catch(function (error) {
              res.status(400).json({ error });
            });
        }
      })
      .catch(function (error) {
        res.status(404).json({ error });
      });
  }
};
