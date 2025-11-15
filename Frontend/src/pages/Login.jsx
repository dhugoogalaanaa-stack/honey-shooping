import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Style constants with your brand colors
const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    fontFamily: 'DM Sans, sans-serif',
    borderRadius: '20px',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    backgroundColor: '#FFFFFF', // White background
  },
  mobileContainer: {
    flexDirection: 'column',
    padding: '1rem',
    background: 'none',
  },
  formContainer: {
    flex: 1,
    maxWidth: '450px',
    backgroundColor: '#FFFFFF', // White background
    borderRadius: '20px',
    padding: '2.5rem',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
    border: '1px solid #F5F5F5', // Soft Gray border
  },
  mobileFormContainer: {
    width: '100%',
    padding: '1.5rem 1rem',
  },
  input: {
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #F5F5F5', // Soft Gray border
    borderRadius: '0.5rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    backgroundColor: '#FFFFFF', // White background
    color: '#2C2C2C', // Charcoal text
  },
  inputError: {
    borderColor: '#ef4444',
  },
  button: {
    backgroundColor: '#1E3A5F', // Navy Blue
    border: 'none',
    padding: '0.75rem',
    fontSize: '1rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    color: '#FFFFFF', // White text
    fontWeight: '600',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  errorText: {
    color: '#ef4444',
    fontSize: '0.875rem',
    marginTop: '0.25rem',
  },
  successText: {
    color: '#4A5D23', // Olive Green for success
    fontSize: '0.875rem',
    marginTop: '0.25rem',
  },
  passwordRequirements: {
    marginTop: '0.5rem',
    fontSize: '0.75rem',
    color: '#2C2C2C', // Charcoal text
  },
  requirement: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.25rem',
  },
  requirementMet: {
    color: '#4A5D23', // Olive Green
  },
  requirementUnmet: {
    color: '#9ca3af',
  },
  checkmark: {
    marginRight: '0.5rem',
    fontSize: '0.875rem',
  },
};

const Login = () => {
  const [currentState, setCurrentState] = useState('Log In'); // Default to Login
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { token, setToken, backendUrl, setCartItems } = useContext(ShopContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',
    resetPassword: '',
    resetConfirmPassword: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [userId, setUserId] = useState(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  // Forgot password states
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  
  // Reset password states
  const [resetToken, setResetToken] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);

  // Terms and Privacy Policy states
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  // Check for reset token in URL
  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    
    if (token && email) {
      setResetToken(token);
      setResetEmail(decodeURIComponent(email));
      setShowResetPassword(true);
      setShowForgotPassword(false);
      setCurrentState('Log In');
    }
  }, [searchParams]);

  // Validate email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Validate password strength with all requirements
  const validatePassword = (password) => {
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const hasMinLength = password.length >= 8;
    
    return {
      hasLowercase,
      hasUppercase,
      hasNumber,
      hasSymbol,
      hasMinLength,
      isValid: hasLowercase && hasUppercase && hasNumber && hasSymbol && hasMinLength
    };
  };

  // Get password requirements status
  const getPasswordRequirements = (password) => {
    const validation = validatePassword(password);
    return [
      { text: 'A lowercase letter', met: validation.hasLowercase },
      { text: 'A capital (uppercase) letter', met: validation.hasUppercase },
      { text: 'A number', met: validation.hasNumber },
      { text: 'A symbol', met: validation.hasSymbol },
      { text: 'Minimum 8 characters', met: validation.hasMinLength }
    ];
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (showResetPassword) {
      if (!formData.resetPassword) {
        newErrors.resetPassword = 'Password is required';
      } else {
        const passwordValidation = validatePassword(formData.resetPassword);
        if (!passwordValidation.isValid) {
          newErrors.resetPassword = 'Password does not meet requirements';
        }
      }
      
      if (formData.resetPassword !== formData.resetConfirmPassword) {
        newErrors.resetConfirmPassword = 'Passwords do not match';
      }
    } 
    else if (requiresVerification) {
      if (!formData.verificationCode) {
        newErrors.verificationCode = 'Verification code is required';
      }
    }
    else if (currentState === 'Sign Up') {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      
      // Check password strength for sign up
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = 'Password does not meet requirements';
      }
    }
    
    if (!requiresVerification && !showResetPassword && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!requiresVerification && !showResetPassword && !formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Cooldown timer for resend verification code
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      if (showResetPassword) {
        // Reset password with token
        const response = await axios.post(`${backendUrl}/api/user/reset-password`, {
          token: resetToken,
          email: resetEmail,
          newPassword: formData.resetPassword
        });
        
        if (response.data.success) {
          setResetPasswordSuccess(true);
          setTimeout(() => {
            setShowResetPassword(false);
            setResetPasswordSuccess(false);
            setFormData(prev => ({
              ...prev,
              resetPassword: '',
              resetConfirmPassword: ''
            }));
            // Clear URL parameters
            navigate('/login', { replace: true });
          }, 2000);
        }
      }
      else if (requiresVerification) {
        // Verify email with code
        const response = await axios.post(`${backendUrl}/api/user/verify-email`, {
          userId: userId,
          code: formData.verificationCode
        });
        
        if (response.data.success) {
          const authToken = response.data.token;
          setToken(authToken);
          localStorage.setItem('token', authToken);
          
          // Clear any existing cart data for the new user
          setCartItems({});
          localStorage.removeItem('guest_cart');
          
          navigate('/');
        }
      } else {
        // Regular sign up or login
        const endpoint = currentState === 'Sign Up' 
          ? '/api/user/register' 
          : '/api/user/login';
        
        const payload = currentState === 'Sign Up'
          ? { name: formData.name, email: formData.email, password: formData.password }
          : { email: formData.email, password: formData.password };
        
        const response = await axios.post(`${backendUrl}${endpoint}`, payload);
        
        if (response.data.success) {
          if (response.data.requiresVerification) {
            // Show verification input
            setRequiresVerification(true);
            setUserId(response.data.userId);
            setVerificationSent(true);
          } else {
            // Direct login (for existing users)
            const authToken = response.data.token;
            setToken(authToken);
            localStorage.setItem('token', authToken);
            
            // Clear any existing cart data for the new user
            setCartItems({});
            localStorage.removeItem('guest_cart');
            
            navigate('/');
          }
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: 'An error occurred. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationCode = async () => {
    if (resendCooldown > 0) return;
    
    try {
      setResendCooldown(60); // 60 seconds cooldown
      const response = await axios.post(`${backendUrl}/api/user/resend-verification`, {
        email: formData.email
      });
      
      if (response.data.success) {
        setVerificationSent(true);
        setErrors({});
      }
    } catch (error) {
      console.error('Resend error:', error);
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: 'Failed to resend verification code.' });
      }
    }
  };

  // Forgot password handler
  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail || !validateEmail(forgotPasswordEmail)) {
      setErrors({ general: 'Please enter a valid email address' });
      return;
    }

    setForgotPasswordLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/user/forgot-password`, {
        email: forgotPasswordEmail
      });
      
      if (response.data.success) {
        setForgotPasswordSent(true);
        setErrors({});
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: 'Failed to send reset email. Please try again.' });
      }
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    if (token) navigate('/');
  }, [token, navigate]);

  // Responsive design handler
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const buttonHover = {
    scale: 1.02,
    boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
    transition: { duration: 0.2 }
  };

  const buttonTap = {
    scale: 0.98
  };

  const passwordRequirements = getPasswordRequirements(
    showResetPassword ? formData.resetPassword : formData.password
  );

  // Terms and Privacy Policy content
  const termsContent = (
    <div>
      <h3 style={{ color: '#1E3A5F', marginBottom: '1rem' }}>Terms of Service</h3>
      <p style={{ marginBottom: '1rem', color: '#2C2C2C' }}>
        Welcome to ShopNest! By creating an account, you agree to the following terms:
      </p>
      <ol style={{ paddingLeft: '1.5rem', marginBottom: '1rem', color: '#2C2C2C' }}>
        <li>You must be at least 13 years old to use our service</li>
        <li>You are responsible for maintaining the security of your account</li>
        <li>You agree not to use our service for any illegal purposes</li>
        <li>We reserve the right to terminate accounts that violate these terms</li>
        <li>All purchases are subject to our return and refund policies</li>
      </ol>
      <p style={{ color: '#2C2C2C' }}>
        These terms may be updated from time to time. Continued use of our service constitutes acceptance of any changes.
      </p>
    </div>
  );

  const privacyContent = (
    <div>
      <h3 style={{ color: '#1E3A5F', marginBottom: '1rem' }}>Privacy Policy</h3>
      <p style={{ marginBottom: '1rem', color: '#2C2C2C' }}>
        At ShopNest, we value your privacy. Here's how we handle your information:
      </p>
      <ol style={{ paddingLeft: '1.5rem', marginBottom: '1rem', color: '#2C2C2C' }}>
        <li>We collect only necessary information to provide our services</li>
        <li>Your personal data is encrypted and stored securely</li>
        <li>We do not sell your personal information to third parties</li>
        <li>We use cookies to enhance your shopping experience</li>
        <li>You can request deletion of your data at any time</li>
      </ol>
      <p style={{ color: '#2C2C2C' }}>
        For more details about our data practices, please contact our support team.
      </p>
    </div>
  );

  // Modal component
  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          style={{
            backgroundColor: '#FFFFFF',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto',
            border: '1px solid #F5F5F5',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#2C2C2C', margin: 0 }}>{title}</h3>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#2C2C2C'
              }}
            >
              ×
            </button>
          </div>
          {children}
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <button
              onClick={onClose}
              style={{
                backgroundColor: '#1E3A5F',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1.5rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        ...styles.container,
        ...(isMobile && styles.mobileContainer),
        backgroundImage: isMobile 
          ? 'none' 
          : 'url("https://i.pinimg.com/736x/35/0f/02/350f02458ebc0e43023ae5217bdc2a7d.jpg")',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        style={{
          ...styles.formContainer,
          ...(isMobile && styles.mobileFormContainer),
        }}
      >
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            color: '#2C2C2C', // Charcoal text
            fontWeight: 700,
            fontSize: '1.8rem',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}
        >
          {showResetPassword ? 'Reset Password' : 
           requiresVerification ? 'Verify Email' : 
           currentState === 'Sign Up' ? 'Create account' : 'Welcome back'}
        </motion.h2>

        {errors.general && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{
              ...styles.errorText,
              backgroundColor: '#fee2e2',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
            }}
          >
            {errors.general}
          </motion.div>
        )}

        {resetPasswordSuccess && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{
              ...styles.successText,
              backgroundColor: '#d1fae5',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
            }}
          >
            Password reset successfully! Redirecting to login...
          </motion.div>
        )}

        {verificationSent && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{
              color: '#4A5D23', // Olive Green
              backgroundColor: '#d1fae5',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
              fontSize: '0.875rem',
            }}
          >
            Verification code sent to your email. Check your inbox.
          </motion.div>
        )}

        <motion.form
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={onSubmitHandler}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {showResetPassword ? (
            <>
              <motion.div variants={itemVariants}>
                <p style={{ marginBottom: '1rem', color: '#2C2C2C' }}> {/* Charcoal text */}
                  Set a new password for {resetEmail}
                </p>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="resetPassword"
                    placeholder="New Password"
                    value={formData.resetPassword}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      ...(errors.resetPassword && styles.inputError),
                      paddingRight: '2.5rem',
                    }}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#2C2C2C', // Charcoal text
                    }}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.resetPassword && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    style={styles.errorText}
                  >
                    {errors.resetPassword}
                  </motion.p>
                )}
                
                {/* Password requirements */}
                {formData.resetPassword && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    style={styles.passwordRequirements}
                  >
                    {passwordRequirements.map((req, index) => (
                      <div key={index} style={styles.requirement}>
                        <span 
                          style={{
                            ...styles.checkmark,
                            ...(req.met ? styles.requirementMet : styles.requirementUnmet)
                          }}
                        >
                          {req.met ? '✓' : '•'}
                        </span>
                        <span style={req.met ? styles.requirementMet : styles.requirementUnmet}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="resetConfirmPassword"
                  placeholder="Confirm New Password"
                  value={formData.resetConfirmPassword}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    ...(errors.resetConfirmPassword && styles.inputError),
                  }}
                  disabled={isLoading}
                />
                {errors.resetConfirmPassword && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    style={styles.errorText}
                  >
                    {errors.resetConfirmPassword}
                  </motion.p>
                )}
              </motion.div>
            </>
          ) : requiresVerification ? (
            <motion.div variants={itemVariants}>
              <p style={{ marginBottom: '1rem', color: '#2C2C2C' }}> {/* Charcoal text */}
                Enter the verification code sent to {formData.email}
              </p>
              <input
                type="text"
                name="verificationCode"
                placeholder="Verification code"
                value={formData.verificationCode}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  ...(errors.verificationCode && styles.inputError),
                }}
                disabled={isLoading}
              />
              {errors.verificationCode && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={styles.errorText}
                  >
                  {errors.verificationCode}
                </motion.p>
              )}
              
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#2C2C2C' }}> {/* Charcoal text */}
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={resendVerificationCode}
                  disabled={resendCooldown > 0}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: resendCooldown > 0 ? '#9ca3af' : '#4A5D23', // Olive Green
                    cursor: resendCooldown > 0 ? 'default' : 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                </button>
              </p>
            </motion.div>
          ) : (
            <>
              {currentState === 'Sign Up' && (
                <motion.div variants={itemVariants}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      ...(errors.name && styles.inputError),
                    }}
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      style={styles.errorText}
                    >
                      {errors.name}
                    </motion.p>
                  )}
                </motion.div>
              )}

              <motion.div variants={itemVariants}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    ...(errors.email && styles.inputError),
                  }}
                  disabled={isLoading}
                />
                {errors.email && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    style={styles.errorText}
                  >
                    {errors.email}
                  </motion.p>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <div style={{ position: 'relative' }}>
                  <input
                       type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      ...(errors.password && styles.inputError),
                      paddingRight: '2.5rem',
                    }}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#2C2C2C', // Charcoal text
                    }}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.password && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    style={styles.errorText}
                  >
                    {errors.password}
                  </motion.p>
                )}
                
                {/* Password requirements */}
                {currentState === 'Sign Up' && formData.password && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    style={styles.passwordRequirements}
                  >
                    {passwordRequirements.map((req, index) => (
                      <div key={index} style={styles.requirement}>
                        <span 
                          style={{
                            ...styles.checkmark,
                            ...(req.met ? styles.requirementMet : styles.requirementUnmet)
                          }}
                        >
                          {req.met ? '✓' : '•'}
                        </span>
                        <span style={req.met ? styles.requirementMet : styles.requirementUnmet}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </motion.div>

              {currentState === 'Sign Up' && (
                <motion.div variants={itemVariants}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      ...(errors.confirmPassword && styles.inputError),
                    }}
                    disabled={isLoading}
                  />
                  {errors.confirmPassword && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      style={styles.errorText}
                    >
                      {errors.confirmPassword}
                    </motion.p>
                  )}
                </motion.div>
              )}
            </>
          )}

          <motion.button
            variants={itemVariants}
            style={{
              ...styles.button,
              ...(isLoading && styles.buttonDisabled),
            }}
            whileHover={!isLoading ? buttonHover : {}}
            whileTap={!isLoading ? buttonTap : {}}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{
                  display: 'inline-block',
                  width: '20px',
                  height: '20px',
                  border: '2px solid white',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                }}
              />
            ) : (
              showResetPassword ? 'Reset Password' : 
              requiresVerification ? 'Verify Email' : 
              currentState === 'Sign Up' ? 'Create account' : 'Sign in'
            )}
          </motion.button>
        </motion.form>

        {/* Show Forgot Password link only in Login state and not in reset password mode */}
        {currentState === 'Log In' && !showForgotPassword && !showResetPassword && !requiresVerification && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              marginTop: '0.5rem',
              textAlign: 'center',
              fontSize: '0.9rem',
              color: '#2C2C2C', // Charcoal text
            }}
          >
            <motion.span 
              onClick={() => setShowForgotPassword(true)}
              style={{ 
                color: '#4A5D23', // Olive Green
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Forgot your password?
            </motion.span>
          </motion.p>
        )}

        {!requiresVerification && !showResetPassword && (
          <>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{
                fontSize: '0.8rem',
                color: '#2C2C2C', // Charcoal text
                textAlign: 'center',
                lineHeight: '1.4',
                marginTop: '1.5rem',
              }}
            >
              By creating an account you agree to our{' '}
              <motion.span 
                whileHover={{ color: '#4A5D23' }} // Olive Green
                style={{ 
                  color: '#1E3A5F', // Navy Blue
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
                onClick={() => setShowTerms(true)}
              >
                Terms
              </motion.span>{' '}
              and{' '}
              <motion.span 
                whileHover={{ color: '#4A5D23' }} // Olive Green
                style={{ 
                  color: '#1E3A5F', // Navy Blue
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
                onClick={() => setShowPrivacy(true)}
              >
                Privacy Policy
              </motion.span>.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              style={{
                marginTop: '1rem',
                textAlign: 'center',
                fontSize: '0.9rem',
                color: '#2C2C2C', // Charcoal text
              }}
            >
              <AnimatePresence mode="wait">
                {currentState === 'Sign Up' ? (
                  <motion.span
                    key="login-prompt"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Have an account?{' '}
                    <motion.span 
                      onClick={() => {
                        setCurrentState('Log In');
                        setErrors({});
                        setFormData(prev => ({
                          ...prev,
                          name: '',
                          confirmPassword: '',
                        }));
                      }} 
                      style={{ 
                        color: '#4A5D23', // Olive Green
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Log in
                    </motion.span>
                  </motion.span>
                ) : (
                  <motion.span
                    key="signup-prompt"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Don't have an account?{' '}
                    <motion.span 
                      onClick={() => {
                        setCurrentState('Sign Up');
                        setErrors({});
                      }} 
                      style={{ 
                        color: '#4A5D23', // Olive Green
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Sign up
                    </motion.span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.p>
          </>
        )}

        {/* Forgot Password Modal */}
        <AnimatePresence>
          {showForgotPassword && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '1rem',
              }}
              onClick={() => setShowForgotPassword(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                style={{
                  backgroundColor: '#FFFFFF', // White background
                  padding: '2rem',
                  borderRadius: '12px',
                  maxWidth: '400px',
                  width: '100%',
                  border: '1px solid #F5F5F5', // Soft Gray border
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 style={{ marginBottom: '1rem', textAlign: 'center', color: '#2C2C2C' }}> {/* Charcoal text */}
                  Reset Password
                </h3>
                
                {forgotPasswordSent ? (
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#4A5D23', marginBottom: '1rem' }}> {/* Olive Green */}
                      If the email exists, a reset link has been sent
                    </p>
                    <button
                      onClick={() => {
                        setShowForgotPassword(false);
                        setForgotPasswordSent(false);
                      }}
                      style={{
                        backgroundColor: '#4A5D23', // Olive Green
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                      }}
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <>
                    <p style={{ marginBottom: '1rem', color: '#2C2C2C' }}> {/* Charcoal text */}
                      Enter your email address and we'll send you a link to reset your password.
                    </p>
                    <input
                      type="email"
                      placeholder="Email address"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      style={{
                        ...styles.input,
                        marginBottom: '1rem',
                      }}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => setShowForgotPassword(false)}
                        style={{
                          flex: 1,
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          padding: '0.75rem',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleForgotPassword}
                        disabled={forgotPasswordLoading}
                        style={{
                          flex: 1,
                          ...styles.button,
                          ...(forgotPasswordLoading && styles.buttonDisabled),
                        }}
                      >
                        {forgotPasswordLoading ? 'Sending...' : 'Send Reset Link'}
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Terms of Service Modal */}
        <Modal
          isOpen={showTerms}
          onClose={() => setShowTerms(false)}
          title="Terms of Service"
        >
          {termsContent}
        </Modal>

        {/* Privacy Policy Modal */}
        <Modal
          isOpen={showPrivacy}
          onClose={() => setShowPrivacy(false)}
          title="Privacy Policy"
        >
          {privacyContent}
        </Modal>
      </motion.div>
    </motion.div>
  );
};

export default Login;