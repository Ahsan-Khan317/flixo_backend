import User from '../models/user.js';

export const addToFavorites = async (req, res) => {
  try {
    const { movieId, title, posterPath } = req.body;

    if (!movieId || !title) {
      return res.status(400).json({
        success: false,
        message: 'Movie ID and title are required'
      });
    }

    const user = await User.findById(req.user.id);

    const exists = user.favorites.some(fav => fav.movieId === movieId);
    
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Movie already in favorites'
      });
    }

    user.favorites.push({
      movieId,
      title,
      posterPath
    });

    await user.save();

    res.json({
      success: true,
      message: 'Added to favorites',
      favorites: user.favorites
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const removeFromFavorites = async (req, res) => {
  try {
    const { movieId } = req.params;

    const user = await User.findById(req.user.id);

    user.favorites = user.favorites.filter(
      fav => fav.movieId !== parseInt(movieId)
    );

    await user.save();

    res.json({
      success: true,
      message: 'Removed from favorites',
      favorites: user.favorites
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const addToHistory = async (req, res) => {
  try {
    const { movieId, title, posterPath } = req.body;

    if (!movieId || !title) {
      return res.status(400).json({
        success: false,
        message: 'Movie ID and title are required'
      });
    }

    const user = await User.findById(req.user.id);

    user.watchHistory = user.watchHistory.filter(
      item => item.movieId !== movieId
    );

    user.watchHistory.unshift({
      movieId,
      title,
      posterPath
    });

    if (user.watchHistory.length > 50) {
      user.watchHistory = user.watchHistory.slice(0, 50);
    }

    await user.save();

    res.json({
      success: true,
      history: user.watchHistory
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('favorites');

    res.json({
      success: true,
      favorites: user.favorites
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const getHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('watchHistory');

    res.json({
      success: true,
      history: user.watchHistory
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};