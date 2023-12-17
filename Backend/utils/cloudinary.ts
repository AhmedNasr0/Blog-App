import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: 'dyoojnua8', 
  api_key: '613991481726735',
  api_secret: '8rR1cddqALXGjoZLFhxzGi-CfdY'
});

export const cloudinaryUploadImage=async(fileToUpload:string)=>{
    try{
        const result =await cloudinary.uploader.upload(fileToUpload,
            { resource_type:'auto'})
            return result
    }
    catch(error){
        return error
    }
}

export const cloudinaryRemoveImage=async(fileToUpload:string)=>{
    try{
        const result=await cloudinary.uploader.destroy(fileToUpload)
        return result
    }
    catch(error){
        return error
    }
}

export const cloudinaryRemoveMultipleImage=async(publicIds:string[])=>{
    try{
        const result =await cloudinary.api.delete_resources(publicIds)
        return result
    }
    catch(err){
        return err
    }
}