const albumController = require("../../controllers/music/AlbumController");
const checkUploadMiddleware = require("../../middlewares/checkUpload");
const upload = require("../../middlewares/upload");

const router = require("express").Router();

router.post("/", checkUploadMiddleware.checkUploadSinger,upload.single("image_url"), albumController.create);

router.get("/", albumController.fetch);

router.get("/:id", albumController.detail);

router.put("/:id", albumController.update);

router.delete("/:id", albumController.delete);

module.exports = router;
