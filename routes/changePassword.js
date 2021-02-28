const express = require("express");
const router = express.Router();
const UserContoller = require("../controllers/UserController");

router.post("/", UserContoller.changePassword);

module.exports = router;
