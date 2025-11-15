import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js';
import fs from 'fs';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const addProduct = async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = ['name', 'description', 'price', 'category'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Process images
        const imageFields = ['image1', 'image2', 'image3', 'image4', 'image5'];
        const uploadedImages = [];

        for (const field of imageFields) {
            if (req.files && req.files[field]) {
                try {
                    const file = req.files[field][0];
                    const result = await cloudinary.uploader.upload(file.path, {
                        folder: 'products',
                        resource_type: 'image'
                    });

                    uploadedImages.push({
                        url: result.secure_url,
                        public_id: result.public_id
                    });

                    // Delete temporary file
                    fs.unlinkSync(file.path);
                } catch (uploadError) {
                    console.error(`Error uploading ${field}:`, uploadError);
                }
            }
        }

        // Validate at least one image was uploaded
        if (uploadedImages.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one product image is required"
            });
        }

        // Create new product
        const newProduct = new productModel({
            name: req.body.name,
            description: req.body.description,
            price: Number(req.body.price),
            images: uploadedImages,
            category: req.body.category,
            subCategory: req.body.subCategory || '',
            sizes: req.body.sizes ? JSON.parse(req.body.sizes) : [],
            bestseller: req.body.bestseller === 'true',
            date: new Date()
        });

        await newProduct.save();

        res.status(201).json({
            success: true,
            message: "Product added successfully",
            product: newProduct
        });

    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const listProducts = async (req, res) => {
    try {
        const products = await productModel.find().sort({ date: -1 });
        res.json({ success: true, products });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: err.message 
        });
    }
};

const removeProduct = async (req, res) => {
    try {
        // Get ID from URL params instead of body
        const product = await productModel.findByIdAndDelete(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Delete images from Cloudinary
        for (const image of product.images) {
            try {
                await cloudinary.uploader.destroy(image.public_id);
            } catch (err) {
                console.error("Error deleting image from Cloudinary:", err);
            }
        }

        res.json({ 
            success: true, 
            message: "Product removed successfully" 
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: err.message 
        });
    }
};
const singleProduct = async (req, res) => {
    try {
        const product = await productModel.findById(req.body.productId);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.json({ 
            success: true, 
            product 
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: err.message 
        });
    }
};
const countProducts = async (req, res) => {
  try {
    const count = await productModel.countDocuments();
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addProduct, listProducts, removeProduct, singleProduct,countProducts };