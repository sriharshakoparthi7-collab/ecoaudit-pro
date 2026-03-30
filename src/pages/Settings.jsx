import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { User, Trash2, LogOut, Moon, Sun, Monitor, ChevronRight, AlertTriangle } from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteText, setDeleteText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const handleRequestDeletion = async () => {
    if (deleteText !== 'DELETE') return;
    setDeleting(true);
    await base44.integrations.Core.SendEmail({
      to: user.email,
      subject: 'Account Deletion Request — Sustainability Wise',
      body: `A request to permanently delete the account for ${user.email} has been submitted. Your account and all associated data will be deleted within 30 days. If this was not you, please contact support immediately.`,
    });
    toast.success('Deletion request submitted. You will receive a confirmation email.');
    setDeleting(false);
    setShowDeleteConfirm(false);
    setTimeout(() => base44.auth.logout(), 2000);
  };

  const THEMES = [
    { value: 'system', label: 'System', icon: Monitor },
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
  ];

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Account</h2>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{user?.full_name || '—'}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Appearance</h2>
        <div className="grid grid-cols-3 gap-2">
          {THEMES.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${theme === value ? 'border-primary bg-primary/5' : 'border-border bg-background'}`}
            >
              <Icon className={`w-5 h-5 ${theme === value ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`text-xs font-medium ${theme === value ? 'text-primary' : 'text-muted-foreground'}`}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider p-5 pb-3">Account Actions</h2>
        <button
          onClick={() => base44.auth.logout()}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted transition-colors border-t border-border"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Log Out</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-destructive/5 transition-colors border-t border-border"
        >
          <div className="flex items-center gap-3">
            <Trash2 className="w-4 h-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">Delete Account</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Delete Account</h3>
                <p className="text-xs text-muted-foreground">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              All your audits, zones, and equipment data will be permanently deleted within 30 days.
              Type <strong>DELETE</strong> to confirm.
            </p>
            <input
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              placeholder="Type DELETE to confirm"
              value={deleteText}
              onChange={e => setDeleteText(e.target.value)}
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowDeleteConfirm(false); setDeleteText(''); }}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestDeletion}
                disabled={deleteText !== 'DELETE' || deleting}
                className="flex-1 py-2.5 rounded-xl bg-destructive text-white text-sm font-medium disabled:opacity-40"
              >
                {deleting ? 'Submitting…' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}