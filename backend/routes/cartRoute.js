import express from 'express';
import auth from '../middleware/auth.js';
import userModel from '../models/userModel.js';

const router = express.Router();

// GET cart
router.get('/', auth, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, cartData: user.cartData || {} });
  } catch (error) {
    console.error('Cart fetch error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update cart (add/update/remove items)
router.put('/', auth, async (req, res) => {
  try {
    const { updates } = req.body;
    
    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({ success: false, message: 'Invalid updates format' });
    }
    
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Initialize cartData if it doesn't exist
    if (!user.cartData || typeof user.cartData !== 'object') {
      user.cartData = {};
    }
    
    // Process each update
    updates.forEach(({ itemId, size, quantity }) => {
      if (!itemId) return;
      
      const itemIdStr = String(itemId);
      const sizeStr = String(size || 'default');
      const quantityNum = parseInt(quantity) || 0;
      
      
      // Initialize item entry if it doesn't exist
      if (!user.cartData[itemIdStr]) {
        user.cartData[itemIdStr] = {};
      }
      
      if (quantityNum > 0) {
        // Update quantity for this size
        user.cartData[itemIdStr][sizeStr] = quantityNum;
      } else {
        // Remove the size entry if quantity is 0 or negative
        if (user.cartData[itemIdStr][sizeStr]) {
          delete user.cartData[itemIdStr][sizeStr];
        }
        
        // Remove the item entry if no sizes left
        if (Object.keys(user.cartData[itemIdStr]).length === 0) {
          delete user.cartData[itemIdStr];
        }
      }
    });
    
    // Mark cartData as modified
    user.markModified('cartData');
    
    await user.save();

    res.json({ success: true, cartData: user.cartData });
  } catch (error) {
    console.error('Cart update error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// NEW: Delete specific item from cart
router.delete('/item/:itemId', auth, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { size } = req.query; // Get size from query parameter
    
    
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Initialize cartData if it doesn't exist
    if (!user.cartData || typeof user.cartData !== 'object') {
      user.cartData = {};
    }
    
    const itemIdStr = String(itemId);
    const sizeStr = String(size || 'default');
    
    // Check if the item exists in cart
    if (user.cartData[itemIdStr] && user.cartData[itemIdStr][sizeStr]) {
      // Remove the specific size
      delete user.cartData[itemIdStr][sizeStr];
      
      // If no sizes left for this item, remove the entire item
      if (Object.keys(user.cartData[itemIdStr]).length === 0) {
        delete user.cartData[itemIdStr];
      }
      
      // Mark cartData as modified
      user.markModified('cartData');
      
      await user.save();
      
      console.log('User cartData after deletion:', user.cartData);
      
      res.json({ 
        success: true, 
        message: 'Item removed from cart', 
        cartData: user.cartData 
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'Item not found in cart' 
      });
    }
  } catch (error) {
    console.error('Cart item delete error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Clear entire cart
router.delete('/', auth, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    user.cartData = {};
    user.markModified('cartData');
    
    await user.save();
    
    res.json({ success: true, message: 'Cart cleared', cartData: {} });
  } catch (error) {
    console.error('Cart clear error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;