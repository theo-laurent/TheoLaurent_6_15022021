const multer = require("multer");

const MIME_TYPES = {
    "images/jpg": "jpg",
    "images/jpeg": "jpg",
    "images/png" : "png",
};

const storage = multer.diskStorage({
    destination: function(req,file,callback){
        callback(null,"images");
    },
    filename: function(req,file,callback){
        const name = file.originalname.split(" ").join("_");
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + "." + extension);
    },
});

module.exports = multer({storage : storage}).single("image");