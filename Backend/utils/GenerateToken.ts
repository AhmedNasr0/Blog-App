const jwt=require('jsonwebtoken')

export const GenerateToken=(payload:object)=>{
    const token =jwt.sign(payload,`${process.env.SECRITKEY}`)
    return token
}