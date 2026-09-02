import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Globe, 
  MessageCircle,
  Linkedin,
  Twitter,
  Mail,
  Key,
  Eye,
  Send
} from 'lucide-react';
import { PortfolioMode } from '../types';

interface ShareLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEditor?: () => void;
  onSwitchMode?: (mode: PortfolioMode) => void;
  currentMode?: PortfolioMode;
}

export const ShareLinksModal: React.FC<ShareLinksModalProps> = ({
  isOpen,
  onClose,
  onOpenEditor,
  onSwitchMode,
  currentMode = 'public'
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  // Transform private ais-dev URL to the public, always-active ais-pre shared URL
  const currentOrigin = window.location.origin;
  const publicOrigin = currentOrigin.includes('ais-dev-')
    ? currentOrigin.replace('ais-dev-', 'ais-pre-')
    : currentOrigin;

  const publicPortfolioUrl = `${publicOrigin}/`;
  const adminEditUrl = `${publicOrigin}/?edit=ruchita`;
  const journalismUrl = `${publicOrigin}/#journalism`;
  const litScrollUrl = `${publicOrigin}/#the-lit-scroll`;
  const substackUrl = `${publicOrigin}/#substack`;
  const contactUrl = `${publicOrigin}/#contact`;

  const copyToClipboard = (text: string, type: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    }
  };

  const shareTitle = "Ruchita Sahukari — Journalism & Media Portfolio";
  const shareText = "Explore Ruchita Sahukari's journalism bylines, editorial projects, The Lit Scroll, and communications work.";

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: publicPortfolioUrl,
        });
      } catch (err) {
        // User cancelled or share failed, fallback to copy
        copyToClipboard(publicPortfolioUrl, 'public');
      }
    } else {
      copyToClipboard(publicPortfolioUrl, 'public');
    }
  };

  const isEditor = currentMode === 'editor';

  return (
    <div 
      id="share-links-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div 
        id="share-links-modal-container"
        className="relative w-full max-w-lg rounded-3xl bg-[#141414] border border-white/15 p-6 sm:p-7 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#d9823e]/20 text-[#d9823e]">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Share Portfolio
              </h3>
              <p className="text-xs text-zinc-400">Share Ruchita's live portfolio with recruiters, editors & network</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Public Share Link */}
        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-3 shadow-inner">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#d9823e]" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Public Portfolio URL
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
              Live & Verified
            </span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              readOnly
              value={publicPortfolioUrl}
              className="flex-1 bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-emerald-300 font-mono select-all focus:outline-none"
            />
            <button
              id="share-modal-copy-btn"
              onClick={() => copyToClipboard(publicPortfolioUrl, 'public')}
              className="px-4 py-2.5 rounded-xl bg-[#d9823e] hover:bg-[#c4712f] text-black font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer shadow-md"
            >
              {copiedType === 'public' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Social & Direct Share Buttons */}
        <div className="space-y-2.5">
          <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Quick Share Channels
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Native Mobile / System Share */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white flex flex-col items-center justify-center gap-1.5 text-xs font-medium transition-all group cursor-pointer"
              >
                <Send className="w-4 h-4 text-[#d9823e] group-hover:scale-110 transition-transform" />
                <span>Share App</span>
              </button>
            )}

            {/* LinkedIn */}
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicPortfolioUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-zinc-900 hover:bg-[#0077b5]/20 border border-white/10 hover:border-[#0077b5]/50 text-white flex flex-col items-center justify-center gap-1.5 text-xs font-medium transition-all group cursor-pointer"
            >
              <Linkedin className="w-4 h-4 text-[#0077b5] group-hover:scale-110 transition-transform" />
              <span>LinkedIn</span>
            </a>

            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + '\n' + publicPortfolioUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-zinc-900 hover:bg-[#25D366]/20 border border-white/10 hover:border-[#25D366]/50 text-white flex flex-col items-center justify-center gap-1.5 text-xs font-medium transition-all group cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366] group-hover:scale-110 transition-transform" />
              <span>WhatsApp</span>
            </a>

            {/* Twitter / X */}
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(publicPortfolioUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-white/30 text-white flex flex-col items-center justify-center gap-1.5 text-xs font-medium transition-all group cursor-pointer"
            >
              <Twitter className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
              <span>X / Twitter</span>
            </a>

            {/* Email */}
            <a
              href={`mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText + '\n\n' + publicPortfolioUrl)}`}
              className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-amber-500/50 text-white flex flex-col items-center justify-center gap-1.5 text-xs font-medium transition-all group cursor-pointer"
            >
              <Mail className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Email</span>
            </a>
          </div>
        </div>

        {/* Section Links */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Direct Section Deep Links
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">Journalism Bylines</div>
                <div className="text-[10px] text-zinc-400 font-mono">/#journalism</div>
              </div>
              <button
                onClick={() => copyToClipboard(journalismUrl, 'journalism')}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium cursor-pointer"
                title="Copy section link"
              >
                {copiedType === 'journalism' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">The Lit Scroll</div>
                <div className="text-[10px] text-zinc-400 font-mono">/#the-lit-scroll</div>
              </div>
              <button
                onClick={() => copyToClipboard(litScrollUrl, 'litscroll')}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium cursor-pointer"
                title="Copy section link"
              >
                {copiedType === 'litscroll' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">Substack Articles</div>
                <div className="text-[10px] text-zinc-400 font-mono">/#substack</div>
              </div>
              <button
                onClick={() => copyToClipboard(substackUrl, 'substack')}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium cursor-pointer"
                title="Copy section link"
              >
                {copiedType === 'substack' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">Contact & Socials</div>
                <div className="text-[10px] text-zinc-400 font-mono">/#contact</div>
              </div>
              <button
                onClick={() => copyToClipboard(contactUrl, 'contact')}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium cursor-pointer"
                title="Copy section link"
              >
                {copiedType === 'contact' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Private Admin / Edit Link ONLY visible when Ruchita is already logged into Editor Mode */}
        {isEditor && (
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-[#d9823e]/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-[#d9823e]" />
                <span className="text-xs font-bold text-[#d9823e] uppercase tracking-wider">
                  Your Private Admin Link
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#d9823e]/20 text-[#d9823e] text-[10px] font-bold">
                Owner Only
              </span>
            </div>
            <p className="text-[11px] text-zinc-300">
              Only visible to you because Creator Studio is unlocked on this device.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={adminEditUrl}
                className="flex-1 bg-zinc-950 border border-[#d9823e]/30 rounded-xl px-3 py-2 text-xs text-[#d9823e] font-mono select-all focus:outline-none"
              />
              <button
                onClick={() => copyToClipboard(adminEditUrl, 'admin')}
                className="px-3.5 py-2 rounded-xl bg-[#d9823e] hover:bg-[#c4712f] text-black font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
              >
                {copiedType === 'admin' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-between">
          {isEditor && onSwitchMode && (
            <button
              onClick={() => {
                onSwitchMode('public');
                onClose();
              }}
              className="text-xs font-medium text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-blue-400" />
              <span>Preview Public View</span>
            </button>
          )}

          <div className="ml-auto">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
