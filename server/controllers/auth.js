const { body, validationResult } = require('express-validator');
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

exports.signUp = (req, res) => {
    const errors  = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            error: errors.array()[0].msg
        })
    }
     const user = new User(req.body)
     user.save((error, user) => {
         if(error){
             return res.status(400).json({
                 err: "User email or phone number allready registered"
             })
         }
         return res.json(user);
     })
}

exports.createUser = (req, res) => {
    console.log(req.body);
    const errors  = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            error: errors.array()[0].msg
        })
    }
    const user = new User(req.body)
     user.save((err, user) => {
         if(err){
             return res.status(400).json({
                 err: "Couldint create an entry"
             })
         }
         return res.json(user);
     })
}

exports.signin = (req, res) => {
    const { email, password } = req.body;
    User.findOne({email}, (err, user) => {
        if(err || !user){
            return res.status(400).json({
                error: "No user Found"
            })
        }
        if(!user.authendicate(password)){
            return res.status(400).json({
                error: "password entered  seems wrong"
            })
        }

        const token = jwt.sign({_id: user._id}, process.env.SECRET)
        res.cookie("token", token, {expire: new Date() + 9999} )
        const {_id, name, email, assignedPerm } = user
        return res.json({token, user:{_id,name, email, assignedPerm}})
    })
}

exports.signout = (req, res) => {
    req.clearCookie("token");
    res.json({
        message: "The user signedout sucessfully"
    })
}

exports.isSignedin = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth",
    algorithms: ['sha1', 'RS256', 'HS256']
})

exports.isAuthenticated = (req, res, next) => {
    let checker =  req.profile && req.auth && req.profile._id == req.auth._id
    if(!checker){
        return res.status(400).json({
            error: "ACCESS DENIED"
        })
    }
    next();
}

exports.alwUserList = (req, res, next) => {
    let { assignedPerm } =  req.profile
    if(!assignedPerm.includes("user-list")){
       return res.status(400).json({
            err: "ACCESS DENIDE"
        })
    }
    next();
}

exports.alwUserControl = (req, res, next) => {
    let { assignedPerm } =  req.profile
    if(!assignedPerm.includes("user-edit")){
       return res.status(400).json({
            err: "ACCESS DENIDE"
        })
    }
    next();
}

exports.alwDashborad = (req, res, next) => {
    let { assignedPerm } =  req.profile
    if(!assignedPerm.includes("dashboard")){
       return res.status(400).json({
            err: "ACCESS DENIDE"
        })
    }
    next();
}

exports.isAdmin = (req, res, next) => {
    let { isAdmin } =  req.profile
    if(isAdmin == false){
       return res.status(400).json({
            err: "ACCESS DENIDE"
        })
    }
    next();
}
