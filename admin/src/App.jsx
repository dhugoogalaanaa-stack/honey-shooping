import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route, Navigate } from 'react-router-dom' // Add Navigate
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './components/Login';
import Dashboard from './pages/Dashboard'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = 'ETB'


const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');

  useEffect(() => {
    localStorage.setItem('token', token)
  }, [token])

  return (
    <div>
      <ToastContainer />
      {token === ""
        ? <Login setToken={setToken} />
        :
        <>
          <Navbar setToken={setToken} />
          <div style={{
            display: 'flex',
            width: '100%',
          }}
          >
            <Sidebar />
            <div style={{
              width: '80%',
              marginLeft: 'max(5vw, 25px)', // custom left margin
              marginRight: 'auto',           // mx-auto means left & right auto, but overridden by ml-[max(5vw,25px)]
              marginTop: '2rem',             // my-8 = 2rem top & bottom
              marginBottom: '2rem',
              color: '#4B5563',              // text-gray-600 hex color
              fontSize: '1rem',              // text-base = 1rem
              lineHeight: 1.5,               // typical line height for text-base
            }}>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} /> {/* Redirect root to Add */}
                <Route path='/dashboard' element={<Dashboard token={token}/>} />
                <Route path='/add' element={<Add token={token}/>} />
                <Route path='/list' element={<List token={token}/>} />
                <Route path='/orders' element={<Orders token={token}/>} />
              </Routes>
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default App