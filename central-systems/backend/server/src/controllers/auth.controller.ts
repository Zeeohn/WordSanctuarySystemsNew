import { Request, Response } from "express";
import {
  getInvitationDetailsValidator,
  InvitationRequestValidator,
  LoginRequestValidator,
  VerifyLoginRequestValidator,
} from "../validators/InvitationRequestValidator";
import {
  get_Data_Layer_Base_Api_Endpoint,
  get_Data_Layer_POSTGRESS_Api_Endpoint,
  get_NODE_ENV,
  get_root_user_email,
} from "../helpers/getDataLayerAPI_endpoint";
import { ZodError } from "zod";
import { TokenTypes } from "../types";
import { signJWT } from "../lib/jwt";

export const submitAccessRequestController = async (
  req: Request,
  res: Response
) => {
  try {
  } catch (err) {}
};

export const logoutControlller = async (req: Request, res: Response) => {
  try {
    // Step 1: Clear the JWT cookie
    res.clearCookie("auth_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // Respond with success message
    res.status(200).json({
      success: true,
      message: "Successfully logged out",
    });
  } catch (err) {
    console.log(` logoutControlller encountered an err`, err);

    res.status(500).json({
      success: false,
      message:
        "An error occured while logging you out. Please try again later.",
    });

    return;
  }
};
export const requestLoginCredentailsController = async (
  req: Request,
  res: Response
) => {
  try {
    const parsedBody = LoginRequestValidator.parse(req.body);

    const data_Layer_Base_Api_Endpoint = get_Data_Layer_Base_Api_Endpoint();

    const data_Layer_Postgres_Api_Endpoint =
      get_Data_Layer_POSTGRESS_Api_Endpoint();

    const root_user_email = get_root_user_email();

    console.log(
      "endpoint ",
      data_Layer_Base_Api_Endpoint,
      data_Layer_Postgres_Api_Endpoint
    );

    if (root_user_email !== parsedBody.email) {
      //    check if the email is registered in the system
      const profile = await fetch(
        `${data_Layer_Postgres_Api_Endpoint}/profiles/individuals/getbyemail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: parsedBody.email,
          }),
        }
      );

      if (!profile) {
        res.status(401).json({
          success: false,
          message: "No profile associated with this email",
        });

        return;
      }
    }

    const loginRequestRes = await fetch(
      `${data_Layer_Base_Api_Endpoint}/accounts/auth/request/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: parsedBody.email,
        }),
      }
    );

    const response = await loginRequestRes.json();

    if (response?.success) {
      res.status(201).json({
        success: true,
        message: "Login credentials sent to user email",
      });

      return;
    }

    res.status(401).json({
      success: false,
      message: response?.message
        ? response.message
        : "Could not send login credentials. Please try again later.",
    });
  } catch (err) {
    console.log(`requestLoginCredentailsController encountered an err`, err);

    if (err instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: "Bad request",
        error: err.errors,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message:
        "Internal Server error.requestLoginCredentailsController encountered an error. Please try again later.",
    });

    return;
  }
};

export const verifyLoginRequestController = async (
  req: Request,
  res: Response
) => {
  try {
    const parsedBody = VerifyLoginRequestValidator.parse(req.body);

    const data_Layer_Base_Api_Endpoint = get_Data_Layer_Base_Api_Endpoint();

    const node_env = get_NODE_ENV();

    const root_user_email = get_root_user_email();

    console.log("verifying login credentials");

    const getVerificationDetailsFromDb = await fetch(
      `${data_Layer_Base_Api_Endpoint}/accounts/auth/request/login/getCredentials`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: parsedBody.email,
          otp: parsedBody.otp,
        }),
      }
    );

    const response = await getVerificationDetailsFromDb.json();

    console.log("login verification details ", response);

    if (getVerificationDetailsFromDb.ok) {
      //  if the token has not expired and it of type "LOGIN"
      if (
        Date.now() <= response?.data.expiration &&
        response?.data.token_type === TokenTypes.LOGIN
      ) {
        //  get the login token
        if (parsedBody.email === root_user_email) {
          const token = signJWT(
            {
              profileId: "root_user_super_admin",
              email: parsedBody.email,
            },
            "1h"
          );

          // Set login token in HTTP-only cookie
          res.cookie("auth_token", token, {
            httpOnly: true,
            secure: node_env === "production", // Use secure cookies in production
            maxAge: 1000 * 60 * 60, // Token expiration (1 hour)
            sameSite: "lax",
          });

          // send the response
          res.status(200).json({
            verified: true,
            message: "user verified",
            is_token_expired: false,
            profile: {
              name: "super admin",
              surname: "root user",
              profile_id: "root_user_super_admin",
              email: parsedBody.email,
              giving_number: "000",
              lifeclass_topic: 1,
              mentor_profile_id: "",
              installation_id: "",
              signature: "",
              passport: "",
              birthday: "",
              departments: [],
              phone_contact: "",
              lifeclass_teacher_profile_id: "",
              leadership_level: "MEMBER",
            },
          });

          return;
        }

        //  this will run regardless
        const token = signJWT(
          {
            profileId: response.data?.profile_details?.profile_id,
            email: parsedBody.email,
          },
          "1h"
        );

        // Set login token in HTTP-only cookie
        res.cookie("auth_token", token, {
          httpOnly: true,
          secure: node_env === "production", // Use secure cookies in production
          maxAge: 1000 * 60 * 60, // Token expiration (1 hour)
          sameSite: "lax",
        });

        // set the response
        res.status(200).json({
          verified: true,
          message: "user verified",
          is_token_expired: false,
          profile: response.data?.profile_details,
        });

        return;
      } else {
        res.status(401).json({
          verified: false,
          message: "Could not verify user",
          is_token_expired: true,
        });
      }

      return;
    }

    res.status(401).json({
      verified: false,
      message: "Could not verify user",
      is_token_expired: false,
    });

    return;
  } catch (err) {
    console.log(`verifyLoginRequestController encountered an err `, err);

    if (err instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: "Bad request",
        error: err.errors,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal Server error. Please try again later.",
    });

    return;
  }
};

export const invitationRequestController = async (
  req: Request,
  res: Response
) => {
  try {
    const parsedBody = InvitationRequestValidator.parse(req.body);

    const data_Layer_Base_Api_Endpoint = get_Data_Layer_Base_Api_Endpoint();

    console.log("endpoint ", data_Layer_Base_Api_Endpoint);

    const invitationRequestRes = await fetch(
      `${data_Layer_Base_Api_Endpoint}/accounts/invites/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: parsedBody.email,
          description: parsedBody.description,
        }),
      }
    );

    if (invitationRequestRes.ok) {
      res.status(201).json({
        success: true,
        message: "Invitation sent to user email",
      });

      return;
    }

    res.status(500).json({
      success: false,
      message: "Could not send invitation. Please try again later.",
    });
  } catch (err) {
    console.log(`invitationRequestController encountered an err`, err);

    if (err instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: "Bad request",
        error: err.errors,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal Server error. Please try again later.",
    });

    return;
  }
};

export const verifyInvitationRequestController = async (
  req: Request,
  res: Response
) => {
  try {
    const parsedBody = getInvitationDetailsValidator.parse(req.body);

    const data_Layer_Base_Api_Endpoint = get_Data_Layer_Base_Api_Endpoint();

    const getVerificationDetailsFromDb = await fetch(
      `${data_Layer_Base_Api_Endpoint}/accounts/invites/getInvite`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_of_invited: parsedBody.email_of_invited,
          token: parsedBody.token,
          otp: parsedBody.otp,
        }),
      }
    );
    const response = await getVerificationDetailsFromDb.json();

    if (getVerificationDetailsFromDb.ok) {
      console.log(
        Date.now() <= response?.data.expiration,
        response?.data.token_type === TokenTypes.INVITATION
      );
      if (
        Date.now() <= response?.data.expiration &&
        response?.data.token_type === TokenTypes.INVITATION
      ) {
        res.status(200).json({
          verified: true,
          message: "user verified",
          is_token_expired: false,
        });

        return;
      } else {
        res.status(401).json({
          verified: false,
          message: "Could not verify user",
          is_token_expired: true,
        });
      }

      return;
    }

    res.status(401).json({
      verified: false,
      message: "Could not verify user",
      is_token_expired: false,
    });

    return;
  } catch (err) {
    console.log(`verifyInvitationRequestController encountered an err `, err);

    if (err instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: "Bad request",
        error: err.errors,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal Server error. Please try again later.",
    });

    return;
  }
};

export const requestLoginOtpController = async (
  req: Request,
  res: Response
) => {
  try {
    // Only validate email, not existence
    const { email } = LoginRequestValidator.parse(req.body);
    const data_Layer_Base_Api_Endpoint = get_Data_Layer_Base_Api_Endpoint();

    // Call data layer to send login OTP/email
    const loginRequestRes = await fetch(
      `${data_Layer_Base_Api_Endpoint}/accounts/auth/request/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    const response = await loginRequestRes.json();

    if (response?.success) {
      res.status(201).json({
        success: true,
        message: `OTP sent to ${email}, check your inbox or spam folder`,
      });
      return;
    }

    res.status(401).json({
      success: false,
      message: response?.message
        ? response.message
        : "Could not send OTP. Please try again later.",
    });
  } catch (err) {
    console.log(`requestLoginOtpController encountered an err`, err);
    if (err instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: "Bad request",
        error: err.errors,
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: "Internal Server error. Please try again later.",
    });
    return;
  }
};

export const verifyLoginOtpController = async (req: Request, res: Response) => {
  try {
    const parsedBody = VerifyLoginRequestValidator.parse(req.body);
    const data_Layer_Base_Api_Endpoint = get_Data_Layer_Base_Api_Endpoint();
    const data_Layer_Postgres_Api_Endpoint =
      get_Data_Layer_POSTGRESS_Api_Endpoint();
    const node_env = get_NODE_ENV();

    // Step 1: Verify OTP with data layer
    const getVerificationDetailsFromDb = await fetch(
      `${data_Layer_Base_Api_Endpoint}/accounts/auth/request/login/getCredentials`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: parsedBody.email,
          otp: parsedBody.otp,
        }),
      }
    );
    const response = await getVerificationDetailsFromDb.json();

    if (
      getVerificationDetailsFromDb.ok &&
      Date.now() <= response?.data.expiration &&
      response?.data.token_type === TokenTypes.LOGIN
    ) {
      // Check if user profile exists
      const profileRes = await fetch(
        `${data_Layer_Postgres_Api_Endpoint}/profiles/individuals/getbyemail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: parsedBody.email }),
        }
      );
      let profileData;
      if (profileRes.ok) {
        profileData = await profileRes.json();
      }

      console.log("Profile data: ", profileData);
      if (profileData && profileData.profile) {
        // Profile exists, registration complete
        res.status(200).json({
          verified: true,
          registration_complete: true,
          profile: profileData.profile,
        });
        return;
      } else {
        // Profile does not exist, registration not complete, use token to identify and redirect users to complete their profile
        // make an API call to create a registration expiry link

        const expiryRes = await fetch(
          `${data_Layer_Base_Api_Endpoint}/accounts/expiry/create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: parsedBody.email }),
          }
        );

        if (!expiryRes.ok) {
          res.status(500).json({
            success: false,
            message: "Could not create registration link, try again later",
          });
          return;
        }

        const expiry = await expiryRes.json();

        if (expiry?.data) {
          res.status(200).json({
            success: true,
            registration_complete: false,
            token: expiry.data,
            message: "Registration link created",
          });
        }
        return;
      }
    } else if (getVerificationDetailsFromDb.ok) {
      res.status(401).json({
        verified: false,
        message: "Could not verify user, request for OTP and try again!",
        is_token_expired: true,
      });
      return;
    }
    res.status(401).json({
      verified: false,
      message: "Could not verify user",
      is_token_expired: false,
    });
    return;
  } catch (err) {
    console.log(`verifyLoginOtpController encountered an err `, err);
    if (err instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: "Bad request",
        error: err.errors,
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: "Internal Server error. Please try again later.",
    });
    return;
  }
};
