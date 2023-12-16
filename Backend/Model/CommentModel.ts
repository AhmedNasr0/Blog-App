import mongoose from 'mongoose'
import joi from 'joi'
const CommentSchema=new mongoose.Schema({
    text:{
        type:String,
        require:true,
        minlength:2,
        trim:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true,
    },
    username:{
        type:String,
        require:true,
        minlength:2,
        trim:true
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
        require:true,
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    image:{
        type:Object,
        default:{
            url:"",
            publicId:null
        }
    }


},{timestamps:true})





export const Comment=mongoose.model('Comment',CommentSchema);

//validation for Create new comment
export const CreateCommentValidation=(obj:Object)=>{
    const schema= joi.object({
        text:joi.string().trim().min(2).required(),
        post:joi.string().required(),
    })
    return schema.validate(obj)
}

// validation for Update Comment
export const UpdateCommentValidation=(obj:Object)=>{
    const schema=joi.object({
        text:joi.string().trim().min(2),
    })
    return schema.validate(obj)
}