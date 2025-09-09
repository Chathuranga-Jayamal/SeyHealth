import axios from "axios";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import OTPInput from "react-otp-input"
import { Link, useLocation, useNavigate } from "react-router-dom"



//This is the WhatsApp verification page that is used after the user has entered the phone no in the form
// It sends an OTP to the user's WhatsApp number and verifies it
// If the OTP is correct, it starts a long session for the user and navigates to the homepage
// If the OTP is incorrect, it shows an error message
export default function WhatsappVerifyPage(){

    const [whatsappOtp, setWhatsappOtp] = useState("");
    const [phone, setPhone] = useState("");
    const [timeLeft, setTimeLeft] = useState(60);
    const [isResendDisabled, setIsResendDisabled] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();
    const timerRef = useRef(null);

   // This useEffect will now handle the navigation
  // It runs whenever the 'user' object from the context changes.
  // The user object is now populated, meaning the login was successful and state is updated.
  // Now it's safe to navigate.
  // We use a small timeout here purely for UX, to allow the user to read the toast.
  // The core logic is sound even with a 0ms delay because this effect is
  // *caused* by the state update, not racing against it.
  
  
  useEffect(() => {
    const phoneFromState = location.state?.phone;
    if (phoneFromState) {
      setPhone(phoneFromState);
    } else {
      toast.error("Phone number not found. Please register again.");
      navigate("/signUp2");
      
    }

    startResendTimer();

    return () => clearInterval(timerRef.current);  // Cleanup on unmount
  }, [location.state, navigate]);

    // Timer logic
  const startResendTimer = () => {
    setIsResendDisabled(true);
    setTimeLeft(60);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };


   // WhatsApp OTP Verification
  const handleVerify = async () => {
    const trimmedOtp = whatsappOtp.trim();
    if (!/^\d{6}$/.test(trimmedOtp)) {
      toast.error("Please enter the complete 6-digit code from WhatsApp.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/users/auth/whatsapp/verify",
        { otp: trimmedOtp },
        { withCredentials: true }
      );

      const { success, message, userId } = res.data;

      if (success) {
        toast.success("WhatsApp verification successful!");
        navigate("/login");
        // Start long session
        // const sessionRes = await axios.get(
        //   "http://localhost:3000/api/v1/users/user/start-long-session",
        //   {
        //     params: { userId },
        //     withCredentials: true,
        //   }
        // );

        // if (sessionRes.data.success) {
        //   setUser(sessionRes.data.user); // Set user in context
        //   toast.success("WhatsApp verification successful! Redirecting...");
        //   navigate("/login");
          
        // } else {
        //   const msg = sessionRes.data.message ||"Session setup failed.";
        //   toast.error(msg);
        // }
      } else {
        toast.error(message || "OTP verification failed.");
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message ||  // "Something went wrong during verification.";

      console.error("Verification error:", error);
      toast.error(msg);
    }
  };
  // useEffect(() => {
  //   if (user) {
  //     toast.success("Verification successful! Redirecting...");
  //     const redirectTimer = setTimeout(() => {
  //       navigate("/");
  //     }, 800);
  //     // Cleanup the timer if the component unmounts before navigation
  //     return () => clearTimeout(redirectTimer);
  //   }
  // }, [user, navigate]); // Dependency array ensures this runs only when user or navigate changes
  
  


    return(

         <div className="w-[88%] h-[98%] rounded-3xl  backdrop-blur-md bg-primary border border-tertiary flex flex-col items-center justify-center my-[20px]">
            <h1 className="w-[500px] h-[80px] text-accent text-[40px] p-[10px]   text-center font-bold font-[Tahoma]">Whatsapp Verification</h1>
            <p className=" text-secondary font-semibold text-[14px] px-[15px] my-[2px] ">We have sent a verification code to your whatsapp number</p>


            <input type="text" disabled value={phone} placeholder="+94 123 456 789" className="w-[60%] h-[40px] text-center bg-blue-100 text-[15px] font-semibold rounded-xl   mx-[5px] my-[5px]  border border-secondary" />   
            <p className=" font-semibold text-secondary my-[15px] text-[15px]">Enter 6-digit verification code</p> 


            
            {/*OTP verification code here */}    
            <div className="w-[80%] h-[60px] flex mx-[5px] my-[2px] py-[25px] gap-[10px] justify-evenly items-center">
              <OTPInput value={whatsappOtp} onChange={setWhatsappOtp} numInputs={6} isInputNum shouldAutoFocus renderInput={(props) => 
              (<input {...props} type="tel" inputMode="numeric" className="w-[40px] h-[40px] text-center mx-[10px] text-black text-[30px] leading-[40px] bg-blue-100 rounded-md border border-secondary focus:border-blue-500 font-[Calibri] "/>)}
                />
        
            </div>      
          

            

            <div className="w-[88%] h-[40%] rounded-xl items-center justify-evenly   flex flex-col"> {/* buttons */}
                <button  onClick={handleVerify} className="w-[70%] h-[40px] text-primary cursor-pointer bg-tertiary font-semibold  rounded-2xl text-[13px] hover:bg-accent  ">Verify Phone Number</button>
                <p className=" text-secondary font-bold text-[15px]">----------------------------------------------------------------------------------</p>

                {isResendDisabled && (          
                <p className=" text-accent font-bold text-[14px]">Resend available in {timeLeft} seconds</p>)}
               
                          
            </div>
                        
        </div>
    )
}