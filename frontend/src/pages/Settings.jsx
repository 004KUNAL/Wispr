import React, { useState } from 'react';
import { User, Lock, Bell, Shield, Palette, Zap, Eye, EyeOff, Trash2, LogOut, Save } from 'lucide-react';
import GlassCard from '../components/common/GlassCard';

const sections = [
  { id: 'profile', label: 'PROFILE', icon: User },
  { id: 'privacy', label: 'PRIVACY', icon: Lock },
  { id: 'notifications', label: 'ALERTS', icon: Bell },
  { id: 'security', label: 'SECURITY', icon: Shield },
  { id: 'appearance', label: 'INTERFACE', icon: Palette },
  { id: 'danger', label: 'DANGER ZONE', icon: Zap },
];

const ToggleSwitch = ({ enabled, onChange, color = 'var(--neon-cyan)' }) => (
  <button
    onClick={onChange}
    className="relative w-10 h-5 rounded-full transition-all duration-300 flex-shrink-0"
    style={{
      background: enabled ? color : 'rgba(255,255,255,0.1)',
      boxShadow: enabled ? `0 0 10px ${color}66` : 'none',
    }}
  >
    <div
      className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300"
      style={{
        background: '#fff',
        left: enabled ? '22px' : '2px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.5)',
      }}
    />
  </button>
);

const Settings = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profileSettings, setProfileSettings] = useState({
    handle: 'Neon_Samurai',
    bio: 'Synthwave DJ on the darknet. Broadcasting from the shadow grid.',
    mood: 'excited',
    privacy: 'shadow',
  });

  const [privacySettings, setPrivacySettings] = useState({
    hideLikes: true,
    blurMedia: false,
    hideFollowers: false,
    ghostMode: true,
    allowDMs: true,
    showOnline: false,
  });

  const [notifSettings, setNotifSettings] = useState({
    likes: false,
    comments: true,
    follows: false,
    dms: true,
    mentions: true,
    communityPosts: false,
  });

  const moods = ['excited', 'numb', 'dark', 'hopeful', 'anxious', 'peaceful', 'angry', 'confused'];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const glowMap = {
    profile: 'var(--neon-cyan)',
    privacy: 'var(--neon-purple)',
    notifications: 'var(--neon-pink)',
    security: 'var(--neon-green)',
    appearance: 'var(--neon-cyan)',
    danger: 'var(--neon-pink)',
  };

  return (
    <div className="max-w-4xl mx-auto p-8 pt-12">
      <div className="mb-8">
        <h2 className="text-3xl font-black tracking-widest mb-1" style={{ color: 'var(--neon-cyan)' }}>
          SYSTEM_CONFIG
        </h2>
        <p className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
          Calibrate your presence in the grid.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Section Nav */}
        <div className="lg:col-span-1">
          <GlassCard className="p-2">
            {sections.map(s => {
              const Icon = s.icon;
              const isActive = activeSection === s.id;
              const color = glowMap[s.id];
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono font-bold tracking-wider transition-all duration-200 mb-1"
                  style={{
                    background: isActive ? `${color}15` : 'transparent',
                    color: isActive ? color : 'var(--text-secondary)',
                    borderLeft: isActive ? `2px solid ${color}` : '2px solid transparent',
                  }}
                >
                  <Icon size={14} />
                  {s.label}
                </button>
              );
            })}
          </GlassCard>
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-3">
          {/* PROFILE */}
          {activeSection === 'profile' && (
            <GlassCard className="p-6 space-y-6">
              <h3 className="text-sm font-black font-mono tracking-widest" style={{ color: 'var(--neon-cyan)' }}>
                PROFILE SETTINGS
              </h3>

              <div>
                <label className="block text-xs font-mono mb-2" style={{ color: 'var(--text-secondary)' }}>HANDLE</label>
                <input
                  className="cyber-input w-full font-mono"
                  value={profileSettings.handle}
                  onChange={e => setProfileSettings(p => ({ ...p, handle: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-xs font-mono mb-2" style={{ color: 'var(--text-secondary)' }}>BIO</label>
                <textarea
                  className="cyber-input w-full font-mono resize-none"
                  rows={3}
                  value={profileSettings.bio}
                  onChange={e => setProfileSettings(p => ({ ...p, bio: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-xs font-mono mb-3" style={{ color: 'var(--text-secondary)' }}>CURRENT MOOD</label>
                <div className="flex flex-wrap gap-2">
                  {moods.map(mood => (
                    <button
                      key={mood}
                      onClick={() => setProfileSettings(p => ({ ...p, mood }))}
                      className={`px-3 py-1 rounded-lg text-xs font-mono transition-all duration-200 mood-${mood}`}
                      style={{
                        background: profileSettings.mood === mood ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${profileSettings.mood === mood ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)'}`,
                        fontWeight: profileSettings.mood === mood ? '700' : '400',
                      }}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono mb-3" style={{ color: 'var(--text-secondary)' }}>PRIVACY MODE</label>
                <div className="flex gap-3">
                  {['public', 'shadow', 'void'].map(mode => (
                    <button
                      key={mode}
                      onClick={() => setProfileSettings(p => ({ ...p, privacy: mode }))}
                      className="flex-1 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all duration-200"
                      style={{
                        background: profileSettings.privacy === mode ? 'rgba(191,0,255,0.15)' : 'rgba(255,255,255,0.04)',
                        color: profileSettings.privacy === mode ? 'var(--neon-purple)' : 'var(--text-muted)',
                        border: `1px solid ${profileSettings.privacy === mode ? 'rgba(191,0,255,0.4)' : 'rgba(255,255,255,0.07)'}`,
                      }}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSave}
                className="btn-cyber flex items-center gap-2 text-sm"
                style={saved ? { background: 'linear-gradient(135deg, var(--neon-green), #00aa00)' } : {}}
              >
                <Save size={14} />
                {saved ? 'SAVED!' : 'SAVE CHANGES'}
              </button>
            </GlassCard>
          )}

          {/* PRIVACY */}
          {activeSection === 'privacy' && (
            <GlassCard className="p-6 space-y-5">
              <h3 className="text-sm font-black font-mono tracking-widest" style={{ color: 'var(--neon-purple)' }}>
                PRIVACY CONTROLS
              </h3>
              {[
                { key: 'hideLikes', label: 'Hide like counts on your posts', desc: 'Others cannot see how many likes your transmissions receive.' },
                { key: 'blurMedia', label: 'Blur media by default', desc: 'All media requires interaction before being revealed.' },
                { key: 'hideFollowers', label: 'Hide follower count', desc: 'Your follower count remains invisible to others.' },
                { key: 'ghostMode', label: 'Ghost mode', desc: 'You appear offline to everyone. Your presence is null.' },
                { key: 'allowDMs', label: 'Allow direct messages', desc: 'Control who can transmit directly to you.' },
                { key: 'showOnline', label: 'Show online status', desc: 'Broadcast your current connection state to followers.' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between gap-4 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div className="flex-1">
                    <p className="text-sm font-mono font-bold" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                  </div>
                  <ToggleSwitch
                    enabled={privacySettings[item.key]}
                    onChange={() => setPrivacySettings(p => ({ ...p, [item.key]: !p[item.key] }))}
                    color="var(--neon-purple)"
                  />
                </div>
              ))}
            </GlassCard>
          )}

          {/* NOTIFICATIONS */}
          {activeSection === 'notifications' && (
            <GlassCard className="p-6 space-y-5">
              <h3 className="text-sm font-black font-mono tracking-widest" style={{ color: 'var(--neon-pink)' }}>
                ALERT CONFIGURATION
              </h3>
              {[
                { key: 'likes', label: 'Reaction alerts', desc: 'Notify when someone reacts to your transmissions.' },
                { key: 'comments', label: 'Comment alerts', desc: 'Notify when someone responds to your posts.' },
                { key: 'follows', label: 'New follower alerts', desc: 'Notify when someone enters your orbit.' },
                { key: 'dms', label: 'Direct message alerts', desc: 'Notify on incoming transmissions.' },
                { key: 'mentions', label: 'Mention alerts', desc: 'Notify when your handle is invoked.' },
                { key: 'communityPosts', label: 'Community activity', desc: 'Notify on new posts in your communities.' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between gap-4 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div className="flex-1">
                    <p className="text-sm font-mono font-bold" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                  </div>
                  <ToggleSwitch
                    enabled={notifSettings[item.key]}
                    onChange={() => setNotifSettings(p => ({ ...p, [item.key]: !p[item.key] }))}
                    color="var(--neon-pink)"
                  />
                </div>
              ))}
            </GlassCard>
          )}

          {/* SECURITY */}
          {activeSection === 'security' && (
            <GlassCard className="p-6 space-y-6">
              <h3 className="text-sm font-black font-mono tracking-widest" style={{ color: 'var(--neon-green)' }}>
                SECURITY PROTOCOLS
              </h3>

              <div>
                <label className="block text-xs font-mono mb-2" style={{ color: 'var(--text-secondary)' }}>CURRENT PASSPHRASE</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="cyber-input w-full font-mono pr-10"
                    placeholder="••••••••••••"
                  />
                  <button
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono mb-2" style={{ color: 'var(--text-secondary)' }}>NEW PASSPHRASE</label>
                <input type="password" className="cyber-input w-full font-mono" placeholder="••••••••••••" />
              </div>

              <div>
                <label className="block text-xs font-mono mb-2" style={{ color: 'var(--text-secondary)' }}>CONFIRM PASSPHRASE</label>
                <input type="password" className="cyber-input w-full font-mono" placeholder="••••••••••••" />
              </div>

              <div className="p-4 rounded-xl" style={{ background: 'rgba(57,255,20,0.06)', border: '1px solid rgba(57,255,20,0.2)' }}>
                <p className="text-xs font-mono font-bold mb-1" style={{ color: 'var(--neon-green)' }}>
                  TWO-FACTOR AUTHENTICATION
                </p>
                <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                  Double-layer encryption for your account. Recommended for all operatives.
                </p>
                <button className="text-xs font-mono font-bold px-4 py-2 rounded-lg transition-all"
                  style={{ background: 'rgba(57,255,20,0.12)', color: 'var(--neon-green)', border: '1px solid rgba(57,255,20,0.3)' }}>
                  ENABLE 2FA
                </button>
              </div>

              <button className="btn-cyber text-sm flex items-center gap-2">
                <Save size={14} /> UPDATE SECURITY
              </button>
            </GlassCard>
          )}

          {/* APPEARANCE */}
          {activeSection === 'appearance' && (
            <GlassCard className="p-6 space-y-6">
              <h3 className="text-sm font-black font-mono tracking-widest" style={{ color: 'var(--neon-cyan)' }}>
                INTERFACE CALIBRATION
              </h3>
              <p className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                Customization features are under construction. The grid is adapting.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {['VOID', 'MATRIX', 'BLOOD'].map((theme, i) => (
                  <div
                    key={theme}
                    className={`p-4 rounded-xl text-center cursor-pointer transition-all duration-200 ${i === 0 ? 'ring-2 ring-cyan-400/50' : ''}`}
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <div className="w-8 h-8 rounded-full mx-auto mb-2"
                      style={{ background: i === 0 ? 'linear-gradient(135deg,#00f5ff,#bf00ff)' : i === 1 ? 'linear-gradient(135deg,#39ff14,#00aa00)' : 'linear-gradient(135deg,#ff0090,#8b0000)' }}
                    />
                    <p className="text-xs font-mono font-bold" style={{ color: i === 0 ? 'var(--neon-cyan)' : 'var(--text-muted)' }}>{theme}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* DANGER ZONE */}
          {activeSection === 'danger' && (
            <GlassCard className="p-6 space-y-5">
              <h3 className="text-sm font-black font-mono tracking-widest" style={{ color: 'var(--neon-pink)' }}>
                ⚠ DANGER ZONE
              </h3>
              <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                Actions in this sector are irreversible. Proceed with extreme caution, operative.
              </p>

              {[
                {
                  label: 'SIGN OUT ALL DEVICES',
                  desc: 'Terminate all active sessions across every node.',
                  color: 'var(--neon-orange)',
                  icon: LogOut,
                },
                {
                  label: 'PURGE ALL DATA',
                  desc: 'Wipe all posts, messages, and activity permanently.',
                  color: 'var(--neon-pink)',
                  icon: Trash2,
                },
                {
                  label: 'DELETE ACCOUNT',
                  desc: 'Permanently erase your existence from the grid. No recovery.',
                  color: '#ff2222',
                  icon: Trash2,
                },
              ].map(action => {
                const Icon = action.icon;
                return (
                  <div
                    key={action.label}
                    className="flex items-center justify-between p-4 rounded-xl gap-4"
                    style={{ background: `${action.color}08`, border: `1px solid ${action.color}33` }}
                  >
                    <div>
                      <p className="text-xs font-mono font-black" style={{ color: action.color }}>{action.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{action.desc}</p>
                    </div>
                    <button
                      className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all"
                      style={{ background: `${action.color}15`, border: `1px solid ${action.color}55`, color: action.color }}
                    >
                      <Icon size={13} /> EXECUTE
                    </button>
                  </div>
                );
              })}
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
