const musicController = require("../../controllers/music/MusicController");

const upload = require("../../middlewares/upload");

const router = require("express").Router();

router.post(
  "/",
  upload.fields([
    { name: "image_url", maxCount: 1 },
    { name: "play_url", maxCount: 1 },
  ]),
  musicController.create
);
// router.post("/",upload.single('image_url'), musicController.create);

router.get("/", musicController.fetch);

router.get("/:id", musicController.detail);

router.put("/:id", musicController.update);

// router.post("/update", musicController.updateAll);

router.post("/delete/:id", musicController.delete);

module.exports = router;
