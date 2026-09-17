const Product = require('../models/Product');
const Transaction = require('../models/Transaction');


const createProduct = async (req, res, next) => {
  try {
    const { name, price, availableStock } = req.body;
    const userId = req.user.id; // From auth middleware

    // Validate required fields
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Product name is required',
      });
    }

    if (price === undefined || price === null) {
      return res.status(400).json({
        success: false,
        message: 'Product price is required',
      });
    }

    if (price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Product price must be greater than zero',
      });
    }

    if (availableStock !== undefined && availableStock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Product stock cannot be negative',
      });
    }

    // Check for duplicate product name for this user
    const existingProduct = await Product.findOne({
      userId,
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
    });

    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: `Product with name "${name.trim()}" already exists`,
      });
    }

    const product = await Product.create({
      userId,
      name: name.trim(),
      price,
      availableStock: availableStock || 0,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products for logged-in user
// @route   GET /api/products
// @access  Private
const getAllProducts = async (req, res, next) => {
  try {
    const userId = req.user.id; // From auth middleware
    const products = await Product.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Purchase a product (Sell)
// @route   POST /api/products/purchase
// @access  Private
const purchaseProduct = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id; // From auth middleware

    // Validate inputs
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Purchase quantity must be greater than zero',
      });
    }

    // Check if product exists and belongs to this user
    const product = await Product.findOne({ _id: productId, userId });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check stock availability
    if (quantity > product.availableStock) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available: ${product.availableStock}, Requested: ${quantity}`,
      });
    }

    // Reduce stock
    product.availableStock -= quantity;
    await product.save();

    // Create transaction record
    const transaction = await Transaction.create({
      userId,
      productId: product._id,
      transactionType: 'purchase',
      quantity,
    });

    res.status(200).json({
      success: true,
      message: `Successfully purchased ${quantity} unit(s) of "${product.name}"`,
      data: {
        transaction,
        updatedStock: product.availableStock,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Restock a product (Buy)
// @route   POST /api/products/restock
// @access  Private
const restockProduct = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id; // From auth middleware

    // Validate inputs
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Restock quantity must be greater than zero',
      });
    }

    // Check if product exists and belongs to this user
    const product = await Product.findOne({ _id: productId, userId });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Increase stock
    product.availableStock += quantity;
    await product.save();

    // Create transaction record
    const transaction = await Transaction.create({
      userId,
      productId: product._id,
      transactionType: 'restock',
      quantity,
    });

    res.status(200).json({
      success: true,
      message: `Successfully restocked ${quantity} unit(s) of "${product.name}"`,
      data: {
        transaction,
        updatedStock: product.availableStock,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product transaction history for logged-in user
// @route   GET /api/products/:productId/history
// @access  Private
const getProductHistory = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id; // From auth middleware

    // Check if product exists and belongs to this user
    const product = await Product.findOne({ _id: productId, userId });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Get all transactions for this product and user
    const transactions = await Transaction.find({ productId, userId }).sort({
      transactionDate: -1,
    });

    res.status(200).json({
      success: true,
      productName: product.name,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  purchaseProduct,
  restockProduct,
  getProductHistory,
};
