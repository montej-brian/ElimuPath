const { parseSMS } = require('../services/smsParser');
const { calculateClusters } = require('../services/clusterCalculator');

const testCase1 = `
KCSE Results 2024
ENG C-, KIS C-, MAT C-, BIO D+, PHY B-, CHEM D+, HIST B, AGRI B+ 
Mean Grade: C+
`;

const testCase2 = `
KCSE 2024
ENG C+, KIS B-, MAT C-, BIO C-
PHY B, CHEM D+, GEO A, BST B+
Mean Grade: B-
`;

const runTest = (smsText, label) => {
    try {
        const parsed = parseSMS(smsText);
        console.log(`\n--- ${label} ---`);
        console.log('Mean Grade:', parsed.meanGrade);
        console.log('Mean Points:', parsed.meanPoints);
        console.log('Total Points (t):', parsed.clusterTP);
        parsed.subjects.forEach(s => console.log(`${s.name}: ${s.grade} (${s.points})`));

        const clusters = calculateClusters(parsed.subjects, parsed.clusterTP);
        console.log('\n--- Cluster Points ---');
        clusters.forEach(c => {
            console.log(`${c.name}: ${c.points}`);
        });
    } catch (error) {
        console.error(`Error in ${label}:`, error.message);
    }
};

runTest(testCase1, 'Example 1 (C+)');
runTest(testCase2, 'Example 2 (B-)');
