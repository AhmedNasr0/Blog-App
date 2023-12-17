import {Request,Response} from 'express'
import { validate_Create_Post, validate_Update_post } from '../Model/PostModel'
import { cloudinaryRemoveImage, cloudinaryUploadImage } from '../utils/cloudinary';
import {Post} from '../Model/PostModel'
import {Comment} from '../Model/CommentModel'
import { JwtPayload } from 'jsonwebtoken';
import fs from 'fs'

interface RequestCustom extends Request{
    user:JwtPayload|string|null|Object|any
}

export const createPost=async(req:Request,res:Response)=>{
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
    API => /api/v1/Post/allposts
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

/*
    API => /api/v1/Post/:id
    Method => GET
    return => 1) success => spicefic post
              2) faild => return error 
*/
export const getSinglePost=async (req:Request,res:Response)=>{

    const post=await Post.findById(req.params.id).populate('user',['-password']).populate('comments')
    if(!post) res.json({message:"post not found"})
    res.json({
        Post: post,
    })
}

/*
    API => /api/v1/Post/count
    Method => GET
    return => 1) success => number of posts
              2) faild => return error 
*/
export const PostCount=async (req:Request,res:Response)=>{

    const NumberOfPosts=await Post.find().countDocuments()
    res.json({
        NumberOfPosts: NumberOfPosts,
    })
}

/*
    API => /api/v1/Post/:id
    Method => DELETE
    return => 1) success => message:post deleted successfully
              2) faild => return error 
*/
export const DeletePost=async (req:Request,res:Response)=>{
    const post:any= await Post.findById(req.params.id).populate('user')
    if(!post) return res.json({message:"Post Not Found"})
    const userId=post.user._id
    //check if exist user is himself or if the exist is admin
    if(userId!=req.user?.id || req.user?.isAdmin){
        return res.json({message:"Only Admin or User himself can delete this Post"})
    }
    if(post.image.publicId != null){
        // remove from cloudinary
        await cloudinaryRemoveImage(post.image.publicId)
    }
    const comments=await Comment.deleteMany({post:req.params.id})
    await Post.findByIdAndDelete(req.params.id)
    res.status(200).json({message:"Post Deleted Successfully"})
}
/*
    API => /api/v1/Post/:id
    Method => PUT
    return => 1) success => message:post Updates successfully
              2) faild => return error 
*/
export async function updatePostDetails (req:Request,res:Response){
    //validation
    const {error} = validate_Update_post(req.body)    
    if(error) return res.json({message:error.details[0].message})

    const post:any= await Post.findById(req.params.id).populate('user')
    if(!post) return res.json({message:"Post Not Found"})
    const userId=post.user._id
    //check if exist user is himself 
    if(userId!=req.user?.id){
        return res.json({message:"Only  User himself can Update this Post"})
    }
    // update
    const updatedpost=await Post.findByIdAndUpdate({_id:req.params.id},{
        $set:{
            title:req.body.title,
            descreption:req.body.descreption,
            category:req.body.category
        }
    },{new:true})
    res.status(200).json({
        message:"Post Updated Successfully"
        ,post:updatedpost
})
}

/*
    API => /api/v1/Post/update-image/:id
    Method => PUT
    return => 1) success => message:image Updates successfully
              2) faild => return error 
*/
export async function updatePostImage (req:Request,res:Response){
    //validation
    if(!req.file) return res.json({message:"image not provided"})

    const post:any= await Post.findById(req.params.id).populate('user')
    if(!post) return res.json({message:"Post Not Found"})
    const userId=post.user._id
    //check if exist user is himself 
    if(userId!=req.user?.id){
        return res.json({message:"Only  User himself can Update this Post"})
    }
    // update   
    // 1) remove image from cloudinary 
    await cloudinaryRemoveImage(post.image.publicId)
    // 2) upload new image in images
    const image=req.file.path
    // uploud to cloudinary
    const uploadedImage:any=await cloudinaryUploadImage(image)
    
    // update image in db
    await Post.findByIdAndUpdate({_id:req.params.id},{
        $set:{
            image:{
                url:uploadedImage.secure_url,
                publicId:uploadedImage.public_id
            }
        }
    },{new:true})

    res.status(200).json({
        message:"Image Updated Successfully"
    })
    // remove image from server
    fs.unlinkSync(req.file.path) 
}

/*
    API => /api/v1/Post/Like/:id
    Method => PUT
    return => 1) success => message:likeed
              2) faild => return error 
*/
export async function LikePost (req:Request,res:Response){
    let post:any= await Post.findById(req.params.id).populate('user')
    if(!post) return res.json({message:"Post Not Found"})
    const userId=post.user._id
    
    const isPostLiked= await post.Likes.find( (userr:string) => userr.toString() === req.user.id)
    
    if(isPostLiked){
        post=await Post.findByIdAndUpdate({_id:req.params.id},{
            $pull:{
                Likes:req.user.id
            }
        })
    }
    else{
        post=await Post.findByIdAndUpdate({_id:req.params.id},{
            $push:{
                Likes:req.user.id
            }
        })
    }
    res.status(200).json({
        message:"Post Liked"
    })
}