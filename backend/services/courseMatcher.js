const Pathway = require('../models/Pathway');
const { GRADE_POINTS } = require('./smsParser');

async function matchCourses(subjects, clusters, meanGrade) {
    try {
        const allPathways = await Pathway.find().sort({ name: 1 });
        const eligiblePathways = [];

        for (const pathway of allPathways) {
            const requirements = pathway.requirements || {};
            let eligible = true;

            // 1. Mean Grade Check
            if (requirements.min_mean_grade) {
                const minPoints = GRADE_POINTS[requirements.min_mean_grade];
                const currentPoints = GRADE_POINTS[meanGrade];
                if (currentPoints < minPoints) eligible = false;
            }

            // 2. Cluster Points Check (If available)
            if (requirements.cluster_number && requirements.min_cluster_points) {
                const cluster = clusters.find(c => c.number === requirements.cluster_number);
                if (!cluster || parseFloat(cluster.points) < requirements.min_cluster_points) {
                    eligible = false;
                }
            }

            // 3. Subject Requirements Check
            if (requirements.subject_requirements && requirements.subject_requirements.size > 0) {
                for (const [code, minGrade] of pathway.requirements.subject_requirements.entries()) {
                    const subject = subjects.find(s => s.code === code);
                    if (!subject || GRADE_POINTS[subject.grade] < GRADE_POINTS[minGrade]) {
                        eligible = false;
                        break;
                    }
                }
            }

            if (eligible) {
                eligiblePathways.push({
                    name: pathway.name,
                    description: pathway.description,
                    requirements: `Min ${requirements.min_mean_grade || 'C+'} overall`,
                    career_paths: pathway.careerPaths
                });
            }
        }

        return eligiblePathways;
    } catch (error) {
        console.error('Pathway matching error:', error);
        return [];
    }
}

function getCareerDescription(careerName) {
    const descriptions = {
        'Healthcare Professional': 'Work in hospitals, clinics, or public health sector providing medical care and health services',
        'Engineer': 'Design and build systems, structures, and technologies across various engineering disciplines',
        'Teacher/Educator': 'Shape future generations through teaching in schools, colleges, or training institutions',
        'Business Professional': 'Manage organizations, develop strategies, or work in finance and accounting',
        'IT/Computer Specialist': 'Develop software, manage systems, or work in cybersecurity and data analysis',
        'Scientist': 'Conduct research in biology, chemistry, physics, or environmental sciences',
        'Lawyer/Legal Professional': 'Provide legal advice, represent clients, or work in policy and governance',
        'Agriculture/Veterinary': 'Work in farming, animal health, or agribusiness sectors'
    };
    return descriptions[careerName] || `Professional opportunities in ${careerName}`;
}

function getAlternativeRoutes(careerName) {
    const alternatives = {
        'Healthcare Professional': 'KMTC certificate courses, nursing assistant programs, community health worker training',
        'Engineer': 'TVET diploma programs, technical training institutes, artisan courses',
        'Teacher/Educator': 'Primary teacher education (P1), ECDE training, TVET instructor courses',
        'IT/Computer Specialist': 'Coding bootcamps, certificate courses in programming, TVET ICT diplomas'
    };
    return alternatives[careerName] || 'TVET diploma and certificate programs, bridging courses';
}

function generateCareerRecommendations(clusters, pathways) {
    const careers = [];
    const careerMap = new Map();

    pathways.forEach(pathway => {
        if (pathway.career_paths) {
            pathway.career_paths.forEach(careerPath => {
                if (!careerMap.has(careerPath)) {
                    careerMap.set(careerPath, {
                        courses: []
                    });
                }
                careerMap.get(careerPath).courses.push(pathway.name);
            });
        }
    });

    careerMap.forEach((data, careerName) => {
        careers.push({
            name: careerName,
            description: getCareerDescription(careerName),
            suggested_courses: data.courses.slice(0, 3),
            alternatives: getAlternativeRoutes(careerName)
        });
    });

    return careers; // Return all, frontend will slice
}

module.exports = { matchCourses, generateCareerRecommendations };
