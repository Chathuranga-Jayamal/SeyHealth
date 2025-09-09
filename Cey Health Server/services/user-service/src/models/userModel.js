import db from "../config/db.js";

//validations
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+94\d{9}$/;

class User {
  //get all users
  static async getAllUsers() {
    try {
      const [rows] = await db.query("SELECT*FROM users");
      return rows;
    } catch (error) {
      console.log(error);
      throw new Error("Error getting users:", error);
    }
  }

  //get user by id
  static async getUserById(id) {
    try {
      //if id is not valid
      if (!id || typeof id !== "number") {
        throw new Error("Invalid id");
      }
      //query to get user by id
      const [rows] = await db.query("SELECT*FROM users WHERE id = ?", [id]);
      //if user not found
      if (rows.length === 0) {
        throw new Error("User not found");
      }
      //if user found return user
      return rows[0];
    } catch (error) {
      console.log(error);
      throw new Error("Get user by id faild");
    }
  }

  // getUserByEmail method (in UserModel)
  static async getUserByEmail(email) {
    try {
      if (!email || typeof email !== "string" || !emailRegex.test(email)) {
        throw new Error("Invalid email");
      }

      const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);

      return rows[0] || null; // Return null if not found instead of throwing
    } catch (error) {
      console.error("Get user by email failed:", error);
      throw new Error("Failed to get user by email");
    }
  }

  static async createUser(user) {
    try {
      const {
        email,
        hashedPassword,
        first_name,
        last_name,
        role,
        phone,
        birthday,
        street,
        city,
        postal_code,
        google_id = null,
        status,
      } = user;

      // Check for required fields
      if (
        !email ||
        !hashedPassword ||
        !first_name ||
        !role ||
        !phone ||
        !status
      ) {
        console.log(user);
        throw new Error(
          "Required fields: email, password, firstName, role, phone, status"
        );
      }

      // Data type validation
      if (
        typeof email !== "string" ||
        typeof hashedPassword !== "string" ||
        typeof first_name !== "string" ||
        typeof last_name !== "string" ||
        typeof role !== "string" ||
        typeof phone !== "string" ||
        (birthday !== null && typeof birthday !== "string") ||
        (street !== null && typeof street !== "string") ||
        (city !== null && typeof city !== "string") ||
        (postal_code !== null && typeof postal_code !== "string") ||
        (google_id !== null &&
          google_id !== undefined &&
          typeof google_id !== "string") ||
        typeof status !== "string"
      ) {
        console.log(user);
        throw new Error("Invalid data type for one or more fields");
      }

      // Validate role (assuming ENUM('user', 'admin', 'doctor'))
      const validRoles = ["patient", "admin", "doctor"];
      if (!validRoles.includes(role)) {
        throw new Error(`Role must be one of: ${validRoles.join(", ")}`);
      }

      // Validate status (assuming ENUM('active', 'inactive'))
      const validStatuses = ["active", "inactive", "pending"];
      if (!validStatuses.includes(status)) {
        throw new Error(`Status must be one of: ${validStatuses.join(", ")}`);
      }

      // Validate email format
      if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
      }

      // Validate phone format (basic example, adjust as needed)
      if (!phoneRegex.test(phone)) {
        throw new Error("Invalid phone number format");
      }

      // Create user
      const [result] = await db.query(
        "INSERT INTO users (email, password_hash, first_Name, last_Name, role, phone, birthday, street, city, postal_code, google_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          email,
          hashedPassword,
          first_name,
          last_name,
          role,
          phone,
          birthday,
          street,
          city,
          postal_code,
          google_id,
          status,
        ]
      );
      return result;
    } catch (error) {
      console.log(error);
      throw new Error("Create user faild");
    }
  }

  //update user
  static async updateUser(userId, userData) {
    try {
      if (!userId || typeof userId !== "number") {
        throw new Error("Invalid user ID");
      }

      const {
        email,
        first_name,
        last_name,
        phone,
        birthday,
        street,
        city,
        postal_code,
      } = userData;

      // Validate email format
      if (email && !emailRegex.test(email)) {
        throw new Error("Invalid email format");
      }

      const existingUser = await User.getUserByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        throw new Error("Email is already in use");
      }

      // Validate phone format
      if (phone && !phoneRegex.test(phone)) {
        throw new Error("Invalid phone number format");
      }

      const [result] = await db.query(
        "UPDATE users SET email = ?, first_name = ?, last_name = ?, phone = ?, birthday = ?, street = ?, city = ?, postal_code = ? WHERE id = ?",
        [
          email,
          first_name,
          last_name,
          phone,
          birthday,
          street,
          city,
          postal_code,
          userId,
        ]
      );

      return result;
    } catch (error) {
      console.log(error);
      throw new Error("Update user faild");
    }
  }

  // Update user password
  static async updatePassword(userId, hashedPassword) {
    try {
      const [result] = await db.query(
        "UPDATE users SET password_hash = ? WHERE id = ?",
        [hashedPassword, userId]
      );

      if (result.affectedRows === 0) {
        throw new Error("User not found or password not updated");
      }
      console.log("Password updated successfully");

      return true;
    } catch (error) {
      console.log(error);
      throw new Error("Update password failed");
    }
  }

  // //delete user by id
  // static async deleteUserById(id) {
  //   //if id is not valid
  //   if (!id || typeof id !== "number") {
  //     throw new Error("Invalid id");
  //   }
  //   //query to delete user by id
  //   const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);

  //   //if user not found
  //   if (result.affectedRows === 0) {
  //     throw new Error("User not found or already deleted");
  //   }
  //   return result;
  // }


  //get paitient by id
  static async isPtientExist(id) {
    try {
      //if id is not valid
      if (!id || typeof id !== "number") {
        throw new Error("Invalid id");
      }
      //query to get user by id
      const [rows] = await db.query("SELECT*FROM Patients WHERE puid = ?", [id]);
      //if user not found
      if (rows.length === 0) {
       return false;
      }
      //if user found return user
      return true;
    } catch (error) {
      console.log(error);
      throw new Error("Get user by id faild");
    }
  }

  //get user with allergies
  static async getUserWithhistory(userId) {
    try {
      if (!userId || typeof userId !== "number") {
        throw new Error("Invalid user ID");
      }

      const [rows] = await db.query(
        "SELECT u.id, CONCAT(u.first_name, ' ', u.last_name) AS name, TIMESTAMPDIFF(YEAR, u.birthday, CURDATE()) AS age,p.history AS medical_records FROM users u JOIN Patients p ON u.id = p.puid WHERE u.role = 'patient' AND u.id = ?;",
        [userId]
      );

      if (rows.length === 0) {
        console.log("User not found", userId);
        throw new Error("User not found", userId);
      }

      return rows[0];
    } catch (error) {
      console.log(error);
      throw new Error("Get user with history failed");
    }
  }

  static async getUserForChat(userId) {
    try {
       if (!userId || typeof userId !== "number") {
        throw new Error("Invalid user ID");
      }

      const [rows] = await db.query(
        "SELECT u.id, CONCAT(u.first_name, ' ', u.last_name) AS name, TIMESTAMPDIFF(YEAR, u.birthday, CURDATE()) AS age FROM users u WHERE u.role = 'patient' AND u.id = ?;",
        [userId]
      );

      if (rows.length === 0) {
        console.log("User not found", userId);
        throw new Error("User not found", userId);
      }

      return rows[0];
    } catch (error) {
      console.log(error);
      throw new Error("Get user for chat failed");
    }
  }
}

export default User;
