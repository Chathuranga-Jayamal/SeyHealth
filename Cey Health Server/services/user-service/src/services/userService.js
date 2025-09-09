import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import Hash from "../utils/hash.js";
import Timeslot from "../models/timeSlotModel.js";
import Doctor from "../models/doctorModel.js";

class UserService {
  //get user data by id
  //1. check if userId is provided
  //2. call User.getUserById(userId) to get user data
  //3. return the user data
  async getUserData(userId) {
    if (!userId) {
      throw new Error("User ID is required");
    }
    const userData = await User.getUserById(userId);

    if (!userData) {
      throw new Error("User not found");
    }

    const user = {
      id: userData.id,
      email: userData.email,
      fname: userData.first_name,
      lname: userData.last_name,
      role: userData.role,
      phone: userData.phone,
      birthday: userData.birthday,
      street: userData.street,
      city: userData.city,
      postalCode: userData.postal_code,
    };

    return user;
  }

  async updateUserData(userId, userData) {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const updatedData = {
      email: userData.email,
      first_name: userData.fname,
      last_name: userData.lname,
      phone: userData.phone,
      birthday: userData.birthday,
      street: userData.street,
      city: userData.city,
      postal_code: userData.postalCode,
    };

    if (!updatedData || Object.keys(updatedData).length === 0) {
      throw new Error("No data provided for update");
    }

    const updatedUser = await User.updateUser(userId, updatedData);

    if (!updatedUser) {
      throw new Error("Failed to update user data");
    }

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      fname: updatedUser.first_name,
      lname: updatedUser.last_name,
      role: updatedUser.role,
      phone: updatedUser.phone,
      birthday: updatedUser.birthday,
      street: updatedUser.street,
      city: updatedUser.city,
      postalCode: updatedUser.postalCode,
    };
  }

  async changeUserPassword(userId, oldPassword, newPassword) {
    const user = await User.getUserById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const currentPassword = user.password_hash;

    if (!currentPassword) {
      throw new Error("Current password not set");
    }

    const isMatch = await bcrypt.compare(oldPassword, currentPassword);

    if (!isMatch) {
      return false;
    }

    const hash = new Hash();
    const hashPassword = await hash.hashPassword(newPassword);

    if (!hashPassword) {
      throw new Error("Failed to hash new password");
    }
    console.log("New password hashed successfully", hashPassword);

    const isUpdated = await User.updatePassword(userId, hashPassword);

    return isUpdated;
  }

  //delete user by id
  //1. check if userId is provided
  //2. call User.deleteUserById(userId) to delete the user
  //3. return the result
  async deleteUserAccount(userId) {
    if (!userId) {
      throw new Error("User ID is required");
    }
    const result = await User.deleteUserById(userId);

    return result;
  }

  async addNewDoctorService(DoctorData) {
    const { password } = DoctorData;

    const hash = new Hash();
    const hashedPassword = await hash.hashPassword(password);
    DoctorData.password = hashedPassword;

    const doctor = new Doctor();
    const result = await doctor.addDoctor(DoctorData);
    console.log(result);

    return result;
  }

  async createTimeslot(duid, date, start_time, end_time) {
    const timeslot = new Timeslot();
    const newtimeslot = await timeslot.createTimeslot(
      duid,
      date,
      start_time,
      end_time
    );
    return newtimeslot;
  }
}

export default new UserService();
