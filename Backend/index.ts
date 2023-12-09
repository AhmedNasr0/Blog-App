const express=require('express')
import dotenv from 'dotenv'
import mongoose from 'mongoose'
const app=express();
dotenv.config()

mongoose.connect(`${process.env.DATABASE}`).then(()=>{
    console.log('Database Connected Successfully.')
})
app.use(express.json())
app.listen(process.env.PORT,()=>{
    console.log(`Server running on Port :${process.env.PORT}`)
})