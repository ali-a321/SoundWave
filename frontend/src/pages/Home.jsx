import React from 'react'
import { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import DownloadForm from '../components/DownloadForm';

function Home() {

  return (
    <div className='page'>
    <Header/> 
    <DownloadForm/> 
   
   </div>
  )
}

export default Home