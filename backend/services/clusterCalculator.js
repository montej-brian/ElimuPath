function calculateClusters(subjects) {
    const clusters = [];

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

    if (eng && mat && bio && chem) {
        clusters.push({
            number: 1,
            name: 'Science Cluster',
            subjects: `${eng.name}, ${mat.name}, ${bio.name}, ${chem.name}`,
            points: (eng.points + mat.points + bio.points + chem.points).toFixed(2),
            description: 'Engineering, Medicine, Pure Sciences'
        });
    }

    const kis = findSubject(['KIS']);
    const humanities = findSubject(['HIST', 'GEO', 'CRE', 'IRE', 'HRE']);

    if (eng && kis && mat && humanities) {
        clusters.push({
            number: 2,
            name: 'Arts/Humanities Cluster',
            subjects: `${eng.name}, ${kis.name}, ${mat.name}, ${humanities.name}`,
            points: (eng.points + kis.points + mat.points + humanities.points).toFixed(2),
            description: 'Education, Law, Social Sciences'
        });
    }

    const bst = findSubject(['BST', 'GEO', 'HIST', 'CRE']);

    if (eng && mat && kis && bst) {
        clusters.push({
            number: 3,
            name: 'Business/Technical Cluster',
            subjects: `${eng.name}, ${mat.name}, ${kis.name}, ${bst.name}`,
            points: (eng.points + mat.points + kis.points + bst.points).toFixed(2),
            description: 'Business, Economics, Technical Courses'
        });
    }

    const phy = findSubject(['PHY', 'CHEM', 'BIO']);
    const tech = findSubject(['COMP', 'AGRI', 'PHY', 'CHEM']);

    if (eng && mat && phy && tech) {
        clusters.push({
            number: 4,
            name: 'Technical/Applied Cluster',
            subjects: `${eng.name}, ${mat.name}, ${phy.name}, ${tech.name}`,
            points: (eng.points + mat.points + phy.points + tech.points).toFixed(2),
            description: 'Engineering Technology, IT, Agriculture'
        });
    }

    return clusters;
}

module.exports = { calculateClusters };
