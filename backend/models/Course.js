const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    institution: String,
    description: String,
    duration: String,
    requirements: Object, // Stores the JSON structure {min_mean_grade, cluster_number, etc.}
    requirementsText: String, // requirements_text in SQL
    careerPaths: [String], // career_paths in SQL
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
