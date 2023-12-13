import express from 'express'
import Uploadimage from '../Middlewares/UploadImage'
import {validateID} from '../Middlewares/Validate_Id'
import { PostCount, createPost,getAllPosts,getSinglePost } from '../Controllers/PostControllers';
import { VerifyToken } from '../Middlewares/VerifyToken';
const router=express.Router()
router.route('/Create-Post')
        .post(VerifyToken,Uploadimage.single("image"),createPost)
router.route('/AllPosts').get(getAllPosts);
router.route('/count').get(PostCount)
router.route('/:id').get(validateID,getSinglePost);



export default router;