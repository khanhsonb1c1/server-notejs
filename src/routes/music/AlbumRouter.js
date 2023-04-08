const albumController = require("../../controllers/music/AlbumController");

const router = require("express").Router();

router.post("/", albumController.create);

router.get("/", albumController.fetch);

router.get("/:id", albumController.detail);

module.exports = router;