import { Request , Response } from "express"
import {User,validateRegisterUser} from "../Model/UserModel"
import { GenerateToken } from "../utils/GenerateToken"
const bcrypt =require('bcrypt')
export const signup=async(req:Request,res:Response)=>{
    // 1) validate
    const{error}=validateRegisterUser(req.body)
    if(error){
        return res.status(400).json({message:error.details[0].message })
    }
    // 2) check if email exist
    const newUser= await User.findOne({email:req.body.email});
    if(newUser) return res.status(400).json({message:"User Already exist"});

    // 3) compare password
    if(!(req.body.password===req.body.confirmedpassword)) return res.status(400).json({message:"given passwords not the same!"})
    // 4) save in database **But before saving , in mongoose middleware it will hash password and delete comfiremed_password
    const RegisterUser=new User({
        username:req.body.username,
        email:req.body.email,
        password:req.body.password,
        confirmedpassword:req.body.confirmedpassword
    }).save()
    res.json({message:"Email Created Successfully"}).status(200)
}



export const signin =async(req:Request,res:Response)=>{
    // check if email exist 
    const user=await User.findOne({email:req.body.email})
    if(!user) return res.json({message:"Email not Exist"})
    // check pass
    const validLogin=await bcrypt.compare(req.body.password,user.password)
    if(!validLogin) return res.status(400).json({message:"invalid password or email !"})
    // generate token
    const token=GenerateToken({id:user._id , isAdmin:user.isAdmin})
    // send token and details
    res.status(200).json({
        _id:user._id,
        token,
        email:user.email 
        ,username:user.username
    })

}