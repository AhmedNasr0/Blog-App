import { GetAllUsers,UpdateUserProfile, GetCountOfAllUsers, GetSpecificUser, UpdatePhoto, DeleteUser } from "../Controllers/UserControllers";
import { ForUserOrAdmin } from "../Middlewares/ForUserOrAdmin";
import { IsAdmin } from "../Middlewares/IsAdmin";
import { IsUser } from "../Middlewares/IsUser";
import photoUpload from "../Middlewares/UploadImage";
import { validateID } from "../Middlewares/Validate_Id";
import { VerifyToken } from "../Middlewares/VerifyToken";

const express=require('express')
const router=express.Router();

router.route('/allusers').get(VerifyToken,IsAdmin,GetAllUsers)
router.route('/profile/:id')
        .get(VerifyToken,validateID,GetSpecificUser)
        .put(VerifyToken,validateID,IsUser,UpdateUserProfile)
        .delete(VerifyToken,validateID,ForUserOrAdmin,DeleteUser)
router.route('/profile/update-photo').post(VerifyToken,photoUpload.single("image"),UpdatePhoto)
router.route('/CountUsers').get(VerifyToken,IsAdmin,GetCountOfAllUsers)
export default router