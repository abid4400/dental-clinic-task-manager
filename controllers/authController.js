const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

exports.getLogin = (req, res) => {
  res.render('auth/login', { title: 'Login' });
};

exports.getRegister = (req, res) => {
  res.render('auth/register', { title: 'Register' });
};

exports.postRegister = async (req, res, next) => {
  try {
    const { username, password, password2 } = req.body;
    const errors = [];

    if (!username || !password || !password2) {
      errors.push('Please fill in all fields.');
    }
    if (password !== password2) {
      errors.push('Passwords do not match.');
    }
    if (password && password.length < 6) {
      errors.push('Password must be at least 6 characters.');
    }

    if (errors.length > 0) {
      return res.render('auth/register', { title: 'Register', errors, username });
    }

    const existingUser = await User.findOne({ username: username.trim().toLowerCase() });
    if (existingUser) {
      return res.render('auth/register', {
        title: 'Register',
        errors: ['That username is already taken.'],
        username,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username: username.trim().toLowerCase(), password: hashedPassword });

    req.flash('success_msg', 'Registration successful. Please log in.');
    res.redirect('/auth/login');
  } catch (err) {
    next(err);
  }
};

exports.postLogin = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/tasks',
    failureRedirect: '/auth/login',
    failureFlash: true,
  })(req, res, next);
};

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash('success_msg', 'You have been logged out.');
    res.redirect('/auth/login');
  });
};
