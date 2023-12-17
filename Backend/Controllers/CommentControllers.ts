import { Request,Response } from "express"
import { CreateCommentValidation, UpdateCommentValidation } from "../Model/CommentModel";
import { cloudinaryRemoveImage, cloudinaryUploadImage } from "../utils/cloudinary";
const fs = require('fs')
import {Comment} from '../Model/CommentModel'
import { User } from "../Model/UserModel";
import { Cursor } from "mongoose";


export const getAllComments=async(req:Request,res:Response)=>{
    const comments=await Comment.find().populate('user')
    res.status(200).json(comments)
}
/*
    API => /api/v1/Comment/:id
    Method => GET
    return => 1) success => Return All Comments In post
              2) faild => return error 
*/
export const getAllRelatedComments=async(req:Request,res:Response)=>{
    const comments=await Comment.find({post:req.params.id}).populate("user",["-password"])
    res.status(200).json(comments)
}
/*
    API => /api/v1/Comment/
    Method => POST
    return => 1) success => Create new Comment
              2) faild => return error 
*/
export const CreateComment=async(req:Request,res:Response)=>{
    const {error} =CreateCommentValidation(req.body);
    if(error) return res.json({message:error.details[0].message})
    let comment:any={};
    const user=await User.findById(req.user.id)
    if(req.file){
        const result:any = await cloudinaryUploadImage(req.file.path)
        comment= new Comment({
            username:user?.username,
            post:req.body.post,
            text:req.body.text,
            user:req.user.id,
            image:{
                url:result.secure_url,
                publicId:result.public_id
            }
        }).save()
    }
    else{
    comment= new Comment({
            username:user?.username,
            post:req.body.post,
            text:req.body.text,
            user:req.user.id
        }).save()
    }
        res.status(201).json({message:"Comment Created successfully",comment:comment})
        if(req.file){
            fs.unlinkSync(req.file.path)}
}
/*
    API => /api/v1/Comment/:id
    Method => Put
    return => 1) success => Update Comment
              2) faild => return error 
*/
export const UpdateCommentText=async(req:Request,res:Response)=>{
    //validate
    const {error} = UpdateCommentValidation(req.body)
    if(error)  res.json({message:error.details[0].message})

    const comment:any=await Comment.findById(req.params.id)
    if(!comment){
         res.json({message:"Comment Not Found"})
    }
    // check if user himself
    if(req.user.id !== comment.user._id.toString()){
        res.json({message:"Only Allow Form user Himself"})
   }
    // check if this update to update image with or without text
    
    const updatedcomment=await Comment.findOneAndUpdate({_id:req.params.id},{
            $set:{
                text:req.body.text,
            }
        })
    res.status(200).json({message:"comment Updated Successfully"})
}

export const UpdateCommentPhoto=async(req:Request,res:Response)=>{
    const comment:any=await Comment.findById(req.params.id).populate("user")
    if(!comment) res.json({message:"Comment Not Found"})

    // check user exist
    if(req.user.id !== comment.user._id.toString()) res.json({message:"Allow only for user himself"})

    if(req.file){
        if(comment.image.publicId!=null)
            await cloudinaryRemoveImage(comment.image.publicId)

        const result:any =await cloudinaryUploadImage(req.file.path)
        const updatedcomment=await Comment.findOneAndUpdate({_id:req.params.id},{
            $set:{
                text:req.body.text,
                image:{
                    url:result.secure_url,
                    publicId:result.public_id
                }
            }
        })
    //    //delete from server
       fs.unlinkSync(req.file.path) 
    }
    res.json({message:"Comment photo updated"})
}

/*
    API => /api/v1/Comment/:id
    Method => DELETE
    return => 1) success => delete comment
              2) faild => return error 
*/
export const DeleteComment=async(req:Request,res:Response)=>{
    const comment=await Comment.findById(req.params.id)
    if(!comment) return res.json({message:"Comment Not Found"})
    if(comment.image.publicId!=null){
        await cloudinaryRemoveImage(comment.image.publicId)
    }
    await Comment.findByIdAndDelete(req.params.id)
    res.status(200).json({message:"Comment Deleted Successfully"})
}

// id => id of comment 
export const CommentLike=async(req:Request,res:Response)=>{
    let comment:any=await Comment.findById(req.params.id).populate('user')
    if(!comment)
        return res.json({message:"Post Not Found"})
    
    const iscommentLiked= await comment.likes.find( (userr:any) => userr.toString() === req.user.id)
    console.log(comment)
    if(iscommentLiked){
        comment=await Comment.findByIdAndUpdate({_id:req.params.id},{
            $pull:{
                likes:req.user.id
            }
        })
    }
    else{
        comment=await Comment.findByIdAndUpdate({_id:req.params.id},{
            $push:{
                likes:req.user.id
            }
        })
    }
    res.status(200).json({
        message:"Comment Liked"
    })

}