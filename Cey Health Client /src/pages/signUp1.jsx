
import {Route, Routes } from "react-router-dom";
import SignUpPage1Form from "./signUp1Form.jsx";
import OtpVerifyPage from "./otpverify.jsx";
import WhatsappVerifyPage from "./whatsappverify.jsx";
import GFWhatsappVerify from "./gfWhatsappverify.jsx";


// This is the starting point of the signUp page 
// It contains the routes for the signUp1Form, otpverify, whatsappverify and g&fWhatsappverify pages
// It renders the SignUpPage1Form component by default

export default function SignUpPage(){

    return(
        <div className="w-full h-screen bg-accent bg-cover bg-center flex justify-center items-center"> {/* full screen */}
            <div className="w-[50%] h-full flex flex-col justify-center items-center "> {/* inner div */}
                <Routes>
                <Route path='otpverify' element={<OtpVerifyPage/>}/>
                <Route path='whatsappverify' element={<WhatsappVerifyPage/>}/>
                <Route path='gfWhatsappverify' element={<GFWhatsappVerify/>}/>
                <Route index element={<SignUpPage1Form/>}/>
     
                </Routes>
               
            </div>
                
           
          

        </div>

    )
}