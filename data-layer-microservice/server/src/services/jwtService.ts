import { mongoDbClient } from "../db_connections/prismaClients";
import jwt from "jsonwebtoken";

export const generateJWTService = async (recipientEmail: string) => {
  try {
    const presentDateTime = new Date();
    const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours in ms

    // Delete any existing token for this email before creating a new one
    const existingToken = await mongoDbClient.registrationExpiry.findFirst({
      where: {
        email: recipientEmail,
      },
    });

    if (existingToken) {
      await mongoDbClient.registrationExpiry.delete({
        where: {
          reg_id: existingToken.reg_id,
        },
      });
    }

    // Create a new token
    const savedToken = await mongoDbClient.registrationExpiry.create({
      data: {
        email: recipientEmail,
        createdAt: presentDateTime,
        expiresAt: expirationDate,
      },
    });

    if (!savedToken) {
      throw new Error("Could not save token in database");
    }
    const token = jwt.sign(
      { email: recipientEmail, id: savedToken.reg_id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "24h",
      }
    );

    return token;
  } catch (err) {
    console.log(`generateJWTService encountered an error `, err);
    return null;
  }
};
