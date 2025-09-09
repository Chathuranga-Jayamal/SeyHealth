// pages/AuthCallback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import axios from "axios";

export default function AuthCallback() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/users/user/me", {
          withCredentials: true,
        });
        const user = res.data.user;
        setUser(user);
        navigate("/profile"); // or dashboard based on role
      } catch (err) {
        console.error("Error fetching user after redirect", err);
        navigate("/login");
      }
    };

    fetchUser();
  }, []);

  return <div>Logging you in...</div>;
}
