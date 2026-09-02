import React, { useState } from 'react';
import { 
  Briefcase, 
  Edit3, 
  Eye, 
  Lock, 
  Unlock, 
  Copy, 
  Check, 
  Share2, 
  FileText, 
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Camera,
  LogOut,
  Globe,
  Key
} from 'lucide-react';
import { PortfolioMode, UserProfile } from '../types';

interface ModeSwitcherBannerProps {
  mode: PortfolioMode;
  onSwitchMode: (targetMode: PortfolioMode) => void;
  onOpenEditor: () => void;
  onOpenChangePhoto?: () => void;
  onOpenShareModal: () => void;
  profile: UserProfile;
  worksCount: number;
}

export const ModeSwitcherBanner: React.FC<ModeSwitcherBannerProps> = ({
  mode,
  onSwitchMode,
  onOpenEditor,
  onOpenChangePhoto,
  onOpenShareModal,
  profile,
  worksCount
}) => {
  const [copiedType, setCopiedType] = useState<'public' | 'admin' | null>(null);

  // Compute clean public and admin URLs
  const currentOrigin = window.location.origin;
  const publicOrigin = currentOrigin.includes('ais-dev-')
    ? currentOrigin.replace('ais-dev-', 'ais-pre-')
    : currentOrigin;

  const publicUrl = `${publicOrigin}/`;
  const adminUrl = `${publicOrigin}/?edit=ruchita`;

  const copyToClipboard = (text: string, type: 'public' | 'admin') => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    }
  };

  // When in public mode: don't show any distracting banner across the top!
  if (mode === 'public' || mode === 'employer') {
    return null;
  }

  // Admin / Creator Mode Banner
  return (
    <div 
      id="admin-mode-banner"
      className="w-full bg-gradient-to-r from-pink-50 via-rose-50 to-pink-100 border-b border-pink-200 px-3 sm:px-6 py-2 text-xs text-zinc-800 z-50 sticky top-0 backdrop-blur-md shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        
        {/* Left: Admin Status & Explanation */}
        <div className="flex items-center gap-2.5 text-center md:text-left flex-wrap justify-center md:justify-start">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-200/80 border border-pink-300 text-pink-800 text-[11px] font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-pink-600" />
            <span>Ruchita's Admin Studio</span>
          </span>
          <span className="text-zinc-600 text-xs hidden lg:inline">
            You can edit content, change pictures, and manage works. Changes are automatically published live for everyone!
          </span>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-center">
          
          {/* Copy Public Link (for others) */}
          <button
            id="admin-btn-copy-public-link"
            onClick={() => copyToClipboard(publicUrl, 'public')}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-pink-50 text-zinc-700 text-xs font-semibold flex items-center gap-1.5 border border-pink-200 transition-all cursor-pointer shadow-xs"
            title="Copy clean public link for employers and readers (no edit buttons)"
          >
            {copiedType === 'public' ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700">Public Link Copied!</span>
              </>
            ) : (
              <>
                <Globe className="w-3 h-3 text-emerald-600" />
                <span>Copy Share Link (for others)</span>
              </>
            )}
          </button>

          {/* Copy Secret Admin Link (for Ruchita) */}
          <button
            id="admin-btn-copy-admin-link"
            onClick={() => copyToClipboard(adminUrl, 'admin')}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-pink-50 text-zinc-700 text-xs font-semibold flex items-center gap-1.5 border border-pink-200 transition-all cursor-pointer shadow-xs"
            title="Copy your secret admin link to bookmark for editing"
          >
            {copiedType === 'admin' ? (
              <>
                <Check className="w-3 h-3 text-pink-600" />
                <span className="text-pink-700">Admin Link Copied!</span>
              </>
            ) : (
              <>
                <Key className="w-3 h-3 text-pink-600" />
                <span>Copy My Edit Link</span>
              </>
            )}
          </button>

          {/* Preview Public View */}
          <button
            id="admin-btn-preview-public"
            onClick={() => onSwitchMode('public')}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-pink-50 text-zinc-700 text-xs font-semibold flex items-center gap-1.5 border border-pink-200 transition-all cursor-pointer shadow-xs"
            title="Preview clean public view without edit controls"
          >
            <Eye className="w-3 h-3 text-blue-600" />
            <span className="hidden sm:inline">Preview Public View</span>
          </button>

          {/* Upload & Manage Works Modal */}
          <button
            id="admin-btn-upload-work"
            onClick={onOpenEditor}
            className="px-3 py-1 rounded-lg bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer hover:scale-105"
            title="Upload new article, byline, research or job"
          >
            <Sparkles className="w-3 h-3" />
            <span>+ Upload Work ({worksCount})</span>
          </button>

          {/* Change Photos Modal */}
          {onOpenChangePhoto && (
            <button
              id="admin-btn-change-photos"
              onClick={onOpenChangePhoto}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-pink-50 text-pink-700 text-xs font-semibold flex items-center gap-1 border border-pink-300 transition-all cursor-pointer shadow-xs"
              title="Change Profile & Field Photos"
            >
              <Camera className="w-3 h-3" />
              <span className="hidden sm:inline">Photos</span>
            </button>
          )}

          {/* Exit Admin */}
          <button
            id="admin-btn-exit"
            onClick={() => onSwitchMode('public')}
            className="p-1 rounded-lg text-zinc-500 hover:text-pink-700 hover:bg-pink-200/50 transition-all cursor-pointer"
            title="Exit Admin Studio"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>
    </div>
  );
};
