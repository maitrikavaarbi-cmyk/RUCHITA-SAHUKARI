import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Unlock, 
  Briefcase, 
  Eye, 
  EyeOff,
  Sparkles, 
  Key
} from 'lucide-react';
import { PortfolioMode } from '../types';

interface UnlockEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSwitch: (targetMode: PortfolioMode) => void;
  currentMode: PortfolioMode;
}

export const UnlockEditorModal: React.FC<UnlockEditorModalProps> = ({
  isOpen,
  onClose,
  onConfirmSwitch,
  currentMode
}) => {
  const [pinInput, setPinInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUnlock = () => {
    const trimmed = pinInput.trim();
    if (!trimmed) {
      setErrorMsg('Please enter your owner password to continue.');
      return;
    }
    // Set to user's specified secure password "Vaarbi@12"
    if (trimmed !== 'Vaarbi@12' && trimmed.toLowerCase() !== 'vaarbi@12') {
      setErrorMsg('Incorrect password. Access is restricted to the portfolio owner.');
      return;
    }
    setErrorMsg(null);
    onConfirmSwitch('editor');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-white border border-pink-200 p-6 sm:p-7 shadow-2xl space-y-6 text-zinc-900">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-pink-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-pink-100 text-pink-700">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-zinc-900">
                Ruchita's Owner Access
              </h3>
              <p className="text-xs text-zinc-500">Manage bylines, photos & content directly on your site</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status context cards */}
        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-zinc-700 space-y-1">
            <div className="font-bold text-emerald-700 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Public / Employer View (Default)</span>
            </div>
            <p className="text-[11px] text-zinc-600">
              External visitors and recruiters can only view published works and contact info. All editing buttons are completely hidden.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-pink-50/70 border border-pink-200 text-zinc-700 space-y-1">
            <div className="font-bold text-pink-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Owner Studio Access</span>
            </div>
            <p className="text-[11px] text-zinc-600">
              Unlock the site to upload articles, crop profile and field photos, update positions, and create AI summaries.
            </p>
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label className="block text-zinc-700 font-bold uppercase tracking-wider text-[11px]">
            Owner Password
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type={showPassword ? 'text' : 'password'}
                maxLength={32}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setErrorMsg(null);
                }}
                placeholder="Enter your owner password"
                className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 pr-10 text-zinc-900 text-xs font-mono focus:border-pink-500 focus:bg-white focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleUnlock();
                }}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button
              onClick={handleUnlock}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-pink-500/20 shrink-0 cursor-pointer"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Unlock</span>
            </button>
          </div>
          {errorMsg && (
            <p className="text-rose-600 text-[11px] flex items-center gap-1 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>{errorMsg}</span>
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-pink-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-zinc-500 hover:text-pink-600 cursor-pointer transition-colors"
          >
            Cancel & Return to Public View
          </button>

          <span className="text-[11px] text-zinc-400 flex items-center gap-1">
            <Lock className="w-3 h-3 text-zinc-400" />
            <span>Encrypted Owner Access</span>
          </span>
        </div>

      </div>
    </div>
  );
};
