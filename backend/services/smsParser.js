const crypto = require('crypto');

const GRADE_POINTS = {
    'A': 12, 'A-': 11,
    'B+': 10, 'B': 9, 'B-': 8,
    'C+': 7, 'C': 6, 'C-': 5,
    'D+': 4, 'D': 3, 'D-': 2,
    'E': 1
};

// Grading Scales (Min Score for each grade)
const GRADING_SCALES = {
    // Group I: Compulsory
    'ENGLISH': { 'A': 80, 'A-': 75, 'B+': 70, 'B': 65, 'B-': 60, 'C+': 55, 'C': 50, 'C-': 45, 'D+': 40, 'D': 35, 'D-': 30, 'E': 0 },
    'KISWAHILI': { 'A': 78, 'A-': 73, 'B+': 68, 'B': 63, 'B-': 58, 'C+': 53, 'C': 48, 'C-': 43, 'D+': 38, 'D': 33, 'D-': 28, 'E': 0 },
    'MATHEMATICS': { 'A': 70, 'A-': 65, 'B+': 60, 'B': 55, 'B-': 49, 'C+': 43, 'C': 37, 'C-': 31, 'D+': 25, 'D': 19, 'D-': 12, 'E': 0 },

    // Group II: Sciences
    'BIOLOGY': { 'A': 80, 'A-': 75, 'B+': 70, 'B': 65, 'B-': 60, 'C+': 55, 'C': 50, 'C-': 45, 'D+': 40, 'D': 35, 'D-': 30, 'E': 0 },
    'PHYSICS': { 'A': 60, 'A-': 55, 'B+': 50, 'B': 45, 'B-': 40, 'C+': 35, 'C': 30, 'C-': 25, 'D+': 20, 'D': 15, 'D-': 10, 'E': 0 },
    'CHEMISTRY': { 'A': 65, 'A-': 60, 'B+': 55, 'B': 50, 'B-': 45, 'C+': 40, 'C': 35, 'C-': 30, 'D+': 25, 'D': 20, 'D-': 15, 'E': 0 },

    // Group III: Humanities & Technical
    'HISTORY': { 'A': 80, 'A-': 75, 'B+': 70, 'B': 65, 'B-': 60, 'C+': 55, 'C': 50, 'C-': 45, 'D+': 40, 'D': 35, 'D-': 30, 'E': 0 },
    'GEOGRAPHY': { 'A': 66, 'A-': 61, 'B+': 56, 'B': 51, 'B-': 46, 'C+': 41, 'C': 36, 'C-': 31, 'D+': 26, 'D': 21, 'D-': 16, 'E': 0 },
    'CRE': { 'A': 90, 'A-': 85, 'B+': 80, 'B': 75, 'B-': 70, 'C+': 65, 'C': 60, 'C-': 55, 'D+': 50, 'D': 45, 'D-': 40, 'E': 0 },
    'AGRICULTURE': { 'A': 88, 'A-': 83, 'B+': 78, 'B': 73, 'B-': 68, 'C+': 63, 'C': 58, 'C-': 53, 'D+': 48, 'D': 43, 'D-': 38, 'E': 0 },
    'BUSINESS STUDIES': { 'A': 88, 'A-': 83, 'B+': 78, 'B': 73, 'B-': 68, 'C+': 63, 'C': 58, 'C-': 53, 'D+': 48, 'D': 43, 'D-': 38, 'E': 0 },
    'COMPUTER STUDIES': { 'A': 88, 'A-': 83, 'B+': 78, 'B': 73, 'B-': 68, 'C+': 63, 'C': 58, 'C-': 53, 'D+': 48, 'D': 43, 'D-': 38, 'E': 0 },
    'HOME SCIENCE': { 'A': 88, 'A-': 83, 'B+': 78, 'B': 73, 'B-': 68, 'C+': 63, 'C': 58, 'C-': 53, 'D+': 48, 'D': 43, 'D-': 38, 'E': 0 },
    'ART & DESIGN': { 'A': 88, 'A-': 83, 'B+': 78, 'B': 73, 'B-': 68, 'C+': 63, 'C': 58, 'C-': 53, 'D+': 48, 'D': 43, 'D-': 38, 'E': 0 },
    'MUSIC': { 'A': 88, 'A-': 83, 'B+': 78, 'B': 73, 'B-': 68, 'C+': 63, 'C': 58, 'C-': 53, 'D+': 48, 'D': 43, 'D-': 38, 'E': 0 },
    'FRENCH': { 'A': 88, 'A-': 83, 'B+': 78, 'B': 73, 'B-': 68, 'C+': 63, 'C': 58, 'C-': 53, 'D+': 48, 'D': 43, 'D-': 38, 'E': 0 },
    'GERMAN': { 'A': 88, 'A-': 83, 'B+': 78, 'B': 73, 'B-': 68, 'C+': 63, 'C': 58, 'C-': 53, 'D+': 48, 'D': 43, 'D-': 38, 'E': 0 },
    'ARABIC': { 'A': 88, 'A-': 83, 'B+': 78, 'B': 73, 'B-': 68, 'C+': 63, 'C': 58, 'C-': 53, 'D+': 48, 'D': 43, 'D-': 38, 'E': 0 },

    // Default (using English/History/Biology scale as standard)
    'DEFAULT': { 'A': 80, 'A-': 75, 'B+': 70, 'B': 65, 'B-': 60, 'C+': 55, 'C': 50, 'C-': 45, 'D+': 40, 'D': 35, 'D-': 30, 'E': 0 }
};

function getSubjectName(code) {
    const subjects = {
        'ENGLISH': 'English',
        'KISWAHILI': 'Kiswahili',
        'MATHEMATICS': 'Mathematics',
        'BIOLOGY': 'Biology',
        'CHEMISTRY': 'Chemistry',
        'PHYSICS': 'Physics',
        'HISTORY': 'History',
        'GEOGRAPHY': 'Geography',
        'CRE': 'Christian Religious Education',
        'IRE': 'Islamic Religious Education',
        'HRE': 'Hindu Religious Education',
        'COMPUTER STUDIES': 'Computer Studies',
        'AGRICULTURE': 'Agriculture',
        'HOME SCIENCE': 'Home Science',
        'ART & DESIGN': 'Art & Design',
        'MUSIC': 'Music',
        'FRENCH': 'French',
        'GERMAN': 'German',
        'ARABIC': 'Arabic',
        'BUSINESS STUDIES': 'Business Studies'
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

function scoreToGrade(subjectCode, score) {
    const scale = GRADING_SCALES[subjectCode] || GRADING_SCALES['DEFAULT'];
    const numericScore = parseFloat(score);

    if (numericScore >= scale['A']) return 'A';
    if (numericScore >= scale['A-']) return 'A-';
    if (numericScore >= scale['B+']) return 'B+';
    if (numericScore >= scale['B']) return 'B';
    if (numericScore >= scale['B-']) return 'B-';
    if (numericScore >= scale['C+']) return 'C+';
    if (numericScore >= scale['C']) return 'C';
    if (numericScore >= scale['C-']) return 'C-';
    if (numericScore >= scale['D+']) return 'D+';
    if (numericScore >= scale['D']) return 'D';
    if (numericScore >= scale['D-']) return 'D-';
    return 'E';
}

function calculateKCSEStats(subjects) {
    // 1. Total AGP (All subjects)
    const agp = subjects.reduce((sum, s) => sum + s.points, 0);

    // 2. Identify Grading Subjects (Math + Best Lang + Best 5 Others)
    const math = subjects.find(s => s.code === 'MATHEMATICS');
    // Languages: English, Kiswahili
    const languages = subjects.filter(s => ['ENGLISH', 'KISWAHILI'].includes(s.code));

    // Sort languages by points desc
    languages.sort((a, b) => b.points - a.points);
    const bestLanguage = languages[0];

    // Determine subjects grading used
    const usedCodes = new Set();
    if (math) usedCodes.add(math.code);
    if (bestLanguage) usedCodes.add(bestLanguage.code);

    // Filter remaining subjects for grading (Best 5 of rest)
    const remainingSubjects = subjects.filter(s => !usedCodes.has(s.code));
    remainingSubjects.sort((a, b) => b.points - a.points);

    // Take best 5 for Grading Mean
    const best5Others = remainingSubjects.slice(0, 5);

    // Calculate Grading Mean Points (Max 84 base)
    let gradingPoints = 0;
    let divisor = 0;

    if (math) { gradingPoints += math.points; divisor++; }
    if (bestLanguage) { gradingPoints += bestLanguage.points; divisor++; }

    best5Others.forEach(s => {
        gradingPoints += s.points;
        divisor++;
    });

    const meanPoints = divisor > 0 ? gradingPoints / divisor : 0;
    const meanGrade = pointsToGrade(meanPoints);

    // 3. Identify Cluster Calculation "t" (Best 5 Overall, Max 60)
    // Sort ALL subjects by points descending
    const allSorted = [...subjects].sort((a, b) => b.points - a.points);
    const best5Points = allSorted.slice(0, 5).reduce((sum, s) => sum + s.points, 0);

    return { agp, gradingPoints, meanPoints, meanGrade, best5Points };
}

function parseSMS(smsText) {
    try {
        const text = smsText.toUpperCase().trim();
        // Use a whitelist of common codes to avoid false positives from words like "GRADE" or "KCSE"
        const commonCodes = ['ENGLISH', 'KISWAHILI', 'MATHEMATICS', 'BIOLOGY', 'CHEMISTRY', 'PHYSICS', 'HISTORY', 'GEOGRAPHY', 'CRE', 'IRE', 'HRE', 'COMPUTER STUDIES', 'AGRICULTURE', 'HOME SCIENCE', 'ART & DESIGN', 'MUSIC', 'FRENCH', 'GERMAN', 'ARABIC', 'BUSINESS STUDIES'];
        const subjectPattern = new RegExp(`\\b(${commonCodes.join('|')})\\s*[-:]?\\s*([A-E][+-]?|\\d{1,3})`, 'g');
        const subjects = [];
        let match;

        while ((match = subjectPattern.exec(text)) !== null) {
            const subjectCode = match[1].trim();
            const value = match[2].trim();
            let grade, points;

            if (GRADE_POINTS[value]) {
                grade = value;
                points = GRADE_POINTS[grade];
            } else if (!isNaN(value)) {
                grade = scoreToGrade(subjectCode, value);
                points = GRADE_POINTS[grade];
            } else {
                continue;
            }

            subjects.push({
                code: subjectCode,
                name: getSubjectName(subjectCode),
                grade: grade,
                points: points,
                group: ['ENGLISH', 'KISWAHILI', 'MATHEMATICS'].includes(subjectCode) ? 'Core Foundation' : 'Elective/Other'
            });
        }

        // Sort subjects from highest to lowest grade (points)
        subjects.sort((a, b) => b.points - a.points);

        if (subjects.length < 5) {
            // Relaxed check
        }

        if (subjects.length === 0) {
            throw new Error('No valid subjects found. Format: SUBJ:GRADE or SUBJ:SCORE');
        }

        const stats = calculateKCSEStats(subjects);

        const resultsHash = crypto
            .createHash('sha256')
            .update(JSON.stringify(subjects.map(s => `${s.code}:${s.grade}`).sort()))
            .digest('hex');

        return {
            subjects,
            meanGrade: stats.meanGrade,
            meanPoints: stats.meanPoints.toFixed(2),
            gradingPoints: stats.gradingPoints,
            clusterTP: stats.gradingPoints,     // 't' for Cluster Calc (Aggregate of 7, Max 84)
            totalPoints: stats.agp,             // AGP
            resultsHash,
            rawText: text
        };
    } catch (error) {
        throw new Error(`Parsing failed: ${error.message}`);
    }
}

module.exports = { parseSMS, GRADE_POINTS };
