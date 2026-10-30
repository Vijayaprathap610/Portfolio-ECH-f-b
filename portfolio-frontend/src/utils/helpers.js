const UPLOADS_URL = import.meta.env?.VITE_UPLOADS_URL || "";

/**
 * Build full URL for uploaded files
 */
export const getImageUrl = (path) => {
    if (!path) return "/placeholder.svg";
    if (
        path.startsWith("http://") ||
        path.startsWith("https://") ||
        path.startsWith("data:") ||
        path.startsWith("blob:")
    ) {
        return path;
    }
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    // If UPLOADS_URL is not set (e.g. dev mode), return relative path to let Vite dev proxy handle it
    if (!UPLOADS_URL) {
        return normalizedPath;
    }
    return `${UPLOADS_URL}${normalizedPath}`;
};

/**
 * Format date to readable string
 */
export const formatDate = (date, options = {}) => {
    if (!date) return '';
    const defaultOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

/**
 * Format date to month-year only (for experience/certifications)
 */
export const formatMonthYear = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
};

/**
 * Truncate text to specified length
 */
export const truncate = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trimEnd() + '...';
};

/**
 * Extract error message from Axios error response
 */
export const getErrorMessage = (error) => {
    if (error?.response?.data?.message) return error.response.data.message;
    if (error?.response?.data?.errors?.length)
        return error.response.data.errors.map((e) => e.message).join(', ');
    if (error?.message) return error.message;
    return 'An unexpected error occurred. Please try again.';
};

/**
 * Debounce function
 */
export const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
};

/**
 * Smooth scroll to section by ID
 */
export const scrollToSection = (sectionId, offset = 80) => {
    const el = document.getElementById(sectionId);
    if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    }
};

/**
 * Render star rating string as array
 */
export const getRatingStars = (rating, max = 5) => {
    return Array.from({ length: max }, (_, i) => ({
        filled: i < Math.floor(rating),
        half: i === Math.floor(rating) && rating % 1 >= 0.5,
    }));
};

/**
 * Generate initials from full name
 */
export const getInitials = (name = '') => {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join('');
};

/**
 * Check if value is valid MongoDB ObjectId
 */
export const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);

/**
 * Capitalize first letter of each word
 */
export const toTitleCase = (str) =>
    str?.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()) || '';
