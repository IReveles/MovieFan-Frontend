import apiClient from './services.js';

const MovieService = {
  // Search for movies and TV shows
  search(query, page = 1) {
    return apiClient.get(`/movies/search`, {
      params: { query, page }
    });
  },

  // Get or create movie in database
  getOrCreate(tmdbId, mediaType) {
    return apiClient.post('/movies/get-or-create', {
      tmdb_id: tmdbId,
      media_type: mediaType
    });
  },

  // Get movie by ID
  getById(id) {
    return apiClient.get(`/movies/${id}`);
  }
};

export default MovieService;