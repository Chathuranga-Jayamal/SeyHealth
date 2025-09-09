--database
CREATE DATABASE IF NOT EXISTS SeyHealth

--user table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL, 
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100),
  role ENUM('user', 'admin', 'doctor') DEFAULT 'user' NOT NULL,
  phone VARCHAR(15) NOT NULL,
  birthday DATE,
  street VARCHAR(255),
  city VARCHAR(100),
  postal_code VARCHAR(20),
  google_id VARCHAR(255) UNIQUE, 
  facebook_id VARCHAR(255) UNIQUE,
  status ENUM('active', 'inactive', 'pending', 'locked') DEFAULT 'pending' NOT NULL, 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
