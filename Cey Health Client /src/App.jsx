import React, { useEffect, useRef, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Trustedby from './components/Trustedby'
import Services from './components/Services'
import AboutUs from './components/AboutUs'
import Teams from './components/Teams'
import ContactUs from './components/ContactUs'
import {Toaster} from 'react-hot-toast'
import Footer from './components/Footer'
import { Route, Router, Routes, useLocation } from 'react-router-dom'
import LoginPage from './pages/login'
import SignUpPage2 from './pages/signUp2'
import SignUpPage from './pages/signUp1'
import ProtectedRoute from './components/ProtectedRoute'
import Booking from './pages/booking'
import Chat from './pages/chat'
import Profile from './pages/profile'
import DoctorDashboard from './pages/doctorDashboard'
import BookingDashboard from './pages/bookingDashboard'
import AuthCallback from './pages/authCallback'



const App = () => {

  const [theme, setTheme] = useState(localStorage.getItem('theme') ? localStorage.getItem('theme') : 'light')

  const dotRef = useRef(null)
  const outlineRef = useRef(null)

    const location = useLocation(); // ⬅️ Get current route
    const hiddenNavbarRoutes = ['/login', '/signUp1', '/signUp2'];
    const shouldShowNavbar = !hiddenNavbarRoutes.some(route=> location.pathname.startsWith(route));
    //Remove the nav bar for the routes that start with the /login, /signUp1 and /signUp2


  // Refs for custom cursor Position tracking
  const mouse = useRef({x: 0, y: 0})
  const position = useRef({x: 0, y: 0})

  useEffect(()=>{
    const handleMouseMove = (e)=>{
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }

    document.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
        position.current.x += (mouse.current.x - position.current.x) * 0.1
        position.current.y += (mouse.current.y - position.current.y) * 0.1

        if(dotRef.current && outlineRef.current){
          dotRef.current.style.transform = `translate3d(${mouse.current.x - 6}px, ${mouse.current.y - 6}px, 0)`
          outlineRef.current.style.transform = `translate3d(${position.current.x - 20}px, ${position.current.y - 20}px, 0)`
        }

        requestAnimationFrame(animate)
    }

    animate()

    return ()=>{
      document.removeEventListener('mousemove', handleMouseMove)
    }

  },[])

  return (
    <div className='dark:bg-black relative'>

      <Toaster />

      {shouldShowNavbar && <Navbar theme={theme} setTheme={setTheme} />} {/* 
       Conditional Navbar */}

      <Routes>
        <Route path='/' element ={
          <>
          <Hero />
          <Trustedby />
          <Services />
          <AboutUs />
          <Teams />
          <ContactUs />
          <Footer theme={theme} />
          </>
        }>
        </Route>
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/signUp2" element={<SignUpPage2 />} />
        <Route path="/signUp1/*" element={<SignUpPage/>} />
        <Route path="/auth/callBack" element={<AuthCallback/>}/>
        

        <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
          <Route path="/booking" element={<Booking />} />
          <Route path='/bookedDashboard' element={<BookingDashboard/>}/>
          <Route path="/chat" element={<Chat/>} />
    
        </Route>

        <Route element = {<ProtectedRoute allowedRoles={['doctor']}/>}>
        <Route path='/dashboard' element ={<DoctorDashboard/>}/>
        </Route>
        
        <Route element = {<ProtectedRoute allowedRoles={['doctor','patient']}/>}>
        <Route path='/profile' element={<Profile/>}/>
        </Route>

        </Routes>
        
  
    {/* Custom Cursor Ring */}
    <div ref={outlineRef} className='fixed top-0 left-0 h-10 w-10 rounded-full border border-blue-950 pointer-events-none z-[9999]' style={{transition: 'transform 0.1s ease-out'}}></div>

    {/* Custom Cursor Dot */}
    <div ref={dotRef} className='fixed top-0 left-0 h-3 w-3 rounded-full bg-blue-700 pointer-events-none z-[9999]'></div>
    
    </div>
    
  )
}

export default App

