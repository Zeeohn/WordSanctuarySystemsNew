"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteIndividualProfile =
  exports.getAllIndividualsProfile =
  exports.getIndividualProfileByGivingNumber =
  exports.getIndividualProfileByEmail =
  exports.getIndividualProfileById =
  exports.updateIndividualProfile =
  exports.createIndividualProfile =
    void 0;
const getDataLayerAPI_endpoint_1 = require("../helpers/getDataLayerAPI_endpoint");
const createIndividualProfileValidators_1 = require("../validators/createIndividualProfileValidators");
const zod_1 = require("zod");
const createIndividualProfile = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const parsedBody =
        createIndividualProfileValidators_1.CreateIndividualProfileSchema.parse(
          req.body
        );
      const { token, redirect } = req.query;
      console.log("token: ", token);
      console.log("redirect: ", redirect);
      const data_Layer_Base_Api_Endpoint = (0,
      getDataLayerAPI_endpoint_1.get_Data_Layer_POSTGRESS_Api_Endpoint)();
      console.log("endpoint ", data_Layer_Base_Api_Endpoint);
      const createProfileResponse = yield fetch(
        `${data_Layer_Base_Api_Endpoint}/profiles/individuals/create${
          token ? `?token=${token}` : ""
        }${redirect ? `&redirect=${redirect}` : ""}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Object.assign({}, parsedBody)),
        }
      );
      const responseFromDatalayer = yield createProfileResponse.json();
      if (createProfileResponse.ok) {
        res.status(201).json({
          success: true,
          data: responseFromDatalayer,
          message: "Profile created",
        });
        return;
      }
      const responseFromDatalayer = yield createProfileResponse.json();
      res.status(500).json({
        success: false,
        message:
          (responseFromDatalayer === null || responseFromDatalayer === void 0
            ? void 0
            : responseFromDatalayer.message) ||
          "Could not send create profile. Please try again later.",
      });
    } catch (err) {
      console.log(`createIndividualprofile controller encountered an err`, err);
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
exports.createIndividualProfile = createIndividualProfile;
//Update Individual Profile
const updateIndividualProfile = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const parsedBody =
        createIndividualProfileValidators_1.UpdateIndividualProfileSchema.parse(
          req.body
        );
      const data_Layer_Base_Api_Endpoint = (0,
      getDataLayerAPI_endpoint_1.get_Data_Layer_POSTGRESS_Api_Endpoint)();
      console.log("endpoint ", data_Layer_Base_Api_Endpoint);
      const updateProfileResponse = yield fetch(
        `${data_Layer_Base_Api_Endpoint}/profiles/individuals/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Object.assign({}, parsedBody)),
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
exports.updateIndividualProfile = updateIndividualProfile;
// Get Individual Profile By ID
const getIndividualProfileById = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const parsedBody =
        createIndividualProfileValidators_1.profileIdValidator.parse(req.body);
      const data_Layer_Base_Api_Endpoint = (0,
      getDataLayerAPI_endpoint_1.get_Data_Layer_POSTGRESS_Api_Endpoint)();
      console.log("endpoint ", data_Layer_Base_Api_Endpoint);
      const getProfileByIdResponse = yield fetch(
        `${data_Layer_Base_Api_Endpoint}/profiles/individuals/fetch/:profileId`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Object.assign({}, parsedBody)),
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
      console.log(
        `getIndividualprofileById controller encountered an err`,
        err
      );
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
exports.getIndividualProfileById = getIndividualProfileById;
// Get Individual Profile By Email
const getIndividualProfileByEmail = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const parsedBody =
        createIndividualProfileValidators_1.EmailValidatorObj.parse(req.body);
      const data_Layer_Base_Api_Endpoint = (0,
      getDataLayerAPI_endpoint_1.get_Data_Layer_POSTGRESS_Api_Endpoint)();
      console.log("endpoint ", data_Layer_Base_Api_Endpoint);
      const getProfileByEmailResponse = yield fetch(
        `${data_Layer_Base_Api_Endpoint}/profiles/individuals/getbyemail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Object.assign({}, parsedBody)),
        }
      );
      if (getProfileByEmailResponse.ok) {
        res.status(201).json({
          success: true,
          message: "Profile retrieved",
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
exports.getIndividualProfileByEmail = getIndividualProfileByEmail;
// Get Individual Profile By Giving Number
const getIndividualProfileByGivingNumber = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const parsedBody =
        createIndividualProfileValidators_1.GivingNumberValidatorObj.parse(
          req.body
        );
      const data_Layer_Base_Api_Endpoint = (0,
      getDataLayerAPI_endpoint_1.get_Data_Layer_POSTGRESS_Api_Endpoint)();
      console.log("endpoint ", data_Layer_Base_Api_Endpoint);
      const getProfileByGivingNumberResponse = yield fetch(
        `${data_Layer_Base_Api_Endpoint}/profiles/individuals/getbygivingnumber`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Object.assign({}, parsedBody)),
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
        message:
          "Could not send get profile by Number. Please try again later.",
      });
    } catch (err) {
      console.log(
        `getIndividualprofileBynumber controller encountered an err`,
        err
      );
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
exports.getIndividualProfileByGivingNumber = getIndividualProfileByGivingNumber;
//Get All Individual Profile
const getAllIndividualsProfile = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const data_Layer_Base_Api_Endpoint = (0,
      getDataLayerAPI_endpoint_1.get_Data_Layer_POSTGRESS_Api_Endpoint)();
      console.log("endpoint ", data_Layer_Base_Api_Endpoint);
      const fetchProfileResponse = yield fetch(
        `${data_Layer_Base_Api_Endpoint}/profiles/individuals/all`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const response = yield fetchProfileResponse.json();
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
      console.log(
        `getAllIndividualsProfile controller encountered an err`,
        err
      );
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
        message:
          "Internal Server error. Could not fetch individual profiles. Please try again later.",
      });
      return;
    }
  });
exports.getAllIndividualsProfile = getAllIndividualsProfile;
//Delete Individual Profile
const deleteIndividualProfile = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const parsedBody =
        createIndividualProfileValidators_1.profileIdValidator.parse(req.body);
      const data_Layer_Base_Api_Endpoint = (0,
      getDataLayerAPI_endpoint_1.get_Data_Layer_POSTGRESS_Api_Endpoint)();
      console.log("endpoint ", data_Layer_Base_Api_Endpoint);
      const deleteProfileResponse = yield fetch(
        `${data_Layer_Base_Api_Endpoint}/profiles/individuals/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Object.assign({}, parsedBody)),
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
exports.deleteIndividualProfile = deleteIndividualProfile;
