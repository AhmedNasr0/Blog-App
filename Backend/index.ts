const express=require('express')
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import AuthRoutes from './Routes/AuthRoutes'
const app=express();
dotenv.config()

mongoose.connect(`${process.env.DATABASE}`).then(()=>{
    console.log('Database Connected Successfully.')
})
app.use(express.json())

app.use('/api/v1/Auth',AuthRoutes)

app.listen(process.env.PORT,()=>{
    console.log(`Server running on Port :${process.env.PORT}`)
})