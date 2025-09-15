import { useState } from 'react'
import './App.css'
import Navbar from './Main/Navbar/Navbar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Components/HomeComponenta/Home'
import About from './Components/About/About'
import Footer from './Main/Footer/Footer'
import Service from './Components/ServiceComponents/Service'

function App() {
  const [city, setCity] = useState("")
  const [weather, setWeather] = useState(null)

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={
            <Home 
              city={city} 
              setCity={setCity} 
              weather={weather} 
              setWeather={setWeather} 
            />
          } />
          <Route path='/about' element={<About />} />
          <Route path='/service/:city' element={
            <Service 
              city={city} 
              weather={weather} 
            />
          } />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
