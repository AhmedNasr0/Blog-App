import {Request,Response ,NextFunction } from "express"
import mongoose from "mongoose"

export const validateID=(req:Request,res:Response,next:NextFunction)=>{
    if(!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.json({message:"invalid ID"})
    next()
}