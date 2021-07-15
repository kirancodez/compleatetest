const { body, validationResult } = require('express-validator');
const User =  require("../models/user");

exports.selectUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if(err || !user){
            res.status(400).json({
                error: "No user found"
            })
        }
        req.userSelected = user;
        next();
    })
}

exports.selecUser = (req, res ) => {
    User.findById(req.userSelected._id).exec((err, user) => {
        if(err || !user){
            res.status(400).json({
                error: "No user found"
            })
        }
        return res.json(user);
        next();
    })
}

exports.updateUser = (req, res) => {
    const errors  = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            error: errors.array()[0].msg
        })
    }

    User.findByIdAndUpdate(
        {_id: req.userSelected._id},
        {$set: req.body},
        {new: true, useFindAndModify: false},
        (err, user) => {
            if(err){
                return res.status(400).json({
                    error: "Phone number or email allready registered"
                })
            }
            return res.json(user)
        }
    )
}


exports.deleteUser = (req, res) => {
    User.findByIdAndDelete(req.userSelected._id, (err, user) => {
        if(err){
            return res.status(400).json({
                error: "User deletion failed"
            })
        }
        return res.json("User deleted sucessfully")
    })
}

exports.addUser = (req, res) => {
    const user =  new User(req.body);
    user.save((err, user) => {
        if(err){
            return res.status(400).json({
                error: "The user insertion failed"
            })
        }
        return res.json(user)
    })
}

exports.userList = (req, res) => {
    User.find( { isAdmin: { $ne: true }, _id: {$ne: req.profile._id} }, (err, user) => {
        if(err){
            return res.status(400).json({
                err: "No users found"
            })
        }
        return res.json(user)
    } )
}

exports.adminList = (req, res) => {
    User.find( { isAdmin: true , _id: {$ne: req.profile._id} }, (err, user) => {
        if(err){
            return res.status(400).json({
                err: "No users found"
            })
        }
        return res.json(user)
    } )
}

exports.userTotal = (req, res) => {
    User.countDocuments({isAdmin: false}, (err, count) => {
        if(err){
            return res.status(400).json({
                error: "No users"
            })
        }
        return res.json(count)
    })
}


exports.makeAdmin = (req, res) => {
    let update = {
        isAdmin: true,
        assignedPerm: ["view", "user-edit", "user-list", "dashboard"]
    }
    User.findByIdAndUpdate(
        {_id: req.userSelected._id},
        {$set: update},
        {new: true, useFindAndModify: false},
        (err, user) => {
            if(err){
                return res.status(400).json({
                    error: "User updation failed"
                })
            }
            return res.json(user)
        }
    )
}