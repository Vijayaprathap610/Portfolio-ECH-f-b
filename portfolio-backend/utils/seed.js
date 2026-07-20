const mongoose = require('mongoose');
const connectDB = require('../config/db')
require('dotenv').config();
const logger = require('./logger');
const Admin = require('../models/Admin');
const Profile = require('../models/Profile');
const Skill = require('../models/Skill');
const Experience = require('../models/Experience');

const seed = async () => {
    await connectDB();

    try {
        // Clear existing data
        await Admin.deleteMany({});
        await Profile.deleteMany({});
        await Skill.deleteMany({});
        await Experience.deleteMany({});

        // ─── Create Admin ─────────────────────────────────────────────────────
        // Pass the RAW secret key — the Admin model's pre-save hook hashes it.
        // Do NOT pre-hash here; doing so causes double-hashing and login failure.
        await Admin.create({
            name: (process.env.ADMIN_NAME || 'admin').toLowerCase(),
            secretKeyHash: process.env.ADMIN_SECRET_KEY,
            role: 'admin',
        });
        logger.info('✅ Admin seeded successfully.');

        // ─── Create Profile ───────────────────────────────────────────────────
        await Profile.create({
            fullName: 'VIJAYAPRATHAP K',
            title: 'Full Stack MERN Developer',
            email: 'vijayaprathap610navi@gmail.com',
            phone: '+91 9585718894',
            location: 'Villupuram, Tamil Nadu, India',
            bio: 'I am a passionate Full Stack MERN Developer with hands-on experience building modern web applications. I specialize in React.js, Node.js, Express.js, and MongoDB. As a fresher, I bring fresh perspectives, strong fundamentals, and a drive to continuously learn and grow.',
            objective: 'Seeking a challenging position as a Full Stack Developer where I can utilize my skills in MERN Stack development to contribute to innovative projects and grow as a professional.',
            profilePhoto: '',
            resumeUrl: '',
            socialLinks: {
                github: 'https://github.com/yourusername',
                linkedin: 'https://linkedin.com/in/yourusername',
                twitter: 'https://twitter.com/yourusername',
                instagram: '',
                portfolio: '',
            },
            personalInfo: {
                dob: '1998-10-06',
                nationality: 'Indian',
                languages: ['English', 'Tamil'],
                interests: ['Web Development', 'Open Source', 'Reading Tech Blogs', 'Problem Solving'],
                availability: 'Immediately Available',
            },
            education: [
                {
                    degree: 'Bachelor of Arts in History',
                    institution: 'Annamalai University',
                    board: 'Annamalai University',
                    year: '2020 - 2023',
                    percentage: '62%',
                    description:
                        'Focused on core fundamentals, Indian and world history, historical methodologies, and the rich cultural heritage of Tamil Nadu, and Human Evolution .',
                },
                {
                    degree: 'Full Stack (MERN) Web Development Certification',
                    institution: 'Entri Elevate ',
                    board: 'NSDC',
                    year: '2025 - 2026',
                    percentage: '88%',
                    description: 'HTML, CSS, and JavaScript, React, Node.js, Express.js, MongoDB.',
                },
            ],
        });
        logger.info('✅ Profile seeded successfully.');

        // ─── Create Skills ────────────────────────────────────────────────────
        const skills = [
            // Frontend
            { name: 'HTML5', category: 'Frontend', percentage: 90, icon: 'FaHtml5', color: '#E34F26', order: 1 },
            { name: 'CSS3', category: 'Frontend', percentage: 85, icon: 'FaCss3Alt', color: '#1572B6', order: 2 },
            { name: 'JavaScript ES6+', category: 'Frontend', percentage: 80, icon: 'FaJs', color: '#F7DF1E', order: 3 },
            { name: 'Bootstrap 5', category: 'Frontend', percentage: 85, icon: 'FaBootstrap', color: '#7952B3', order: 4 },
            { name: 'React.js', category: 'Frontend', percentage: 78, icon: 'FaReact', color: '#61DAFB', order: 5 },
            // Backend
            { name: 'Node.js', category: 'Backend', percentage: 75, icon: 'FaNodeJs', color: '#339933', order: 1 },
            { name: 'Express.js', category: 'Backend', percentage: 75, icon: 'SiExpress', color: '#404040', order: 2 },
            { name: 'RESTful APIs', category: 'Backend', percentage: 78, icon: 'MdApi', color: '#FF5722', order: 3 },
            { name: 'JWT Auth', category: 'Backend', percentage: 70, icon: 'MdSecurity', color: '#d63aff', order: 4 },
            // Database
            { name: 'MongoDB', category: 'Database', percentage: 72, icon: 'SiMongodb', color: '#47A248', order: 1 },
            { name: 'Mongoose', category: 'Database', percentage: 72, icon: 'SiMongodb', color: '#800020', order: 2 },
            // Tools
            { name: 'Git & GitHub', category: 'Tools', percentage: 80, icon: 'FaGithub', color: '#181717', order: 1 },
            { name: 'VS Code', category: 'Tools', percentage: 90, icon: 'FiCode', color: '#007ACC', order: 2 },
            { name: 'Postman', category: 'Tools', percentage: 80, icon: 'SiPostman', color: '#FF6C37', order: 3 },
            { name: 'npm', category: 'Tools', percentage: 82, icon: 'FaNpm', color: '#CB3837', order: 4 },
            // Soft Skills
            { name: 'Problem Solving', category: 'Soft Skills', percentage: 85, icon: 'MdLightbulb', color: '#FFC107', order: 1 },
            { name: 'Team Work', category: 'Soft Skills', percentage: 88, icon: 'MdPeople', color: '#2196F3', order: 2 },
            { name: 'Communication', category: 'Soft Skills', percentage: 82, icon: 'MdChat', color: '#4CAF50', order: 3 },
            { name: 'Time Management', category: 'Soft Skills', percentage: 80, icon: 'MdAccessTime', color: '#FF5722', order: 4 },
        ];
        await Skill.insertMany(skills);
        logger.info('✅ Skills seeded successfully.');

        // ─── Create Experience ────────────────────────────────────────────────
        await Experience.create({
            company: 'Tech Startup / Your Company Name',
            position: 'Full Stack MERN Developer Intern',
            type: 'Internship',
            location: 'Chennai, Tamil Nadu (Remote)',
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-03-31'),
            isCurrent: false,
            description:
                'Completed a 3-month internship gaining hands-on experience in full-stack web development using the MERN stack.',
            responsibilities: [
                'Developed and maintained React.js components for the company dashboard.',
                'Built RESTful APIs using Node.js and Express.js.',
                'Designed and managed MongoDB schemas using Mongoose.',
                'Integrated JWT-based authentication and authorization.',
                'Collaborated with senior developers and participated in code reviews.',
                'Used Git for version control and GitHub for team collaboration.',
            ],
            technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'Bootstrap 5', 'Git'],
            order: 1,
        });
        logger.info('✅ Experience seeded successfully.');

        logger.info('');
        logger.info('══════════════════════════════════════════');
        logger.info('  Database seeded successfully!');
        logger.info('  Admin credentials:');
        logger.info(`  Name      : ${process.env.ADMIN_NAME || 'admin'}`);
        logger.info(`  Secret Key: ${process.env.ADMIN_SECRET_KEY}`);
        logger.info('  Login URL : http://localhost:5173/admin/login');
        logger.info('══════════════════════════════════════════');

        process.exit(0);
    } catch (err) {
        logger.error(`Seeding failed: ${err.message}`);
        console.error(err);
        process.exit(1);
    }
};

seed();