import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoMdArrowForward } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";

// This is the form page for the second step of user registration after otp verification
// It collects user details like first name, last name, phone number, birthday, street, city, and postal code
// It validates the inputs and submits the data to the backend API
export default function SignUpPage2(){
     const initialFormData = {
        first_name:"",
        last_name:"",
        phone:"",
        birthday:"",
        street:"",
        city:"",
        postal_code:"",
    };
   
    /*Use of hooks*/
    const [formData, setFormData] = useState(initialFormData);
    const navigate = useNavigate();
    /*Use of default values for user*/
    const status ="active";
    const role = "patient";

    /*Handle change of input fields*/
  const handleChange = (e) =>{
    const{name,value} = e.target;
    setFormData((prevData)=>({
        ...prevData,
        [name]:value
    }))
  }
    /*Validation of the form*/
  const validateForm = ()=>{
    const{first_name, last_name,phone,birthday,street,city,postal_code} = formData;
    if(!first_name.trim()|| !last_name.trim() || !phone.trim() || !birthday || !street.trim() || !city.trim() || !postal_code.trim()){
        toast.error("All the fields must be filled out.");
        return false;
    }
    const phoneRegex = /^\+94\d{9}$/;
    if(!phoneRegex.test(phone)){
        toast.error("Phone number must start with +94 and be 9 digits long.");
        return false;
    }
    return true;

  };
    /*Handle submission of the form*/
  const handleSubmit = async()=>{
    if(!validateForm()) return;
    const userData = {
        ...formData,
        status,
        role,
    }
    try{
        const response = await axios.post("http://localhost:3000/api/v1/users/auth/form",{userData},{withCredentials:true});
        const {success,message} = response.data;
        if(success){
            toast.success(message||"Registration successful! Please verify your phone number.");
            setFormData(initialFormData); // Clear form
            navigate("/signUp1/whatsappverify", { state: { phone: formData.phone } });
        }else {
      toast.error(message || "Form submission failed.");
        }
    } catch (error) {
        const msg = error.response?.data?.message ||  // Prefer backend-provided message
        error.message ||                 // Fallback to general axios error
        "An unexpected error occurred while submitting the form.";
        console.error("Form submission error:", error);
        toast.error(msg);
    }
    };
    return(
        <div className="w-full h-screen bg-blue-900  flex justify-center items-center"> {/* full screen */}
            
            < div className="w-[80%] h-full flex mx-[20px] flex-col justify-center items-center">  {/* left screen */}
                <div className=" w-[98%] h-[88%] flex flex-col items-center bg-[url('/profileReg.jpg')] object-cover bg-center bg-cover rounded-3xl ">
                    <div className="w-full h-[50px]   flex flex-row justify-between">
                        <h1 className="w-[300px] h-[100px] font-bold font-[Bahnschrift] text-[20px] flex text-tertiary my-[15px] mx-[12px] ">CEY HEALTH</h1>
               
                    </div>
                </div>
            </div>

            <div className="w-[50%] h-full flex flex-col justify-center items-center "> {/* right screen */}

                <div className="w-[88%] h-[88%] rounded-3xl border border-white bg-primary flex flex-col items-center justify-center my-[30px]">
                    <h1 className="w-[500px] h-[70px] text-tertiary text-[35px] p-[10px] text-center font-bold font-[Tahoma]">Profile Information</h1>
                    <p className=" text-secondary font-semibold px-[10px] text-[14px] my-[5px] ">Provide your details to complete setup</p>
                    
                    <div className="w-[88%] h-[60%] txt-[14px]  rounded-xl justify-center items-center mx-[10px] my-[20px]   flex flex-col"> {/* text boxes */}

                        <div className="w-[88%] h-[40px] flex mx-[5px] my-[15px]  justify-between items-center">
                            <input type="text" value={formData.first_name} name="first_name" onChange={handleChange} placeholder="First Name" className="w-[49%] h-[40px]  bg-white/50 rounded-xl   txt-[14px]  px-[10px] border border-secondary" />
                            <input type="text" value={formData.last_name} name="last_name" onChange ={handleChange} placeholder="Last Name" className="w-[49%] h-[40px]  bg-white/50 rounded-xl   txt-[14px]  px-[10px] border border-secondary" />
                        </div>

                        <input type="text" value={formData.phone} name="phone" onChange={handleChange} placeholder="+1234567890" className="w-[88%] h-[40px]  bg-white/50 rounded-xl   mx-[5px] my-[15px] px-[10px] border border-accent" />
                        <input type="date" value={formData.birthday} name="birthday" onChange={handleChange} max={new Date().toISOString().split("T")[0]} placeholder="Birthday" className="w-[88%] h-[40px] text-black/60  bg-white/50 rounded-xl   mx-[5px] my-[5px] px-[10px] border border-secondary" />

                        

                        <input type="text" value={formData.street} name="street" onChange={handleChange} placeholder="123 Main Street" className="w-[88%] h-[40px]  bg-white/50 rounded-xl   mx-[5px] my-[15px] px-[10px] border border-secondary" />
                       

                        <div className="w-[88%] h-[40px] flex mx-[5px] my-[15px]  justify-between items-center">
                            <input type="text" value={formData.city} name="city" onChange={handleChange} placeholder="City" className="w-[49%] h-[40px]  bg-white/50 rounded-xl     px-[10px] border border-secondary " />
                            <input type="text" value={formData.postal_code} name="postal_code" onChange={handleChange}placeholder="Postal Code" className="w-[49%] h-[40px]  bg-white/50 rounded-xl     px-[10px] border border-secondary" />
                        </div>

                    </div>
                     <div className="w-[88%] h-[30%] rounded-md items-center justify-between   font-[Comic Sans] flex flex-col"> {/* buttons */}
                          <button onClick ={handleSubmit}className="w-[88%] h-[45px] bg-tertiary text-white font-semibold  rounded-2xl  text-[15px] hover:bg-accent  ">Create Account</button>          
                     </div>
                   
                    
                    
                   
                </div> 
                 
           
              
               
            </div>


         

            
        </div>

    );
}