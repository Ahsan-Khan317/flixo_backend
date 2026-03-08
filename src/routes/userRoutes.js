import express from 'express';
import {
  addToFavorites,
  removeFromFavorites,
  addToHistory,
  getFavorites,
  getHistory
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/favorites')
  .get(getFavorites)
  .post(addToFavorites);

router.delete('/favorites/:movieId', removeFromFavorites);

router.route('/history')
  .get(getHistory)
  .post(addToHistory);

export default router;