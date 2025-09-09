import { FaFacebookF } from "react-icons/fa";
import { GrUserExpert } from "react-icons/gr";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import {Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";


// This is the login page 
// This is the login page 
export default function LoginPage() {
  const { setUser } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

  const handleLogin = async () => {
 // Prevent form submission from reloading the page
                //prevents the page from reloading 

    if (!email || !password) {
      toast.error("Please fill in all fields"); //validation for empty fields
      return;
    }
        //calling the API to login
    try {
      const res = await axios.post(         
        "http://localhost:3000/api/v1/users/user/login",
        { email, password },
        { withCredentials: true }
      );

      if (res.data.success) {

        setUser(res.data.user); // Set user in context
        toast.success("Login successful!");
        navigate("/");          
        // if (role = "admin"){
        //   navigate("/")
        // }  //Later
      } else {
        toast.error(res.data.message || "Login failed");
        setEmail(""); // Clear email and password on failure
        setPassword(""); // Clear password on failure
      }

     } catch (err) {
      const msg = err.response?.data?.message || "Login failed.Something went wrong";
      toast.error(msg);
    }
  };

  // Google and Facebook Login handlers
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/api/v1/users/auth/google";
  };

  const handleFacebookLogin = () => {
    window.location.href = "http://localhost:3000/api/v1/users/auth/facebook";
  };
    return (
        <div className="w-full h-screen flex flex-row bg-[url('/login.jpg')] bg-center bg-cover justify-center items-center">

            <div className="w-[60%] h-full  flex flex-col bg-accent/60 px-[50px] py-[30px]">
                <h1 className="w-[300px] h-[100px] font-bold font-[Bahnschrift] text-[35px] flex text-primary items-center "><MdOutlineHealthAndSafety size={50} />CEY HEALTH</h1>
                <div className="w-[720px] h-[200px]  flex flex-col my-[80px]">
                    <h1 className="w-[300px] h-[50px] font-semibold font-[Bahnschrift] text-[30px] text-primary">BORN IN CEYLON BORN FOR HEALTH</h1>
                    <p className="my-[50px] py-[20px] text-[14px]  text-primary  font-[Poppins]  ">Your smart health companion manage medical records, appointments, and reports all in one place.
                        Powered by AI, our Symptom Checker helps you understand your symptoms 
                        instantly and take the right steps toward care.Whether you're managing 
                        a chronic condition, keeping up with family checkups, or just exploring how you feel CeyHealth
                        brings smart, proactive care to your daily life.
                    </p>
                </div>
            </div>

            <div className="w-[40%] h-full bg-accent/60 flex flex-col shadow-lg justify-evenly items-center">
                <div className="w-[500px] h-[500px] bg-primary  backdrop-blur-md rounded-3xl absolute border border-tertiary flex flex-col justify-center items-center">
                    <div className="w-[350px] h-[70px] flex flex-row  ">
                        <GrUserExpert size={60} color="accent" />
                        <div className="w-[300px] h-[70px] flex flex-col ">
                            <span className="text-3xl   font-bold text-accent">WELCOME BACK</span> 
                            <p className=" text-[14px]  text-secondary font-bold ">Please enter your valid credentials to login</p>
                        </div>
                         
                        
                    </div>
                   
                    


                    <input type="text" onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" className="w-[350px] h-[40px] rounded-3xl px-[10px] text-[13px] border border-secondary my-[20px]  bg-blue-200" />
                    <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-[350px] h-[40px] rounded-3xl px-[10px] text-[15px] border border-secondary  bg-blue-200" />
                    <span className="cursor-row-resize relative left-[110px] text-tertiary font-bold  text-[13px] hover:underline  my-[20px]"><Link to="/">Back To Home</Link></span>
                    <button type="button" onClick={handleLogin} className="w-[80px] h-[35px] relative left-[120px] text-white cursor-pointer bg-tertiary rounded-3xl  hover:bg-accent text-[12px] font-bold text-center ">LOGIN</button>


                    <div className=" w-[300px] h-[60px] flex flex-row justify-center items-center   relative top-[50px]">
                       {/* <button onClick={handleFacebookLogin} className="w-[140px] h-[40px] hover:bg-accent mx-[10px] cursor-pointer bg-tertiary font-bold text-white rounded-3xl text-[13px] flex items-center justify-center gap-[2px]">Login with < FaFacebookF color="white" size={15}/> </button> */}
                        <button onClick={handleGoogleLogin} className="w-[200px] h-[40px] hover:bg-accent cursor-pointer bg-tertiary font-bold text-white rounded-3xl text-[13px] flex items-center  justify-center gap-[2px] ">Login with <FcGoogle size={20}/></button>
                    </div>
                    <div className=" w-[300px] h-[60px] flex flex-row justify-center items-center  relative top-[45px]">
                        <p className="text-[13px] font-bold  text-black">Don't have an account? <Link to="/signUp1" className="hover:underline text-tertiary ">Create Account</Link></p>
                    </div>
                    

                </div>
                 
                

            </div>

        </div>
    )
}