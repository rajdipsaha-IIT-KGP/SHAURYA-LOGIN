const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    ownEmail:{
        type:String,
        required:true,
        unique:true
},
    clgEmail:{
        type:String,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    usesrname:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    clgName:{
        type:String,
        required:true
    }

})

const usermodel = mongoose.model("users",userSchema);
module.exports = {usermodel};