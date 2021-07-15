const express = require("express");
const router = express.Router();

const { getUserById, getUser } = require("../controllers/user");
const { isSignedin, isAuthenticated, alwUserList } = require("../controllers/auth");

router.param("userId", getUserById);
router.get("/user/:userId", isSignedin, isAuthenticated, alwUserList, getUser, );

module.exports = router;
