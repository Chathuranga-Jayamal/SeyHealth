import React, { useState } from 'react'
import assets from '../assets/assets'
import ThemeToggleBtn from './ThemeToggleBtn'
import { motion } from "motion/react"
import logoCey from '../assets/logoCey.png';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HashLink } from 'react-router-hash-link';
import { User } from 'lucide-react';

const Navbar = ({theme, setTheme}) => {
    const navigate = useNavigate();
    const {user,logout} = useAuth();
    const role = user?.role;
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const handleLogout =() =>{
        logout();
        toast.success("Logged out successfully");
        navigate("/login");
    }

  return (
    <motion.div 
    initial={{opacity: 0, y: -50}}
    animate={{opacity: 1, y: 0}}
    transition={{duration: 0.6, ease: 'easeOut'}}
    className= 'flex justify-between items-center px-4 sm:px-12 lg:px-24 xl:px-40 py-4 sticky top-0 z-20 backdrop-blur-xl font-medium bg-white/50 dark:bg-gray-900/70'>
    
        <img src={logoCey} className='w-32 sm:w-40' alt='CeyHealth Logo' />

        <div className={`text-gray-700 dark:text-white sm:text-sm ${!sidebarOpen ? 'max-sm:w-0 overflow-hidden' : 'max-sm:w-60 max-sm:pl-10'} max-sm:fixed top-0 bottom-0 right-0 max-sm:min-h-screen max-sm:h-full max-sm:flex-col max-sm:bg-tertiary max-sm:text-white max-sm:pt-20 flex sm:items-center gap-5 transition-all`}>

            <img src={assets.close_icon} alt="" className='w-5 absolute right-4 top-4 sm:hidden' onClick={()=> setSidebarOpen(false)}/>

            <HashLink onClick={()=>setSidebarOpen(false)} smooth to="/#" className='sm:hover:border-b'>Home</HashLink>
            <HashLink onClick={()=>setSidebarOpen(false)} smooth to="/#services" className='sm:hover:border-b'>Services</HashLink>
            <HashLink onClick={()=>setSidebarOpen(false)} smooth to="/#about-us" className='sm:hover:border-b'>About Us</HashLink>
            <HashLink onClick={()=>setSidebarOpen(false)} smooth to="/#contact-us" className='sm:hover:border-b'>Contact Us</HashLink>
            
            
            {/* Patient-only */}
            {role === "patient" && (
            <>
            <Link to="/booking" className='sm:hover:border-b'>Booking</Link>
            <Link to="/bookedDashboard" className='sm:hover:border-b'>Appointments</Link>
            <Link to="/chat" className='sm:hover:border-b'>Chat</Link>
          
            </>
            )}

            {role === "doctor" && (
                <>
                <Link to="/dashboard" className='sm:hover:border-b'>Dashboard</Link>
           
                </>
            )}

        </div>

        <div className='flex items-center gap-2 sm:gap-4'>

            <ThemeToggleBtn theme={theme} setTheme={setTheme}/>

            <img src={theme === 'dark' ? assets.menu_icon_dark : assets.menu_icon} alt="" onClick={()=> setSidebarOpen(true)} className='w-8 sm:hidden'/>

            {user ? (
                <>
                  <button onClick={handleLogout} className='text-sm max-sm:hidden flex items-center gap-2 bg-tertiary text-white px-6 py-2 rounded-full cursor-pointer hover:scale-103 transition-all' >
                Logout <img src={assets.arrow_icon} width={14} alt="" />
            </button>
               
            </>
            ) : (
                 
                <Link to="/login" className='text-sm max-sm:hidden flex items-center gap-2 bg-tertiary text-white px-6 py-2 rounded-full cursor-pointer hover:scale-103 transition-all' >
                Login <img src={assets.arrow_icon} width={14} alt="" />
            </Link>
                
            )}

           
             
        {(role === "patient" || role === "doctor") &&(
                <>
                <Link to="/profile" className='max-sm:hidden p-2 rounded-full bg-white border  dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all hover:scale-105'>
                <User size={20} className='text-gray-700 dark:text-white' />
            </Link>
            </>
                
            )}

            
            
            
        </div>
         

    </motion.div>
  )
}

export default Navbar
