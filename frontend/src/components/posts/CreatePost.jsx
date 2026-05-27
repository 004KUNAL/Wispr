import React, { useState } from 'react';
import { Send, Image as ImageIcon, Smile, Loader } from 'lucide-react';
import GlassCard from '../common/GlassCard';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../../store/slices/postSlice';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('content', content);
      await dispatch(createPost(formData)).unwrap();
      setContent('');
    } catch (err) {
      console.error('Failed to create post', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GlassCard className="mb-6 border-dashed border-white/20 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[var(--neon-cyan)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center font-bold text-[var(--neon-cyan)]">
          {user?.username?.[0]?.toUpperCase() || 'W'}
        </div>
        <div className="flex-1">
          <textarea
            placeholder="Transmit your encrypted thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-transparent border-none text-white outline-none resize-none h-20 placeholder:text-gray-600 font-mono text-sm"
          />
          
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5">
            <div className="flex gap-2 text-gray-500">
              <button className="p-2 hover:text-[var(--neon-cyan)] hover:bg-white/5 rounded-lg transition-all"><ImageIcon size={18} /></button>
              <button className="p-2 hover:text-[var(--neon-purple)] hover:bg-white/5 rounded-lg transition-all"><Smile size={18} /></button>
            </div>
            
            <button 
              onClick={handleSubmit}
              disabled={!content.trim() || isSubmitting}
              className="btn-cyber flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed py-2 px-4"
            >
              {isSubmitting ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
              <span>{isSubmitting ? 'TRANSMITTING' : 'TRANSMIT'}</span>
            </button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default CreatePost;
