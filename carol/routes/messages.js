const Router = require("express");
const router = Router();
const { getAllMessages } = require("../controller/messages.controller");

router.get("/", getAllMessages);

module.exports = router;
