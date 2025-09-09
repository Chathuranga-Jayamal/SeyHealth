
import OTPInput from "react-otp-input";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import {useNavigate } from "react-router-dom";
// This is the Google and Facebook WhatsApp verification page
export default function GFWhatsappVerify() {
  const [phone, setPhone] = useState("");
  const [whatsappOtp, setWhatsappOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const timerRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (window.location.hash === '#_=_') {
      // Remove the hash without reloading the page
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [])

  // Start the timer for OTP resend

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
 // Send OTP to WhatsApp
  const sendOtpToPhone = async () => {
    if (!/^\+94\d{9}$/.test(phone)) {
      toast.error("Enter a valid Sri Lankan phone number starting with +94");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/users/auth/whatsapp/phone",
        { phone },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("OTP sent via WhatsApp!");
        startResendTimer();
      } else {
        toast.error(res.data.message || "Failed to send OTP.");
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      console.error("OTP send error:", error);
      toast.error(msg);
    }
  };
  // Handle WhatsApp OTP verification

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
          toast.success("Phone verified and session started!");
          navigate("/login");
        // const sessionRes = await axios.get(
        //   "http://localhost:3000/api/v1/users/user/start-long-session",
        //   {
        //     params: { userId },
        //     withCredentials: true,
        //   }
        // );

        // if (sessionRes.data.success) {
        
        // } else {
        //   toast.error(sessionRes.data.message || "Session setup failed.");
        // }
      } else {
        toast.error(message || "OTP verification failed.");
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      console.error("Verification error:", error);
      toast.error(msg);
    }
  };

  return (
    <div className="w-[88%]  h-[98%] bg-primary rounded-3xl  border border-tertiary flex flex-col items-center justify-evenly my-[20px]">
      <h1 className="text-accent text-[35px] font-bold font-[Tahoma] text-center">Google Facebook Verification</h1>
      <p className="text-secondary text-[15px] font-bold ">Add your number to secure your account</p>

      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+94 123 456 789"
        className="w-[60%] h-[40px] text-center bg-blue-100 border rounded-xl  "
      />

      <button
        onClick={sendOtpToPhone}
        disabled={isResendDisabled}
        className="w-[70%] h-[40px] bg-tertiary font-bold text-primary rounded-2xl text-[14px] hover:bg-accent my-[10px]"
      >
        Send WhatsApp Code
      </button>

      {isResendDisabled && (
        <p className="text-accent  font-bold text-[18px]">
          Resend available in {timeLeft} seconds
        </p>
      )}

      <p className="text-secondary font-semibold text-[15px]">Enter 6-digit verification code</p>

      <div className="w-[80%] h-[60px]  flex gap-[11px] justify-evenly items-center py-[20px]">
        <OTPInput
          value={whatsappOtp}
          onChange={setWhatsappOtp}
          numInputs={6}
          isInputNum
          shouldAutoFocus
          inputStyle={{
          width: "30px",
          height: "40px",
          margin: "0 5px", 
          textAlign: "center",
          fontSize: "30px",
          borderRadius: "6px",
          }}
          renderInput={(props) => (
            <input
              {...props}
              type="tel"
              inputMode="numeric"
              className="w-[90px] h-[40px] text-center text-black text-[30px]  bg-blue-100 rounded-md border  focus:border-blue-500 font-[Calibri]"
            />
          )}
        />
      </div>

      <button
        onClick={handleVerify}
        className="w-[70%] h-[40px] bg-tertiary font-semibold rounded-2xl text-primary text-[14px] hover:bg-accent"
      >
        Verify Phone Number
      </button>
    </div>
  );
}
