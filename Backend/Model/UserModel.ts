
import mongoose, { Schema, model,Document } from "mongoose";
const joi =require('joi')
const bcrypt=require('bcrypt')
export interface IUser extends Document{
    name:string,
    email:string,
    password:string,
    confirmedpassword:undefined,
    image:object,
    bio:string,
    isAccountVerified:boolean,
    isAdmin:boolean
}

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

//validation 
export const validateRegisterUser=(obj:Object)=>{
    const schema=joi.object({
        username:joi.string().trim().min(5).max(100).required(),
        email:joi.string().trim().min(5).max(100).required(),
        password:joi.string().trim().min(8).required(),
        confirmedpassword:joi.string().trim().min(8).required(),
    })
    return schema.validate(obj);
}
// hash password and remove confirmed_password cuz we dont need it anymore
UserSchema.pre<IUser>("save" ,async function(next){
    if(!this.isModified('password')) return next()
    this.password=await bcrypt.hash(this.password,12)
    this.confirmedpassword =undefined
    next()})

export const User=mongoose.model("User",UserSchema);
module.exports = {validateRegisterUser, User};


