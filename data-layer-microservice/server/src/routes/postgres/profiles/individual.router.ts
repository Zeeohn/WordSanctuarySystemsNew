import express from "express";
import {
  createIndividualProfile,
  deleteIndividualProfileById,
  getAllIndividualProfiles,
  getIndividualProfileByEmail,
  getIndividualProfileByGivingNumber,
  getIndividualProfileById,
  searchProfilesByName,
  updateIndividualProfileById,
} from "../../../controllers/postgres/profiles/individualController";
const individualsRouter = express.Router();

individualsRouter.get("/fetch/:profileId", getIndividualProfileById);
individualsRouter.post("/getbyemail", getIndividualProfileByEmail);
individualsRouter.post(
  "/getbygivingnumber",
  getIndividualProfileByGivingNumber
);
individualsRouter.get("/all", getAllIndividualProfiles);
individualsRouter.get("/search", searchProfilesByName);
individualsRouter.post("/create", createIndividualProfile);
individualsRouter.post("/update", updateIndividualProfileById);
individualsRouter.post("/delete", deleteIndividualProfileById);

export default individualsRouter;
