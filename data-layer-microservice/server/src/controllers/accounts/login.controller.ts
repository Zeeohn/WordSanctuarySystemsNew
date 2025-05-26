import { Request, Response} from "express"
import { EmailValidatorObj } from "../validators/createIndividualProfileValidator";
import { sendLoginCredentialsToEmailService } from "../../services/mailing/mailer";
import { TokenTypes } from "../../services/mailing/saveTokenService";
import { ZodError } from "zod";
import { mongoDbClient, postgresClient } from "../../db_connections/prismaClients";
import { getLoginCredentailsValidator } from "../validators/accounts/invitationRequestValidator";




export const loginRequestController = async (req:Request, res:Response)=>{
    try{
       const parsedBody = EmailValidatorObj.parse(req.body);
       
       const response = await sendLoginCredentialsToEmailService(parsedBody.email, TokenTypes.LOGIN)


       if(response){
          res.status(200).json({
            success: true,
            message: "Login credentials sent"
          })

          return
       }

       res.status(500).json({
        success: false,
        message: "Oops something went wrong"
       })

       return
    }catch(err){
      console.log(`loginRequestController  encountered an error `, err)

      if(err instanceof ZodError){
         res.status(400).json({
            success: false,
            error: err.errors,
            message: "Bad request"
         })

         return
      }

      res.status(500).json({
        success: false,
        message: "Oops something went wrong"
       })

       return

    }
}


export const getLoginCredentailsController = async (req:Request, res:Response)=>{
   try{
      const parsedBody = getLoginCredentailsValidator.parse(req.body)

      const loginCredentials = await mongoDbClient.authTokens.findFirst({
         where: {
            email: parsedBody.email,
            otp: parsedBody.otp,
         }
      })

      if(loginCredentials){
         // Only try to get profile if login credentials are valid
         try {
            const profile = await postgresClient.profiles.findUnique({
               where: {
                  email: parsedBody.email
               }
            })

            // Return response with profile details if profile exists
            res.status(200).json({
               success: true,
               data: {
                  ...loginCredentials,
                  profile_details: profile || null
               },
            })
         } catch (dbError: any) {
            // Log the error with more details
            console.error('Failed to fetch profile:', {
               error: dbError,
               code: dbError.code,
               meta: dbError.meta
            })

            // If table doesn't exist, return a more specific message
            if (dbError.code === 'P2021') {
               res.status(200).json({
                  success: true,
                  data: {
                     ...loginCredentials,
                     profile_details: null
                  },
                  message: 'Profile service is being set up. Please try again later.'
               })
               return
            }

            // For other database errors
            res.status(200).json({
               success: true,
               data: {
                  ...loginCredentials,
                  profile_details: null
               },
               message: 'Unable to fetch profile details at the moment.'
            })
         }
         return
      }

      res.status(401).json({
         success: false,
         data: null,
      })

      return
   }catch(err){
      console.log(`getLoginCredentailsController  encountered an error `, err)

      if(err instanceof ZodError){
         res.status(400).json({
            success: false,
            error: err.errors,
            message: "Bad request"
         })

         return
      }

      res.status(500).json({
        success: false,
        message: "Oops something went wrong",
        data:null
       })

       return

    }
   }

