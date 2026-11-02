'use client';

import React, { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    fetchConversations();
    
    // Initialize Socket.io
    const socketUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
    const newSocket = io(socketUrl, { withCredentials: true });
    
    newSocket.on('connect', () => {
      if (user) newSocket.emit('register', user._id);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (!socket) return;

    socket.on('newMessage', (msg) => {
      // If we are currently chatting with the sender, append it
      if (activeChat && msg.sender === activeChat._id) {
        setMessages(prev => [...prev, msg]);
        scrollToBottom();
        // Mark as read immediately
        api.put(`/messages/${activeChat._id}/read`).then(() => {
          window.dispatchEvent(new Event('messagesRead'));
        }).catch(console.error);
      } else {
        // Otherwise just update conversations list (to show badge)
        fetchConversations(true);
      }
    });

    return () => {
      socket.off('newMessage');
    };
  }, [socket, activeChat]);

  const fetchConversations = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const { data } = await api.get('/messages/conversations');
      setConversations(data);
    } catch (err) {
      console.error('Failed to fetch conversations', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const fetchMessages = async (userId: string, silent = false) => {
    try {
      const { data } = await api.get(`/messages/${userId}`);
      setMessages(data);
      if (!silent) scrollToBottom();
      
      // Mark as read
      await api.put(`/messages/${userId}/read`);
      setConversations(prev => prev.map(c => c._id === userId ? { ...c, unreadCount: 0 } : c));
      window.dispatchEvent(new Event('messagesRead'));
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  const handleSelectChat = (chatUser: any) => {
    setActiveChat(chatUser);
    fetchMessages(chatUser._id);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    try {
      const { data } = await api.post(`/messages/${activeChat._id}`, { content: newMessage });
      setMessages(prev => [...prev, data]);
      setNewMessage('');
      scrollToBottom();
      fetchConversations(true);
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center h-full items-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#0cbde8] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-full max-w-6xl mx-auto flex flex-col md:flex-row gap-6 p-4 md:p-8">
      
      {/* Conversations List */}
      <div className={`md:w-1/3 flex flex-col gap-4 ${activeChat ? 'hidden md:flex' : 'flex'} h-[calc(100vh-8rem)]`}>
        <div className="interior-panel h-full flex flex-col">
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <p className="text-sm text-gray-500 mt-1">Connect with your network</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {conversations.length === 0 ? (
              <div className="text-center text-gray-500 py-10 text-sm">
                You have no connections yet. Start connecting with others to chat!
              </div>
            ) : (
              conversations.map((conv) => (
                <div 
                  key={conv._id}
                  onClick={() => handleSelectChat(conv)}
                  className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all ${
                    activeChat?._id === conv._id ? 'bg-cyan/10 border border-cyan/20' : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="relative">
                    {conv.avatar ? (
                      <img src={conv.avatar} alt={conv.name} className="w-12 h-12 rounded-full object-cover shadow-sm bg-gray-100" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-cyan text-white flex items-center justify-center font-bold shadow-sm">
                        {conv.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {conv.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                        {conv.unreadCount}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{conv.name}</h3>
                    <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                      {conv.lastMessage || 'No messages yet'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Active Chat Window */}
      <div className={`md:w-2/3 flex flex-col h-[calc(100vh-8rem)] ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        {activeChat ? (
          <div className="interior-panel h-full flex flex-col shadow-lg border border-gray-100">
            
            {/* Chat Header */}
            <div className="p-4 md:p-6 border-b border-gray-100 flex items-center gap-4 bg-white/50 backdrop-blur-sm z-10 rounded-t-[24px]">
              <button 
                onClick={() => setActiveChat(null)}
                className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              {activeChat.avatar ? (
                <img src={activeChat.avatar} alt={activeChat.name} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-cyan text-white flex items-center justify-center font-bold">
                  {activeChat.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h2 className="font-bold text-gray-900">{activeChat.name}</h2>
                <p className="text-xs text-gray-500">Connected</p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50/50">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  <p className="text-sm">Say hello to {activeChat.name}!</p>
                </div>
              ) : (
                messages.map((msg, i) => {
                  const isMine = msg.sender === user?._id;
                  return (
                    <div key={msg._id || i} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm ${
                        isMine 
                          ? 'bg-[#0cbde8] text-white rounded-br-sm' 
                          : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
                      }`}>
                        <p className="text-sm md:text-base leading-relaxed break-words">{msg.content}</p>
                        <span className={`text-[10px] mt-1 block ${isMine ? 'text-blue-100' : 'text-gray-400'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-gray-100 rounded-b-[24px]">
              <form onSubmit={handleSendMessage} className="flex gap-2 relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-cyan transition-all"
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl px-6 py-3 font-bold text-sm shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
              </form>
            </div>
            
          </div>
        ) : (
          <div className="interior-panel h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-2">
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
            </div>
            <p className="text-lg font-medium text-gray-500">Select a conversation</p>
            <p className="text-sm text-gray-400 max-w-xs text-center">Choose a connection from the menu to start chatting</p>
          </div>
        )}
      </div>

    </div>
  );
}
