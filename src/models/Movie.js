import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  tmdbId: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  overview: String,
  posterPath: String,
  backdropPath: String,
  releaseDate: String,
  voteAverage: Number,
  voteCount: Number,
  genres: [{
    id: Number,
    name: String
  }],
  runtime: Number,
  trailerKey: String,
  category: {
    type: String,
    enum: ['movie', 'tv', 'trending', 'popular'],
    default: 'movie'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// ✅ Fix: Check if model already exists before creating
const Movie = mongoose.models.Movie || mongoose.model('Movie', movieSchema);

export default Movie;