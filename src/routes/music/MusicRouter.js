const musicController = require("../../controllers/music/MusicController");

const router = require("express").Router();

router.post("/", musicController.create);

router.get("/", musicController.fetch);

router.get("/:id", musicController.detail);

module.exports = router;