import express from 'express'
import Uploadimage from '../Middlewares/UploadImage'
import {validateID} from '../Middlewares/Validate_Id'
import { PostCount,DeletePost, createPost,getAllPosts,getSinglePost } from '../Controllers/PostControllers';
import { VerifyToken } from '../Middlewares/VerifyToken';
import { ForUserOrAdmin } from '../Middlewares/ForUserOrAdmin';
const router=express.Router()
router.route('/Create-Post')
        .post(VerifyToken,Uploadimage.single("image"),createPost)
router.route('/AllPosts').get(getAllPosts);
router.route('/count').get(PostCount)
router.route('/:id').get(validateID,getSinglePost).delete(VerifyToken,validateID,DeletePost);



export default router;