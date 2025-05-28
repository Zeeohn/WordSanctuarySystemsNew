"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyLoginOtpController = exports.requestLoginOtpController = exports.verifyInvitationRequestController = exports.invitationRequestController = exports.verifyLoginRequestController = exports.requestLoginCredentailsController = exports.logoutControlller = exports.submitAccessRequestController = void 0;
const InvitationRequestValidator_1 = require("../validators/InvitationRequestValidator");
const getDataLayerAPI_endpoint_1 = require("../helpers/getDataLayerAPI_endpoint");
const zod_1 = require("zod");
const types_1 = require("../types");
const jwt_1 = require("../lib/jwt");
const submitAccessRequestController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (err) { }
});
exports.submitAccessRequestController = submitAccessRequestController;
const logoutControlller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    }
    catch (err) {
        console.log(` logoutControlller encountered an err`, err);
        res.status(500).json({
            success: false,
            message: "An error occured while logging you out. Please try again later.",
        });
        return;
    }
});
exports.logoutControlller = logoutControlller;
const requestLoginCredentailsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedBody = InvitationRequestValidator_1.LoginRequestValidator.parse(req.body);
        const data_Layer_Base_Api_Endpoint = (0, getDataLayerAPI_endpoint_1.get_Data_Layer_Base_Api_Endpoint)();
        const data_Layer_Postgres_Api_Endpoint = (0, getDataLayerAPI_endpoint_1.get_Data_Layer_POSTGRESS_Api_Endpoint)();
        const root_user_email = (0, getDataLayerAPI_endpoint_1.get_root_user_email)();
        console.log("endpoint ", data_Layer_Base_Api_Endpoint, data_Layer_Postgres_Api_Endpoint);
        if (root_user_email !== parsedBody.email) {
            //    check if the email is registered in the system
            const profile = yield fetch(`${data_Layer_Postgres_Api_Endpoint}/profiles/individuals/getbyemail`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: parsedBody.email,
                }),
            });
            if (!profile) {
                res.status(401).json({
                    success: false,
                    message: "No profile associated with this email",
                });
                return;
            }
        }
        const loginRequestRes = yield fetch(`${data_Layer_Base_Api_Endpoint}/accounts/auth/request/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: parsedBody.email,
            }),
        });
        const response = yield loginRequestRes.json();
        if (response === null || response === void 0 ? void 0 : response.success) {
            res.status(201).json({
                success: true,
                message: "Login credentials sent to user email",
            });
            return;
        }
        res.status(401).json({
            success: false,
            message: (response === null || response === void 0 ? void 0 : response.message)
                ? response.message
                : "Could not send login credentials. Please try again later.",
        });
    }
    catch (err) {
        console.log(`requestLoginCredentailsController encountered an err`, err);
        if (err instanceof zod_1.ZodError) {
            res.status(400).json({
                success: false,
                message: "Bad request",
                error: err.errors,
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: "Internal Server error.requestLoginCredentailsController encountered an error. Please try again later.",
        });
        return;
    }
});
exports.requestLoginCredentailsController = requestLoginCredentailsController;
const verifyLoginRequestController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const parsedBody = InvitationRequestValidator_1.VerifyLoginRequestValidator.parse(req.body);
        const data_Layer_Base_Api_Endpoint = (0, getDataLayerAPI_endpoint_1.get_Data_Layer_Base_Api_Endpoint)();
        const node_env = (0, getDataLayerAPI_endpoint_1.get_NODE_ENV)();
        const root_user_email = (0, getDataLayerAPI_endpoint_1.get_root_user_email)();
        console.log("verifying login credentials");
        const getVerificationDetailsFromDb = yield fetch(`${data_Layer_Base_Api_Endpoint}/accounts/auth/request/login/getCredentials`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: parsedBody.email,
                otp: parsedBody.otp,
            }),
        });
        const response = yield getVerificationDetailsFromDb.json();
        console.log("login verification details ", response);
        if (getVerificationDetailsFromDb.ok) {
            //  if the token has not expired and it of type "LOGIN"
            if (Date.now() <= (response === null || response === void 0 ? void 0 : response.data.expiration) &&
                (response === null || response === void 0 ? void 0 : response.data.token_type) === types_1.TokenTypes.LOGIN) {
                //  get the login token
                if (parsedBody.email === root_user_email) {
                    const token = (0, jwt_1.signJWT)({
                        profileId: "root_user_super_admin",
                        email: parsedBody.email,
                    }, "1h");
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
                const token = (0, jwt_1.signJWT)({
                    profileId: (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.profile_details) === null || _b === void 0 ? void 0 : _b.profile_id,
                    email: parsedBody.email,
                }, "1h");
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
                    profile: (_c = response.data) === null || _c === void 0 ? void 0 : _c.profile_details,
                });
                return;
            }
            else {
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
    }
    catch (err) {
        console.log(`verifyLoginRequestController encountered an err `, err);
        if (err instanceof zod_1.ZodError) {
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
});
exports.verifyLoginRequestController = verifyLoginRequestController;
const invitationRequestController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedBody = InvitationRequestValidator_1.InvitationRequestValidator.parse(req.body);
        const data_Layer_Base_Api_Endpoint = (0, getDataLayerAPI_endpoint_1.get_Data_Layer_Base_Api_Endpoint)();
        console.log("endpoint ", data_Layer_Base_Api_Endpoint);
        const invitationRequestRes = yield fetch(`${data_Layer_Base_Api_Endpoint}/accounts/invites/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: parsedBody.email,
                description: parsedBody.description,
            }),
        });
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
    }
    catch (err) {
        console.log(`invitationRequestController encountered an err`, err);
        if (err instanceof zod_1.ZodError) {
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
});
exports.invitationRequestController = invitationRequestController;
const verifyInvitationRequestController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedBody = InvitationRequestValidator_1.getInvitationDetailsValidator.parse(req.body);
        const data_Layer_Base_Api_Endpoint = (0, getDataLayerAPI_endpoint_1.get_Data_Layer_Base_Api_Endpoint)();
        const getVerificationDetailsFromDb = yield fetch(`${data_Layer_Base_Api_Endpoint}/accounts/invites/getInvite`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email_of_invited: parsedBody.email_of_invited,
                token: parsedBody.token,
                otp: parsedBody.otp,
            }),
        });
        const response = yield getVerificationDetailsFromDb.json();
        if (getVerificationDetailsFromDb.ok) {
            console.log(Date.now() <= (response === null || response === void 0 ? void 0 : response.data.expiration), (response === null || response === void 0 ? void 0 : response.data.token_type) === types_1.TokenTypes.INVITATION);
            if (Date.now() <= (response === null || response === void 0 ? void 0 : response.data.expiration) &&
                (response === null || response === void 0 ? void 0 : response.data.token_type) === types_1.TokenTypes.INVITATION) {
                res.status(200).json({
                    verified: true,
                    message: "user verified",
                    is_token_expired: false,
                });
                return;
            }
            else {
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
    }
    catch (err) {
        console.log(`verifyInvitationRequestController encountered an err `, err);
        if (err instanceof zod_1.ZodError) {
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
});
exports.verifyInvitationRequestController = verifyInvitationRequestController;
const requestLoginOtpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Only validate email, not existence
        const { email } = InvitationRequestValidator_1.LoginRequestValidator.parse(req.body);
        const data_Layer_Base_Api_Endpoint = (0, getDataLayerAPI_endpoint_1.get_Data_Layer_Base_Api_Endpoint)();
        // Call data layer to send login OTP/email
        const loginRequestRes = yield fetch(`${data_Layer_Base_Api_Endpoint}/accounts/auth/request/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });
        const response = yield loginRequestRes.json();
        if (response === null || response === void 0 ? void 0 : response.success) {
            res.status(201).json({
                success: true,
                message: `OTP sent to ${email}, check your inbox or spam folder`,
            });
            return;
        }
        res.status(401).json({
            success: false,
            message: (response === null || response === void 0 ? void 0 : response.message)
                ? response.message
                : "Could not send OTP. Please try again later.",
        });
    }
    catch (err) {
        console.log(`requestLoginOtpController encountered an err`, err);
        if (err instanceof zod_1.ZodError) {
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
});
exports.requestLoginOtpController = requestLoginOtpController;
const verifyLoginOtpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedBody = InvitationRequestValidator_1.VerifyLoginRequestValidator.parse(req.body);
        const data_Layer_Base_Api_Endpoint = (0, getDataLayerAPI_endpoint_1.get_Data_Layer_Base_Api_Endpoint)();
        const data_Layer_Postgres_Api_Endpoint = (0, getDataLayerAPI_endpoint_1.get_Data_Layer_POSTGRESS_Api_Endpoint)();
        const node_env = (0, getDataLayerAPI_endpoint_1.get_NODE_ENV)();
        // Step 1: Verify OTP with data layer
        const getVerificationDetailsFromDb = yield fetch(`${data_Layer_Base_Api_Endpoint}/accounts/auth/request/login/getCredentials`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: parsedBody.email,
                otp: parsedBody.otp,
            }),
        });
        const response = yield getVerificationDetailsFromDb.json();
        if (getVerificationDetailsFromDb.ok &&
            Date.now() <= (response === null || response === void 0 ? void 0 : response.data.expiration) &&
            (response === null || response === void 0 ? void 0 : response.data.token_type) === types_1.TokenTypes.LOGIN) {
            // Check if user profile exists
            const profileRes = yield fetch(`${data_Layer_Postgres_Api_Endpoint}/profiles/individuals/getbyemail`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: parsedBody.email }),
            });
            let profileData = null;
            if (profileRes.ok) {
                profileData = yield profileRes.json();
            }
            if (profileData && profileData.data) {
                // Profile exists, registration complete
                res.status(200).json({
                    verified: true,
                    registration_complete: true,
                    profile: profileData.data,
                });
                return;
            }
            else {
                // Profile does not exist, registration not complete, use token to identify and redirect users to complete their profile
                // make an API call to create a registration expiry link
                const expiryRes = yield fetch(`${data_Layer_Base_Api_Endpoint}/accounts/expiry/create`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: parsedBody.email }),
                });
                if (!expiryRes.ok) {
                    res.status(500).json({
                        success: false,
                        message: "Could not create registration link, try again later",
                    });
                    return;
                }
                const expiry = yield expiryRes.json();
                console.log("Expiry response: ", expiry);
                console.log("Expiry Token: ", expiry.data);
                if (expiry === null || expiry === void 0 ? void 0 : expiry.data) {
                    res.status(200).json({
                        success: true,
                        registration_complete: false,
                        token: expiry.data,
                        message: "Registration link created",
                    });
                }
                return;
            }
        }
        else if (getVerificationDetailsFromDb.ok) {
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
    }
    catch (err) {
        console.log(`verifyLoginOtpController encountered an err `, err);
        if (err instanceof zod_1.ZodError) {
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
});
exports.verifyLoginOtpController = verifyLoginOtpController;
