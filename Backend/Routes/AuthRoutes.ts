const express=require('express')
import {signup} from '../Controllers/AuthControllers'
const router=express.Router()

/*
    API => /api/v1/Auth/signup
    Method => POST
    return => 1) success => email created successfully
              2) faild => return error (validate / compare password)
*/
router.route('/signup').post(signup)


export default router