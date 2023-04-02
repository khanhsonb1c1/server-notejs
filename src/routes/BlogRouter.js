const blogController = require("../controllers/blog/BlogController");

const router = require("express").Router();

router.post("/", blogController.create);

router.get("/", blogController.fetch);

module.exports = router;