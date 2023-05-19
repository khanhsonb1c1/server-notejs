const singerController = require("../../controllers/music/SingerController");
const upload = require("../../middlewares/upload");

const router = require("express").Router();

router.post("/", upload.single("image_url"), singerController.create);

router.get("/", singerController.fetch);

router.get("/top-singers-vn", singerController.get_top_singer_vn);

router.get("/:id", singerController.detail);

router.put("/:id", singerController.update);

// router.delete("/:id", singerController.delete);

module.exports = router;
