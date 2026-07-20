const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {sendError} = require('../utils/response')

//ensure the upload directory exists
const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Storage factory - creates destination-specific storage
const createStorage = (destination) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path.join(__dirname, '..', 'uploads', destination);
            ensureDir(uploadPath);
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            const ext = path.extname(file.originalname).toLowerCase();
            const baseName = path.basename(file.originalname, ext)
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/gi, '')
                .toLowerCase();
            cb(null, `${baseName}-${uniqueSuffix}${ext}`);
        },
    });
};

// Allowed MIME types
const IMAGE_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

// File filter - images only
const imageFilter = (req, file, cb) => {
    if (IMAGE_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(`Invalid file type. Allowed: ${IMAGE_MIME_TYPES.join(', ')}`),
            false
        );
    }
};

// Max file size in bytes (default 5MB)
const MAX_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024;

// Upload configurations
const uploadProfile = multer({
    storage: createStorage('profile'),
    fileFilter: imageFilter,
    limits: { fileSize: MAX_SIZE },
});

const uploadProject = multer({
    storage: createStorage('projects'),
    fileFilter: imageFilter,
    limits: { fileSize: MAX_SIZE, files: 10 },
});

const uploadCertification = multer({
    storage: createStorage('certifications'),
    fileFilter: imageFilter,
    limits: { fileSize: MAX_SIZE },
});

// Multer error handling wrapper middleware
const handleUploadError = (uploadFn) => {
    return (req, res, next) => {
        uploadFn(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json(
                        sendError(400, `File too large. Maximum allowed size is ${MAX_SIZE / (1024 * 1024)}MB.`)
                    );
                }
                if (err.code === 'LIMIT_FILE_COUNT') {
                    return res.status(400).json(sendError(400, 'Too many files uploaded at once.'));
                }
                return res.status(400).json(sendError(400, `Upload error: ${err.message}`));
            }
            if (err) {
                return res.status(400).json(sendError(400, err.message));
            }
            next();
        });
    };
};

module.exports = {uploadProfile, uploadProject, uploadCertification, handleUploadError};