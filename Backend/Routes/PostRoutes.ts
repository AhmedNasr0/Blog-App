import express from 'express'
import Uploadimage from '../Middlewares/UploadImage'
import {  createPost } from '../Controllers/PostControllers';
import { VerifyToken } from '../Middlewares/VerifyToken';
const router=express.Router()
router.route('/Create-Post')
        .post(VerifyToken,Uploadimage.single("image"),createPost)




export default router;