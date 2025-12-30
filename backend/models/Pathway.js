const mongoose = require('mongoose');

const pathwaySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String
    },
    requirements: {
        min_mean_grade: { type: String, default: 'C+' },
        min_cluster_points: { type: Number, default: 0 },
        cluster_number: { type: Number, default: 0 },
        subject_requirements: { type: Map, of: String }
    },
    careerPaths: [{
        type: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('Pathway', pathwaySchema);
