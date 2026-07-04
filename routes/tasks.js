const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/isAuthenticated');
const upload = require('../middleware/upload');
const taskController = require('../controllers/taskController');

router.use(isAuthenticated);

router.get('/', taskController.renderTaskList);
router.get('/report/print', taskController.renderPrintReport);
router.get('/new', taskController.renderCreateForm);
router.post('/', upload.single('photo'), taskController.handleCreate);
router.get('/:id/edit', taskController.renderEditForm);
router.put('/:id', upload.single('photo'), taskController.handleUpdate);
router.delete('/:id', taskController.handleDelete);

module.exports = router;

