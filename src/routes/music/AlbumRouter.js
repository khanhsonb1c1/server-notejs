const albumController = require("../../controllers/music/AlbumController");
const upload = require("../../middlewares/upload");

const router = require("express").Router();

router.post("/", upload.single("image_url"), albumController.create);

router.get("/", albumController.fetch);

router.get("/:id", albumController.detail);

module.exports = router;
