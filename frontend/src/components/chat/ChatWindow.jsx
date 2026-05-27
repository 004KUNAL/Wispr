import React, { useState } from 'react';
import { Send, Phone, Video, MoreVertical } from 'lucide-react';
import MessageBubble from './MessageBubble';

const ChatWindow = ({ activeChat }) => {
  const [input, setInput] = useState('');

  if (!activeChat) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500 font-mono">
        <div className="w-16 h-16 border border-dashed border-gray-600 rounded-full flex items-center justify-center mb-4">
          <span className="animate-pulse">_</span>
        </div>
        SELECT_CHANNEL_TO_INITIALIZE_COMMS
      </div>
    );
  }

  const mockMessages = [
    { id: 1, sender: 'Neon_Samurai', content: 'Did you get the files?', time: '10:42 PM', isOwn: false },
    { id: 2, sender: 'Me', content: 'Yeah, decrypting them now. The ICE was thicker than expected.', time: '10:45 PM', isOwn: true },
    { id: 3, sender: 'Neon_Samurai', content: 'Be careful. Corps are watching.', time: '10:46 PM', isOwn: false },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-purple)] flex items-center justify-center font-bold text-black shadow-[0_0_15px_rgba(0,245,255,0.2)]">
            {activeChat[0]}
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">{activeChat}</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--neon-green)] animate-pulse"></span>
              <span className="text-xs text-[var(--neon-green)] font-mono">SECURE_CONNECTION</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-gray-400">
          <button className="hover:text-[var(--neon-cyan)] transition-colors"><Phone size={20} /></button>
          <button className="hover:text-[var(--neon-purple)] transition-colors"><Video size={20} /></button>
          <button className="hover:text-white transition-colors"><MoreVertical size={20} /></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-2">
        {mockMessages.map(msg => (
          <MessageBubble key={msg.id} message={msg} isOwn={msg.isOwn} />
        ))}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-white/5 bg-black/20 backdrop-blur-md">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Encrypting message..."
            className="cyber-input w-full pr-12 bg-black/40"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--neon-cyan)] hover:text-white transition-colors">
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
