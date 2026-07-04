module.exports = function errorHandler(err, req, res, next) {
  console.error('ERROR HANDLER CAUGHT:', err.stack);

  if (req.originalUrl.startsWith('/api/')) {
    return res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal Server Error',
    });
  }

  if (typeof req.flash === 'function') {
    req.flash('error_msg', err.message || 'Something went wrong.');
  }

  res.redirect(req.get('Referer') || '/tasks');
};