import { Module } from "module";
import mongoose, { model } from "mongoose";

const UserSchema=new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        trim:true,
        required:true,
        minlength:5,
        maxlength:100,
    },
    email:{
        type:String,
        unique:true,
        trim:true,
        required:true,
        minlength:5,
        maxlength:100,
    },
    password:{
        type:String,
        required:true,
        minlength:8,
    },
    confirmedpassword:{
        type:String,
        required:true,
        minlength:8,
    }
    ,
    image:{
        type:Object,
        default:{
            url:"https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg"
            ,publicId:null
        }
    },
    bio:{
        type:String
    },
    isAccountVerified:{
        type:Boolean,
        default:false
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const User=mongoose.model("User",UserSchema);

export default User;
