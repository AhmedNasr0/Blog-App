

import {Request,Response,NextFunction} from 'express'
import {  } from 'multer'
const path=require('path')
const multer=require('multer')

// create types for photoStorage
type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string|boolean) => void


const photoStorage=multer.diskStorage(
    {
    destination:"D:\\Mern Projects\\Blog-App\\Backend\\Images"
    ,
    filename:function(req:Request,file:Express.Multer.File,cb:FileNameCallback){
        if(file)
           { 
            cb(null,new Date().toISOString().replace(/:/g,"-")+file.originalname)
           }else 
            cb(null,false)
    }
})

// types for fileFilter
type FileFilterCallback=(error:Error|Object|null,save:boolean)=>void

const filefilter=(req:Request,file:Express.Multer.File,cb:FileFilterCallback)=>{
    if(file.mimetype.startsWith("image")){
        cb(null,true)
    }
    else 
        cb({message:"UnSupported File ,Only image allowed."},false)
}


const photoUpload=multer({
    storage:photoStorage,
    fileFilter:filefilter
})
// const photoUpload=multer({dest:"Images"})
export default photoUpload