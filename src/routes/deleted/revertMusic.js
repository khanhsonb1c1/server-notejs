const revertMusicController = require("../../controllers/deleted/RevertMusicController") 

const router = require("express").Router();


router.post("/music/:id", revertMusicController.revert);


module.exports = router;
