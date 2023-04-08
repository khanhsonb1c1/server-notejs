const categoryController = require("../../controllers/blog/CategoryController");

const router = require("express").Router();

router.post("/", categoryController.create);

router.get("/", categoryController.fetch);

router.get("/:id", categoryController.detail);

router.put("/:id", categoryController.update);

router.delete("/:id", categoryController.delete);

module.exports = router;