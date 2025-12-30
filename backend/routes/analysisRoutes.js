const express = require('express');
const router = express.Router();
const Analysis = require('../models/Analysis');
const { parseSMS } = require('../services/smsParser');
const { calculateClusters } = require('../services/clusterCalculator');
const { matchCourses, generateCareerRecommendations } = require('../services/courseMatcher');

function getMeanGradeInterpretation(grade) {
    const interpretations = {
        'A': 'Outstanding performance! Eligible for most competitive degree programs.',
        'A-': 'Excellent performance! Wide range of degree programs available.',
        'B+': 'Very good performance! Eligible for many degree programs.',
        'B': 'Good performance! Strong potential for various degree programs.',
        'B-': 'Good performance! Many degree and diploma options available.',
        'C+': 'Fair performance! Multiple diploma and some degree programs accessible.',
        'C': 'Fair performance! Focus on diploma and certificate programs.',
        'C-': 'You qualify for diploma and certificate programs.',
        'D+': 'Focus on certificate and TVET programs for skill development.',
        'D': 'Certificate and vocational training programs recommended.',
        'D-': 'Vocational and artisan training programs available.',
        'E': 'Consider TVET and vocational training for skill development.'
    };
    return interpretations[grade] || 'Results processed.';
}

// 1. Parse and preview results
router.post('/parse-results', async (req, res) => {
    try {
        const { smsText } = req.body;
        if (!smsText) return res.status(400).json({ error: 'SMS text is required' });

        const parsed = parseSMS(smsText);

        // Duplicate check
        const existingAnalysis = await Analysis.findOne({ resultsHash: parsed.resultsHash });
        if (existingAnalysis) {
            return res.status(409).json({ error: 'These results have already been analyzed.' });
        }

        const clusters = calculateClusters(parsed.subjects);

        const analysis = await Analysis.create({
            resultsHash: parsed.resultsHash,
            meanGrade: parsed.meanGrade,
            meanPoints: parsed.meanPoints,
            totalPoints: parsed.totalPoints,
            subjects: parsed.subjects,
            clusters: clusters,
            isPaid: true // Temorarily set to true for testing
        });

        res.json({
            analysisId: analysis._id,
            preview: {
                meanGrade: parsed.meanGrade,
                meanPoints: parsed.meanPoints
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Get full analysis (after payment)
router.get('/analysis/:analysisId', async (req, res) => {
    try {
        const { analysisId } = req.params;
        const analysis = await Analysis.findById(analysisId);

        if (!analysis) return res.status(404).json({ error: 'Analysis not found' });

        // Payment check disabled for testing
        // if (!analysis.isPaid) return res.status(403).json({ error: 'Payment required' });

        const subjects = analysis.subjects;
        const clusters = analysis.clusters;
        const meanGrade = analysis.meanGrade;

        const courses = await matchCourses(subjects, clusters, meanGrade);
        const careers = generateCareerRecommendations(clusters, courses);

        res.json({
            subjects,
            meanGrade,
            meanPoints: analysis.meanPoints,
            interpretation: getMeanGradeInterpretation(meanGrade),
            clusters,
            courses,
            careers
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
