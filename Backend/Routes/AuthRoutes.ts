const express=require('express')
import {signin, signup} from '../Controllers/AuthControllers'
const router=express.Router()

/*
    API => /api/v1/Auth/signup
    Method => POST
    return => 1) success => email created successfully
              2) faild => return error (validate / compare password)
*/
router.route('/signup').post(signup)


/*
    API => /api/v1/Auth/signin
    Method => POST
    return => 1) success => user(email,token,username,id)
              2) faild => return error (validate / ...)
*/
router.route('/signin').post(signin)

export default router