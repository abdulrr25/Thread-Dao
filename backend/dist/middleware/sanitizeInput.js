import DOMPurify from 'isomorphic-dompurify';
const sanitizeValue = (value) => {
    if (typeof value === 'string') {
        return DOMPurify.sanitize(value.trim());
    }
    if (Array.isArray(value)) {
        return value.map(sanitizeValue);
    }
    if (typeof value === 'object' && value !== null) {
        return Object.keys(value).reduce((acc, key) => {
            acc[key] = sanitizeValue(value[key]);
            return acc;
        }, {});
    }
    return value;
};
export const sanitizeInput = (req, _res, next) => {
    try {
        // Sanitize request body
        if (req.body) {
            req.body = sanitizeValue(req.body);
        }
        // Sanitize query parameters
        if (req.query) {
            req.query = sanitizeValue(req.query);
        }
        // Sanitize URL parameters
        if (req.params) {
            req.params = sanitizeValue(req.params);
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
