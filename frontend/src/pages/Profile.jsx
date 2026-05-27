import React, { useState } from 'react';
import { Edit3, Eye, Heart, MessageSquare, Share2, Shield, Star, Activity, Lock, Globe } from 'lucide-react';
import GlassCard from '../components/common/GlassCard';

const userProfile = {
  handle: 'Neon_Samurai',
  tier: 'Legend',
  bio: 'Synthwave DJ on the darknet. I turn encryption keys into melodies. Broadcasting from the shadow grid.',
  followers: '201K',
  following: '432',
  posts: '1,847',
  reputation: '99,140',
  joinDate: 'Year 0 — The Beginning',
  privacy: 'shadow',
  mood: 'excited',
  badges: ['Pioneer', 'Signal_Ghost', 'Cipher_Master', 'The_100K'],
};

const mockUserPosts = [
  {
    id: 1,
    content: 'Just dropped a new synthwave track on the darknet radio. Tune in. DARK LATTICE Vol.9 — frequency 7.7MHz',
    likes: 8990,
    comments: 340,
    time: '15m ago',
    glow: 'cyan',
  },
  {
    id: 2,
    content: 'The grid never sleeps. And neither do I. 72 hours in the void. Worth every second.',
    likes: 4412,
    comments: 89,
    time: '2d ago',
    glow: 'purple',
  },
  {
    id: 3,
    content: 'They tried to trace my signal. Cute. I broadcast from eleven nodes simultaneously. Good luck.',
    likes: 12034,
    comments: 567,
    time: '1w ago',
    glow: 'pink',
  },
];

const tierColors = {
  Legend: 'var(--neon-green)',
  Specter: 'var(--neon-purple)',
  Wraith: 'var(--neon-pink)',
  Cipher: 'var(--neon-cyan)',
  Shadow: '#9370db',
  Ghost: 'var(--neon-cyan)',
};

const glowColor = { cyan: 'var(--neon-cyan)', purple: 'var(--neon-purple)', pink: 'var(--neon-pink)' };

const Profile = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [likedPosts, setLikedPosts] = useState({});

  const toggleLike = (id) => setLikedPosts(prev => ({ ...prev, [id]: !prev[id] }));

  const tabs = ['posts', 'liked', 'media'];

  return (
    <div className="max-w-3xl mx-auto p-8 pt-12">
      {/* Profile Header Card */}
      <GlassCard className="mb-6 overflow-hidden">
        {/* Banner */}
        <div
          className="h-32 relative"
          style={{
            background: 'linear-gradient(135deg, rgba(0,245,255,0.15), rgba(191,0,255,0.2), rgba(255,0,144,0.1))',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          {/* Animated grid overlay */}
          <div
            className="absolute inset-0 cyber-grid opacity-30"
            style={{ backgroundSize: '24px 24px' }}
          />
          {/* Edit Banner Button */}
          <button
            className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono"
            style={{ background: 'rgba(0,0,0,0.4)', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <Edit3 size={11} /> EDIT
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-end justify-between -mt-16 mb-4">
            {/* Avatar */}
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-black relative"
              style={{
                background: 'linear-gradient(135deg, rgba(0,245,255,0.3), rgba(191,0,255,0.3))',
                border: '3px solid var(--neon-cyan)',
                boxShadow: '0 0 24px rgba(0,245,255,0.4)',
              }}
            >
              N
              {/* Online Indicator */}
              <div
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full"
                style={{ background: 'var(--neon-green)', boxShadow: '0 0 8px var(--neon-green)', border: '2px solid var(--bg-void)' }}
              />
            </div>

            {/* Edit Profile Button */}
            <button
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-mono font-bold transition-all duration-200"
              style={{
                background: 'rgba(0,245,255,0.08)',
                border: '1px solid rgba(0,245,255,0.3)',
                color: 'var(--neon-cyan)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,245,255,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,245,255,0.08)'; }}
            >
              <Edit3 size={13} /> EDIT PROFILE
            </button>
          </div>

          {/* Name & Tier */}
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-black font-mono" style={{ color: 'var(--text-primary)' }}>
              {userProfile.handle}
            </h1>
            <span
              className="text-xs font-black font-mono px-2 py-0.5 rounded"
              style={{
                color: tierColors[userProfile.tier],
                background: `${tierColors[userProfile.tier]}18`,
                border: `1px solid ${tierColors[userProfile.tier]}44`,
              }}
            >
              [{userProfile.tier}]
            </span>
          </div>

          {/* Mood & Privacy */}
          <div className="flex items-center gap-3 mb-3">
            <span className={`text-xs font-mono mood-${userProfile.mood}`}>
              ◉ {userProfile.mood.toUpperCase()}
            </span>
            <span className="text-xs font-mono flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
              {userProfile.privacy === 'shadow' ? <Lock size={11} /> : <Globe size={11} />}
              {userProfile.privacy.toUpperCase()} MODE
            </span>
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              {userProfile.joinDate}
            </span>
          </div>

          {/* Bio */}
          <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
            {userProfile.bio}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-5">
            {userProfile.badges.map(badge => (
              <span
                key={badge}
                className="text-xs font-mono px-2 py-1 rounded-lg flex items-center gap-1"
                style={{
                  background: 'rgba(255,215,0,0.08)',
                  border: '1px solid rgba(255,215,0,0.2)',
                  color: '#ffd700',
                }}
              >
                <Star size={10} /> {badge}
              </span>
            ))}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {[
              { label: 'POSTS', value: userProfile.posts, color: 'var(--neon-cyan)' },
              { label: 'FOLLOWERS', value: userProfile.followers, color: 'var(--neon-purple)' },
              { label: 'FOLLOWING', value: userProfile.following, color: 'var(--neon-pink)' },
              { label: 'REP', value: userProfile.reputation, color: '#ffd700' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-lg font-black font-mono" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map(tab => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-widest transition-all duration-200"
              style={{
                background: isActive ? 'rgba(0,245,255,0.12)' : 'rgba(255,255,255,0.04)',
                color: isActive ? 'var(--neon-cyan)' : 'var(--text-secondary)',
                border: `1px solid ${isActive ? 'rgba(0,245,255,0.35)' : 'rgba(255,255,255,0.07)'}`,
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Posts */}
      {activeTab === 'posts' && (
        <div className="space-y-5">
          {mockUserPosts.map(post => {
            const isLiked = likedPosts[post.id];
            const color = glowColor[post.glow];
            return (
              <GlassCard key={post.id} className="p-5 post-card">
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-primary)' }}>
                  {post.content}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className="flex items-center gap-1.5 text-xs font-mono transition-all duration-200"
                      style={{ color: isLiked ? 'var(--neon-pink)' : 'var(--text-muted)' }}
                    >
                      <Heart size={14} fill={isLiked ? 'var(--neon-pink)' : 'none'} />
                      {isLiked ? post.likes + 1 : post.likes}
                    </button>
                    <button className="flex items-center gap-1.5 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                      <MessageSquare size={14} /> {post.comments}
                    </button>
                    <button className="flex items-center gap-1.5 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                      <Share2 size={14} />
                    </button>
                  </div>
                  <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{post.time}</span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {activeTab === 'liked' && (
        <GlassCard className="p-12 text-center">
          <Heart size={32} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>
            Liked transmissions are hidden in shadow mode.
          </p>
        </GlassCard>
      )}

      {activeTab === 'media' && (
        <GlassCard className="p-12 text-center">
          <Activity size={32} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>
            No media transmissions detected.
          </p>
        </GlassCard>
      )}
    </div>
  );
};

export default Profile;
