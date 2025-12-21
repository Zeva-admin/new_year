import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useStore } from '../store';
import { ChatMessage } from '../types';

const Chat = () => {
  const [message, setMessage] = useState('');
  const { messages, sendChatMessage, currentUser } = useStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    sendChatMessage(message.trim());
    setMessage('');
  };

  const formatMessageTime = (timestamp: Date) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffMs = now.getTime() - messageTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return messageTime.toLocaleDateString();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-dark-700">
        <h3 className="font-semibold text-dark-100">Chat</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        {messages.length === 0 ? (
          <div className="text-center text-dark-500 py-8">
            <p>No messages yet</p>
            <p className="text-sm mt-1">Be the first to say hello!</p>
          </div>
        ) : (
          messages.map((msg: ChatMessage) => (
            <div key={msg.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {msg.username.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline space-x-2">
                  <span className="text-sm font-medium text-dark-100">
                    {msg.username}
                  </span>
                  <span className="text-xs text-dark-500">
                    {formatMessageTime(msg.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-dark-300 mt-1 break-words">
                  {msg.message}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-dark-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="input flex-1"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="btn-primary"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;