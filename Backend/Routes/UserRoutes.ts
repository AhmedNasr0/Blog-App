import { GetAllUsers,UpdateUserProfile, GetCountOfAllUsers, GetSpecificUser } from "../Controllers/UserControllers";
import { IsAdmin } from "../Middlewares/IsAdmin";
import { IsUser } from "../Middlewares/IsUser";
import { validateID } from "../Middlewares/Validate_Id";
import { VerifyToken } from "../Middlewares/VerifyToken";

const express=require('express')
const router=express.Router();

router.route('/allusers').get(VerifyToken,IsAdmin,GetAllUsers)
router.route('/profile/:id').get(VerifyToken,validateID,GetSpecificUser).put(VerifyToken,validateID,IsUser,UpdateUserProfile)
router.route('/CountUsers').get(VerifyToken,IsAdmin,GetCountOfAllUsers)
export default router