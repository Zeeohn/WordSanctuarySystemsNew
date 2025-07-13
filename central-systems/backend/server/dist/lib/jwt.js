"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signJWT = signJWT;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fallBackSecret = "fallback_random_secret_277253*&62-=6^%#@!(##^^$(@)+@)@jdjdhjJJJ";
function signJWT(payload, expiry) {
    //    example usage expiry in "1h"
    const secret = process.env.JWT_SIGN_SECRET || fallBackSecret;
    if (secret) {
        return jsonwebtoken_1.default.sign(payload, secret, {
            expiresIn: expiry
        });
    }
    else {
        return jsonwebtoken_1.default.sign(payload, fallBackSecret, {
            expiresIn: expiry
        });
    }
}
