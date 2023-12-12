const express=require('express')
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import AuthRoutes from './Routes/AuthRoutes'
import UserRoutes from './Routes/UserRoutes';
import PostRoutes from './Routes/PostRoutes';
const app=express();
dotenv.config()

declare module "express-serve-static-core" {
    interface Request {
        user: any;
    }
 }


mongoose.connect(`${process.env.DATABASE}`).then(()=>{
    console.log('Database Connected Successfully.')
})
app.use(express.json())

app.use('/api/v1/Auth',AuthRoutes)
app.use('/api/v1/User',UserRoutes)
app.use('/api/v1/Post',PostRoutes)
app.listen(process.env.PORT,()=>{
    console.log(`Server running on Port :${process.env.PORT}`)
})