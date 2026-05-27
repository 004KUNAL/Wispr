import React, { useState } from 'react';
import ChatWindow from '../components/chat/ChatWindow';

const Messages = () => {
  const [activeChat, setActiveChat] = useState('Neon_Samurai');

  const contacts = [
    { id: 1, name: 'Neon_Samurai', lastMessage: 'Be careful. Corps are watching.', time: '10:46 PM', unread: 0 },
    { id: 2, name: 'Cipher_Protocol', lastMessage: 'Sending coordinates now.', time: '09:12 PM', unread: 2 },
    { id: 3, name: 'Null_Pointer', lastMessage: 'Connection terminated.', time: 'Yesterday', unread: 0 },
  ];

  return (
    <div className="flex h-full">
      {/* Sidebar / Contact List */}
      <div className="w-80 border-r border-white/5 bg-black/20 backdrop-blur-md flex flex-col h-full">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-2xl font-black neon-text-purple tracking-widest mb-4">COMMS_LINK</h2>
          <input 
            type="text" 
            placeholder="Search channels..." 
            className="cyber-input w-full text-sm py-2"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {contacts.map(contact => (
            <button 
              key={contact.id}
              onClick={() => setActiveChat(contact.name)}
              className={`w-full text-left p-4 border-b border-white/5 transition-all flex items-center gap-4 ${activeChat === contact.name ? 'bg-white/10' : 'hover:bg-white/5'}`}
            >
              <div className="w-12 h-12 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center font-bold text-gray-400">
                {contact.name[0]}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center mb-1">
                  <h4 className={`font-bold truncate ${activeChat === contact.name ? 'text-[var(--neon-cyan)]' : 'text-white'}`}>{contact.name}</h4>
                  <span className="text-xs text-gray-500 font-mono">{contact.time}</span>
                </div>
                <p className="text-sm text-gray-400 truncate">{contact.lastMessage}</p>
              </div>
              {contact.unread > 0 && (
                <div className="w-5 h-5 rounded-full bg-[var(--neon-pink)] flex items-center justify-center text-[10px] font-bold text-black">
                  {contact.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 h-full">
        <ChatWindow activeChat={activeChat} />
      </div>
    </div>
  );
};

export default Messages;
