import { JwtPayload } from "jsonwebtoken"

export interface RequestCustom extends Request{
    user:JwtPayload|string|null|Object,
    file:Express.Multer.File
}
export interface Iuser{
    isAdmin:boolean,
    id:string,
    iat:number
}