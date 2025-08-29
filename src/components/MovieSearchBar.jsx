import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Heart, Star, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import MovieServices from '../services/movieServices.js';
import UserMovieListServices from '../services/userMovieListServices.js';
import useUserStore from "@/store/userStore";

const MovieSearchBar = () => {
  const { user } = useUserStore(); 
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');
  const currentUser = user?.user;

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      searchMovies(query);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const searchMovies = async (searchQuery) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await MovieServices.search(searchQuery);
      setResults(response.data.results || []);
      setIsOpen(true);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.response?.data?.error || err.message || 'Search failed');
      setResults([]);
      setIsOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const addToList = async (movie, status, isFavorite = false) => {
    // Check if user is logged in
    if (!currentUser || !currentUser.id) {
      console.error('User not logged in');
      return;
    }

    try {
      const response = await UserMovieListServices.addToList(
        movie.tmdb_id,
        movie.media_type,
        status,
        currentUser.id,
        isFavorite
      );

      setIsOpen(false);
      setQuery('');
      console.log('Movie added successfully:', response.data.message);
      
    } catch (err) {
      console.error('Error adding movie:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).getFullYear();
  };

  const getMediaTypeIcon = (mediaType) => {
    return mediaType === 'tv' ? '📺' : '🎬';
  };

  return (
    <div className="relative w-full max-w-[285px] mx-2 mt-4 lg:max-w-[440px]">
      {/* Search Input */}
      <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
        <Input
          type="text"
          placeholder="Search for movies, TV shows..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
            style={{ boxShadow: 'none' }}
          className="font-serif pl-10 pr-4 h-10 bg-white/80 rounded-xl border hover:border-slate-500 focus:border-slate-500 text-center lg:h-12"
        />

        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-700"></div>
          </div>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Results Container */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border z-20 max-h-96 overflow-y-auto no-scrollbar">
            {error && (
              <div className="p-4 text-center text-red-500 text-sm">
                {error}
              </div>
            )}

            {!error && results.length === 0 && !loading && (
              <div className="p-4 text-center text-gray-500 text-sm">
                No results found for "{query}"
              </div>
            )}

            {results.map((movie) => (
              <div key={movie.tmdb_id} className="border-b last:border-b-0 hover:bg-slate-400/50 transition-colors">
                <div className="p-3 flex gap-3">
                  {/* Movie Poster */}
                  <div className="flex-shrink-0 w-12 h-16 rounded overflow-hidden bg-gray-200 ">
                    {movie.poster_url ? (
                      <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg">
                        {getMediaTypeIcon(movie.media_type)}
                      </div>
                    )}
                  </div>

                  {/* Movie Info */}
                  <div className="flex-grow min-w-0 space-y-1">
                    <div className="flex items-start gap-2">
                      <h4 className="font-serif font-medium text-sm leading-tight line-clamp-2 flex-grow">
                        {movie.title}
                      </h4>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="capitalize">{movie.media_type}</span>
                      <span>•</span>
                      <span>{formatDate(movie.release_date)}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-1 pt-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => addToList(movie, 'to_watch')}
                        className="h-6 px-2 text-xs bg-purple-100 hover:bg-purple-200 hover:text-purple-700 active:bg-purple-200 active:text-purple-700"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        List
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => addToList(movie, 'watched')}
                        className="h-6 px-2 text-xs bg-green-100 hover:bg-green-200 hover:text-green-700 active:bg-green-200 active:text-green-700"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Watched
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => addToList(movie, 'watched', true)}
                        className="h-6 px-2 text-xs bg-red-100 hover:bg-red-200 hover:text-red-700 active:bg-red-200 active:text-red-700"
                        title="Add to Favorites"
                      >
                        <Heart className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MovieSearchBar;