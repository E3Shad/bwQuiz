const rateLimit = require ("express-rate-limit");

const limiter = rateLimit({
                  windowMs: 20 * 1000, // 3 seconds
                  max: 5 // limit each IP to 3 requests per windowMs
                });
module.exports = limiter;