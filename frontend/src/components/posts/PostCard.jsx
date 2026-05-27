import React from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import GlassCard from '../common/GlassCard';
import { useDispatch, useSelector } from 'react-redux';
import { votePost } from '../../store/slices/postSlice';
import TimeAgo from 'react-timeago';

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  // fallback for demo
  const data = post || {
    _id: 1,
    author: { username: 'Phantom_99', tier: 'Ghost' },
    createdAt: new Date().toISOString(),
    content: 'Just successfully bypassed the mainframe firewall. The neural net is wide open. #cyberpunk #netrunner',
    upvotes: [],
    comments: [],
    mood: 'excited',
  };

  const glowColor = data.mood === 'excited' ? 'cyan' : data.mood === 'dark' ? 'purple' : 'pink';
  const isLiked = data.upvotes?.includes(user?.id || user?._id);
  const likesCount = data.upvotes?.length || 0;
  const commentsCount = data.comments?.length || 0;

  const handleLike = () => {
    if (data._id && user) {
      dispatch(votePost({ postId: data._id, vote: 1 }));
    }
  };

  return (
    <GlassCard glow={glowColor} className="mb-4 hover:shadow-[0_0_15px_rgba(0,245,255,0.1)] transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3 min-w-0 flex-1 mr-4">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--neon-${glowColor})] to-transparent flex items-center justify-center font-bold text-black shrink-0`}>
            {data.author?.username?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-white tracking-wide truncate">{data.author?.username}</h3>
              <span className={`text-[10px] uppercase px-2 py-0.5 rounded border border-[var(--neon-${glowColor})] text-[var(--neon-${glowColor})] shrink-0`}>
                {data.author?.tier || 'Phantom'}
              </span>
            </div>
            <span className="text-xs text-gray-500 font-mono block truncate">
              <TimeAgo date={data.createdAt} />
            </span>
          </div>
        </div>
        <button className="text-gray-500 hover:text-white transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <p className="text-gray-300 mb-6 leading-relaxed">
        {data.content}
      </p>

      <div className="flex items-center gap-6 border-t border-white/5 pt-4">
        <button 
          onClick={handleLike} 
          className={`flex items-center gap-2 transition-colors ${isLiked ? `text-[var(--neon-pink)] drop-shadow-[0_0_8px_var(--neon-pink)]` : 'text-gray-400 hover:text-white'}`}
        >
          <Heart size={18} className={isLiked ? 'fill-current' : ''} />
          <span className="text-sm font-mono">{likesCount}</span>
        </button>
        <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <MessageCircle size={18} />
          <span className="text-sm font-mono">{commentsCount}</span>
        </button>
        <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors ml-auto">
          <Share2 size={18} />
        </button>
      </div>
    </GlassCard>
  );
};

export default PostCard;
