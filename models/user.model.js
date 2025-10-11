import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    firstName : { type : String ,required : true,minLength : 3,maxLength : 50},
    lastName : { type : String, required : true},
    username : { type : String , required : true},
    password : { type : String , required : true},
})


export const User = mongoose.model("User" , UserSchema);