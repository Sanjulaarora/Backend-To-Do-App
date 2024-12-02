const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretKey = process.env.KEY;

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    number: {
        type: String,
        required: true,
        unique: true,
        maxlength: 10
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error ("not valid email address")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    passwordAgain: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [
        {
            token : {
                type: String,
                required: true
            }
        }
    ]
});

//password hashing
usersSchema.pre("save", async function(next){
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
        this.passwordAgain = await bcrypt.hash(this.passwordAgain, 12);
    }
    
    next();

});

//token generate
usersSchema.methods.generateAuthToken = async function() {
    try {
        let token = jwt.sign({_id:this._id}, secretKey, {
            expiresIn:"1d"
        });
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    } catch (error) {
        console.log(error);
    }
};


const Users = new mongoose.model("users", usersSchema);

module.exports = Users;