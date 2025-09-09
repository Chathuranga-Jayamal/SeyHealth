import express from "express";
import passport from "../config/passport.js";
import { UserSessionMiddleware } from "../middleware/sessionMiddleware.js";
import AuthController from "../controllers/authController.js";
import UserController from "../controllers/userController.js";
import validateInput from "../middleware/validateInput.js";

const router = express.Router();

router.use(UserSessionMiddleware);
router.use(passport.initialize());
router.use(passport.session());

//Authentication Routes
router.post(
  "/login",
  validateInput(["email", "password"]),
  AuthController.loginController
);
//calling the session id and role 
router.get("/me", (req,res) => {
 
  if (!req.headers["userid"]) {
    return res.status(401).json({ success:false, message:"Not authenticated" });
  }
res.status(200).json({
    success:true,
    user:{
      id: req.headers["userid"],
      email: req.headers["email"],
      role: req.headers["role"]
    }
    
  })
  
});

router.post("/logout", (req, res) => {
  // Clear the JWT cookie
  res.cookie("accessToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0), // immediately expire the cookie
    path: "/login",             // make sure the path matches the cookie path used on login
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// User Profile Routes
router.get("/profile", UserController.getProfile);
router.put("/profile", UserController.updateProfile);
router.post("/change-password", UserController.changePassword);
router.post("/timeslot", UserController.createTimeslot);
// router.post("/logout", UserController.logout);

// Doctor model routes
router.post("/add-doctor", UserController.addNewDoctor);
router.get("/doctors", UserController.getDoctorsForAI);
router.get("/get-patient-exist", UserController.getPatient);
router.get("/user-without-history", UserController.getUserWithOutHistoryController);
router.get("/history-info", UserController.getUserWithHistoryController);
export default router;
