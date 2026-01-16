function calculateClusters(subjects, gradingPoints) {
    const clusters = [];
    const t = gradingPoints || 0; // t = student's grade points (grading total)
    const T = 84; // T = max grade points (7 * 12)
    const R = 48; // R = max cluster points (4 * 12)

    // Formula: C = sqrt( (r/R) * (t/T) ) * 48

    const calculateC = (clusterSubjects) => {
        let r = 0;
        let breakdown = {};

        clusterSubjects.forEach((s, idx) => {
            r += s.points;
            breakdown[`S${idx + 1}`] = {
                name: s.name,
                grade: s.grade,
                points: s.points
            };
        });

        const clusterPoints = Math.sqrt((r / R) * (t / T)) * 48;
        return {
            points: clusterPoints.toFixed(3),
            breakdown: breakdown,
            subjects: clusterSubjects.map(s => s.name).join(', ')
        };
    };

    const findSubject = (codes) => {
        for (const code of codes) {
            const subject = subjects.find(s => s.code === code);
            if (subject) return subject;
        }
        return null;
    };

    const eng = findSubject(['ENG']);
    const mat = findSubject(['MAT']);
    const bio = findSubject(['BIO', 'PHY']);
    const chem = findSubject(['CHEM', 'PHY']);
    const phy = findSubject(['PHY', 'CHEM', 'BIO']);

    // 1. Science Cluster (Eng + Mat + Bio + Chem)
    if (eng && mat && bio && chem) {
        const result = calculateC([eng, mat, bio, chem]);
        clusters.push({
            number: 1,
            name: 'Science Cluster',
            points: result.points,
            breakdown: result.breakdown,
            subjects: result.subjects,
            description: 'Engineering, Medicine, Pure Sciences'
        });
    }

    const kis = findSubject(['KIS']);
    const humanities = findSubject(['HIST', 'GEO', 'CRE', 'IRE', 'HRE']);

    // 2. Arts Cluster (Eng + Kis + Mat + Hum)
    if (eng && kis && mat && humanities) {
        const result = calculateC([eng, kis, mat, humanities]);
        clusters.push({
            number: 2,
            name: 'Arts/Humanities Cluster',
            points: result.points,
            breakdown: result.breakdown,
            subjects: result.subjects,
            description: 'Education, Law, Social Sciences'
        });
    }

    const bst = findSubject(['BST', 'GEO', 'HIST', 'CRE']);

    // 3. Business Cluster (Eng + Mat + Kis + Bst/Hum)
    if (eng && mat && kis && bst) {
        const result = calculateC([eng, mat, kis, bst]);
        clusters.push({
            number: 3,
            name: 'Business/Technical Cluster',
            points: result.points,
            breakdown: result.breakdown,
            subjects: result.subjects,
            description: 'Business, Economics, Technical Courses'
        });
    }

    const tech = findSubject(['COMP', 'AGRI', 'PHY', 'CHEM']);

    // 4. Tech Cluster (Eng + Mat + Phy + Tech)
    if (eng && mat && phy && tech) {
        const result = calculateC([eng, mat, phy, tech]);
        clusters.push({
            number: 4,
            name: 'Technical/Applied Cluster',
            points: result.points,
            breakdown: result.breakdown,
            subjects: result.subjects,
            description: 'Engineering Technology, IT, Agriculture'
        });
    }

    return clusters;
}

module.exports = { calculateClusters };
