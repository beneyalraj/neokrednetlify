const express = require("express");
const router = express.Router();

const { login, signUp, profile } = require("../controller/Auth");

router.post("/login", login);
router.post("/signup", signUp);
router.get("/profile/:id", profile);

module.exports = router;
