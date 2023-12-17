import mongoose from "mongoose";
import joi from 'joi'

const CategorySchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    title:{
        type:String,
        required:true,
        trim:true
    }
},{timestamps: true})

const Category =mongoose.model("Category",CategorySchema);

const createCategoryValidation=(obj:Object)=>{
    const schema=joi.object({
        title:joi.string().required().trim()
    })
    return schema.validate(obj)
}

export {Category , createCategoryValidation}