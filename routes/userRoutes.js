import express from 'express';
const router = express.Router();
import UserController from '../controllers/userController.js';

// ROute Level Middleware - To Protect Route


// Public Routes
router.post('/register', UserController.userRegistration)


// Protected Routes



export default router