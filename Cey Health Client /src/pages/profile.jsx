import { useAuth } from "../context/authContext";
import axios from "axios";
import toast from "react-hot-toast";
import { replace, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


const API_BASE_URL = "http://localhost:3000/api/v1/users/user";
export default function Profile() {
  
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [originalProfile, setOriginalProfile] = useState(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profile, setProfile] = useState({
    fname: "",
    lname: "",
    phone: "",
    email: "",
    birthday: "",
    street: "",
    city: "",
    postalCode: "",
    role: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Fetch profile data when the component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/profile`, {
          withCredentials: true,
        });
        if (response.data.success) {
          // Format the birthDate to YYYY-MM-DD for the date input
          const formattedData = {
            ...response.data.data,
            birthday: response.data.data.birthday ? new Date(response.data.data.birthday).toISOString().split('T')[0] : ''
          };
          setProfile(formattedData);
          setOriginalProfile(formattedData);
        } else {
          toast.error("Failed to fetch profile data.");
        }
      } catch (error) {
        console.error("Fetch profile error:", error);
        toast.error("An error occurred while fetching your profile.");
      }
    };

    fetchProfile();
  }, []);

  const handleCancelPasswordChange = () => {
  setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
  setIsChangingPassword(false);
};

  const handlePasswordChange = (e) => {
  const { name, value } = e.target;
  setPasswordData((prev) => ({ ...prev, [name]: value }));
};

// Handler for input changes in the main profile form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };


    // Toggles the profile editing mode
 const handleEditToggle = () => {
      if (isEditing) {
    // Revert to original profile data when canceling
    setProfile(originalProfile);
  }
      if (isChangingPassword) setIsChangingPassword(false); // Close password form if open
      setIsEditing((prev) => !prev);
  };

  // Toggles the password change form visibility
  const toggleChangePassword = () => {
      if (isEditing) {
        setProfile(originalProfile); // Revert profile data when switching to password mode
        setIsEditing(false);
       } // Close profile edit mode if open
      setIsChangingPassword(prev => !prev);
  };


  
  // Handles saving the updated profile data
 const handleSave = async () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+94\d{9}$/;

  if (!emailRegex.test(profile.email)) {
    toast.error("Please enter a valid email address (e.g., example@domain.com).");
    return;
  }

  if (!phoneRegex.test(profile.phone)) {
    toast.error("Phone number must start with +94 followed by exactly 9 digits (e.g., +94123456789).");
    return;
  }

  try {
    const response = await axios.put(`${API_BASE_URL}/profile`, profile, {
      withCredentials: true,
    });
    if (response.data.success) {
      toast.success("Profile updated successfully!");
      setOriginalProfile(profile); // Update original profile after successful save
      setIsEditing(false);
    } else {
      toast.error(response.data.message || "Failed to update profile.");
    }
  } catch (error) {
    console.error("Update profile error:", error);
    toast.error("An error occurred while updating your profile.");
  }
};

   // Handles submitting the new password
  const handleSubmitNewPassword = async (e) => {
    e.preventDefault();
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error("New passwords do not match!");
        return;
    }
    if (!passwordData.oldPassword || !passwordData.newPassword) {
        toast.error("Please fill in all password fields.");
        return;
    }
    if (!passwordPattern.test(passwordData.newPassword)) {
      toast.error("New password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&).");
      return;
    }
    try {
    const response = await axios.post(`${API_BASE_URL}/change-password`, {
    oldPassword: passwordData.oldPassword,
    newPassword: passwordData.newPassword
  }, { withCredentials: true });

  if (response.data.success) {
    toast.success("Password changed successfully!");
    setIsChangingPassword(false);
    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
  } else {
    toast.error(response.data.message || "Failed to change password.");
  }
  } catch (error) {
  console.error("Change password error:", error);
  const errorMessage = error.response?.data?.message || error.message || "An error occurred.";
  toast.error(errorMessage);
  }
  };

  

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/v1/users/user/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      toast.success("Logged out successfully");
    navigate("/login", {replace: true});
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="w-full min-h-screen bg-primary bg-cover bg-center backdrop-blur-2xl text-white">
   

    <div className="w-full flex flex-col lg:flex-row justify-center items-stretch gap-8 p-8">
    {/* Left Section – Avatar */}
      <div className="flex-1 max-w-lg bg-white/60 backdrop-blur-md rounded-3xl p-6 flex flex-col items-center shadow-xl justify-between">

        {/* Avatar at the top half */}
        <div className="flex justify-center items-center w-full" style={{ height: "70%" }}>
          <img
          src="Profile.jpg"
          alt="User Avatar"
          className="w-90 h-90 object-cover border-4 border-white rounded-xl shadow-lg"
        />
      </div>

    {/* Bottom section with role + button */}
    <div className="flex flex-col items-center space-y-4 pb-4">
      <h2 className=" text-lg text-accent font-['Poppins']  px-3 py-1 font-semibold "> Welcome {profile.role}</h2>
      <button
      onClick={handleEditToggle}
      className="px-5 py-2 bg-tertiary text-white text-sm rounded-lg hover:bg-blue-700 transition"
      >
      {isEditing ? "Cancel" : "Update"}
    </button>
    </div>
    </div>

        {/* Right Section – Form */}
        <div className="w-[90%] lg:w-2/3 bg-white/60 backdrop-blur-md rounded-3xl shadow-xl p-6">
          <h3 className="text-2xl font-bold text-accent mb-6 text-center">
            User Profile
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="First Name" name="fname" value={profile.fname} disabled={!isEditing} onChange={handleChange} />
            <InputField label="Last Name" name="lname" value={profile.lname} disabled={!isEditing} onChange={handleChange} />
            <InputField label="Phone" name="phone" value={profile.phone} disabled={!isEditing} onChange={handleChange} />
            <InputField label="Street" name="street" value={profile.street} disabled={!isEditing} onChange={handleChange} />
            <InputField label="City" name="city" value={profile.city} disabled={!isEditing} onChange={handleChange} />
            <InputField label="Postal Code" name="postalCode" value={profile.postalCode} disabled={!isEditing} onChange={handleChange} />
            <InputField label="Email" name="email" type="email" value={profile.email} disabled={!isEditing} onChange={handleChange} />
            <InputField label="Birth Date" name="birthday" type="date" value={profile.birthday || ''} disabled={!isEditing} onChange={handleChange} />
          </div>

          <div className="flex justify-center gap-6 mt-8">
            <button
              onClick={handleEditToggle}
              className="px-7 py-2 bg-green-600 text-white text-[15px] rounded-xl hover:bg-green-700 transition"
            >
              {isEditing ? "Cancel " : "Update Profile"}
            
            </button>
            {isEditing && (
              <button
                onClick={handleSave}
                className="px-7 py-2 bg-green-600 text-white text-[15px] rounded-xl hover:bg-green-700 transition"
              >
                Save Changes
              </button>
            )}
            <button
              onClick={toggleChangePassword}
              className="px-5 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition"
            >
              {isChangingPassword ? 'Cancel' : 'Change Password'}
            </button>
            <button
              onClick={handleLogout}
              className="px-7 py-2 bg-red-600 text-white text-[15px] rounded-xl hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
            {/* Change Password Section - Conditionally Rendered */}
        {isChangingPassword && (
          <div className="w-full max-w-4xl bg-white/60 backdrop-blur-md rounded-3xl shadow-xl p-6 mt-4">
            <h3 className="text-2xl font-bold text-accent mb-6 text-center">
              Change Your Password
            </h3>
            <form onSubmit={handleSubmitNewPassword} className="space-y-4 max-w-md mx-auto">
                <InputField label="Current Password" name="oldPassword" type="password" value={passwordData.oldPassword} onChange={handlePasswordChange} />
                <InputField label="New Password" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} />
                <InputField label="Confirm New Password" name="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange} />
                <div className="flex justify-center pt-4 gap-4">
                    <button type="submit" className="px-7 py-2 bg-green-600 text-white text-[15px] rounded-xl hover:bg-green-700 transition">
                        Submit New Password
                    </button>
                     <button type="button"
                    onClick={handleCancelPasswordChange}
                    className="px-7 py-2 bg-red-600 text-white text-[15px] rounded-xl hover:bg-red-700 transition">
                    Cancel
                    </button>
                </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable input component
function InputField({ label, name, value, onChange, type = "text", disabled = false }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-black mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value || ''}
        onChange={onChange}
        disabled={disabled}
        className={`px-4 py-2 text-[15px] rounded-lg border ${
          disabled ? "border-gray-400 bg-gray-200 cursor-not-allowed" : "border-black bg-white"
        } text-black focus:outline-none focus:ring-2 focus:ring-blue-500`}
        required={!disabled && type !== 'password'} // Make fields required when editing
      />
    </div>
  );
}