const singerController = require("../../controllers/music/SingerController");

const router = require("express").Router();

router.post("/", singerController.create);

router.get("/", singerController.fetch);

router.get("/:id", singerController.detail);

module.exports = router;