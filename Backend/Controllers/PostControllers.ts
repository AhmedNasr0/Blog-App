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


/*
    API => /api/v1/Posts/allposts
    Method => GET
    return => 1) success => All posts ,Number of all post , number of current page  and number of posts in cureent page
              2) faild => return error 
*/
export const getAllPosts=async (req:Request,res:Response)=>{
    // exclude sorting and pagination params
    const excludeParams=['page','limit','sort']
    const queryObj={...req.query} // copy of query string to work with
    excludeParams.forEach(el=>delete queryObj[el])
    const {page,category,limit,sort} =req.query 
    let defaultSort:any=sort||'-createdAt';
    let Post_Per_Page:any=limit||1
    let posts={}
    if(page){
        posts=await Post.find(queryObj).skip((+page-1)*Post_Per_Page).limit(Post_Per_Page).sort(defaultSort).populate('user',['-password'])
    }
    else{
        posts=await Post.find(queryObj).sort(defaultSort).populate('user',['-password'])
    } 
    const NumberOfAllPosts= await Post.countDocuments()
        const NumberOfPosts=Object.keys(posts).length
    res.json({
        NumberOfAllPosts:NumberOfAllPosts,
        NumberOfPosts:NumberOfPosts,
        Page:page,
        Posts: posts,
    })
}