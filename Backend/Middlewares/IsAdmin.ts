import {Request,Response ,NextFunction } from "express"
import { JwtPayload } from "jsonwebtoken";

export interface RequestCustom extends Request
{
    user: string|null|JwtPayload|Object
}
interface Iuser{
    id:string,
    isAdmin:boolean,
    iat:number
}
export const IsAdmin=(req:RequestCustom,res:Response,next:NextFunction)=>{
    const user= req.user as Iuser
    if(!user.isAdmin) return res.json({message:"Not Allowed ,For Admins Only"})
    next()
}