import jwt from "jsonwebtoken"


const fallBackSecret = "fallback_random_secret_277253*&62-=6^%#@!(##^^$(@)+@)@jdjdhjJJJ"

export function signJWT (payload:object, expiry:string | number ){
//    example usage expiry in "1h"
   const secret = process.env.JWT_SIGN_SECRET || fallBackSecret
   if(secret){
     return jwt.sign(payload, secret, {
        expiresIn: expiry
     })
   }else{
    return jwt.sign(payload, fallBackSecret, {
        expiresIn: expiry
     })
   }
}