import { createContext, useEffect, useState, useCallback, useMemo } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = "ETB";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [previousToken, setPreviousToken] = useState('');

  // Helper function to normalize cart data structure
  const normalizeCartData = useCallback((cartData) => {
    if (!cartData || typeof cartData !== 'object') {
      return {};
    }
    
    const normalized = {};
    
    for (const itemId in cartData) {
      if (cartData.hasOwnProperty(itemId)) {
        const itemSizes = cartData[itemId];
        
        if (itemSizes && typeof itemSizes === 'object') {
          normalized[itemId] = {};
          
          for (const size in itemSizes) {
            if (itemSizes.hasOwnProperty(size)) {
              const quantity = parseInt(itemSizes[size]);
              if (!isNaN(quantity) && quantity > 0) {
                normalized[itemId][size] = quantity;
              }
            }
          }
          
          // Remove empty items
          if (Object.keys(normalized[itemId]).length === 0) {
            delete normalized[itemId];
          }
        }
      }
    }
    
    return normalized;
  }, []);

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: backendUrl,
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'token': token
      }
    });

    instance.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          setToken('');
          setUser(null);
          setCartItems({});
          localStorage.removeItem('token');
          localStorage.removeItem('guest_cart');
        }
        return Promise.reject(error);
      }
    );
    
    return instance;
  }, [token, backendUrl]);

  const persistCart = useCallback((cartData) => {
    try {
      const normalized = normalizeCartData(cartData);
      localStorage.setItem('guest_cart', JSON.stringify(normalized));
    } catch (error) {
      console.error("Failed to persist cart:", error);
    }
  }, [normalizeCartData]);

  const loadPersistedCart = useCallback(() => {
    try {
      const guestCart = localStorage.getItem('guest_cart');
      if (guestCart) {
        return JSON.parse(guestCart);
      }
      return {};
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return {};
    }
  }, []);

  const clearCart = useCallback(async () => {
    const emptyCart = {};
    setCartItems(emptyCart);
    persistCart(emptyCart);
    
    if (token) {
      try {
        await api.delete('/api/cart');
      } catch (error) {
        console.error("Failed to clear server cart:", error);
      }
    }
  }, [token, api, persistCart]);

  const cartCalculations = useMemo(() => {
    let count = 0;
    let amount = 0;
    
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        const qty = cartItems[itemId][size];
        const product = products.find(p => p._id === itemId);
        count += qty;
        if (product) amount += product.price * qty;
      }
    }
    
    return {
      cartCount: count,
      cartAmount: amount,
      cartSubtotal: amount,
      cartTotal: amount + delivery_fee
    };
  }, [cartItems, products, delivery_fee]);

  const getProductsData = useCallback(async () => {
    try {
      const response = await api.get('/api/product/list');
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error("Failed to load products:", error);
    }
  }, [api]);

  const getCartData = useCallback(async () => {
    try {
      setIsCartLoading(true);
      
      if (token) {
        try {
          const response = await api.get('/api/cart');
          if (response.data.success) {
            const normalizedCart = normalizeCartData(response.data.cartData);
            setCartItems(normalizedCart);
            persistCart(normalizedCart);
            return;
          }
        } catch (error) {
          console.error("Server cart error:", error);
          // Continue to load local cart as fallback
        }
      }
      
      // Load from local storage for guests or if server fails
      const localCart = loadPersistedCart();
      const normalizedLocalCart = normalizeCartData(localCart);
      setCartItems(normalizedLocalCart);
      
    } catch (error) {
      console.error("Error loading cart:", error);
      setCartItems({});
    } finally {
      setIsCartLoading(false);
    }
  }, [token, api, loadPersistedCart, persistCart, normalizeCartData]);

  // Function to sync cart with server
  const syncCartWithServer = useCallback(async (cartData) => {
    if (!token) return { success: false };
    
    try {
      // Convert cart data to the format expected by the server
      const updates = [];
      for (const itemId in cartData) {
        for (const size in cartData[itemId]) {
          updates.push({
            itemId,
            size,
            quantity: cartData[itemId][size]
          });
        }
      }
      
      const response = await api.put('/api/cart', { updates });
      return response.data;
    } catch (error) {
      console.error("Cart sync error:", error);
      throw error;
    }
  }, [token, api]);

  const removeFromCart = useCallback(async (itemId, size) => {
  try {
    // Create a direct update without using the complex updateCart function
    const newCart = { ...cartItems };
    
    if (newCart[itemId] && newCart[itemId][size]) {
      // Remove the specific size
      delete newCart[itemId][size];
      
      // If no sizes left for this item, remove the entire item
      if (Object.keys(newCart[itemId]).length === 0) {
        delete newCart[itemId];
      }
      
      // Update state immediately
      setCartItems(newCart);
      
      // Persist to localStorage for guests
      if (!token) {
        persistCart(newCart);
      } else {
        // Sync with server for logged-in users using the new DELETE endpoint
        try {
          await api.delete(`/api/cart/item/${itemId}?size=${encodeURIComponent(size)}`);
        } catch (error) {
          console.error("Server sync failed:", error);
          // Revert to previous state if sync fails
          await getCartData();
        }
      }
    }
  } catch (error) {
    console.error("Failed to remove item:", error);
  }
}, [cartItems, token, persistCart, api, getCartData]);

  // FIXED: addToCart function using direct approach
  const addToCart = useCallback(async (itemId, size, quantity = 1) => {
    try {
      const newCart = { ...cartItems };
      
      if (!newCart[itemId]) newCart[itemId] = {};
      newCart[itemId][size] = (newCart[itemId][size] || 0) + quantity;
      
      // Update state immediately
      setCartItems(newCart);
      
      // Persist to localStorage for guests
      if (!token) {
        persistCart(newCart);
      } else {
        // Sync with server for logged-in users
        try {
          await syncCartWithServer(newCart);
        } catch (error) {
          console.error("Server sync failed:", error);
          // Revert to previous state if sync fails
          await getCartData();
          throw new Error("Failed to sync with server");
        }
      }
    } catch (error) {
      console.error("Failed to add item:", error);
    }
  }, [cartItems, token, persistCart, syncCartWithServer, getCartData]);

  // FIXED: updateQuantity function using direct approach
  const updateQuantity = useCallback(async (itemId, size, newQuantity) => {
    try {
      // Convert to number and validate
      const quantity = parseInt(newQuantity);
      
      if (isNaN(quantity)) {
        return;
      }
      
      if (quantity < 1) {
        // If quantity is 0 or negative, remove the item
        await removeFromCart(itemId, size);
        return;
      }
      
      const newCart = { ...cartItems };
      
      // Ensure the item structure exists
      if (!newCart[itemId]) {
        newCart[itemId] = {};
      }
      
      // Update the quantity
      newCart[itemId][size] = quantity;
      
      // Update state immediately
      setCartItems(newCart);
      
      // Persist to localStorage for guests
      if (!token) {
        persistCart(newCart);
      } else {
        // Sync with server for logged-in users
        try {
          await syncCartWithServer(newCart);
        } catch (error) {
          console.error("Server sync failed:", error);
          // Revert to previous state if sync fails
          await getCartData();
          throw new Error("Failed to sync with server");
        }
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  }, [cartItems, token, persistCart, syncCartWithServer, getCartData, removeFromCart]);

  const verifyToken = useCallback(async () => {
    if (!token) return false;
    
    try {
      const response = await api.get('/api/user/verify');
      if (response.data.success) {
        setUser(response.data.user);
        return true;
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      if (error.response?.status === 401) {
        setToken('');
        setUser(null);
        setCartItems({});
        localStorage.removeItem('token');
        localStorage.removeItem('guest_cart');
      }
      return false;
    }
    return false;
  }, [token, api]);

  const logout = useCallback(() => {
    setToken('');
    setUser(null);
    setCartItems({});
    localStorage.removeItem('token');
    localStorage.removeItem('guest_cart');
    navigate('/');
  }, [navigate]);

  // Function to handle cart migration when user logs in
  const migrateGuestCartToServer = useCallback(async () => {
    if (!token) return;
    
    try {
      const guestCart = loadPersistedCart();
      // Only migrate if there's actually a guest cart and it's not empty
      if (guestCart && Object.keys(guestCart).length > 0) {
        // Sync guest cart to server
        await syncCartWithServer(guestCart);
        // Clear guest cart after successful migration
        localStorage.removeItem('guest_cart');
      }
    } catch (error) {
      console.error("Cart migration failed:", error);
    }
  }, [token, syncCartWithServer, loadPersistedCart]);

  // Initialize cart from localStorage on first load
  useEffect(() => {
    if (!token && !isInitialized) {
      const localCart = loadPersistedCart();
      const normalizedCart = normalizeCartData(localCart);
      setCartItems(normalizedCart);
    }
  }, [token, isInitialized, loadPersistedCart, normalizeCartData]);

  // Handle token changes and user switching
  useEffect(() => {
    const handleUserSwitch = async () => {
      // If token changed (user logged in/out)
      if (token !== previousToken) {
        setPreviousToken(token);
        
        if (token) {
          // User logged in
          localStorage.setItem('token', token);
          const isValid = await verifyToken();
          
          if (isValid) {
            // Clear any existing cart data before loading new user's cart
            setCartItems({});
            localStorage.removeItem('guest_cart');
            
            // Load the server cart for the new user
            await getCartData();
          }
        } else {
          // User logged out - clear cart and load guest cart
          setCartItems({});
          const localCart = loadPersistedCart();
          const normalizedCart = normalizeCartData(localCart);
          setCartItems(normalizedCart);
        }
      }
    };
    
    handleUserSwitch();
  }, [token, previousToken, verifyToken, getCartData, loadPersistedCart, normalizeCartData]);

  // Initialize application
  useEffect(() => {
    const initialize = async () => {
      try {
        // Load products first
        await getProductsData();
        
        // Then verify token and load cart based on auth status
        if (token) {
          const isValid = await verifyToken();
          if (isValid) {
            await getCartData();
          } else {
            // Load guest cart if token is invalid
            const localCart = loadPersistedCart();
            const normalizedCart = normalizeCartData(localCart);
            setCartItems(normalizedCart);
          }
        } else {
          // Load guest cart
          const localCart = loadPersistedCart();
          const normalizedCart = normalizeCartData(localCart);
            setCartItems(normalizedCart);
        }
        
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setIsInitialized(true);
        setIsCartLoading(false);
      }
    };
    
    if (!isInitialized) {
      initialize();
    }
  }, [getProductsData, getCartData, token, verifyToken, isInitialized, loadPersistedCart, normalizeCartData]);

const contextValue = useMemo(() => ({
  // State
  products,
  currency,
  delivery_fee,
  cartItems,
  isCartLoading,
  backendUrl,
  navigate,
  token,
  user,
  isInitialized,
  showSearch,
  setShowSearch,
  
  // Setters
  setToken,
  setCartItems, // Add this line to expose setCartItems
  
  // Cart calculations
  getCartAmount: () => cartCalculations.cartAmount,
  getCartTotal: () => cartCalculations.cartTotal,
  ...cartCalculations,
  
  // Cart actions
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  
  // User actions
  logout,
  
  // Utilities
  isAuthenticated: !!token,
  isAdmin: user?.isAdmin || false
  
}), [
  products,
  cartItems, // Make sure cartItems is in the dependency array
  isCartLoading,
  cartCalculations,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  token,
  user,
  backendUrl,
  navigate,
  logout,
  isInitialized,
  showSearch,
  setCartItems, // Add this to dependency array
  setToken, // Add this to dependency array
  setShowSearch, // Add this to dependency array
]);

  return (
    <ShopContext.Provider value={contextValue}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;