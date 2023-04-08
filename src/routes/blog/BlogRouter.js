const blogController = require("../../controllers/blog/BlogController");

const router = require("express").Router();

router.post("/", blogController.create);

router.get("/", blogController.fetch);

router.get("/:id", blogController.detail);

router.put("/:id", blogController.update);

router.delete("/:id", blogController.delete);

module.exports = router;