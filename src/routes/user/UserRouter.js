const userController = require("../../controllers/User/UserController");

const router = require("express").Router();

router.post("/", userController.create);

router.get("/", userController.fetch);

router.get("/:id", userController.detail);

router.put("/:id", userController.update);

router.delete("/:id", userController.delete);

module.exports = router;