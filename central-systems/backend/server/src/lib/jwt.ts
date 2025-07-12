import jwt from "jsonwebtoken"

//  These types are lifted from the ms library used by the jsonwebtoken under the hood
type Unit =
   | "Years"
   | "Year"
   | "Yrs"
   | "Yr"
   | "Y"
   | "Weeks"
   | "Week"
   | "W"
   | "Days"
   | "Day"
   | "D"
   | "Hours"
   | "Hour"
   | "Hrs"
   | "Hr"
   | "H"
   | "Minutes"
   | "Minute"
   | "Mins"
   | "Min"
   | "M"
   | "Seconds"
   | "Second"
   | "Secs"
   | "Sec"
   | "s"
   | "Milliseconds"
   | "Millisecond"
   | "Msecs"
   | "Msec"
   | "Ms";

type UnitAnyCase = Unit | Uppercase<Unit> | Lowercase<Unit>;


type StringValue =
   | `${number}`
   | `${number}${UnitAnyCase}`
   | `${number} ${UnitAnyCase}`;

const fallBackSecret = "fallback_random_secret_277253*&62-=6^%#@!(##^^$(@)+@)@jdjdhjJJJ"

export function signJWT(payload: object, expiry: StringValue) {
   //    example usage expiry in "1h"
   const secret = process.env.JWT_SIGN_SECRET || fallBackSecret
   if (secret) {
      return jwt.sign(payload, secret, {
         expiresIn: expiry
      })
   } else {
      return jwt.sign(payload, fallBackSecret, {
         expiresIn: expiry
      })
   }
}