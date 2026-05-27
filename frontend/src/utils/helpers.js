export const AVATAR_STYLES = ['cyber', 'ghost', 'neon', 'shadow', 'void'];
export const AVATAR_COLORS = ['#00f5ff', '#bf00ff', '#ff0090', '#39ff14', '#ff6b00', '#7b2fff', '#ff2d55'];
export const MOODS = ['happy', 'sad', 'angry', 'anxious', 'excited', 'numb', 'confused', 'hopeful', 'dark', 'peaceful'];
export const MOOD_EMOJIS = { happy: '😊', sad: '😔', angry: '😤', anxious: '😰', excited: '⚡', numb: '😶', confused: '🌀', hopeful: '✨', dark: '🌑', peaceful: '🌊' };
export const REACTIONS = ['fire', 'ghost', 'broken', 'eye', 'skull', 'heart'];
export const REACTION_EMOJIS = { fire: '🔥', ghost: '👻', broken: '💔', eye: '👁️', skull: '💀', heart: '🤍' };
export const TIER_COLORS = { phantom: '#8892a4', shadow: '#9370db', cipher: '#00ced1', ghost: '#00f5ff', specter: '#bf00ff', wraith: '#ff0090', legend: '#ffd700' };
export const TIER_LABELS = { phantom: 'Phantom', shadow: 'Shadow', cipher: 'Cipher', ghost: 'Ghost', specter: 'Specter', wraith: 'Wraith', legend: 'Legend' };

export const formatCount = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n?.toString() || '0';
};

export const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
};

export const getAvatarStyle = (style) => {
  const styles = {
    cyber: 'linear-gradient(135deg, #00f5ff, #bf00ff)',
    ghost: 'linear-gradient(135deg, #4a5568, #1a202c)',
    neon: 'linear-gradient(135deg, #ff0090, #ff6b00)',
    shadow: 'linear-gradient(135deg, #1a0530, #0d001a)',
    void: 'linear-gradient(135deg, #000, #1a0530)',
  };
  return styles[style] || styles.cyber;
};

export const generateGhostInitials = (alias) => {
  if (!alias) return '??';
  return alias.slice(0, 2).toUpperCase();
};

export const truncate = (str, len = 120) => str?.length > len ? str.slice(0, len) + '...' : str;
