import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Register from './components/Register'
import Login from './components/Login'
import Profile from './components/Profile'


const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/profile" element={<Profile/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App