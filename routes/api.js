const express = require('express');
const router = express.Router();
const isAuthenticatedApi = require('../middleware/isAuthenticatedApi');
const taskController = require('../controllers/taskController');

router.use(isAuthenticatedApi);

router.get('/tasks', taskController.apiGetAllTasks);
router.get('/tasks/:id', taskController.apiGetTask);
router.post('/tasks', taskController.apiCreateTask);
router.put('/tasks/:id', taskController.apiUpdateTask);
router.delete('/tasks/:id', taskController.apiDeleteTask);

module.exports = router;
