const express = require('express');
const router = express.Router();
const Analysis = require('../models/Analysis');
const Payment = require('../models/Payment');

router.get('/admin/stats', async (req, res) => {
    try {
        const totalRequests = await Analysis.countDocuments();

        // Count unique phone numbers from payments
        const uniqueUsers = await Payment.distinct('phoneNumber');
        const totalUsers = uniqueUsers.length;

        // Sum completed payments
        const revenueResult = await Payment.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        res.json({
            totalRequests,
            totalUsers,
            totalRevenue,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('Error fetching admin stats:', err);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

module.exports = router;
