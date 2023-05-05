const albumController = require("../../controllers/music/AlbumController");
const checkUploadMiddleware = require("../../middlewares/checkUpload");
const upload = require("../../middlewares/upload");

const router = require("express").Router();

router.post("/create", upload.single("image_url"), albumController.create);

router.post("/", albumController.fetch);

router.get("/:id", albumController.detail);

router.put("/:id", albumController.update);

router.delete("/:id", albumController.delete);

router.post("/get-top-albums", albumController.get_album_top);

module.exports = router;
