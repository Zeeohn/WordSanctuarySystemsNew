import express from "express";
import {
  createIndividualProfile,
  deleteIndividualProfile,
  getAllIndividualsProfile,
  getIndividualProfileByEmail,
  getIndividualProfileByGivingNumber,
  getIndividualProfileById,
  updateIndividualProfile,
} from "../controllers/individuals.controller";

const individualsRouter = express.Router();

individualsRouter.get("/fetch/individual/:profileId", getIndividualProfileById);

individualsRouter.get("/getbyemail", getIndividualProfileByEmail);

individualsRouter.get("/getbygivingnumber", getIndividualProfileByGivingNumber);

individualsRouter.post("/create", createIndividualProfile);

individualsRouter.get("/fetch/all", getAllIndividualsProfile);

individualsRouter.get("/update", updateIndividualProfile);

individualsRouter.get("/delete", deleteIndividualProfile);

export default individualsRouter;
