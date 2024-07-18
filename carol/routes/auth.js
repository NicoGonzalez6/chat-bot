const Router = require("express");
const router = Router();
const { signUp, signIn } = require("../controller/auth.controller");

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);

module.exports = router;
