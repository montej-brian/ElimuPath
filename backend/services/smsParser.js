const crypto = require('crypto');

const GRADE_POINTS = {
    'A': 12, 'A-': 11,
    'B+': 10, 'B': 9, 'B-': 8,
    'C+': 7, 'C': 6, 'C-': 5,
    'D+': 4, 'D': 3, 'D-': 2,
    'E': 1
};

function getSubjectName(code) {
    const subjects = {
        'ENG': 'English',
        'KIS': 'Kiswahili',
        'MAT': 'Mathematics',
        'BIO': 'Biology',
        'CHEM': 'Chemistry',
        'PHY': 'Physics',
        'HIST': 'History',
        'GEO': 'Geography',
        'CRE': 'Christian Religious Education',
        'IRE': 'Islamic Religious Education',
        'HRE': 'Hindu Religious Education',
        'COMP': 'Computer Studies',
        'AGRI': 'Agriculture',
        'HSCI': 'Home Science',
        'ART': 'Art & Design',
        'MUSIC': 'Music',
        'FREN': 'French',
        'GERM': 'German',
        'ARAB': 'Arabic',
        'BST': 'Business Studies'
    };
    return subjects[code] || code;
}

function pointsToGrade(avgPoints) {
    if (avgPoints >= 11.5) return 'A';
    if (avgPoints >= 10.5) return 'A-';
    if (avgPoints >= 9.5) return 'B+';
    if (avgPoints >= 8.5) return 'B';
    if (avgPoints >= 7.5) return 'B-';
    if (avgPoints >= 6.5) return 'C+';
    if (avgPoints >= 5.5) return 'C';
    if (avgPoints >= 4.5) return 'C-';
    if (avgPoints >= 3.5) return 'D+';
    if (avgPoints >= 2.5) return 'D';
    if (avgPoints >= 1.5) return 'D-';
    return 'E';
}

function parseSMS(smsText) {
    try {
        const text = smsText.toUpperCase().trim();
        const subjectPattern = /([A-Z]{2,4})\s*[-:]?\s*([A-E][+-]?)/g;
        const subjects = [];
        let match;

        while ((match = subjectPattern.exec(text)) !== null) {
            const subject = match[1].trim();
            const grade = match[2].trim();

            if (GRADE_POINTS[grade]) {
                subjects.push({
                    code: subject,
                    name: getSubjectName(subject),
                    grade: grade,
                    points: GRADE_POINTS[grade]
                });
            }
        }

        if (subjects.length < 7) {
            throw new Error('Could not parse sufficient subjects. Please check SMS format.');
        }

        const totalPoints = subjects.reduce((sum, s) => sum + s.points, 0);
        const avgPoints = totalPoints / subjects.length;
        const meanGrade = pointsToGrade(avgPoints);

        const resultsHash = crypto
            .createHash('sha256')
            .update(JSON.stringify(subjects.map(s => `${s.code}:${s.grade}`).sort()))
            .digest('hex');

        return {
            subjects,
            meanGrade,
            meanPoints: avgPoints.toFixed(2),
            totalPoints,
            resultsHash,
            rawText: text
        };
    } catch (error) {
        throw new Error(`Parsing failed: ${error.message}`);
    }
}

module.exports = { parseSMS, GRADE_POINTS };
