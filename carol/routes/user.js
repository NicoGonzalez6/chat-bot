const Router = require("express");
const router = Router();
const { register } = require("../controller/user.controller");

router.post("/register", register);

module.exports = router;
