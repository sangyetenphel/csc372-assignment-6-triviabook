/**
 * @file Wraps async route handlers so rejected promises reach Express error middleware.
 */

/**
 * @param {Function} handler - Async Express handler.
 * @return {Function} A standard Express handler.
 */
function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;