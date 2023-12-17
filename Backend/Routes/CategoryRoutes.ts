const express=require('express')
import {CreateCategory,GetCategories,UpdateCategory,DeleteCategory} from '../Controllers/CategoryControllers'
import { IsAdmin } from '../Middlewares/IsAdmin'
import { validateID } from '../Middlewares/Validate_Id'
import { VerifyToken } from '../Middlewares/VerifyToken'
const router=express.Router()

router.route('/').get(GetCategories).post(VerifyToken,IsAdmin,CreateCategory)
router.route('/:id').delete(VerifyToken,validateID,IsAdmin,DeleteCategory).put(VerifyToken,validateID,IsAdmin,UpdateCategory)


export default router;