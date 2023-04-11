const tagController = require("../../controllers/music/TagController");

const router = require("express").Router();

router.post("/", tagController.create);

router.get("/", tagController.fetch);

router.get("/:id", tagController.detail);

router.put("/:id", tagController.update);

router.delete("/:id", tagController.delete);

module.exports = router;
