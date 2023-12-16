import mongoose from 'mongoose';
import joi from 'joi';
const PostSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        minlength:2,
        maxlength:200
    },
    descreption:{
        type:String,
        required:true,
        trim:true,
        minlength:2,
        maxlength:200
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    category:{
        type:String,
        required:true
    },
    image:{
        type:Object,
        default:{
            url:"",
            publicId:null
        }
    },
    Likes:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
        }
        ]   
},{timestamps:true , toJSON:{virtuals:true} , toObject:{virtuals:true}})



// create virtual comment field to retreie with post
PostSchema.virtual('comments',{
    ref:'Comment',
    foreignField:'post',
    localField:'_id'
})


export const Post=mongoose.model("Post",PostSchema);
// Express validation

export const validate_Create_Post=(obj:any)=>{
    const schema=joi.object({
        title:joi.string().trim().required().min(2).max(200),
        descreption:joi.string().trim().required().min(2).max(200),
        category:joi.string().trim().required()
    })
    return schema.validate(obj)
}

export const validate_Update_post=(obj:any)=>{
    const schema=joi.object({
        title:joi.string().trim().min(2).max(200),
        descreption:joi.string().trim().min(2).max(200),
        category:joi.string().trim()
    })
    return schema.validate(obj)
}

module.exports={
    Post,
    validate_Create_Post,
    validate_Update_post
}