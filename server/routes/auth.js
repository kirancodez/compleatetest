const express = require("express");
const router = express.Router();
const { home, signUp, signin, createUser, alwUserControl } = require("../controllers/auth")
const { getUserById } = require("../controllers/user")
const { check } = require('express-validator');

router.param("userId", getUserById);
router.post("/signup", [
    check("name").isLength({min: 3}).withMessage("name Should be atleast 3 char"),
    check("email").isEmail().withMessage("Please enter a valid email"),
    check("password").isLength({min:4}).withMessage("Password must contain atleast 4 charecter"),
    check("phoneNumber").isLength({min: 10, max:10}).withMessage("Phone Number should be 10 letter long and not exceed").isNumeric().withMessage('should be numeric'),
    check("age").isNumeric().withMessage("Please use numbers for age ").isLength({max:2}).withMessage("cannot proceed a age more than 100")
], signUp);
router.post("/createuser/:userId", [
    check("name").isLength({min: 3}).withMessage("name Should be atleast 3 char"),
    check("email").isEmail().withMessage("Please enter a valid email"),
    check("password").isLength({min:4}).withMessage("Password must contain atleast 4 charecter"),
    check("phoneNumber").isLength({min: 10, max:10}).withMessage("Phone Number should be 10 letter long and not exceed").isNumeric().withMessage('should be numeric'),
    check("age").isNumeric().withMessage("Please use numbers for age ").isLength({max:2}).withMessage("cannot proceed a age more than 100")
], alwUserControl, createUser);
router.get("/signin", [
    check("email").isEmail().withMessage("Please enter a valid email"),
], signUp);

router.post("/signin", signin);


module.exports = router;