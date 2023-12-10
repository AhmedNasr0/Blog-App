import { GetAllUsers, GetCountOfAllUsers, GetSpecificUser } from "../Controllers/UserControllers";

const express=require('express')
const router=express.Router();

router.route('/allusers').get(GetAllUsers)
router.route('/user/:id').get(GetSpecificUser)
router.route('/CountUsers').get(GetCountOfAllUsers)
export default router