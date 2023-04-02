const musicController = require("../../controllers/music/MusicController");

const router = require("express").Router();

router.post("/", musicController.create);

router.get("/", musicController.fetch);

module.exports = router;