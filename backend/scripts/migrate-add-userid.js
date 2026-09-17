/**
 * Migration Script: Add userId to existing Products and Transactions
 * 
 * This script updates the database schema by:
 * 1. Dropping the old unique index on Product.name
 * 2. Adding userId field to existing products
 * 3. Adding userId field to existing transactions
 * 4. Creating compound index on (userId, name) for products
 * 
 * Run this once after deploying the schema changes:
 * node backend/scripts/migrate-add-userid.js
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

async function migrate() {
  try {
    // Connect to database
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in .env file');
    }
    
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB');

    // Get the first user as the default owner (or create a default user)
    let defaultUser = await User.findOne();
    
    if (!defaultUser) {
      console.log('⚠ No users found. Creating default admin user...');
      defaultUser = await User.create({
        name: 'Admin',
        email: 'admin@inventory.com',
        password: 'admin123' // Change this in production
      });
      console.log('✓ Created default admin user');
    }

    console.log(`\nUsing user: ${defaultUser.name} (${defaultUser.email}) as default owner\n`);

    // Step 1: Drop the old unique index on Product.name if it exists
    try {
      await Product.collection.dropIndex('name_1');
      console.log('✓ Dropped old unique index on Product.name');
    } catch (error) {
      if (error.code === 27) {
        console.log('ℹ Old index does not exist, skipping...');
      } else {
        console.log('⚠ Error dropping index:', error.message);
      }
    }

    // Step 2: Add userId to all existing products
    const productsWithoutUserId = await Product.countDocuments({ userId: { $exists: false } });
    
    if (productsWithoutUserId > 0) {
      console.log(`\nUpdating ${productsWithoutUserId} products...`);
      
      const updateProductsResult = await Product.updateMany(
        { userId: { $exists: false } },
        { $set: { userId: defaultUser._id } }
      );
      
      console.log(`✓ Updated ${updateProductsResult.modifiedCount} products with userId`);
    } else {
      console.log('\n✓ All products already have userId');
    }

    // Step 3: Add userId to all existing transactions
    const transactionsWithoutUserId = await Transaction.countDocuments({ userId: { $exists: false } });
    
    if (transactionsWithoutUserId > 0) {
      console.log(`\nUpdating ${transactionsWithoutUserId} transactions...`);
      
      const updateTransactionsResult = await Transaction.updateMany(
        { userId: { $exists: false } },
        { $set: { userId: defaultUser._id } }
      );
      
      console.log(`✓ Updated ${updateTransactionsResult.modifiedCount} transactions with userId`);
    } else {
      console.log('\n✓ All transactions already have userId');
    }

    // Step 4: Create compound index on (userId, name) for products
    try {
      await Product.collection.createIndex({ userId: 1, name: 1 }, { unique: true });
      console.log('\n✓ Created compound unique index on (userId, name)');
    } catch (error) {
      if (error.code === 85 || error.code === 86) {
        console.log('\nℹ Index already exists');
      } else {
        console.log('\n⚠ Error creating index:', error.message);
      }
    }

    // Verification
    console.log('\n--- Verification ---');
    const totalProducts = await Product.countDocuments();
    const productsWithUserId = await Product.countDocuments({ userId: { $exists: true } });
    const totalTransactions = await Transaction.countDocuments();
    const transactionsWithUserId = await Transaction.countDocuments({ userId: { $exists: true } });

    console.log(`Products: ${productsWithUserId}/${totalProducts} have userId`);
    console.log(`Transactions: ${transactionsWithUserId}/${totalTransactions} have userId`);

    if (productsWithUserId === totalProducts && transactionsWithUserId === totalTransactions) {
      console.log('\n✅ Migration completed successfully!');
    } else {
      console.log('\n⚠ Migration incomplete. Please check the data.');
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrate();
