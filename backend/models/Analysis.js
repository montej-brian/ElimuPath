const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    code: String,
    name: String,
    grade: String,
    points: Number
});

const analysisSchema = new mongoose.Schema({
    resultsHash: {
        type: String,
        required: true,
        unique: true
    },
    meanGrade: {
        type: String,
        required: true
    },
    meanPoints: {
        type: Number,
        required: true
    },
    totalPoints: {
        type: Number,
        required: true
    },
    subjects: [subjectSchema],
    clusters: {
        type: Array, // Keeping it flexible as the structure is complex
        required: true
    },
    isPaid: {
        type: Boolean,
        default: false // Reverting to original default, override in logic if needed
    },
    paymentDate: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Analysis', analysisSchema);
