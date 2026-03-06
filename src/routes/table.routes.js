const express = require('express');
const router = express.Router();
const tableController = require('../controllers/table.controller');
const { authorize } = require('../auth/auth.middlewares');

//public routes 
router.get('/', tableController.getAllTables);
router.get('/:id', tableController.getTableById);

//Admin only
router.post('/', authorize('admin'), tableController.createTable);
router.put('/:id', authorize('admin'), tableController.updateTable);
router.delete('/:id', authorize('admin'), tableController.deleteTable);

module.exports = router;
