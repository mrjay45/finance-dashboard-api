const express = require('express');

const router = express.Router();

const userController = require('../controllers/users.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.get("/get-users", authMiddleware, roleMiddleware('admin'), userController.getAllUsers);
router.get("/get-user/:id", authMiddleware, roleMiddleware('admin'), userController.getUserById);

module.exports = router;