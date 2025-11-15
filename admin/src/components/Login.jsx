import React, { useState } from 'react';
import axios from 'axios'
import { motion } from 'framer-motion';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Login = ({setToken}) => {

   const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(backendUrl + '/api/user/admin',{email,password})
      if (response.data.success) {
        setToken(response.data.token)
      }
      else{
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
      }
  }
  return (
    <>
     <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans&family=Syne:wght@400..800&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    }}>
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 100,
          damping: 10,
          duration: 0.5
        }}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
          borderRadius: '16px',
          padding: '2.5rem 3rem',
          width: '380px',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '1.75rem',
            color: 'black',
            textAlign: 'center',
            letterSpacing: '-0.5px'
          }}>Admin Panel</h1>
          
          <form 
           onSubmit={onSubmitHandler}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ 
              marginBottom: '1.5rem',
              width: '100%',
              maxWidth: '320px'
            }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#4a5568',
                marginBottom: '0.5rem',
                transition: 'all 0.2s ease'
              }}>Email Address</label>
              <motion.div 
                whileHover={{ scale: 1.01 }}
                whileFocus={{ scale: 1.02 }}
                style={{ width: '100%' }}
              >
                <motion.input 
                   onChange={(e)=>setEmail(e.target.value)}
                   value={email}
                  whileFocus={{ 
                    borderColor: '#667eea',
                    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.2)'
                  }}
                  style={{
                    width: '88%',
                    padding: '0.875rem 1.25rem',
                    backgroundColor: 'rgba(247, 250, 252, 0.8)',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    outline: 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    fontSize: '0.9375rem',
                    color: '#2d3748'
                  }} 
                  type="email" 
                  placeholder='your@email.com' 
                  required 
                />
              </motion.div>
            </div>
            
            <div style={{ 
              marginBottom: '2rem',
              width: '100%',
              maxWidth: '320px'
            }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#4a5568',
                marginBottom: '0.5rem'
              }}>Password</label>
              <motion.div 
                whileHover={{ scale: 1.01 }}
                whileFocus={{ scale: 1.02 }}
                style={{ width: '100%' }}
              >
                <motion.input
                   onChange={(e)=>setPassword(e.target.value)}
                   value={password}
                  whileFocus={{ 
                    borderColor: '#667eea',
                    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.2)'
                  }}
                  style={{
                    width: '88%',
                    padding: '0.875rem 1.25rem',
                    backgroundColor: 'rgba(247, 250, 252, 0.8)',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    outline: 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    fontSize: '0.9375rem',
                    color: '#2d3748'
                  }} 
                  type="password" 
                  placeholder='Enter your password' 
                  required 
                />
              </motion.div>
            </div>
            
            <motion.button 
              whileHover={{ 
                scale: 1.02,
                background: 'black',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
              }}
              whileTap={{ 
                scale: 0.98,
                boxShadow: '0 2px 5px rgba(102, 126, 234, 0.3)'
              }}
              style={{
                width: '100%',
                maxWidth: '320px',
                background: 'black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                borderRadius: '10px',
                color: 'white',
                padding: '1rem 1.5rem',
                fontSize: '0.9375rem',
                fontWeight: '600',
                border: 'none',
                outline: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 10px rgba(102, 126, 234, 0.3)'
              }} 
              type='submit'
            > 
              Login 
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
    </>
  )
}

export default Login