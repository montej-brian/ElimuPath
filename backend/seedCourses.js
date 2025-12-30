const mongoose = require('mongoose');
require('dotenv').config();
const Course = require('./models/Course');

const courses = [
    {
        name: 'Bachelor of Medicine and Bachelor of Surgery (MBChB)',
        type: 'Degree',
        institution: 'University of Nairobi, Moi University, Kenyatta University',
        description: 'Medical doctor training program',
        duration: '6 years',
        requirements: { min_mean_grade: "B+", cluster_number: 1, min_cluster_points: 42, required_subjects: { BIO: "B+", CHEM: "B+", PHY: "B", ENG: "B", MAT: "B" } },
        requirementsText: 'Min B+ overall; B+ in Biology and Chemistry, B in Physics, English, and Mathematics',
        careerPaths: ['Healthcare Professional']
    },
    {
        name: 'Bachelor of Science in Nursing',
        type: 'Degree',
        institution: 'University of Nairobi, Kenyatta University, Moi University',
        description: 'Professional nursing program',
        duration: '4 years',
        requirements: { min_mean_grade: "B-", cluster_number: 1, min_cluster_points: 35, required_subjects: { BIO: "B", CHEM: "C+", ENG: "C+" } },
        requirementsText: 'Min B- overall; B in Biology, C+ in Chemistry and English',
        careerPaths: ['Healthcare Professional']
    },
    {
        name: 'Bachelor of Engineering (Various)',
        type: 'Degree',
        institution: 'JKUAT, University of Nairobi, Technical University of Kenya',
        description: 'Engineering programs in Civil, Mechanical, Electrical, etc.',
        duration: '4-5 years',
        requirements: { min_mean_grade: "B", cluster_number: 1, min_cluster_points: 38, required_subjects: { MAT: "B", PHY: "B", CHEM: "C+", ENG: "C+" } },
        requirementsText: 'Min B overall; B in Mathematics and Physics, C+ in Chemistry and English',
        careerPaths: ['Engineer']
    },
    {
        name: 'Bachelor of Science in Computer Science',
        type: 'Degree',
        institution: 'University of Nairobi, Strathmore University, JKUAT',
        description: 'Computer science and software development',
        duration: '4 years',
        requirements: { min_mean_grade: "B", cluster_number: 1, min_cluster_points: 36, required_subjects: { MAT: "B", ENG: "C+" } },
        requirementsText: 'Min B overall; B in Mathematics, C+ in English',
        careerPaths: ['IT/Computer Specialist']
    },
    {
        name: 'Bachelor of Education (Arts)',
        type: 'Degree',
        institution: 'Kenyatta University, Moi University, Egerton University',
        description: 'Secondary school teacher training',
        duration: '4 years',
        requirements: { min_mean_grade: "C+", cluster_number: 2, min_cluster_points: 30, required_subjects: { ENG: "C+" } },
        requirementsText: 'Min C+ overall; C+ in English and two teaching subjects at C+',
        careerPaths: ['Teacher/Educator']
    },
    {
        name: 'Bachelor of Education (Science)',
        type: 'Degree',
        institution: 'Kenyatta University, Egerton University, Maseno University',
        description: 'Science teacher training',
        duration: '4 years',
        requirements: { min_mean_grade: "C+", cluster_number: 1, min_cluster_points: 30, required_subjects: { ENG: "C+", MAT: "C+" } },
        requirementsText: 'Min C+ overall; C+ in English, Mathematics, and two science subjects',
        careerPaths: ['Teacher/Educator']
    },
    {
        name: 'Bachelor of Commerce',
        type: 'Degree',
        institution: 'University of Nairobi, Strathmore University, USIU',
        description: 'Business and commerce studies',
        duration: '4 years',
        requirements: { min_mean_grade: "C+", cluster_number: 3, min_cluster_points: 28, required_subjects: { ENG: "C+", MAT: "C+" } },
        requirementsText: 'Min C+ overall; C+ in English and Mathematics',
        careerPaths: ['Business Professional']
    },
    {
        name: 'Bachelor of Laws (LLB)',
        type: 'Degree',
        institution: 'University of Nairobi, Moi University, Kenyatta University',
        description: 'Legal education program',
        duration: '4 years',
        requirements: { min_mean_grade: "B", cluster_number: 2, min_cluster_points: 36, required_subjects: { ENG: "B" } },
        requirementsText: 'Min B overall; B in English',
        careerPaths: ['Lawyer/Legal Professional']
    },
    {
        name: 'Bachelor of Science in Agriculture',
        type: 'Degree',
        institution: 'Egerton University, University of Nairobi, Jomo Kenyatta University',
        description: 'Agricultural sciences',
        duration: '4 years',
        requirements: { min_mean_grade: "C+", cluster_number: 1, min_cluster_points: 30, required_subjects: { BIO: "C+", CHEM: "C+" } },
        requirementsText: 'Min C+ overall; C+ in Biology and Chemistry',
        careerPaths: ['Agriculture/Veterinary']
    },
    {
        name: 'Diploma in Clinical Medicine and Surgery',
        type: 'Diploma',
        institution: 'Kenya Medical Training College (KMTC)',
        description: 'Clinical officer training',
        duration: '3 years',
        requirements: { min_mean_grade: "C", required_subjects: { BIO: "C", CHEM: "C", ENG: "C" } },
        requirementsText: 'Min C overall; C in Biology, Chemistry, and English',
        careerPaths: ['Healthcare Professional']
    },
    {
        name: 'Diploma in Nursing',
        type: 'Diploma',
        institution: 'Kenya Medical Training College (KMTC)',
        description: 'Registered nurse training',
        duration: '3 years',
        requirements: { min_mean_grade: "C", required_subjects: { BIO: "C", ENG: "C" } },
        requirementsText: 'Min C overall; C in Biology and English',
        careerPaths: ['Healthcare Professional']
    },
    {
        name: 'Diploma in Information Technology',
        type: 'Diploma',
        institution: 'Technical University of Kenya, Kenya Technical Trainers College',
        description: 'IT and computer systems',
        duration: '2-3 years',
        requirements: { min_mean_grade: "C-", required_subjects: { MAT: "C-", ENG: "C-" } },
        requirementsText: 'Min C- overall; C- in Mathematics and English',
        careerPaths: ['IT/Computer Specialist']
    },
    {
        name: 'Diploma in Business Management',
        type: 'Diploma',
        institution: 'Kenya Institute of Management, Technical Universities',
        description: 'Business administration',
        duration: '2-3 years',
        requirements: { min_mean_grade: "C-", required_subjects: { ENG: "C-", MAT: "D+" } },
        requirementsText: 'Min C- overall; C- in English, D+ in Mathematics',
        careerPaths: ['Business Professional']
    },
    {
        name: 'Diploma in Civil Engineering',
        type: 'Diploma',
        institution: 'Technical University of Kenya, Kenya Technical Trainers College',
        description: 'Civil engineering technology',
        duration: '3 years',
        requirements: { min_mean_grade: "C-", required_subjects: { MAT: "C", PHY: "C-" } },
        requirementsText: 'Min C- overall; C in Mathematics, C- in Physics',
        careerPaths: ['Engineer']
    },
    {
        name: 'Diploma in Electrical Engineering',
        type: 'Diploma',
        institution: 'Technical University of Kenya, Mombasa Technical University',
        description: 'Electrical engineering technology',
        duration: '3 years',
        requirements: { min_mean_grade: "C-", required_subjects: { MAT: "C", PHY: "C" } },
        requirementsText: 'Min C- overall; C in Mathematics and Physics',
        careerPaths: ['Engineer']
    },
    {
        name: 'Diploma in Primary Teacher Education (PTE)',
        type: 'Diploma',
        institution: 'Teacher Training Colleges',
        description: 'Primary school teacher training',
        duration: '2 years',
        requirements: { min_mean_grade: "C-", required_subjects: { ENG: "C-" } },
        requirementsText: 'Min C- overall; C- in English',
        careerPaths: ['Teacher/Educator']
    },
    {
        name: 'Certificate in Community Health',
        type: 'Certificate',
        institution: 'Kenya Medical Training College (KMTC)',
        description: 'Community health worker training',
        duration: '2 years',
        requirements: { min_mean_grade: "D+", required_subjects: { ENG: "D+" } },
        requirementsText: 'Min D+ overall; D+ in English',
        careerPaths: ['Healthcare Professional']
    },
    {
        name: 'Certificate in Information Communication Technology',
        type: 'Certificate',
        institution: 'TVET Institutions',
        description: 'Basic ICT skills',
        duration: '1-2 years',
        requirements: { min_mean_grade: "D", required_subjects: { ENG: "D" } },
        requirementsText: 'Min D overall; D in English',
        careerPaths: ['IT/Computer Specialist']
    },
    {
        name: 'Certificate in Electrical Installation',
        type: 'Certificate',
        institution: 'TVET Institutions',
        description: 'Electrical wiring and installation',
        duration: '1-2 years',
        requirements: { min_mean_grade: "D", required_subjects: { MAT: "D" } },
        requirementsText: 'Min D overall; D in Mathematics',
        careerPaths: ['Engineer']
    },
    {
        name: 'Certificate in Plumbing',
        type: 'Certificate',
        institution: 'TVET Institutions',
        description: 'Plumbing and pipe fitting',
        duration: '1-2 years',
        requirements: { min_mean_grade: "D", required_subjects: {} },
        requirementsText: 'Min D overall',
        careerPaths: ['Engineer']
    },
    {
        name: 'Certificate in Automotive Engineering',
        type: 'Certificate',
        institution: 'TVET Institutions',
        description: 'Motor vehicle mechanics',
        duration: '1-2 years',
        requirements: { min_mean_grade: "D", required_subjects: {} },
        requirementsText: 'Min D overall',
        careerPaths: ['Engineer']
    },
    {
        name: 'Certificate in Food and Beverage Service',
        type: 'Certificate',
        institution: 'TVET Institutions',
        description: 'Hospitality and catering',
        duration: '1 year',
        requirements: { min_mean_grade: "D", required_subjects: {} },
        requirementsText: 'Min D overall',
        careerPaths: ['Business Professional']
    },
    {
        name: 'Certificate in Hairdressing and Beauty Therapy',
        type: 'Certificate',
        institution: 'TVET Institutions',
        description: 'Hair styling and beauty services',
        duration: '1 year',
        requirements: { min_mean_grade: "D", required_subjects: {} },
        requirementsText: 'Min D overall',
        careerPaths: ['Business Professional']
    }
];

const seedCourses = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        await Course.deleteMany({});
        console.log('Courses cleared');

        await Course.insertMany(courses);
        console.log('Courses seeded');

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedCourses();
