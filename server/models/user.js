const mongoose =  require("mongoose");
const crypto = require("crypto")
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        maxlength: 32,
        trim: true,
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        require: true,
        unique: true,
        trim: true,
        maxlength: 10
    },
    age: {
        type: Number,
        require: true,
        trim: true,
        maxlength: 10
        
    },
    encry_password: {
        type: String,
        require: true
    },
    salt: String,
    assignedPerm: {
        type: [],
        default: ["view"]
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
    
}); 

userSchema.virtual("password")
.set(
    function(password){
        this._password = password;
        this.salt = uuidv4();
        this.encry_password = this.securePassword(password);
    }
)
.get(function(){
    return this._password
})

userSchema.methods = {
    authendicate: function(planepassword){
        return this.securePassword(planepassword) === this.encry_password
    },

    securePassword: function(planepassword){
        if(!planepassword){
            return "";
        }
        try {
            return crypto.createHmac('sha256', this.salt)
            .update(planepassword)
            .digest('hex');
        } catch (err) {
            return "";
        }
    }
}


module.exports = mongoose.model("User", userSchema);