import React, { useState } from 'react';
import { Users, Shield, MessageSquare, Pin, ChevronRight, Crown, Plus } from 'lucide-react';
import GlassCard from '../components/common/GlassCard';

const communities = [
  {
    id: 1,
    name: 'Cipher Collective',
    tag: 'cipher-collective',
    description: 'For those who speak in code. Encryption tips, zero-day exploits, and digital resistance.',
    members: '12.4K',
    posts: 89,
    glow: 'cyan',
    category: 'Security',
    pinned: true,
  },
  {
    id: 2,
    name: 'Void Philosophy',
    tag: 'void-philosophy',
    description: 'Existential dread in the digital age. We question everything — especially the simulation.',
    members: '8.1K',
    posts: 134,
    glow: 'purple',
    category: 'Philosophy',
    pinned: false,
  },
  {
    id: 3,
    name: 'Neon Underworld',
    tag: 'neon-underworld',
    description: 'Underground music, art, and counter-culture from across the dark web.',
    members: '31.7K',
    posts: 402,
    glow: 'pink',
    category: 'Culture',
    pinned: false,
  },
  {
    id: 4,
    name: 'Ghost Protocol',
    tag: 'ghost-protocol',
    description: 'Anonymous activism. Surveillance evasion. Staying invisible in a world of watchers.',
    members: '19.2K',
    posts: 211,
    glow: 'green',
    category: 'Privacy',
    pinned: false,
  },
  {
    id: 5,
    name: 'ShadowMarket Devs',
    tag: 'shadowmarket-devs',
    description: 'Builders of tools no one should need but everyone does. Open source, no questions.',
    members: '5.8K',
    posts: 67,
    glow: 'cyan',
    category: 'Dev',
    pinned: false,
  },
];

const recentPosts = [
  { community: 'Cipher Collective', author: 'Cipher_Protocol', text: 'New exploit in sector 7G. Don\'t update yet.', time: '3m' },
  { community: 'Neon Underworld', author: 'Neon_Samurai', text: 'New synthwave drop — DARK LATTICE Vol.9', time: '14m' },
  { community: 'Void Philosophy', author: 'Null_Pointer', text: 'Are we just entropy with self-awareness?', time: '1h' },
];

const glowColor = {
  cyan: 'var(--neon-cyan)',
  purple: 'var(--neon-purple)',
  pink: 'var(--neon-pink)',
  green: 'var(--neon-green)',
};

const Community = () => {
  const [joined, setJoined] = useState({ 'cipher-collective': true });

  const toggleJoin = (tag) => {
    setJoined(prev => ({ ...prev, [tag]: !prev[tag] }));
  };

  return (
    <div className="max-w-4xl mx-auto p-8 pt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black neon-text-pink tracking-widest mb-1">COMMUNITIES</h2>
          <p className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
            Find your collective. Build your network.
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all duration-200"
          style={{
            background: 'rgba(255,0,144,0.1)',
            border: '1px solid rgba(255,0,144,0.3)',
            color: 'var(--neon-pink)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,0,144,0.2)';
            e.currentTarget.style.boxShadow = '0 0 16px rgba(255,0,144,0.2)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,0,144,0.1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <Plus size={14} />
          CREATE
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Communities List */}
        <div className="lg:col-span-2 space-y-4">
          {communities.map((c) => {
            const isJoined = joined[c.tag];
            const color = glowColor[c.glow];
            return (
              <GlassCard key={c.id} className="p-5 post-card cursor-pointer group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Community Icon */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `${color}15`,
                        border: `1px solid ${color}44`,
                      }}
                    >
                      {c.pinned
                        ? <Crown size={20} style={{ color }} />
                        : <Shield size={20} style={{ color }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-black text-sm font-mono" style={{ color: 'var(--text-primary)' }}>
                          {c.name}
                        </h3>
                        {c.pinned && (
                          <span
                            className="text-xs font-mono px-1.5 py-0.5 rounded"
                            style={{ background: `${color}22`, color, fontSize: '10px' }}
                          >
                            <Pin size={9} className="inline mr-1" />PINNED
                          </span>
                        )}
                        <span
                          className="text-xs font-mono px-2 py-0.5 rounded"
                          style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)' }}
                        >
                          {c.category}
                        </span>
                      </div>
                      <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {c.description}
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1">
                          <Users size={11} style={{ color: 'var(--text-muted)' }} />
                          <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                            {c.members} members
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare size={11} style={{ color: 'var(--text-muted)' }} />
                          <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                            {c.posts} posts today
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleJoin(c.tag); }}
                    className="flex-shrink-0 text-xs font-mono font-bold px-4 py-1.5 rounded-lg transition-all duration-200"
                    style={isJoined
                      ? { background: `${color}22`, border: `1px solid ${color}66`, color }
                      : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }
                    }
                  >
                    {isJoined ? 'JOINED' : 'JOIN'}
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Sidebar: Recent Activity */}
        <div className="space-y-4">
          <GlassCard className="p-5">
            <h3 className="text-xs font-black font-mono tracking-widest mb-4" style={{ color: 'var(--neon-cyan)' }}>
              RECENT ACTIVITY
            </h3>
            <div className="space-y-4">
              {recentPosts.map((p, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-bold" style={{ color: 'var(--neon-purple)' }}>
                      {p.community}
                    </span>
                    <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{p.time}</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{p.author}</span>
                    {' — '}{p.text}
                  </p>
                  {i < recentPosts.length - 1 && (
                    <div className="mt-3 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
                  )}
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Stats Card */}
          <GlassCard className="p-5">
            <h3 className="text-xs font-black font-mono tracking-widest mb-4" style={{ color: 'var(--neon-pink)' }}>
              YOUR STANDING
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Communities Joined', val: '1', color: 'var(--neon-cyan)' },
                { label: 'Posts This Week', val: '0', color: 'var(--neon-purple)' },
                { label: 'Reputation Points', val: '420', color: 'var(--neon-pink)' },
              ].map(stat => (
                <div key={stat.label} className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{stat.label}</span>
                  <span className="text-sm font-black font-mono" style={{ color: stat.color }}>{stat.val}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Community;
