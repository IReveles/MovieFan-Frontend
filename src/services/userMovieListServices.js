import apiClient from './services.js';

const UserMovieListService = {
  // Add movie to user's list
  addToList(tmdbId, mediaType, status, userId, isFavorite = false) {
    return apiClient.post('/user-movie-list/add-to-list', {
      tmdb_id: tmdbId,
      media_type: mediaType,
      status,
      user_id: userId,
      is_favorite: isFavorite
    });
  },

  // Get user's movie lists
  getMyLists(userId, status = null, favoritesOnly = false) {
    const params = { user_id: userId };
    if (status) params.status = status;
    if (favoritesOnly) params.favorites_only = 'true';

    return apiClient.get('/user-movie-list/my-lists', { params });
  },

  // Update movie entry (rating, review, status, favorite)
  updateEntry(entryId, userId, updateData) {
    return apiClient.put(`/user-movie-list/${entryId}`, {
      user_id: userId,
      ...updateData
    });
  },

  // Remove movie from list
  removeFromList(entryId, userId) {
    return apiClient.delete(`/user-movie-list/${entryId}`, {
      params: { user_id: userId }
    });
  },

  // Get user stats
  getStats(userId) {
    return apiClient.get('/user-movie-list/stats', {
      params: { user_id: userId }
    });
  }
};

export default UserMovieListService;