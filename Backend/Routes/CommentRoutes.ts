import express from 'express'
import { getAllComments,getAllRelatedComments,CreateComment, DeleteComment, UpdateCommentPhoto, UpdateCommentText, CommentLike, } from '../Controllers/CommentControllers'
import {VerifyToken} from '../Middlewares/VerifyToken'
import {validateID} from'../Middlewares/Validate_Id'
import photoUpload from '../Middlewares/UploadImage'
const router=express.Router()

router.route('/').get(getAllComments).post(VerifyToken,photoUpload.single('image'),CreateComment)
router.route('/:id')
        .get(getAllRelatedComments).delete(validateID,VerifyToken,DeleteComment)
        .put(validateID,VerifyToken,UpdateCommentText)
router.route('/photo/:id').put(validateID,VerifyToken,photoUpload.single('image'),UpdateCommentPhoto)
router.route('/like/:id').put(validateID,VerifyToken,CommentLike)


export default router