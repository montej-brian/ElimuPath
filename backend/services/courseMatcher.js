const Course = require('../models/Course');
const { GRADE_POINTS } = require('./smsParser');

async function matchCourses(subjects, clusters, meanGrade) {
    try {
        const allCourses = await Course.find({ isActive: true }).sort({ type: 1, name: 1 });
        const eligibleCourses = [];

        for (const course of allCourses) {
            const requirements = course.requirements || {};
            let eligible = true;

            if (requirements.min_mean_grade) {
                const minPoints = GRADE_POINTS[requirements.min_mean_grade];
                const currentPoints = GRADE_POINTS[meanGrade];
                if (currentPoints < minPoints) eligible = false;
            }

            if (requirements.cluster_number && requirements.min_cluster_points) {
                const cluster = clusters.find(c => c.number === requirements.cluster_number);
                if (!cluster || parseFloat(cluster.points) < requirements.min_cluster_points) {
                    eligible = false;
                }
            }

            if (requirements.required_subjects) {
                for (const [code, minGrade] of Object.entries(requirements.required_subjects)) {
                    const subject = subjects.find(s => s.code === code);
                    if (!subject || GRADE_POINTS[subject.grade] < GRADE_POINTS[minGrade]) {
                        eligible = false;
                        break;
                    }
                }
            }

            if (eligible) {
                eligibleCourses.push({
                    name: course.name,
                    type: course.type,
                    institution: course.institution,
                    description: course.description,
                    requirements: course.requirementsText,
                    duration: course.duration,
                    career_paths: course.careerPaths
                });
            }
        }

        return eligibleCourses;
    } catch (error) {
        console.error('Course matching error:', error);
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

function generateCareerRecommendations(clusters, courses) {
    const careers = [];
    const careerMap = new Map();

    courses.forEach(course => {
        if (course.career_paths) {
            // Mongoose array will already be an array
            const paths = course.career_paths;
            paths.forEach(careerPath => {
                if (!careerMap.has(careerPath)) {
                    careerMap.set(careerPath, {
                        courses: [],
                        institutions: new Set()
                    });
                }
                careerMap.get(careerPath).courses.push(course.name);
                if (course.institution) {
                    course.institution.split(',').forEach(inst => {
                        careerMap.get(careerPath).institutions.add(inst.trim());
                    });
                }
            });
        }
    });

    careerMap.forEach((data, careerName) => {
        careers.push({
            name: careerName,
            description: getCareerDescription(careerName),
            institutions: Array.from(data.institutions).join(', '),
            suggested_courses: data.courses.slice(0, 3),
            alternatives: getAlternativeRoutes(careerName)
        });
    });

    return careers.slice(0, 5);
}

module.exports = { matchCourses, generateCareerRecommendations };
