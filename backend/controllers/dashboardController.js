const Product = require('../models/Product');
const Transaction = require('../models/Transaction');

// @desc    Get dashboard statistics for logged-in user
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get all user's products
    const products = await Product.find({ userId });

    // Get all user's transactions
    const transactions = await Transaction.find({ userId }).populate('productId');

    // Calculate stats
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.availableStock, 0);
    const inventoryValue = products.reduce((sum, p) => sum + (p.price * p.availableStock), 0);

    // Calculate revenue (sales/purchases)
    const purchases = transactions.filter(t => t.transactionType === 'purchase');
    const restocks = transactions.filter(t => t.transactionType === 'restock');

    let revenue = 0;
    let purchasesCost = 0;

    // Calculate revenue from sales
    for (const tx of purchases) {
      if (tx.productId) {
        revenue += tx.productId.price * tx.quantity;
      }
    }

    // Calculate cost from restocks
    for (const tx of restocks) {
      if (tx.productId) {
        purchasesCost += tx.productId.price * tx.quantity;
      }
    }

    // Profit = Revenue - Purchases Cost
    const profit = revenue - purchasesCost;

    // Get low stock products (stock <= 10)
    const lowStockProducts = products
      .filter(p => p.availableStock <= 10)
      .map(p => ({
        id: p._id,
        name: p.name,
        stock: p.availableStock,
        price: p.price
      }))
      .slice(0, 5);

    // Get top products by inventory value
    const topProducts = products
      .map(p => ({
        name: p.name,
        stock: p.availableStock,
        value: p.price * p.availableStock,
        quantity: p.availableStock
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // Monthly sales/purchases for chart (last 7 months)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    const monthlyData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

      const monthTransactions = transactions.filter(t => {
        const txDate = new Date(t.transactionDate);
        return txDate >= monthStart && txDate <= monthEnd;
      });

      let monthlySales = 0;
      let monthlyPurchases = 0;

      for (const tx of monthTransactions) {
        if (tx.productId) {
          const amount = tx.productId.price * tx.quantity;
          if (tx.transactionType === 'purchase') {
            monthlySales += amount;
          } else {
            monthlyPurchases += amount;
          }
        }
      }

      monthlyData.push({
        month: monthNames[date.getMonth()],
        sales: monthlySales,
        purchases: monthlyPurchases
      });
    }

    // Product distribution for pie chart (top 4 products by value)
    const productDistribution = products
      .map(p => ({
        name: p.name,
        value: p.price * p.availableStock
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 4);

    const totalDistValue = productDistribution.reduce((sum, p) => sum + p.value, 0);
    const productPercentages = productDistribution.map(p => ({
      name: p.name,
      percentage: totalDistValue > 0 ? ((p.value / totalDistValue) * 100).toFixed(1) : 0
    }));

    res.status(200).json({
      success: true,
      data: {
        stats: {
          revenue: revenue.toFixed(2),
          purchases: purchasesCost.toFixed(2),
          salesReturn: 0, // Not implemented yet
          profit: profit.toFixed(2),
          inventoryValue: inventoryValue.toFixed(2),
          totalProducts,
          totalStock
        },
        lowStockProducts,
        topProducts,
        monthlyData,
        productDistribution: productPercentages
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats
};
