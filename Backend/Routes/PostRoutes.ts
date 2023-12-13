import express from 'express'
import Uploadimage from '../Middlewares/UploadImage'
import {  createPost,getAllPosts } from '../Controllers/PostControllers';
import { VerifyToken } from '../Middlewares/VerifyToken';
const router=express.Router()
router.route('/Create-Post')
        .post(VerifyToken,Uploadimage.single("image"),createPost)
router.route('/AllPosts').get(getAllPosts)



export default router;