import React, { useEffect, useState } from 'react';
import GlassCard from '../components/common/GlassCard';
import CreatePost from '../components/posts/CreatePost';
import PostCard from '../components/posts/PostCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../store/slices/postSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Feed = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector(state => state.posts);
  const [filter, setFilter] = useState('latest');

  useEffect(() => {
    dispatch(fetchPosts({ page: 1, limit: 20, sort: filter === 'latest' ? 'newest' : 'trending' }));
  }, [dispatch, filter]);

  return (
    <div className="max-w-3xl mx-auto p-8 pt-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black neon-text-cyan tracking-widest">GLOBAL_FEED</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setFilter('latest')}
            className={`px-3 py-1 rounded text-xs font-mono transition-colors ${filter === 'latest' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
          >
            LATEST
          </button>
          <button 
            onClick={() => setFilter('trending')}
            className={`px-3 py-1 rounded text-xs font-mono transition-colors ${filter === 'trending' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
          >
            TRENDING
          </button>
        </div>
      </div>
      
      <CreatePost />

      {error && (
        <div className="mt-8 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-center font-mono">
          {error}
        </div>
      )}

      {loading && posts.length === 0 ? (
        <div className="mt-12">
          <LoadingSpinner size="lg" color="cyan" />
        </div>
      ) : (
        <div className="space-y-6 mt-8">
          {posts.map(post => (
            <PostCard key={post._id || post.id} post={post} />
          ))}
          {posts.length === 0 && !loading && (
            <div className="text-center text-gray-500 font-mono py-12">
              NO_TRANSMISSIONS_FOUND
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Feed;
