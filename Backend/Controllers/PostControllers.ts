import {Request,Response} from 'express'
import { validate_Create_Post } from '../Model/PostModel'
import { cloudinaryUploadImage } from '../utils/cloudinary';
import {Post} from '../Model/PostModel'
import { JwtPayload } from 'jsonwebtoken';
import fs from 'fs'

interface RequestCustom extends Request{
    user:JwtPayload|string|null|Object|any
}

export const createPost=async(req:RequestCustom,res:Response)=>{
    // validate
    const {error} = validate_Create_Post(req.body);
    if(error) res.json({message:error.details[0].message})
    
    if(req.file){
        const result:any = await cloudinaryUploadImage(req.file.path)
        const post=await new Post({
            title:req.body.title,
            descreption:req.body.descreption,
            category:req.body.category,
            user:req.user.id,
            image:{
                url:result.secure_url,
                publicId:result.public_id
            }
        }).save();
    }
    else{
        const post=await new Post({
            title:req.body.title,
            descreption:req.body.descreption,
            category:req.body.category,
            user:req.user.id,
            image:{
                url:"",
                publicId:null
            }
        }).save();
    }
    res.status(200).json({message:"Post Created Successfully"})
    if(req.file)
        fs.unlinkSync(req.file.path)
}