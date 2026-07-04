module.exports = function errorHandler(err, req, res, next) {
  console.error('ERROR HANDLER CAUGHT:', err.stack);

  if (req.originalUrl.startsWith('/api/')) {
    return res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal Server Error',
    });
  }

  // req.flash may not be available if an earlier middleware (e.g. the
  // session store) failed before connect-flash was reached.
  if (typeof req.flash === 'function') {
    req.flash('error_msg', err.message || 'Something went wrong.');
  }

  res.redirect(req.get('Referer') || '/tasks');
};
