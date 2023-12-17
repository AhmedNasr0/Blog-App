import {Request  ,Response} from 'express'
import { Category, createCategoryValidation } from '../Model/categorModel'
import { ok } from 'assert'


export const CreateCategory=async(req:Request,res:Response)=>{
    const {error} = createCategoryValidation(req.body)
    if(error) res.json({message:error.details[0].message})

    const category=await Category.create({
        title:req.body.title,
        user:req.user.id
    })
    res.status(200).json({message:"Category Created Successfully"})
}

export const DeleteCategory=async(req:Request,res:Response)=>{
    const category=await Category.findById(req.params.id)
    if(!category) res.json({message:"ategor not found"})

    await Category.findByIdAndDelete(req.params.id)
    res.json({message:"Category Deleted Successfully"})
}

export const UpdateCategory=async(req:Request,res:Response)=>{
    const category=await Category.findById(req.params.id)
    if(!category) res.json({message:"ategor not found"})

    await Category.findByIdAndUpdate(req.params.id,{
        $set:{
            title:req.body.title
        }
    })
    res.json({message:"Category Updated Successfully"})
}

export const GetCategories=async(req:Request,res:Response)=>{
    const categoris=await Category.find()
    res.json(categoris)

}

