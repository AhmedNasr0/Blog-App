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
export const ForUserOrAdmin=(req:RequestCustom,res:Response,next:NextFunction)=>{
    const user= req.user as Iuser
    const equality = (user.id === req.params.id)
    if(equality || user.isAdmin) next()
    else{
        res.json({message:"not allowed only user himself or Admin."})
    }
    
}