const Task = require('../models/Task');

// ---------- JSON API Handlers (used by routes/api.js) ----------

exports.apiGetAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ dateTime: 1 });
    res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    next(err);
  }
};

exports.apiGetTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

exports.apiCreateTask = async (req, res, next) => {
  try {
    const task = await Task.create({ ...req.body, createdBy: req.user?._id });
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    next(err);
  }
};

exports.apiUpdateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(200).json({ success: true, data: task });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    next(err);
  }
};

exports.apiDeleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(200).json({ success: true, message: 'Task deleted', data: task });
  } catch (err) {
    next(err);
  }
};

// ---------- Server-Rendered (EJS) Handlers (used by routes/tasks.js) ----------

exports.renderTaskList = async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ dateTime: 1 });
    res.render('tasks/index', { title: 'All Tasks', tasks });
  } catch (err) {
    next(err);
  }
};

exports.renderCreateForm = (req, res) => {
  res.render('tasks/create', { title: 'New Task' });
};

exports.renderEditForm = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      req.flash('error_msg', 'Task not found.');
      return res.redirect('/tasks');
    }
    res.render('tasks/edit', { title: 'Edit Task', task });
  } catch (err) {
    next(err);
  }
};

exports.handleCreate = async (req, res, next) => {
  try {
    await Task.create({ ...req.body, createdBy: req.user?._id });
    req.flash('success_msg', 'Task created successfully.');
    res.redirect('/tasks');
  } catch (err) {
    if (err.name === 'ValidationError') {
      req.flash('error_msg', err.message);
      return res.redirect('/tasks/new');
    }
    next(err);
  }
};

exports.handleUpdate = async (req, res, next) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, req.body, { runValidators: true });
    req.flash('success_msg', 'Task updated successfully.');
    res.redirect('/tasks');
  } catch (err) {
    if (err.name === 'ValidationError') {
      req.flash('error_msg', err.message);
      return res.redirect(`/tasks/${req.params.id}/edit`);
    }
    next(err);
  }
};

exports.handleDelete = async (req, res, next) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Task deleted successfully.');
    res.redirect('/tasks');
  } catch (err) {
    next(err);
  }
};
