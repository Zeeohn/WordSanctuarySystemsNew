import { Request, Response } from "express";

import { get_Data_Layer_POSTGRESS_Api_Endpoint } from "../helpers/getDataLayerAPI_endpoint";
import {
  CreateIndividualProfileSchema,
  EmailValidatorObj,
  GivingNumberValidatorObj,
  UpdateIndividualProfileSchema,
  profileIdValidator,
} from "../validators/createIndividualProfileValidators";
import { ZodError } from "zod";

export const createIndividualProfile = async (req: Request, res: Response) => {
  try {
    const parsedBody = CreateIndividualProfileSchema.parse(req.body);

    const { token, redirect } = req.query;
    console.log("token: ", token);
    console.log("redirect: ", redirect);

    const data_Layer_Base_Api_Endpoint =
      get_Data_Layer_POSTGRESS_Api_Endpoint();

    console.log("endpoint ", data_Layer_Base_Api_Endpoint);

    const createProfileResponse = await fetch(
      `${data_Layer_Base_Api_Endpoint}/profiles/individuals/create${
        token ? `?token=${token}` : ""
      }${redirect ? `&redirect=${redirect}` : ""}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...parsedBody,
        }),
      }
    );

    const responseFromDatalayer = await createProfileResponse.json();

    if (createProfileResponse.ok) {
      res.status(201).json({
        success: true,
        data: responseFromDatalayer,
        message: "Profile created",
      });

      return;
    }

    res.status(500).json({
      success: false,
      message:
        responseFromDatalayer?.message ||
        "Could not send create profile. Please try again later.",
    });
  } catch (err) {
    console.log(`createIndividualprofile controller encountered an err`, err);

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

//Update Individual Profile
export const updateIndividualProfile = async (req: Request, res: Response) => {
  try {
    const parsedBody = UpdateIndividualProfileSchema.parse(req.body);

    const data_Layer_Base_Api_Endpoint =
      get_Data_Layer_POSTGRESS_Api_Endpoint();

    console.log("endpoint ", data_Layer_Base_Api_Endpoint);

    const updateProfileResponse = await fetch(
      `${data_Layer_Base_Api_Endpoint}/profiles/individuals/update`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...parsedBody,
        }),
      }
    );

    if (updateProfileResponse.ok) {
      res.status(201).json({
        success: true,
        message: "Profile updated",
      });

      return;
    }

    res.status(500).json({
      success: false,
      message: "Could not send update profile. Please try again later.",
    });
  } catch (err) {
    console.log(`updateIndividualprofile controller encountered an err`, err);

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

// Get Individual Profile By ID
export const getIndividualProfileById = async (req: Request, res: Response) => {
  try {
    const parsedBody = profileIdValidator.parse(req.body);

    const data_Layer_Base_Api_Endpoint =
      get_Data_Layer_POSTGRESS_Api_Endpoint();

    console.log("endpoint ", data_Layer_Base_Api_Endpoint);

    const getProfileByIdResponse = await fetch(
      `${data_Layer_Base_Api_Endpoint}/profiles/individuals/fetch/:profileId`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...parsedBody,
        }),
      }
    );

    if (getProfileByIdResponse.ok) {
      res.status(201).json({
        success: true,
        message: "Profile retrieved",
      });

      return;
    }

    res.status(500).json({
      success: false,
      message: "Could not send get profile by Id. Please try again later.",
    });
  } catch (err) {
    console.log(`getIndividualprofileById controller encountered an err`, err);

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

// Get Individual Profile By Email
export const getIndividualProfileByEmail = async (
  req: Request,
  res: Response
) => {
  try {
    const parsedBody = EmailValidatorObj.parse(req.body);

    const data_Layer_Base_Api_Endpoint =
      get_Data_Layer_POSTGRESS_Api_Endpoint();

    console.log("endpoint ", data_Layer_Base_Api_Endpoint);

    const getProfileByEmailResponse = await fetch(
      `${data_Layer_Base_Api_Endpoint}/profiles/individuals/getbyemail`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...parsedBody,
        }),
      }
    );

    if (getProfileByEmailResponse.ok) {
      const profileData = await getProfileByEmailResponse.json();
      console.log("Profile Data: ", profileData);

      res.status(201).json({
        success: true,
        message: "Profile retrieved",
        data: profileData,
      });

      return;
    }

    res.status(500).json({
      success: false,
      message: "Could not send get profile by email. Please try again later.",
    });
  } catch (err) {
    console.log(
      `getIndividualprofileByemail controller encountered an err`,
      err
    );

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

// Get Individual Profile By Giving Number
export const getIndividualProfileByGivingNumber = async (
  req: Request,
  res: Response
) => {
  try {
    const parsedBody = GivingNumberValidatorObj.parse(req.body);

    const data_Layer_Base_Api_Endpoint =
      get_Data_Layer_POSTGRESS_Api_Endpoint();

    console.log("endpoint ", data_Layer_Base_Api_Endpoint);

    const getProfileByGivingNumberResponse = await fetch(
      `${data_Layer_Base_Api_Endpoint}/profiles/individuals/getbygivingnumber`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...parsedBody,
        }),
      }
    );

    if (getProfileByGivingNumberResponse.ok) {
      res.status(201).json({
        success: true,
        message: "Profile retrieved",
      });

      return;
    }

    res.status(500).json({
      success: false,
      message: "Could not send get profile by Number. Please try again later.",
    });
  } catch (err) {
    console.log(
      `getIndividualprofileBynumber controller encountered an err`,
      err
    );

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

//Get All Individual Profile
export const getAllIndividualsProfile = async (req: Request, res: Response) => {
  try {
    const data_Layer_Base_Api_Endpoint =
      get_Data_Layer_POSTGRESS_Api_Endpoint();

    console.log("endpoint ", data_Layer_Base_Api_Endpoint);

    const fetchProfileResponse = await fetch(
      `${data_Layer_Base_Api_Endpoint}/profiles/individuals/all`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const response = await fetchProfileResponse.json();

    if (fetchProfileResponse.ok) {
      res.status(201).json({
        success: true,
        data: response,
      });

      return;
    }

    res.status(500).json({
      success: false,
      data: null,
      message:
        "Could not send fetch individuals profiles. Please try again later.",
    });
  } catch (err) {
    console.log(`getAllIndividualsProfile controller encountered an err`, err);

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
        "Internal Server error. Could not fetch individual profiles. Please try again later.",
    });

    return;
  }
};

//Delete Individual Profile
export const deleteIndividualProfile = async (req: Request, res: Response) => {
  try {
    const parsedBody = profileIdValidator.parse(req.body);

    const data_Layer_Base_Api_Endpoint =
      get_Data_Layer_POSTGRESS_Api_Endpoint();

    console.log("endpoint ", data_Layer_Base_Api_Endpoint);

    const deleteProfileResponse = await fetch(
      `${data_Layer_Base_Api_Endpoint}/profiles/individuals/delete`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...parsedBody,
        }),
      }
    );

    if (deleteProfileResponse.ok) {
      res.status(201).json({
        success: true,
        message: "Profile deleted",
      });

      return;
    }

    res.status(500).json({
      success: false,
      message: "Could not send delete profile. Please try again later.",
    });
  } catch (err) {
    console.log(`deleteIndividualprofile controller encountered an err`, err);

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
