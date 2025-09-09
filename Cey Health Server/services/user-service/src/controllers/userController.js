import userService from "../services/userService.js";
import Doctor from "../models/doctorModel.js";
import User from "../models/userModel.js";
import e from "express";

class UserController {
  // ------------------------------------------------ User Account Management ------------------------------------------------

  // Get user profile data
  async getProfile(req, res) {
    try {
      //Get userID from headers
      const userId = req.headers["userid"];

      if (!userId) {
        console.log("No userId found in headers", req.headers);
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      let id = Number(userId);
      const userProfileData = await userService.getUserData(id);

      res.status(200).json({
        success: true,
        message: "User profile data retrieved successfully",
        data: userProfileData,
      });
    } catch (error) {
      console.error("Get profile error:", error.message);

      if (error.message === "User not found") {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to retrieve user profile",
        error: error.message,
      });
    }
  }

  //Update user profile data
  async updateProfile(req, res) {
    try {
      const userId = req.headers["userid"];
      const updatedData = req.body;

      if (!userId) {
        console.log("No userId found in headers", req.headers);
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      if (updatedData === undefined || Object.keys(updatedData).length === 0) {
        return res.status(400).json({
          success: false,
          message: "No data provided for update",
        });
      }

      console.log("Updating profile data:", updatedData);

      let id = Number(userId);
      const result = await userService.updateUserData(id, updatedData);

      if (!result) {
        return res.status(400).json({
          success: false,
          message: "Failed to update user profile",
        });
      }

      console.log("Updating profile data:", updatedData);

      res.status(200).json({
        success: true,
        message: "User profile updated successfully",
        data: result,
      });
    } catch (error) {
      console.error("Update profile error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to update user profile",
        error: error.message,
      });
    }
  }

  async changePassword(req, res) {
    try {
      const userId = req.headers["userid"];
      const email = req.headers["email"];
      const { oldPassword, newPassword } = req.body;

      if (!userId) {
        console.log("No userId found in headers", req.headers);
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      if (!oldPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Old password and new password are required",
        });
      }

      let id = Number(userId);
      const result = await userService.changeUserPassword(
        id,
        oldPassword,
        newPassword
      );

      if (result) {
        res.status(200).json({
          success: true,
          message: "Password changed successfully",
        });
      } else {
        res.status(401).json({
          success: false,
          message: "Old password is incorrect",
        });
      }
    } catch (error) {
      console.error("Change password error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to change password",
        error: error.message,
      });
    }
  }

  // Delete User Account Controller
  async deleteUserAccountController(req, res) {
    try {
      const result = await userService.deleteUserAccount(req.session.user?.id);

      res.status(200).json({
        success: true,
        message: "User account deleted successfully",
        data: result,
      });
    } catch (error) {
      console.error("Delete user account error:", error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  //Add new Doctor Controller
  async addNewDoctor(req, res) {
    try {
      const { DoctorData } = req.body;

      if (!DoctorData) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const result = await userService.addNewDoctorService(DoctorData);

      if (result.success == false) {
        return res.status(400).json({ message: result.message });
      }

      console.log(result);

      res.status(201).json({
        success: true,
        message: "Doctor added successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error adding new doctor" });
    }
  }

  //add time slot of doctor
  async createTimeslot(req, res) {
    try {
      const { duid, date, start_time, end_time } = req.body;

      if (!duid || !date || !start_time || !end_time) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const newSlot = await userService.createTimeslot(
        duid,
        date,
        start_time,
        end_time
      );
      res.status(201).json(newSlot);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error creating timeslot" });
    }
  }

  //get doctors for AI
  async getDoctorsForAI(req, res) {
    try {
      console.log("Getting doctors for AI");
      const doctor = new Doctor();
      const doctors = await doctor.getAllDoctorsForAI();
      res.status(200).json(doctors);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error getting doctors for AI" });
    }
  }


  async getPatient(req, res) {
    console.log(req);
    try {
      const userId = req.headers["userid"];

      if(!userId) {
        console.log("No userId found in headers", req.headers);
        return res
        .status(401)
        .json({ success: false, message: "Unauthorized" });
      }

      console.log("Getting patient with userId:", userId);

      let id = Number(userId);
      const result = await User.isPtientExist(id);

      if(result){
        console.log("Patient found");
        return res.status(200).json({data: result, success: true});
      }else{
        console.log("Patient not found");
        return res.json({ message: "Patient not found", data: result, success: false });
      }
    } catch (error) {
      res.status(500).json({ message: "Error getting patient", error });
    }
  }

  async getUserWithOutHistoryController(req, res){
    try {
      const userId = req.headers["userid"];

      if (!userId) {
        console.log("No userId found in headers", req.headers);
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      let id = Number(userId);

      const result = await User.getUserForChat(id);

      console.log(result);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error getting user without history", error });
    }
  }

  //get user with history
  async getUserWithHistoryController(req, res) {
    try {
      const userId = req.headers["userid"];

      if (!userId) {
        console.log("No userId found in headers", req.headers);
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      let id = Number(userId);

      const userWithHistory = await User.getUserWithhistory(id);

      console.log(userWithHistory);
      res.status(200).json(userWithHistory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error getting user with history", error });
    }
  }
}

export default new UserController();
