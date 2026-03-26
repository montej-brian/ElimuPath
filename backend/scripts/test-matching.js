const MatchingService = require('../src/services/matchingService');
const db = require('../src/config/db');

async function testMatching() {
    console.log('--- Matching Service Test ---');
    
    // 1. Create a mock student result
    const mockSubjects = {
        'MAT': 'A',
        'PHY': 'A',
        'CHEM': 'B+',
        'BIO': 'B',
        'ENG': 'B+',
        'KIS': 'A-',
        'HIST': 'A'
    };

    try {
        const resultRes = await db.query(
            `INSERT INTO student_results (results_hash, mean_grade, mean_points, total_points, subjects)
             VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            ['test_hash_' + Date.now(), 'A-', 10.5, 78, JSON.stringify(mockSubjects)]
        );
        const resultId = resultRes.rows[0].id;
        console.log(`Created mock result ID: ${resultId}`);

        // 2. Run matching engine
        console.log('Running matching engine...');
        const matches = await MatchingService.findMatches(resultId);
        
        console.log(`Found ${matches.length} matches.`);
        
        // 3. Verify specific matches (assuming seed data exists)
        const csMatch = matches.find(m => m.course_name.includes('Computer Science'));
        if (csMatch) {
            console.log(`CS Eligibility: ${csMatch.eligibility_status} - ${csMatch.reason}`);
            if (csMatch.eligibility_status === 'eligible') {
                console.log('✅ CS Matching Pass');
            } else {
                console.log('❌ CS Matching Fail');
            }
        }

        const medMatch = matches.find(m => m.course_name.includes('Medicine'));
        if (medMatch) {
            console.log(`Medicine Eligibility: ${medMatch.eligibility_status} - ${medMatch.reason}`);
        }

        process.exit(0);
    } catch (err) {
        console.error('Test Failed:', err);
        process.exit(1);
    }
}

require('dotenv').config();
testMatching();
