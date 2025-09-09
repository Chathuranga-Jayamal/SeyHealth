import axios from "axios";                         
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import OTPInput from "react-otp-input";
import { Link, useLocation, useNavigate } from "react-router-dom";

//This is the otp verification page
export default function OtpVerifyPage(){
    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState("");
    const [timeLeft, setTimeLeft] = useState(60);
    const [isResendDisabled, setIsResendDisabled] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();
    // On mount: get email and send initial OTP
    useEffect(() => {
        const emailFromState = location.state?.email;
        if (!emailFromState) {
        toast.error("Email not found. Please register again.");
        navigate("/signUp1");
        return;
        }
        setEmail(emailFromState);
        handleVerify()
    }, []);

     // Countdown timer effect
    useEffect(() => {
        let timer;
        if (isResendDisabled && timeLeft > 0) {
        timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        } else if (timeLeft <= 0) {
        setIsResendDisabled(false);
        setTimeLeft(60); // Reset for next resend
        }
        return () => clearInterval(timer);
    }, [isResendDisabled, timeLeft]);

    //Send OTP API call (Not defined yet)
//     const sendOtp = async () => {
//     try {
//     const response = await axios.post(
//       "http://localhost:3000/api/v1/users/auth/email/otp/resend",
//       {},
//       { withCredentials: true }
//     );

//     if (response.data.success) {
//       toast.success(response.data.message || "OTP resent successfully!");
//       setIsResendDisabled(true);
//       setTimeLeft(60);
//     } else {
//       toast.error(response.data.message || "Failed to resend OTP.");
//     }
//     } catch (error) {
//     const msg =error.response?.data?.message ||error.message ||"Error resending OTP.";
//     console.error("Resend OTP error:", error);
//     toast.error(msg);
//   }
// };

    /*Verification of the otp*/
    const handleVerify = async () => {
        const trimmedOtp = otp.trim();
        
       
        try {
        const response = await axios.post(
            "http://localhost:3000/api/v1/users/auth/email/verify",
            { otp: trimmedOtp },
            { withCredentials: true }
        );

        if (response.data.success) {
            toast.success("Email verified successfully!");
            navigate("/signUp2");
        } else {
            toast.error(response.data.message ||"OTP verification failed.");
        }
        } catch (error) {
        const msg = error.response?.data?.message || error.message || "Invalid OTP verification.";
        console.error("Verification error:", error);
      
        
        }
    };
    // Resend OTP handler
   
    return(
         <div className="w-[88%] h-[98%] rounded-3xl border bg-primary  border-tertiary flex flex-col items-center justify-center my-[30px]">
           
            <h1 className="w-[500px] h-[90px] text-accent text-[50px]  text-center font-bold font-[Tahoma]">Verify Your Email</h1>
            <p className=" text-secondary  font-semibold px-[15px] text-[14px] my-[5px] ">We have sent a verification code to your email address</p>


            <input type="text" disabled value={email} className="w-[60%] h-[40px] text-center bg-blue-50 rounded-xl border border-secondary  mx-[5px] my-[5px] px-[10px] text-[14px] font-semibold" />   
            <p className=" text-secondary font-semibold text-[15px]  my-[15px] ">Enter 6-digit verification code</p> 


            
            {/*OTP verification code here */}    
            <div className="w-[80%] h-[60px] flex mx-[5px] my-[2px] py-[25px] gap-[10px] justify-evenly items-center">
              <OTPInput value={otp} onChange={setOtp} numInputs={6} isInputNum shouldAutoFocus renderInput={(props) => 
              (<input {...props} type="tel" inputMode="numeric" className="w-[40px] h-[40px] text-center mx-[10px] text-black text-[30px] leading-[10px] bg-blue-50 rounded-lg border border-secondary focus:border-blue-500 font-[Calibri] "/>)}
                />
        
            </div>      
          

            <div className="w-[88%] h-[40%] rounded-xl items-center justify-evenly   font-[Comic Sans]  flex flex-col"> {/* buttons */}
                <button onClick={handleVerify} className="w-[70%] h-[40px] cursor-pointer bg-tertiary font-semibold border border-secondary  rounded-2xl text-white text-[16px] hover:bg-accent  ">Verify Email</button>
                <p className=" text-secondary font-semibold  text-[15px]">----------------------------------------------------------------------------------</p>
                <p className=" text-secondary font-semibold  text-[15px]">Didn't receive the code?</p>
                {/*<button onClick={sendOtp} disabled={isResendDisabled} className=" cursor-pointer  font-[Calibri]  text-blue-200 hover:underline  ">Resend Code</button>*/}
                
                {/*Timer */}
                {isResendDisabled &&(
                     <p className=" text-accent font-bold text-[14px]">Resend available in {timeLeft} seconds</p>
                )}          
               
                <Link to="/login " className="hover:underline text-tertiary font-semibold text-[14px]">Back To Login</Link>
                          
            </div>
                        
        </div>
    )
}