const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer");
const sauceController = require("../controllers/sauces");

router.post("/", auth, multer, sauceController.createSauce);
router.get("/", auth, sauceController.getAllSauces);
router.get("/:id", auth, sauceController.getOneSauce);
router.delete("/:id", auth, sauceController.deleteSauce);
router.put("/:id",auth, multer, sauceController.modifySauce);
router.post("/:id/like", auth, sauceController.likeSauce);

module.exports = router;
