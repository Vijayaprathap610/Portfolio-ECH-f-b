const express = require('express');
require('dotenv').config();
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('./middleware/mongoSanitize');
const hpp = require('hpp');
const path = require('path');
const connectDB = require('./config/db');
const requestLogger = require('./middleware/requestLogger');
const logger = require('./utils/logger');
const { apiLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFound } = require('./middleware/errorHandler');
// Import Routes
const authRoute = require('./routes/authRoute');
const profileRoute = require('./routes/profileRoute');
const skillsRoute = require('./routes/skillsRoute');
const projectRoute = require('./routes/projectRoute');
const experienceRoute = require('./routes/experienceRoute');
const certificationsRoute = require('./routes/certificationsRoute');
const testimonialsRoute = require('./routes/testimonialsRoute');
const contactRoute = require('./routes/contactRoute');
const analyticsRoute = require('./routes/analyticsRoute');



const app = express();
connectDB();

// ─── Trust Proxy ──────────────────────────────────────────────────────────────
// Required in production when deployed behind a reverse proxy / load balancer
// (Heroku, Render, Railway, Nginx, AWS ELB, Vercel, etc.). Without this, Express
// ignores the X-Forwarded-For header and req.ip always resolves to the proxy's
// own IP for every request — which silently breaks per-IP rate limiting,
// account-lockout tracking, contact/testimonial spam limits, and visitor
// analytics (every visitor would be counted as the same single "IP").
// `1` means "trust exactly one hop" (the immediate proxy) — the secure default,
// since trusting an unbounded number of hops allows IP spoofing via a
// client-supplied X-Forwarded-For header.
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// ─── Security Headers (Helmet) ───────────────────────────────────────────────
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        contentSecurityPolicy: false, // Disabled for API; enable for SSR
    })
);

// ─── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim());

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error(`CORS blocked: origin ${origin} not allowed.`));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
        optionsSuccessStatus: 200,
    })
);

// ─── Body Parsers ────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ─── Security Middleware ─────────────────────────────────────────────────────
app.use(mongoSanitize);
app.use(hpp());             // HTTP Parameter Pollution protection

// ─── Compression ─────────────────────────────────────────────────────────────
app.use(compression());

// ─── Request Logger ──────────────────────────────────────────────────────────
app.use(requestLogger);

// ─── Static Files — Serve Uploaded Images ────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Global API Rate Limiter ─────────────────────────────────────────────────
app.use('/api', apiLimiter);

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'EliteCodeHub Backend API is running.',
        health: '/api/health'
    });
});
// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 200,
        message: 'EliteCodeHub API is running.',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use('/api/auth', authRoute);
app.use('/api/profile', profileRoute);
app.use('/api/skills', skillsRoute);
app.use('/api/projects', projectRoute);
app.use('/api/experience', experienceRoute);
app.use('/api/certifications', certificationsRoute);
app.use('/api/testimonials', testimonialsRoute);
app.use('/api/contact', contactRoute);
app.use('/api/analytics', analyticsRoute);

// ─── 404 Handler ────────────────────────────────────────────────────────────
app.use(notFound);

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    logger.info(`
╔═══════════════════════════════════════════════╗
║         EliteCodeHub API Server               ║
║  Environment : ${(process.env.NODE_ENV || 'production').padEnd(30)}║
║  Port        : ${String(PORT).padEnd(30)}║
║  URL         : http://localhost:${PORT}          ║
╚═══════════════════════════════════════════════╝
  `);
});

// ─── Graceful Shutdown ───────────────────────────────────────────────────────
const shutdown = (signal) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
    });
    setTimeout(() => {
        logger.error('Forced shutdown after timeout.');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled Rejection: ${reason}`);
    shutdown('unhandledRejection');
});

module.exports = app;