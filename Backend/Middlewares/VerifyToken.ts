import { Request,Response,NextFunction } from "express";
import jwt, { JwtPayload} from 'jsonwebtoken'
export interface RequestCustom extends Request
{
    user: string|null|JwtPayload|any
}

export const VerifyToken=async(req:RequestCustom,res:Response,next:NextFunction)=>{
    const token=req.headers.authorization  
    if(!token) return res.json({message:"You are not Logged in , Loggin First.."})
    else{
    const virefied= jwt.decode(token)
    req.user=virefied;
    next();
}
}