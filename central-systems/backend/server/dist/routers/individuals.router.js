"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const individuals_controller_1 = require("../controllers/individuals.controller");
const individualsRouter = express_1.default.Router();
individualsRouter.get("/fetch/individual/:profileId", individuals_controller_1.getIndividualProfileById);
individualsRouter.post("/getbyemail", individuals_controller_1.getIndividualProfileByEmail);
individualsRouter.get("/getbygivingnumber", individuals_controller_1.getIndividualProfileByGivingNumber);
individualsRouter.post("/create", individuals_controller_1.createIndividualProfile);
individualsRouter.get("/fetch/all", individuals_controller_1.getAllIndividualsProfile);
individualsRouter.get("/update", individuals_controller_1.updateIndividualProfile);
individualsRouter.get("/delete", individuals_controller_1.deleteIndividualProfile);
exports.default = individualsRouter;
