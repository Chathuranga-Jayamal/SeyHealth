import React from 'react'
import Title from './Title'
import assets from '../assets/assets'
import { motion } from "motion/react"
import telehealth from '../assets/telehealth.jpg';

const AboutUs = () => {

    const workData = [
      {
        title: 'AI-Powered Patient Monitoring',
        description: 'Monitor patient vitals in real-time with AI alerts for emergencies.',
        image: assets.work_dashboard_management
      },
      {
        title: 'Telehealth Platform Development',
        description: 'Connecting patients and doctors easily for healthcare anytime, anywhere.',
        image: telehealth
      },
      {
        title: 'Wellness App Campaigns',
        description: 'Promoting health and fitness apps to increase user engagement effectively.',
        image: assets.work_fitness_app
      },
    ]

  return (
    <motion.div 
    initial="hidden"
    whileInView="visible"
    viewport={{once: true}}
    transition={{staggerChildren: 0.2}}
    id='about-us' className='flex flex-col items-center gap-7 px-4 sm:px-12 lg:px-24 xl:px-40 pt-30 text-gray-700 dark:text-white'>
      <Title title='Our latest work' desc='From care strategy to patient solutions, we deliver digital tools that improve healthcare outcomes.'/>

      <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl'>
          {
            workData.map((work, index)=>(
              <motion.div 
              initial={{opacity: 0, y: 30}}
              whileInView={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: index * 0.2}}
              viewport={{once: true}}
              
              key={index} className='hover:scale-102 duration-500 transition-all cursor-pointer'>
                  <img src={work.image} className='w-full rounded-xl' alt="" />
                  <h3 className='mt-3 mb-2 text-lg font-semibold'>{work.title}</h3>
                  <p className='text-sm opacity-60 w-5/6'>{work.description}</p>
              </motion.div>
            ))
          }

      </div>

    </motion.div>
  )
}

export default AboutUs
