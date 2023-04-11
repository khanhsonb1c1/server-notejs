const singerController = require("../../controllers/music/SingerController");
const upload = require("../../middlewares/upload");

const router = require("express").Router();

router.post("/", upload.single("image_url"), singerController.create);

router.get("/", singerController.fetch);

router.get("/:id", singerController.detail);

router.put("/:id", singerController.update);

// router.get("/:id", singerController.detail);

module.exports = router;
