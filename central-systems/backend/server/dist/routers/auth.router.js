"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const authRouter = express_1.default.Router();
//  login route handlers
authRouter.post("/access/request/login", auth_controller_1.requestLoginCredentailsController);
authRouter.post("/logout", auth_controller_1.logoutControlller);
authRouter.post("/access/request/login/verify", auth_controller_1.verifyLoginRequestController);
authRouter.post("/access/request/submit", auth_controller_1.submitAccessRequestController);
authRouter.post("/access/request/process");
authRouter.post("/invitations/request/submit", auth_controller_1.invitationRequestController);
authRouter.post("/invitations/request/verify", auth_controller_1.verifyInvitationRequestController);
authRouter.post("/access/request/external/login", auth_controller_1.requestLoginOtpController);
authRouter.post("/access/request/external/verify", auth_controller_1.verifyLoginOtpController);
//  authRouter.get("/access/requests/all", getAllAccessRequests)
exports.default = authRouter;
