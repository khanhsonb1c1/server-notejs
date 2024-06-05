const favoriteController = require("../../controllers/favorite/Favorite.controller");


const router = require("express").Router();

router.post("/", favoriteController.add);




module.exports = router;