import express from "express";
import {
  invitationRequestController,
  logoutControlller,
  requestLoginCredentailsController,
  submitAccessRequestController,
  verifyInvitationRequestController,
  verifyLoginRequestController,
  requestLoginOtpController,
  verifyLoginOtpController,
} from "../controllers/auth.controller";

const authRouter = express.Router();

//  login route handlers

authRouter.post("/access/request/login", requestLoginCredentailsController);

authRouter.post("/logout", logoutControlller);

authRouter.post("/access/request/login/verify", verifyLoginRequestController);

authRouter.post("/access/request/submit", submitAccessRequestController);

authRouter.post("/access/request/process");

authRouter.post("/invitations/request/submit", invitationRequestController);

authRouter.post(
  "/invitations/request/verify",
  verifyInvitationRequestController
);

authRouter.post("/access/request/external/login", requestLoginOtpController);

authRouter.post("/access/request/external/verify", verifyLoginOtpController);

//  authRouter.get("/access/requests/all", getAllAccessRequests)

export default authRouter;
