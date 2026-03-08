import axios from 'axios';

const TMDB_ACCESS_TOKEN = process.env.TMDB_TOKEN;
const BASE_URL = 'process.env.BASE_URL';

// Get 100 movies with just their trailers (PERFECT for your needs)
export const getMoviesForDisplay = async (req, res) => {
  try {
    const { category = 'popular', page = 1 } = req.query;
    
    // 1. Fetch 20 movies from TMDB (basic info only)
    const listResponse = await axios.get(
      `${BASE_URL}/movie/${category}?page=${page}`,
      { headers: { 'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}` } }
    );
    
    const movies = listResponse.data.results;
    const movieIds = movies.map(m => m.id);
    
    // 2. Fetch ONLY videos for these movies (not full details)
    // This gives us trailers without all the extra data we don't need
    const videosPromises = movieIds.map(id =>
      axios.get(
        `${BASE_URL}/movie/${id}/videos`,
        { headers: { 'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}` } }
      ).catch(() => ({ data: { results: [] } }))
    );
    
    const videosResponses = await Promise.all(videosPromises);
    
    // 3. Create a map of movieId -> trailer
    const trailerMap = new Map();
    videosResponses.forEach((response, index) => {
      const movieId = movieIds[index];
      const videos = response.data.results;
      
      // Find the official trailer
      const trailer = videos.find(
        v => v.type === 'Trailer' && v.site === 'YouTube' && v.official === true
      ) || videos.find(
        v => v.type === 'Trailer' && v.site === 'YouTube'
      ) || videos.find(
        v => v.type === 'Teaser' && v.site === 'YouTube'
      ) || videos[0];
      
      trailerMap.set(movieId, {
        key: trailer?.key,
        name: trailer?.name,
        site: trailer?.site
      });
    });
    
    // 4. Merge trailers with movie data
    const moviesWithTrailers = movies.map(movie => ({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      overview: movie.overview,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      vote_count: movie.vote_count,
      // Add just the trailer info (not all videos)
      trailer: trailerMap.get(movie.id) || null
    }));
    
    res.json({
      success: true,
      page: listResponse.data.page,
      totalPages: listResponse.data.total_pages,
      totalResults: listResponse.data.total_results,
      results: moviesWithTrailers
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching movies' 
    });
  }
};

// Get SINGLE movie details (when user clicks on a movie)
export const getMovieDetail = async (req, res) => {
  try {
    const { id } = req.params;
    
    // For single movie, fetch ALL details including videos and images
    const response = await axios.get(
      `${BASE_URL}/movie/${id}?append_to_response=videos,images,credits`,
      { headers: { 'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}` } }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching movie details' 
    });
  }
};

