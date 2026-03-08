import express from 'express';
import {
  getAllUsers,
  toggleBanUser,
  deleteUser,
  addMovieManually,
  updateMovie,
  deleteMovie
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(isAdmin);

router.get('/users', getAllUsers);
router.put('/users/:id/ban', toggleBanUser);
router.delete('/users/:id', deleteUser);

router.post('/movies', addMovieManually);
router.put('/movies/:id', updateMovie);
router.delete('/movies/:id', deleteMovie);

export default router;