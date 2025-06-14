import { Response, Request } from "express";
import {
  CreateIndividualProfileSchema,
  EmailValidatorObj,
  GivingNumberValidatorObj,
  profileIdValidator,
  UpdateIndividualProfileSchema,
} from "../../validators/createIndividualProfileValidator";
import { ZodError } from "zod";
import { postgresClient } from "../../../db_connections/prismaClients";
import { mongoDbClient } from "../../../db_connections/prismaClients";
import { PrismaClientKnownRequestError } from "../../../../prisma/generated-clients/postgres/runtime/library";
import { saveIndividualProfileByIdService } from "../../../services/individualProfileService";
import jwt from "jsonwebtoken";

interface TokenPayload {
  id: string;
  email: string;
  [key: string]: unknown;
}

/**
 * Controller to create an individual profile, with optional token validation
 */
export const createIndividualProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { token, redirect } = req.query;

  try {
    const parsedBody = CreateIndividualProfileSchema.parse(req.body);

    // Handle token validation if token is provided
    if (token && redirect) {
      const isTokenValid = await validateToken(token as string, res);

      // If token validation failed, the response will be sent and we should exit the flow
      if (!isTokenValid) {
        return;
      }
    }

    // Create profile in database
    const createdProfile = await postgresClient.profiles.create({
      data: {
        ...parsedBody,
        registered_from:
          parsedBody.registered_from || token
            ? "Central Training"
            : "default_source",
      },
    });

    if (!createdProfile) {
      throw new Error("Failed to create new profile");
    }

    // Prepare response payload - include redirect if it exists
    const responsePayload: {
      createdProfile: typeof createdProfile;
      redirect?: string;
    } = {
      createdProfile,
    };

    // Add redirect to response if it exists
    if (redirect) {
      responsePayload.redirect = redirect as string;
    }

    // Respond before continuing with non-blocking operations
    res.status(201).json(responsePayload);

    // Create snapshot after response is sent (non-blocking operation)
    try {
      await saveIndividualProfileByIdService([createdProfile.profile_id]);
    } catch (snapshotError) {
      console.error("Failed to create profile snapshot:", snapshotError);
    }
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * Validates token and updates its status in database
 * @returns boolean indicating if validation was successful
 */
async function validateToken(
  tokenString: string,
  res: Response
): Promise<boolean> {
  try {
    // Verify token
    const decoded = jwt.verify(
      tokenString,
      process.env.JWT_SECRET as string
    ) as TokenPayload;

    if (!decoded.id || !decoded.email) {
      res.status(400).json({
        message: "Invalid token format",
        errorMessage: "Token is missing required fields",
      });
      return false;
    }

    // Check if token exists in database
    const existingToken = await mongoDbClient.registrationExpiry.findUnique({
      where: {
        reg_id: decoded.id,
        email: decoded.email,
      },
    });

    if (!existingToken) {
      res.status(400).json({
        message: "Invalid token",
        errorMessage: "Token does not exist",
      });
      return false;
    }

    // Check token expiration
    const currentDate = new Date();
    const expirationDate = new Date(existingToken.expiresAt);

    if (currentDate > expirationDate) {
      res.status(400).json({
        message: "Token expired",
        errorMessage: "Token has expired",
      });
      return false;
    }

    // Check if token was already accessed
    if (existingToken.accessed) {
      res.status(400).json({
        message: "Token already accessed",
        errorMessage: "Token has already been used, please request a new one",
      });
      return false;
    }

    // Update token as accessed
    await mongoDbClient.registrationExpiry.update({
      where: {
        reg_id: decoded.id,
      },
      data: {
        accessed: true,
        accessed_at: new Date(),
      },
    });

    // Token is valid if execution reaches here
    return true;
  } catch (error) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      res.status(400).json({
        message: "Token expired",
        errorMessage: "Token has expired",
      });
      return false;
    }

    res.status(400).json({
      message: "Invalid identification token",
      errorMessage: "Invalid token, kindly check and try again",
    });
    return false;
  }
}

/**
 * Centralized error handling for the controller
 */
function handleError(error: unknown, res: Response): void {
  console.error("Error creating individual profile:", error);

  if (error instanceof ZodError) {
    res.status(400).json({
      message: "Invalid request body",
      errorMessage: error.errors,
    });
    return;
  }

  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      res.status(400).json({
        message: `The ${error.meta?.target} already exists`,
        errorMessage: "Unique constraint failed",
      });
      return;
    }
  }

  // Generic error handling
  res.status(500).json({
    message: "Operation failed. Please try again later",
    errorMessage: "Internal server error",
  });
}

// get the individual profile by id
export const getIndividualProfileById = async (req: Request, res: Response) => {
  let profileID = "";
  try {
    const profileId = req.params?.profileId;
    profileID = profileId;

    if (!profileId) {
      res.status(404).json({
        message: "Bad Request",
        errorMessage: "Invalid or non-existent profileId",
      });
    } else {
      const profile = await postgresClient.profiles.findUnique({
        where: {
          profile_id: profileId,
        },
      });

      if (profile) {
        res.status(200).json({ profile });
      } else {
        res.status(404).json({
          message: "Profile not found",
          errorMessage: "Invalid or non-existent profileId",
        });
      }
    }
  } catch (err) {
    console.log(`error fetching profile with id ${profileID}`, err);
    res.status(500).json({
      message: `Could not fetch profile with id ${profileID}`,
      errorMessage: "Internal Server Error",
    });
  }
};

// get the individual profile by giving number
export const getIndividualProfileByGivingNumber = async (
  req: Request,
  res: Response
) => {
  let givingNumber: any;
  try {
    const reqBody = req.body;
    const parsedBody = GivingNumberValidatorObj.parse(reqBody);
    givingNumber = parsedBody.givingNumber;

    const profile = await postgresClient.profiles.findFirst({
      where: {
        giving_number: parsedBody.givingNumber,
      },
    });

    if (profile) {
      res.status(200).json({ profile });
    } else {
      res.status(404).json({
        message: "Profile not found",
        errorMessage: `No profile associated with giving number ${parsedBody.givingNumber}`,
      });
    }
  } catch (err) {
    console.log(
      `error fetching profile with giving number ${givingNumber}`,
      err
    );
    if (err instanceof ZodError) {
      res.status(400).json({
        message: "Invalid giving number input",
        errorMessage: err.errors,
      });
    }

    res.status(500).json({
      message: `Could not fetch profile with giving number ${givingNumber}`,
      errorMessage: "Internal Server Error",
    });
  }
};

// get the individual profile by id
export const getIndividualProfileByEmail = async (
  req: Request,
  res: Response
) => {
  let profileEmail: any;
  try {
    const reqBody = req.body;
    const parsedBody = EmailValidatorObj.parse(reqBody);
    profileEmail = parsedBody.email;

    const profile = await postgresClient.profiles.findUnique({
      where: {
        email: parsedBody.email,
      },
    });

    console.log("Profile from data-layer: ", profile);

    if (profile) {
      res.status(200).json({ profile });
    } else {
      res.status(404).json({
        message: "Profile not found",
        errorMessage: `No profile associated with email ${parsedBody.email}`,
      });
    }
  } catch (err) {
    console.log(`error fetching profile with email ${profileEmail}`, err);
    if (err instanceof ZodError) {
      res.status(400).json({
        message: "Invalid email input",
        errorMessage: err.errors,
      });
    }

    res.status(500).json({
      message: `Could not fetch profile with email ${profileEmail}`,
      errorMessage: "Internal Server Error",
    });
  }
};

// get all the profiles
export const getAllIndividualProfiles = async (req: Request, res: Response) => {
  try {
    const result = await postgresClient.profiles.findMany();
    res.status(200).json({ allProfiles: result });
  } catch (err) {
    console.log("error fetching all profiles ", err);
    res.status(500).json({
      message: "Could not fetch profiles",
      errorMessage: "Internal Server Error",
    });
  }
};

//Search for individual profiles by name or surname
export const searchProfilesByName = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { q } = req.query;

    // Return all profiles if no search query is provided
    if (!q || typeof q !== "string" || q.trim() === "") {
      const result = await postgresClient.profiles.findMany({
        take: 20, // Limit results to avoid returning too many profiles
      });
      res.status(200).json({ profiles: result });
      return;
    }

    const searchTerm = q.trim();

    // Find profiles where name or surname contains the search term
    const matchingProfiles = await postgresClient.profiles.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { surname: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      orderBy: [{ name: "asc" }, { surname: "asc" }],
    });

    res.status(200).json({ profiles: matchingProfiles });
  } catch (err) {
    console.error("Error searching profiles by name:", err);
    res.status(500).json({
      message: "Could not search for profiles",
      errorMessage: "Internal Server Error",
    });
  }
};

export const updateIndividualProfileById = async (
  req: Request,
  res: Response
) => {
  try {
    const parsedBody = UpdateIndividualProfileSchema.parse(req.body);
    const { profile_id, ...restProps } = parsedBody;

    const existingProfile = await postgresClient.profiles.findUnique({
      where: {
        profile_id: profile_id,
      },
    });

    if (!existingProfile) {
      res.status(400).json({ message: "Profile does not exist" });
      return;
    }

    const updatedProfile = await postgresClient.profiles.update({
      where: {
        profile_id: profile_id,
      },
      data: {
        ...existingProfile,
        ...restProps,
      },
    });

    if (updatedProfile) {
      res.status(201).json({ message: "Updated profile successfully" });

      //  create the snapshot of the individual
      const saveIndividualSnapshot = await saveIndividualProfileByIdService([
        updatedProfile.profile_id,
      ]);

      return;
    } else {
      throw new Error(`Could not update profile with id ${profile_id}`);
    }
  } catch (err) {
    console.log("update profile error ", err);
    if (err instanceof ZodError) {
      res
        .status(400)
        .json({ message: "Invalid inputs", errorMessage: err.errors });
    } else if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        res.status(400).json({
          message: `The ${err.meta?.target} already exists`,
          errorMessage: "Unique constraint failed",
        });
      }
    } else {
      res.status(500).json({
        message: "Operation failed. Try again later",
        errorMessage: "Internal server error",
      });
    }
  }
};

export const deleteIndividualProfileById = async (
  req: Request,
  res: Response
) => {
  try {
    const parsedBody = profileIdValidator.parse(req.body);

    // check if the record to be deleted is in the database, else, refuse the delete request
    const isInDb = await postgresClient.profiles.findUnique({
      where: {
        profile_id: parsedBody.profile_id,
      },
    });

    if (!(isInDb?.profile_id === parsedBody.profile_id)) {
      res.status(404).json({
        message: `Profile with id ${parsedBody.profile_id} does not exist`,
      });
    } else {
      const result = await postgresClient.profiles.delete({
        where: {
          profile_id: parsedBody.profile_id,
        },
      });

      if (result.profile_id === parsedBody.profile_id) {
        res.status(201).json({ message: "Operation succesfull" });
      }
    }
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({
        message: "Invalid profile_id field",
        errorMessage: err.errors,
      });
    } else {
      res.status(500).json({
        message: "Operation failed. Try again later",
        errorMessage: "Internal server error",
      });
    }
  }
};

export const deleteAllIndividualProfiles = async () =>
  // req: Request,
  // res: Response
  {
    try {
      const result = await postgresClient.profiles.deleteMany();
      console.log(`Deleted ${result.count} profiles successfully`);
      // res.status(200).json({
      //   message: `Deleted ${result.count} profiles successfully`,
      //   deletedCount: result.count,
      // });
    } catch (err) {
      console.error("Error deleting all profiles:", err);
      // res.status(500).json({
      //   message: "Failed to delete all profiles",
      //   errorMessage: "Internal server error",
      // });
    }
  };

deleteAllIndividualProfiles();
