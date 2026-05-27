import React from 'react';

const MessageBubble = ({ message, isOwn }) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] rounded-2xl p-4 ${isOwn ? 'bg-gradient-to-br from-[var(--neon-purple)]/20 to-[var(--neon-pink)]/20 border border-[var(--neon-purple)]/30 rounded-br-sm' : 'bg-white/5 border border-white/10 rounded-bl-sm'}`}>
        {!isOwn && <div className="text-xs text-[var(--neon-cyan)] mb-1 font-mono">{message.sender}</div>}
        <p className="text-white text-sm">{message.content}</p>
        <div className="text-[10px] text-gray-500 mt-2 text-right font-mono">{message.time}</div>
      </div>
    </div>
  );
};

export default MessageBubble;
