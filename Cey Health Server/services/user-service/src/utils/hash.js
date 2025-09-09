// Hash class
import bcrypt from "bcryptjs";
import UserModel from "../models/userModel.js";

class Hash {
  // generateHash method
  async #generateHash(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  // compareHash method
  async #compareHash(password, email) {
    const user = new UserModel();
    const userData = await user.getUserByEmail(email);

    if (!userData) {
      throw new Error("User not found");
    }

    const hash = userData.password;
    return await bcrypt.compare(password, hash);
  }

  async hashPassword(password) {
    return await this.#generateHash(password);
  }

  async comparePassword(password, email) {
    return await this.#compareHash(password, email);
  }
}

export default Hash;
