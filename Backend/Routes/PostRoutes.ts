import express from 'express'
import Uploadimage from '../Middlewares/UploadImage'
import {validateID} from '../Middlewares/Validate_Id'
import {PostCount,DeletePost, createPost,getAllPosts,getSinglePost, updatePostDetails, updatePostImage, LikePost } from '../Controllers/PostControllers';
import { VerifyToken } from '../Middlewares/VerifyToken';
const router=express.Router()
router.route('/Create-Post')
        .post(VerifyToken,Uploadimage.single("image"),createPost)
router.route('/AllPosts').get(getAllPosts);
router.route('/count').get(PostCount)
router.route('/:id').get(validateID,getSinglePost).delete(VerifyToken,validateID,DeletePost).put(VerifyToken,validateID,updatePostDetails)
router.route('/update-Image/:id').put(VerifyToken,validateID,Uploadimage.single('image'),updatePostImage)
router.route('/like/:id').put(validateID,VerifyToken,LikePost)

export default router;