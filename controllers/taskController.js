const Task = require('../models/Task');

// Converts a multer in-memory file into a base64 data URI for storage
// directly on the Task document (no separate file storage needed).
function filePhotoToDataUri(file) {
  if (!file) return null;
  return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
}

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

exports.renderPrintReport = async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ dateTime: 1 });
    const generatedAt = new Date();
    // Rendered without the main layout (no navbar/flash banners) since
    // this is a standalone printable page, not part of the app chrome.
    res.render('tasks/print', { title: 'Task Report', tasks, generatedAt, layout: false });
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
    const photo = filePhotoToDataUri(req.file);
    const payload = { ...req.body, createdBy: req.user?._id };
    if (photo) payload.photo = photo;

    await Task.create(payload);
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
    const photo = filePhotoToDataUri(req.file);
    const payload = { ...req.body };
    if (photo) payload.photo = photo; // only overwrite if a new file was uploaded
    if (req.body.removePhoto === 'true' && !photo) {
      payload.photo = '';
    }
    delete payload.removePhoto; // not a schema field, just a form control

    await Task.findByIdAndUpdate(req.params.id, payload, { runValidators: true });
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
