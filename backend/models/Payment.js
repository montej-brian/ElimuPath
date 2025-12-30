const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    analysisId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Analysis',
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    mpesaCheckoutRequestId: {
        type: String,
        required: true,
        unique: true
    },
    mpesaReceiptNumber: {
        type: String
    },
    transactionDate: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
