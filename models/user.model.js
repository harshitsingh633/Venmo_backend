import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    googleId: {
        type : String,
        unique : true,
        sparse : true
    },
    firstName : {
        type : String,
        required : function(){
            return !this.googleId;
        }
    },
    lastName : {
        type : String,
        required : function () {
            return !this.googleId;
        }
    },
    username : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : function(){
            return !this.googleId;
        }
    }
})


export const User = mongoose.model("User" , UserSchema);