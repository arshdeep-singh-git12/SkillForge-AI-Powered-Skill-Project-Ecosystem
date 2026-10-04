'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import { teamService } from '@/services/team.service';
import type { JoinRequest } from '@/types';

interface PendingRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  onUpdated: () => void;
}

export default function PendingRequestsModal({ isOpen, onClose, teamId, onUpdated }: PendingRequestsModalProps) {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      fetchRequests();
    }
  }, [isOpen, teamId]);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await teamService.getJoinRequests(teamId);
      setRequests(response.data || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load requests';
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message || msg);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    setProcessing((prev) => ({ ...prev, [userId]: true }));
    try {
      await teamService.approveJoinRequest(teamId, userId);
      setRequests((prev) => prev.filter((r) => r.user.id !== userId && r.user._id !== userId));
      onUpdated();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to approve request';
      const axiosErr = err as { response?: { data?: { message?: string } } };
      alert(axiosErr?.response?.data?.message || msg);
    } finally {
      setProcessing((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleReject = async (userId: string) => {
    setProcessing((prev) => ({ ...prev, [userId]: true }));
    try {
      await teamService.rejectJoinRequest(teamId, userId);
      setRequests((prev) => prev.filter((r) => r.user.id !== userId && r.user._id !== userId));
      onUpdated();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reject request';
      const axiosErr = err as { response?: { data?: { message?: string } } };
      alert(axiosErr?.response?.data?.message || msg);
    } finally {
      setProcessing((prev) => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pending Join Requests">
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-5 w-5 border-2 border-[#0cbde8] border-t-transparent rounded-full" />
          </div>
        ) : error ? (
          <div className="p-3 rounded-sm bg-red-400/10 border border-red-400/20">
            <p className="font-mono text-[10px] text-red-400 text-center">{error}</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-8">
            <p className="font-mono text-[10px] text-[#7a889b]">No pending requests.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {requests.map((req) => {
              const userId = req.user.id || req.user._id || '';
              const isProcessing = processing[userId];
              
              return (
                <div key={userId} className="flex items-center justify-between p-3 rounded-sm bg-[#15181d] border border-[#2d333b]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#232830] flex items-center justify-center border border-[#2d333b]">
                      <span className="font-mono text-[10px] text-[#0cbde8]">
                        {req.user.name ? req.user.name.charAt(0).toUpperCase() : '?'}
                      </span>
                    </div>
                    <div>
                      <p className="font-sans font-semibold text-[#eaedf0] text-sm">{req.user.name}</p>
                      <p className="font-mono text-[10px] text-[#7a889b]">{req.user.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(userId)}
                      disabled={isProcessing}
                      className="btn-primary text-[10px] px-3 py-1.5 disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(userId)}
                      disabled={isProcessing}
                      className="btn-secondary text-[10px] px-3 py-1.5 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}
