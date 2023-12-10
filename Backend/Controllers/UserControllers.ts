import {Request,Response} from 'express'
import {User} from '../Model/UserModel'

/*
    API => /api/v1/User/all-users
    Method => GET
    return => 1) success => All Users
              2) faild => return error 
*/
export const GetAllUsers=async (req:Request,res:Response)=>{
    const AllUsers= await User.find().select("-password")
    if(!AllUsers) res.status(400).json({message:"Something went Wrong !"})
    res.status(200).json(AllUsers)
}
/*
    API => /api/v1/User/user/:id
    Method => GET
    return => 1) success => specific Users
              2) faild => return error 
*/
export const GetSpecificUser=async(req:Request,res:Response)=>{
    const user=await User.findOne({_id:req.params.id})
    if(!user) res.status(400).json({message:"Something went Wrong !"})
    res.status(200).json(user)
}

export const GetCountOfAllUsers=async(req:Request,res:Response)=>{
    const NumberOfUsers=await User.countDocuments();
    if(!NumberOfUsers) return res.status(200).json("Number of Users = 0 ")
    res.status(200).json({NumberofUsers :`${NumberOfUsers}`});
}
