const musicController = require("../controllers/music/MusicController");

const router = require("express").Router();


router.get("/", musicController.searchAll);


module.exports = router;
