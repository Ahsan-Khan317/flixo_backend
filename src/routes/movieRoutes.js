import express from 'express';
import { 
  getMoviesForDisplay,
  getMovieDetail 
} from '../controllers/movieController.js';

const router = express.Router();

// For lists (home page, movies page, etc.) - returns 20 movies with trailers
router.get('/:category', getMoviesForDisplay); // /api/movies/popular?page=1
router.get('/:category/:page', getMoviesForDisplay); // /api/movies/popular/2

// For single movie detail page
router.get('/detail/:id', getMovieDetail); // /api/movies/detail/111

export default router;