const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/isAuthenticated');
const taskController = require('../controllers/taskController');

router.use(isAuthenticated);

router.get('/', taskController.renderTaskList);
router.get('/new', taskController.renderCreateForm);
router.post('/', taskController.handleCreate);
router.get('/:id/edit', taskController.renderEditForm);
router.put('/:id', taskController.handleUpdate);
router.delete('/:id', taskController.handleDelete);

module.exports = router;
