import React from 'react'
import Hero from '../components/Hero'
import Service from '../components/Service'
import LatestCollection from '../components/LatestCollection'
import ServicesSection from '../components/ServicesSection'
import BestSeller from '../components/BestSeller'
import Instagram from '../components/Instagram'
import Text from '../components/Text'


const Home = () => {
  return (
    <div>
      <Hero />
      <Service />
      <LatestCollection />
      <Text />
      <BestSeller />
      <ServicesSection />
      <Instagram />
    </div>
  )
}

export default Home
