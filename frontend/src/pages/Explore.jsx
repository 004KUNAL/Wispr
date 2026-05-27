import React, { useState } from 'react';
import { Search, TrendingUp, Hash, Users, Zap, Eye } from 'lucide-react';
import GlassCard from '../components/common/GlassCard';

const trendingTopics = [
  { tag: '#NeuralDrift', posts: '14.2K', heat: 'purple', rank: 1 },
  { tag: '#CipherWars', posts: '9.8K', heat: 'cyan', rank: 2 },
  { tag: '#VoidProtocol', posts: '7.3K', heat: 'pink', rank: 3 },
  { tag: '#ShadowNet', posts: '5.1K', heat: 'green', rank: 4 },
  { tag: '#DataHeresy', posts: '4.6K', heat: 'purple', rank: 5 },
  { tag: '#NightWatch', posts: '3.9K', heat: 'cyan', rank: 6 },
  { tag: '#BinaryGhost', posts: '2.7K', heat: 'pink', rank: 7 },
  { tag: '#QuantumBleed', posts: '2.1K', heat: 'green', rank: 8 },
];

const suggestedUsers = [
  { handle: 'Cipher_Protocol', tier: 'Specter', bio: 'I find what they hide.', followers: '48.2K', glow: 'purple' },
  { handle: 'Neon_Samurai', tier: 'Legend', bio: 'Synthwave DJ on the darknet.', followers: '201K', glow: 'cyan' },
  { handle: 'Null_Pointer', tier: 'Shadow', bio: 'Error 404: Hope not found.', followers: '12.4K', glow: 'pink' },
  { handle: 'VoidWalker_X', tier: 'Wraith', bio: 'I exist between the packets.', followers: '89.7K', glow: 'purple' },
  { handle: 'GlitchQueen', tier: 'Cipher', bio: 'The matrix has a glitch. I am it.', followers: '33.1K', glow: 'pink' },
];

const heatColor = {
  purple: 'var(--neon-purple)',
  cyan: 'var(--neon-cyan)',
  pink: 'var(--neon-pink)',
  green: 'var(--neon-green)',
};

const Explore = () => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('trending');

  const tabs = [
    { id: 'trending', label: 'TRENDING', icon: TrendingUp },
    { id: 'users', label: 'USERS', icon: Users },
    { id: 'tags', label: 'TAGS', icon: Hash },
  ];

  return (
    <div className="max-w-3xl mx-auto p-8 pt-12">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-black neon-text-purple tracking-widest mb-2">EXPLORE</h2>
        <p className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
          Navigate the signal. Find the noise.
        </p>
      </div>

      {/* Search Bar */}
      <GlassCard className="mb-8 p-4">
        <div className="flex items-center gap-3">
          <Search size={18} style={{ color: 'var(--neon-cyan)' }} />
          <input
            className="cyber-input flex-1 border-0 bg-transparent p-0 text-sm"
            placeholder="Search users, tags, transmissions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              className="text-xs font-mono px-3 py-1 rounded"
              style={{ background: 'rgba(0,245,255,0.1)', color: 'var(--neon-cyan)' }}
            >
              SEARCH
            </button>
          )}
        </div>
      </GlassCard>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all duration-200"
              style={{
                background: isActive ? 'rgba(191,0,255,0.15)' : 'rgba(255,255,255,0.04)',
                color: isActive ? 'var(--neon-purple)' : 'var(--text-secondary)',
                border: `1px solid ${isActive ? 'rgba(191,0,255,0.4)' : 'rgba(255,255,255,0.07)'}`,
                boxShadow: isActive ? '0 0 16px rgba(191,0,255,0.2)' : 'none',
              }}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Trending Topics */}
      {activeTab === 'trending' && (
        <div className="space-y-3">
          {trendingTopics.map((topic) => (
            <GlassCard
              key={topic.tag}
              className="p-4 post-card cursor-pointer group"
              style={{ '--hover-glow': heatColor[topic.heat] }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span
                    className="text-lg font-black font-mono w-6 text-center"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {topic.rank}
                  </span>
                  <div>
                    <p
                      className="font-black font-mono text-sm tracking-wide group-hover:scale-[1.02] transition-transform"
                      style={{ color: heatColor[topic.heat] }}
                    >
                      {topic.tag}
                    </p>
                    <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {topic.posts} transmissions
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={14} style={{ color: heatColor[topic.heat] }} />
                  <TrendingUp size={14} style={{ color: 'var(--text-muted)' }} />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Users Discovery */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {suggestedUsers.map((user) => (
            <GlassCard key={user.handle} className="p-5 post-card cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-black"
                    style={{
                      background: `linear-gradient(135deg, ${heatColor[user.glow]}22, ${heatColor[user.glow]}44)`,
                      border: `1px solid ${heatColor[user.glow]}66`,
                      color: heatColor[user.glow],
                    }}
                  >
                    {user.handle[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm font-mono" style={{ color: 'var(--text-primary)' }}>
                        {user.handle}
                      </span>
                      <span
                        className={`text-xs font-mono font-bold tier-${user.tier.toLowerCase()}`}
                      >
                        [{user.tier}]
                      </span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                      {user.bio}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Eye size={11} style={{ color: 'var(--text-muted)' }} />
                      <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                        {user.followers} followers
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  className="text-xs font-mono font-bold px-4 py-1.5 rounded-lg transition-all duration-200"
                  style={{
                    border: `1px solid ${heatColor[user.glow]}66`,
                    color: heatColor[user.glow],
                    background: `${heatColor[user.glow]}11`,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = `${heatColor[user.glow]}22`;
                    e.currentTarget.style.boxShadow = `0 0 12px ${heatColor[user.glow]}44`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = `${heatColor[user.glow]}11`;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  FOLLOW
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Tags Tab */}
      {activeTab === 'tags' && (
        <div className="grid grid-cols-2 gap-4">
          {trendingTopics.map((topic) => (
            <GlassCard
              key={topic.tag}
              className="p-5 post-card cursor-pointer text-center"
            >
              <Hash size={20} className="mx-auto mb-2" style={{ color: heatColor[topic.heat] }} />
              <p className="font-black font-mono text-sm" style={{ color: heatColor[topic.heat] }}>
                {topic.tag.replace('#', '')}
              </p>
              <p className="text-xs font-mono mt-1" style={{ color: 'var(--text-muted)' }}>
                {topic.posts} posts
              </p>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;
