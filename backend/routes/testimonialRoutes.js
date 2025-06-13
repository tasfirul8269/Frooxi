import express from 'express';
import {
  getTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} from '../controllers/testimonialController.js';
import { auth } from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Public routes
router.get('/', getTestimonials);
router.get('/:id', getTestimonial);

// Protected routes (Admin only)
router.post('/', [auth, adminAuth], createTestimonial);
router.put('/:id', [auth, adminAuth], updateTestimonial);
router.delete('/:id', [auth, adminAuth], deleteTestimonial);

export default router; 