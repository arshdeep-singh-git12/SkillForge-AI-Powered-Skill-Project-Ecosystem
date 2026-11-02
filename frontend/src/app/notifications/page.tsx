'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/notifications');
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  const acceptTeamRequest = async (teamId: string, notificationId: string) => {
    try {
      await api.post(`/teams/${teamId}/accept-request`, { notificationId });
      
      // Update local state to show it was accepted
      setNotifications(notifications.map(n => 
        n._id === notificationId 
          ? { ...n, isRead: true, data: { ...n.data, status: 'ACCEPTED' } } 
          : n
      ));
      
      alert('Team request accepted successfully!');
    } catch (error: any) {
      console.error('Failed to accept request', error);
      alert(error.response?.data?.message || 'Failed to accept request');
    }
  };

  const handleConnectionRequest = async (requesterId: string, notificationId: string, action: string) => {
    try {
      await api.post(`/users/${requesterId}/respond`, { action, notificationId });
      setNotifications(notifications.map(n => 
        n._id === notificationId 
          ? { ...n, isRead: true, data: { ...n.data, status: action } } 
          : n
      ));
    } catch (error: any) {
      console.error('Failed to respond', error);
      alert(error.response?.data?.message || 'Failed to respond');
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!user) return null;

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 interior-card bg-white shadow-sm">
        <div>
          <h1 className="text-3xl interior-heading mb-1">
            Notifications
          </h1>
          <p className="interior-text font-sans text-sm">Stay updated on team requests and platform alerts.</p>
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="interior-pill interior-pill-active shadow-md text-sm whitespace-nowrap"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="interior-panel overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 animate-pulse">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-16 text-center text-gray-500 font-sans">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p className="text-lg">No notifications yet</p>
            <p className="text-sm mt-2 text-gray-400">When you receive requests or updates, they will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => {
              const isAccepted = notification.data?.status === 'ACCEPTED';
              
              return (
              <div 
                key={notification._id} 
                className={`p-6 transition-all duration-300 ${
                  !notification.isRead 
                    ? 'bg-blue-50/40 hover:bg-blue-50' 
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex gap-4 items-start">
                  <div className={`p-3 rounded-full mt-1 ${
                    notification.type === 'TEAM_JOIN_REQUEST' 
                      ? 'bg-purple-100 text-purple-600' 
                      : notification.type === 'TEAM_JOIN_ACCEPTED'
                        ? 'bg-green-100 text-green-600'
                        : ['PROJECT_LIKE', 'CERTIFICATE_LIKE'].includes(notification.type)
                          ? 'bg-red-100 text-red-500'
                          : 'bg-blue-100 text-blue-600'
                  }`}>
                    {notification.type === 'TEAM_JOIN_REQUEST' ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    ) : notification.type === 'CONNECTION_REQUEST' ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    ) : notification.type === 'TEAM_JOIN_ACCEPTED' ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : ['PROJECT_LIKE', 'CERTIFICATE_LIKE'].includes(notification.type) ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L12 8.343l3.172-3.171a4 4 0 115.656 5.656L12 21.343l-8.828-8.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`text-lg ${!notification.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                        {new Date(notification.createdAt).toLocaleDateString()} at {new Date(notification.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 font-sans">
                      {['CONNECTION_REQUEST', 'PROJECT_LIKE', 'CERTIFICATE_LIKE'].includes(notification.type) && notification.sender?.name 
                        ? <><span className="font-bold text-gray-900">{notification.sender.name}</span> {notification.message}</> 
                        : notification.message}
                    </p>
                    
                    {notification.type === 'TEAM_JOIN_REQUEST' && notification.data && (
                      <div className="mt-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm inline-block min-w-full sm:min-w-[300px]">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 font-sans">Applicant Details</h4>
                        <div className="space-y-2 text-sm mb-4">
                          <div className="flex justify-between border-b border-gray-50 pb-1">
                            <span className="text-gray-500 font-medium">Name:</span>
                            <span className="text-gray-900 font-semibold">{notification.data.applicantName}</span>
                          </div>
                          <div className="flex justify-between border-b border-gray-50 pb-1">
                            <span className="text-gray-500 font-medium">Email:</span>
                            <span className="text-gray-900 font-semibold">{notification.data.applicantEmail}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500 font-medium">Mobile:</span>
                            <span className="text-gray-900 font-semibold">{notification.data.applicantMobile}</span>
                          </div>
                        </div>
                        
                        {isAccepted ? (
                          <div className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-200">
                            ✓ REQUEST ACCEPTED
                          </div>
                        ) : (
                          <button 
                            onClick={() => acceptTeamRequest(notification.data.teamId, notification._id)}
                            className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-bold shadow-md hover:bg-gray-800 transition-colors"
                          >
                            Accept Request
                          </button>
                        )}
                      </div>
                    )}
                    
                    {notification.type === 'CONNECTION_REQUEST' && (
                      <div className="mt-4 flex gap-3">
                        {notification.data?.status === 'ACCEPTED' || notification.data?.status === 'ACCEPT' ? (
                          <div className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-200">
                            ✓ FORGED
                          </div>
                        ) : notification.data?.status === 'REJECTED' || notification.data?.status === 'REJECT' ? (
                          <div className="inline-block px-3 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-lg border border-gray-200">
                            DECLINED
                          </div>
                        ) : (
                          <>
                            <button 
                              onClick={() => {
                                const senderId = notification.sender?._id || notification.sender || notification.data?.requesterId;
                                if (!senderId) {
                                  alert('Error: Sender information is missing.');
                                  return;
                                }
                                handleConnectionRequest(senderId, notification._id, 'ACCEPT');
                              }}
                              className="px-4 py-2 bg-[#0cbde8] hover:bg-[#0aa6cc] text-white rounded-lg text-sm font-bold shadow-md transition-colors"
                            >
                              Accept Forge
                            </button>
                            <button 
                              onClick={() => {
                                const senderId = notification.sender?._id || notification.sender || notification.data?.requesterId;
                                if (!senderId) {
                                  alert('Error: Sender information is missing.');
                                  return;
                                }
                                handleConnectionRequest(senderId, notification._id, 'REJECT');
                              }}
                              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-bold transition-colors"
                            >
                              Decline
                            </button>
                          </>
                        )}
                      </div>
                    )}
                    
                    {!notification.isRead && (
                      <button 
                        onClick={() => markAsRead(notification._id)}
                        className="mt-4 text-sm text-blue-600 font-bold hover:text-blue-700 font-sans flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        Mark as read
                      </button>
                    )}
                  </div>
                  
                  {!notification.isRead && (
                    <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(37,99,235,0.5)]"></div>
                  )}
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
