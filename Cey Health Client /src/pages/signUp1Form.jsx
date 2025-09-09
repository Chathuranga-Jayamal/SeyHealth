import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import {Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// This is the index element of the SignUp1 page which contains email, confirm password and password fields
// It also contains the Google and Facebook sign up buttons
// It validates the form inputs and handles the registration process
// If registration is successful, it navigates to the OTP verification page with the email in state
export default function SignUpPage1Form(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const validateForm =()=>{
        
        if(!email || !password || !confirmPassword){
            toast.error("Please fill in all fields");
            return false;
        }
        
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailPattern.test(email)){
            toast.error("Please enter a valid email address");
            return false;
        }

        if(password !== confirmPassword){
            toast.error("Passwords do not match");
            return false;
        }
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if(!passwordPattern.test(password)){
            toast.error("Password must be at least 8 characters with uppercase, lowercase, number, and special character");
            return false;
        }

        return true;
    };

   const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.post( "http://localhost:3000/api/v1/users/auth/register", {
        email,
        password,
      },{withCredentials :true});

      if (response.data.success) {
        toast.success(response.data.message ||"Registration successful!");
        setEmail("");  //reset email ,password and confirmpassword when registration is successful
        setPassword("");
        setConfirmPassword("");
        navigate("/signUp1/otpverify", { state: { email } });
      } else {
        toast.error(response.data.message ||"Registration failed.");
      }
    } catch (error) {
      const msg =error.response?.data?.message ||error.message ||"Something went wrong during registration";
      console.error("Registration failed:", error);
      toast.error(msg);
    }
  };

  const handleGoogleSignUp = () =>{
    window.location.href = "http://localhost:3000/api/v1/users/auth/google";
  }

  const handleFacebookSignUp = () =>{
    window.location.href = "http://localhost:3000/api/v1/users/auth/facebook";
  }

    return(

        <div className="w-[88%] h-[98%] rounded-3xl border  bg-primary border-tertiary flex flex-col items-center justify-center my-[10px]">
            <h1 className="w-[500px] h-[80px] text-accent text-[50px]  text-center font-semibold font-[Tahoma]">Create an Account</h1>
            <p className=" text-secondary text-primary font-semibold text-[15px] px-[10px] my-[5px] ">Join us today and get started on your health journey</p>
                    
            <div className="w-[88%] h-[40%]   justify-center items-center mx-[10px]  text-[15px] flex flex-col"> {/* text boxes */}
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="w-[88%] h-[40px]  bg-white/50 rounded-xl border border-secondary mx-[5px] my-[15px] px-[10px] " />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-[88%] h-[40px]  bg-white/50 rounded-xl  border border-secondary mx-[5px] my-[15px] px-[10px] " />
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className="w-[88%] h-[40px]  bg-white/50 rounded-xl  border border-secondary mx-[5px] my-[15px] px-[10px] " />
                       
            </div>


            <div className="w-[88%] h-[30%] rounded-xl items-center justify-evenly   flex flex-col"> {/* buttons */}
                <button onClick={handleRegister} className="w-[35%] h-[35px] cursor-pointer bg-tertiary font-semibold  rounded-lg text-[15px] text-white hover:bg-accent ">Create Account</button>
                <p className=" text-secondary  font-semibold text-[14px]">---------------------------or Continue with----------------------------</p>
                          
                          
                <div className="w-[100%] h-[50px] flex mx-[5px] my-[5px]   justify-center item-center">
                    <button onClick={handleGoogleSignUp} className="w-[40%] h-[40px] font-semibold cursor-pointer bg-tertiary  rounded-2xl text-[14px] text-white flex gap-[2px] hover:bg-accent justify-center items-center "><FcGoogle size={20} />Google</button>
                    {/* <button onClick={handleFacebookSignUp} className="w-[40%] h-[40px] font-semibold cursor-pointer bg-tertiary rounded-2xl text-[14px] text-white flex gap-[2px] justify-center hover:bg-accent items-center "><FaFacebook size={20}/>Facebook</button> */}

                </div>
                <p className=" text-secondary px-[15px] font-semibold text-[13px] my-[2px] ">Already have an account? <button className="hover:underline text-tertiary"><Link to="/login">Sign In here</Link></button></p>
                          
            </div>
                        
        </div>
    )
}