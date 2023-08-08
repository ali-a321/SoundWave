import React from 'react'
import logo from '../images/soundwaveIcon.svg'

function Header() {
  return (
    <div>
     
      <div className='titleHeader'>  
        <img src={logo} className='titleLogo'/>
        SoundWave 
      </div>
      
    </div>
  )
}

export default Header