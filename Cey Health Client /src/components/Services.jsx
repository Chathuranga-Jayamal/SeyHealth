import React from 'react'
import assets from '../assets/assets'
import Title from './Title'
import ServiceCard from './ServiceCard'
import { motion } from "motion/react"

const Services = () => {

    const servicesData = [
      {
        title: 'AI-Powered Symptom Checker',
        description: 'Get quick insights into your health conditions.',
        icon: assets.marketing_icon
      },
      {
        title: 'Instant Appointment Booking',
        description: 'Schedule consultations in real time with ease.',
        icon: assets.marketing_icon
      },
      {
        title: 'Teleconsultation Services',
        description: 'Connect with doctors online anytime, anywhere.',
        icon: assets.marketing_icon
      },
      {
        title: 'Secure Patient Records',
        description: 'Keep your medical history safe and confidential.',
        icon: assets.marketing_icon
      },
    ]

  return (
    <motion.div 
    initial="hidden"
    whileInView="visible"
    viewport={{once: true}}
    transition={{staggerChildren: 0.2}}
    id='services' className='relative flex flex-col items-center gap-7 px-4 sm:px-12 lg:px-24 xl:px-40 pt-30 text-gray-700 dark:text-white'>
      
      <img src={assets.bgImage2} alt="" className='absolute -top-110 -left-70 -z-1 dark:hidden'/>

      <Title title='How can we help?' desc='Delivering innovative digital healthcare solutions that enhance patient care and streamline medical services.'/>

      <div className='flex flex-col md:grid grid-cols-2'>
          {servicesData.map((service, index)=>(
             <ServiceCard key={index} service={service} index={index}/>
          ))}
      </div>

    </motion.div>
  )
}

export default Services
