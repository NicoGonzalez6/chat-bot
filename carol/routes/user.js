const Router = require("express");
const router = Router();
const { getAllUsers } = require("../controller/user.controller");

router.get("/", getAllUsers);

module.exports = router;
