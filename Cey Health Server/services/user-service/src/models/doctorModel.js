import db from "../config/db.js";

//validations
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+94\d{9}$/;

class Doctor {
  async getAllDoctorsForAI() {
    try {
      const [rows] = await db.query(
        "SELECT users.first_name, users.last_name, Doctors.spec, Doctors.qualification_title, Doctors.qualification_institute FROM users JOIN Doctors ON users.id = Doctors.duid WHERE users.role = 'doctor';"
      );
      return rows;
    } catch (error) {
      console.log(error);
      throw new Error("Error getting users:", error);
    }
  }

  async addDoctor(doctor) {
    try {
      const {
        first_name,
        last_name,
        email,
        password,
        phone,
        birthday,
        street,
        city,
        postal_code,
        price,
        spec,
        qualification_title,
        qualification_institute,
      } = doctor;

      if (
        !first_name ||
        !last_name ||
        !email ||
        !password ||
        !phone ||
        !birthday ||
        !street ||
        !city ||
        !postal_code ||
        !price ||
        !spec ||
        !qualification_title ||
        !qualification_institute
      ) {
        console.log(doctor);
        throw new Error("Missing required fields");
      }

      if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
      }

      if (!phoneRegex.test(phone)) {
        throw new Error("Invalid phone number format");
      }

      // Check if email already exists
      const [existing] = await db.execute(
        "SELECT id FROM users WHERE email = ?",
        [email]
      );
      if (existing.length > 0) {
        throw new Error("Email already exists");
      }

      // Insert into users table
      const [userResult] = await db.execute(
        `INSERT INTO users 
        (email, password_hash, first_name, last_name, role, phone, birthday, street, city, postal_code, status) 
       VALUES (?, ?, ?, ?, 'doctor', ?, ?, ?, ?, ?, 'active')`,
        [
          email,
          password,
          first_name,
          last_name,
          phone,
          birthday,
          street,
          city,
          postal_code,
        ]
      );

      if (userResult.affectedRows === 0) {
        console.log("Failed to add user");
        throw new Error("Failed to add user");
      }

      const userId = userResult.insertId;

      // Insert into Doctors table
      await db.execute(
        `INSERT INTO Doctors (duid,price, spec, qualification_title, qualification_institute) 
       VALUES (?, ?, ?, ?, ?)`,
        [userId, price, spec, qualification_title, qualification_institute]
      );

      if (userResult.affectedRows === 0) {
        await db.execute(`DELETE FROM users WHERE id = ?`, [userId]);
        console.log("Failed to add doctor");
        throw new Error("Failed to add doctor");
      }

      return { success: true, message: "Doctor added successfully" };
    } catch (err) {
      console.error("Error adding doctor:", err);
      return { success: false, message: err.message };
    }
  }
}

export default Doctor;
