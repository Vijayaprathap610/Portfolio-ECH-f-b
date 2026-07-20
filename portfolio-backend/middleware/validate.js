const { validationResult, body, param, query } = require('express-validator');
const { sendError } = require('../utils/response');

// ─── Run validations and return errors if any ────────────────────────────────
const runValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map((err) => ({
            field: err.path || err.param,
            message: err.msg,
            value: err.value,
        }));
        return res.status(422).json(sendError(422, 'Validation failed.', formattedErrors));
    }
    next();
};

// ─── Auth Validators ─────────────────────────────────────────────────────────
const validateAdminLogin = [
    body('name')
        .trim()
        .notEmpty().withMessage('Admin name is required.')
        .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters.')
        // Use customSanitizer to convert to lowercase
        .customSanitizer((val) => (val ? val.toLowerCase() : val)),
    body('secretKey')
        .notEmpty().withMessage('Secret key is required.')
        .isLength({ min: 6, max: 200 }).withMessage('Secret key must be between 6 and 200 characters.'),
    runValidation,
];

// ─── Profile Validators ──────────────────────────────────────────────────────
const validateProfile = [
    body('fullName')
        .trim()
        .notEmpty().withMessage('Full name is required.')
        .isLength({ max: 100 }).withMessage('Full name cannot exceed 100 characters.'),
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required.')
        .isLength({ max: 150 }).withMessage('Title cannot exceed 150 characters.'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required.')
        .isEmail().withMessage('Please enter a valid email address.')
        .normalizeEmail(),
    body('phone')
        .optional()
        .trim()
        .isLength({ max: 20 }).withMessage('Phone cannot exceed 20 characters.'),
    body('bio')
        .optional()
        .trim()
        .isLength({ max: 2000 }).withMessage('Bio cannot exceed 2000 characters.'),
    body('objective')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('Objective cannot exceed 1000 characters.'),
    runValidation,
];

// ─── Skill Validators ────────────────────────────────────────────────────────
const validateSkill = [
    body('name')
        .trim()
        .notEmpty().withMessage('Skill name is required.')
        .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters.'),
    body('category')
        .trim()
        .notEmpty().withMessage('Category is required.')
        .isIn(['Frontend', 'Backend', 'Database', 'Tools', 'Soft Skills'])
        .withMessage('Category must be one of: Frontend, Backend, Database, Tools, Soft Skills.'),
    body('percentage')
        .notEmpty().withMessage('Percentage is required.')
        .isInt({ min: 0, max: 100 }).withMessage('Percentage must be between 0 and 100.'),
    body('color')
        .optional()
        .trim()
        .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
        .withMessage('Color must be a valid hex color (e.g. #6c63ff).'),
    runValidation,
];

// ─── Project Validators ──────────────────────────────────────────────────────
const validateProject = [
    body('title')
        .trim()
        .notEmpty().withMessage('Project title is required.')
        .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters.'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required.')
        .isLength({ max: 3000 }).withMessage('Description cannot exceed 3000 characters.'),
    body('category')
        .optional()
        .trim()
        .isIn(['Web App', 'Mobile App', 'API', 'UI/UX', 'Open Source', 'Other'])
        .withMessage('Invalid category.'),
    body('liveUrl')
        .optional({ nullable: true, checkFalsy: true })
        .isURL().withMessage('Live URL must be a valid URL.'),
    body('githubUrl')
        .optional({ nullable: true, checkFalsy: true })
        .isURL().withMessage('GitHub URL must be a valid URL.'),
    runValidation,
];

// ─── Experience Validators ───────────────────────────────────────────────────
const validateExperience = [
    body('company')
        .trim()
        .notEmpty().withMessage('Company name is required.')
        .isLength({ max: 200 }).withMessage('Company cannot exceed 200 characters.'),
    body('position')
        .trim()
        .notEmpty().withMessage('Position is required.')
        .isLength({ max: 200 }).withMessage('Position cannot exceed 200 characters.'),
    body('startDate')
        .notEmpty().withMessage('Start date is required.')
        .isISO8601().withMessage('Start date must be a valid ISO 8601 date.'),
    body('endDate')
        .optional({ nullable: true, checkFalsy: true })
        .isISO8601().withMessage('End date must be a valid ISO 8601 date.'),
    body('type')
        .optional()
        .isIn(['Full-time', 'Part-time', 'Internship', 'Freelance', 'Contract', 'Volunteer'])
        .withMessage('Invalid employment type.'),
    runValidation,
];

// ─── Certification Validators ────────────────────────────────────────────────
const validateCertification = [
    body('title')
        .trim()
        .notEmpty().withMessage('Certificate title is required.')
        .isLength({ max: 300 }).withMessage('Title cannot exceed 300 characters.'),
    body('organization')
        .trim()
        .notEmpty().withMessage('Organization is required.')
        .isLength({ max: 200 }).withMessage('Organization cannot exceed 200 characters.'),
    body('issueDate')
        .notEmpty().withMessage('Issue date is required.')
        .isISO8601().withMessage('Issue date must be a valid ISO 8601 date.'),
    body('credentialUrl')
        .optional({ nullable: true, checkFalsy: true })
        .isURL().withMessage('Credential URL must be a valid URL.'),
    runValidation,
];

// ─── Testimonial Validators ──────────────────────────────────────────────────
const validateTestimonial = [
    body('name')
        .trim()
        .notEmpty().withMessage('Your name is required.')
        .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters.'),
    body('message')
        .trim()
        .notEmpty().withMessage('Testimonial message is required.')
        .isLength({ min: 20, max: 1000 })
        .withMessage('Message must be between 20 and 1000 characters.'),
    body('rating')
        .notEmpty().withMessage('Rating is required.')
        .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5.'),
    body('company')
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage('Company cannot exceed 200 characters.'),
    body('position')
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage('Position cannot exceed 200 characters.'),
    runValidation,
];

// ─── Contact Validators ──────────────────────────────────────────────────────
const validateContact = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required.')
        .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters.'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required.')
        .isEmail().withMessage('Please enter a valid email address.')
        .normalizeEmail(),
    body('phone')
        .optional()
        .trim()
        .isLength({ max: 20 }).withMessage('Phone cannot exceed 20 characters.')
        .matches(/^[+\d\s\-(). ]*$/)
        .withMessage('Phone number contains invalid characters.'),
    body('subject')
        .trim()
        .notEmpty().withMessage('Subject is required.')
        .isLength({ max: 300 }).withMessage('Subject cannot exceed 300 characters.'),
    body('message')
        .trim()
        .notEmpty().withMessage('Message is required.')
        .isLength({ min: 10, max: 5000 })
        .withMessage('Message must be between 10 and 5000 characters.'),
    runValidation,
];

// ─── Param Validators ────────────────────────────────────────────────────────
const validateObjectId = [
    param('id')
        .isMongoId().withMessage('Invalid ID format. Must be a valid MongoDB ObjectId.'),
    runValidation,
];

// ─── Query Validators ────────────────────────────────────────────────────────
const validatePagination = [
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer.'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100.'),
    runValidation,
];

module.exports = {
    runValidation,
    validateAdminLogin,
    validateProfile,
    validateSkill,
    validateProject,
    validateExperience,
    validateCertification,
    validateTestimonial,
    validateContact,
    validateObjectId,
    validatePagination,
};