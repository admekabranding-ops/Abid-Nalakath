import React, { useState, useEffect } from 'react';
import { Mail, Trash2, CheckCheck, Info } from 'lucide-react';
import { apiRequest } from '../../../api/client';

export const MessagesTab: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/admin/messages');
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRead = async (msg: any) => {
    try {
      const newStatus = !msg.is_read;
      await apiRequest(`/admin/messages/${msg.id}/read`, {
        method: 'PATCH',
        body: JSON.stringify({ is_read: newStatus }),
      });
      setMessages(messages.map((m) => m.id === msg.id ? { ...m, is_read: newStatus ? 1 : 0 } : m));
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage({ ...selectedMessage, is_read: newStatus ? 1 : 0 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await apiRequest(`/admin/messages/${id}`, { method: 'DELETE' });
      setMessages(messages.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">
            Client Inquiries Inbox
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Locally stored messages submitted through your public website contact form
          </p>
        </div>
      </div>

      {/* Local Storage Notice */}
      <div className="p-4 rounded-2xl bg-[#FF9D00]/10 border border-[#FF9D00]/25 flex items-start gap-3 text-xs text-neutral-300">
        <Info className="w-4 h-4 text-[#FF9D00] flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold text-white">Local Storage Notice:</span> Inquiries submitted by clients remain securely stored on this computer in your local SQLite database (<code className="text-[#FF9D00]">data/database.sqlite</code>). They are not transmitted to any third-party or cloud server.
        </div>
      </div>

      {/* Main Split: Message List + Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Messages List (cols 1-5) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 px-1">
            Total Messages ({messages.length})
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-neutral-500">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="bg-[#140a07] border border-white/10 rounded-3xl p-8 text-center text-neutral-500 text-xs">
              No inquiries received yet. Submit a test message on the public website!
            </div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessage(msg);
                    if (!msg.is_read) handleToggleRead(msg);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedMessage?.id === msg.id
                      ? 'bg-[#F4510B]/15 border-[#F4510B]/50'
                      : msg.is_read
                      ? 'bg-[#140a07] border-white/5 hover:border-white/20'
                      : 'bg-[#1a0c08] border-[#FF9D00]/30 hover:border-[#FF9D00]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{msg.name}</span>
                      {!msg.is_read && (
                        <span className="w-2 h-2 rounded-full bg-[#F4510B] animate-pulse" />
                      )}
                    </div>
                    <span className="text-[10px] text-neutral-500">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="text-xs text-[#FF9D00] font-medium mb-1">
                    {msg.project_type}
                  </div>

                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Message Detail (cols 6-12) */}
        <div className="lg:col-span-7">
          {selectedMessage ? (
            <div className="bg-[#140a07] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl sticky top-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <div className="text-xs text-neutral-400">From</div>
                  <h3 className="font-display font-bold text-xl text-white">
                    {selectedMessage.name}
                  </h3>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-xs text-[#FF9D00] hover:underline mt-0.5 inline-block"
                  >
                    {selectedMessage.email}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleRead(selectedMessage)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs flex items-center gap-1.5"
                    title={selectedMessage.is_read ? 'Mark as Unread' : 'Mark as Read'}
                  >
                    <CheckCheck className="w-4 h-4 text-[#FF9D00]" />
                    <span>{selectedMessage.is_read ? 'Mark Unread' : 'Mark Read'}</span>
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400"
                    title="Delete Message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <div className="text-neutral-500 uppercase font-semibold text-[10px]">Project Category</div>
                  <div className="text-white font-medium mt-1">{selectedMessage.project_type}</div>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <div className="text-neutral-500 uppercase font-semibold text-[10px]">Date &amp; Time</div>
                  <div className="text-white font-medium mt-1">
                    {new Date(selectedMessage.created_at).toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold uppercase text-neutral-400 mb-2">
                  Client Message
                </div>
                <div className="p-4 rounded-2xl bg-black/50 border border-white/5 text-sm text-neutral-200 leading-relaxed whitespace-pre-line">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Regarding your ${selectedMessage.project_type} project inquiry`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F4510B] to-[#FF9D00] text-white font-semibold text-xs uppercase tracking-wider shadow-glow-orange"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Reply via Email Client</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-[#140a07] border border-white/10 rounded-3xl p-12 text-center text-neutral-500 flex flex-col items-center justify-center min-h-[300px]">
              <Mail className="w-10 h-10 text-neutral-600 mb-3" />
              <p className="text-xs">Select an inquiry from the list to view its full details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
