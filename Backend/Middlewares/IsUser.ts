
import {Request,Response ,NextFunction } from "express"
import { JwtPayload } from "jsonwebtoken"

interface RequestCustom extends Request{
    user:JwtPayload|string|null|Object
}
interface Iuser{
    isAdmin:boolean,
    id:string,
    iat:number
}
export const IsUser=(req:RequestCustom,res:Response,next:NextFunction)=>{
    const user = req.user as Iuser
    const equality = (user.id === req.params.id)
    if(!equality) return res.json({message:"Only Email Owner Who can Access it"})
    next()
}