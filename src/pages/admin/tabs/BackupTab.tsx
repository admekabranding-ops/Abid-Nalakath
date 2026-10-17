import React, { useState } from 'react';
import { Download, Upload, AlertTriangle, Check, RefreshCw } from 'lucide-react';
import { apiRequest, getAuthToken } from '../../../api/client';

export const BackupTab: React.FC = () => {
  const [restoring, setRestoring] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedBackupData, setSelectedBackupData] = useState<any | null>(null);

  const handleExport = () => {
    const token = getAuthToken();
    const url = `/api/admin/backup/export`;
    // Trigger download via hidden link with authorization
    fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.blob())
      .then(blob => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `abid-portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setSuccessMsg('Complete SQLite database backup successfully downloaded!');
        setTimeout(() => setSuccessMsg(''), 4000);
      })
      .catch(err => setErrorMsg(err.message));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg('');
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!json.site_content || !json.projects) {
          throw new Error('Selected file is not a valid Abid Portfolio backup JSON.');
        }
        setSelectedBackupData(json);
        setConfirmModalOpen(true);
      } catch (err: any) {
        setErrorMsg(`Failed to parse backup file: ${err.message}`);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const handleConfirmRestore = async () => {
    if (!selectedBackupData) return;

    setRestoring(true);
    setConfirmModalOpen(false);
    setErrorMsg('');

    try {
      const res = await apiRequest<{ success: boolean; message: string }>('/admin/backup/restore', {
        method: 'POST',
        body: JSON.stringify({ backup: selectedBackupData }),
      });
      setSuccessMsg(res.message || 'Backup restored successfully!');
      setSelectedBackupData(null);
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err: any) {
      setErrorMsg(`Restore failed: ${err.message}`);
    } finally {
      setRestoring(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      <div className="pb-6 border-b border-white/10">
        <h2 className="font-display text-2xl font-bold text-white">
          Local Backup &amp; Disaster Recovery
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Export your SQLite database content to a safe file, or restore from a previous backup
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300">
          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-300">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Export Card */}
      <div className="bg-[#140a07] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F4510B]/20 flex items-center justify-center text-[#FF9D00]">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-white">
              Export Complete Website Database
            </h3>
            <p className="text-xs text-neutral-400">
              Downloads a snapshot containing all hero copy, about sections, project case studies, services, stats, and client inquiries.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleExport}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#F4510B] to-[#FF9D00] text-white font-semibold text-xs tracking-wider uppercase shadow-glow-orange hover:opacity-95 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Database Backup (.json)</span>
          </button>
        </div>
      </div>

      {/* Restore Card */}
      <div className="bg-[#140a07] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-white">
              Restore from Previous Backup
            </h3>
            <p className="text-xs text-neutral-400">
              Restore website data from a valid JSON backup file. You will be prompted to confirm before any changes are written.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <label className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold text-xs tracking-wider uppercase cursor-pointer transition-all">
            <RefreshCw className={`w-4 h-4 ${restoring ? 'animate-spin' : ''}`} />
            <span>{restoring ? 'Restoring Database...' : 'Select Backup File to Restore'}</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              disabled={restoring}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModalOpen && selectedBackupData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#160c08] border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full text-white shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">
              Confirm Database Restore
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              This backup contains <strong className="text-white">{selectedBackupData.projects?.length || 0} projects</strong> and <strong className="text-white">{selectedBackupData.site_content?.length || 0} content blocks</strong>. Restoring will replace current portfolio content with this snapshot.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setConfirmModalOpen(false);
                  setSelectedBackupData(null);
                }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRestore}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#F4510B] to-[#FF9D00] text-white text-xs font-semibold shadow-glow-orange"
              >
                Yes, Restore Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
