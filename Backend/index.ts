const express=require('express')
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import AuthRoutes from './Routes/AuthRoutes'
import UserRoutes from './Routes/UserRoutes';
import PostRoutes from './Routes/PostRoutes';
import CategoryRoutes from './Routes/CategoryRoutes';
import bodyParser from 'body-parser';
import CommentRoutes from './Routes/CommentRoutes';
import { errorHandler } from './utils/errorHandler';
const app=express();
dotenv.config()



mongoose.connect(`${process.env.DATABASE}`).then(()=>{
    console.log('Database Connected Successfully.')
})
app.use(express.json())
app.use(bodyParser.urlencoded({
    extended: true
  }));

app.use('/api/v1/Auth',AuthRoutes)
app.use('/api/v1/User',UserRoutes)
app.use('/api/v1/Post',PostRoutes)
app.use('/api/v1/Comment',CommentRoutes)
app.use('/api/v1/Category',CategoryRoutes)

app.use(errorHandler)
app.listen(process.env.PORT,()=>{
    console.log(`Server running on Port :${process.env.PORT}`)
})