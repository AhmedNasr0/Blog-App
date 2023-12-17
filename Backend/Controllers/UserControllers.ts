import {Request,Response} from 'express'
import {User,validateUpdateUser} from '../Model/UserModel'
import { JwtPayload } from 'jsonwebtoken'
import { cloudinaryRemoveImage, cloudinaryRemoveMultipleImage,cloudinaryUploadImage } from '../utils/cloudinary'
const fs=require('fs')
const bcrypt = require('bcrypt')
import {RequestCustom} from '../utils/CustomRequest'
import { Post } from '../Model/PostModel'
import { Comment } from '../Model/CommentModel'
/*
    API => /api/v1/User/all-users
    Method => GET
    return => 1) success => All Users
              2) faild => return error 
*/
export const GetAllUsers=async (req:Request,res:Response)=>{
    const AllUsers= await User.find().select("-password").populate('posts')
    if(!AllUsers) res.status(400).json({message:"Something went Wrong !"})
    res.status(200).json(AllUsers)
}
/*
    API => /api/v1/User/profile/:id
    Method => GET
    return => 1) success => specific Users
              2) faild => return error 
*/
export const GetSpecificUser=async(req:Request,res:Response)=>{
    const user=await User.findOne({_id:req.params.id}).populate('posts')
    if(!user) res.status(400).json({message:"Something went Wrong !"})
    res.status(200).json(user)
}
/*
    API => /api/v1/User/CountUsers
    Method => GET
    return => 1) success => number of users
              2) faild => return error 
*/
export const GetCountOfAllUsers=async(req:Request,res:Response)=>{
    const NumberOfUsers=await User.countDocuments();
    if(!NumberOfUsers) return res.status(200).json("Number of Users = 0 ")
    res.status(200).json({NumberofUsers :`${NumberOfUsers}`});
}
/*
    API => /api/v1/User/profile/:id
    Method => PUT
    return => 1) success => return updated user
              2) faild => return error 
*/
export const UpdateUserProfile=async (req:Request,res:Response)=>{
    // validate
    const {error} = validateUpdateUser(req.body);
    if(error) return res.json({message:error.details[0].message})
    //hash password
    let hashPass=req.body.password
    if(hashPass)
        hashPass=await bcrypt.hash(req.body.password,12)
    //update user
    const currentuser=await User.findByIdAndUpdate({_id:req.params.id},{
        $set:{
            username:req.body.username,
            password:hashPass,
            bio:req.body.bio
        }
    })
    const updatedUser=await User.findOne({_id:req.params.id})
    // refresh and update token here 

    res.status(200).json({updatedUser})
}

/*
    API => /api/v1/User/profile/Update-photo
    Method => POST
    return => 1) success => Update Photo
              2) faild => return error 
*/
interface Iuser{
    isAdmin:boolean,
    id:string,
    iat:number
}
interface IUser{
    username?: string;
    email?: string;
    password?: string;
    image: Object;
    isAccountVerified?: boolean;
    isAdmin?: boolean;
    confirmedpassword?: string | undefined,
    bio?: string | undefined;
}
export const UpdatePhoto=async(req:RequestCustom,res:Response)=>{
    // validation
    if(!req.file) res.json({message:"File not provided !"})
    // path of inserted image ,=> that in images folder
    const image=req.file.path
    // uploud to cloudinary
    const uploadedImage:any=await cloudinaryUploadImage(image)
    // get user from db
    const currentUser=req.user as Iuser
    const user:IUser|any =await User.findById(currentUser.id)
   //check if user has old image
   if(user.image.publicId!==null){
    await cloudinaryRemoveImage(user.image.publicId)
   }

   user.image.url=uploadedImage.secure_url;
   user.image.publicId=uploadedImage.public_id;
   // update image in db
    const users=await User.findOneAndUpdate({username:user.username},
        {
            image:{
                url:user.image.url,
                publicId:user.image.publicId
            }
        }
    )
   //send response
    res.status(200).json({message:"Photo Updated Successfully"})
    //remove image from server
    fs.unlinkSync(req.file.path) 
}

/*
    API => /api/v1/User/profile/:id
    Method => DELETE
    return => 1) success => delete user
              2) faild => return error 
*/
export const DeleteUser=async(req:Request,res:Response)=>{
    const user=await User.findById(req.params.id)
    if(!user) res.json({message:"user not found"})
    // delete profile img from cloudinary
    await cloudinaryRemoveImage(user?.image.publicId);
    // delete all images belong from posts or comments to user 
        // 1)get all posts
        const posts:any=await Post.find({user:req.params.id})
        // 2) get all public id from each post
        const publicIds=posts?.map((post)=>posts.image.publicId)
        // 3) delete from cloundiary
        if(publicIds?.length<=0){}
        else{
            await cloudinaryRemoveMultipleImage(publicIds)
        }
    // to do delete all posts and comments belong to user
    await Comment.deleteMany({user:req.params.id})
    await Post.deleteMany({user:req.params.id})

    // delete user 
    await User.findOneAndDelete(user?._id) 
    // response
    res.json({message:"Your Account Deleted Successfully"})
    
}
