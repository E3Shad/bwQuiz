const rateLimit = require ("express-rate-limit");

const limiter = rateLimit({
                  windowMs: 3 * 1000, // 3 seconds
                  max: 3 // limit each IP to 3 requests per windowMs
                });
module.exports = limiter;