const express =  require("express");
const router = express.Router();
const { check } = require('express-validator');

const { getUserById } = require("../controllers/user")
const {selectUserById, addUser, updateUser, deleteUser, userList, adminList, makeAdmin, userTotal, selecUser} = require("../controllers/userCountrols");
const {isSignedin, isAuthenticated, isAdmin, alwUserList, alwUserControl, alwDashborad} = require("../controllers/auth");
const user = require("../models/user");

router.param("userId", getUserById );
router.param("selectedId", selectUserById );

router.post("/user/add/:userId", isSignedin, isAuthenticated, alwUserControl, addUser);
router.put("/user/:userId/:selectedId", isSignedin, isAuthenticated, alwUserControl,[
    check("name").isLength({min: 3}).withMessage("name Should be atleast 3 char"),
    check("email").isEmail().withMessage("Please enter a valid email"),
    check("phoneNumber").isLength({min: 10, max:10}).withMessage("Phone Number should be 10 letter long and not exceed").isNumeric().withMessage('should be numeric'),
    check("age").isNumeric().withMessage("Please use numbers for age ").isLength({max:2}).withMessage("cannot proceed a age more than 100")
] ,updateUser);
router.delete("/user/:userId/:selectedId", isSignedin, isAuthenticated, alwUserControl, deleteUser);
router.get("/users/:userId", isSignedin, isAuthenticated, alwUserList, userList);
router.get("/user/count/:userId", isSignedin, isAuthenticated, alwDashborad, userTotal);
router.get("/user/select/:userId/:selectedId", isSignedin, isAuthenticated, selecUser);
router.get("/admin/list/:userId", isSignedin, isAuthenticated, isAdmin, adminList);
router.get("/make/admin/:userId/:selectedId", isSignedin, isAuthenticated, isAdmin, makeAdmin);


module.exports = router;