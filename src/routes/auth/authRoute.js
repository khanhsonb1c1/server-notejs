const authController = require("../../controllers/auth/Auth.controller");


const router = require("express").Router();

router.post("/login", authController.login);
router.post("/change-password", authController.changePassword);




module.exports = router;