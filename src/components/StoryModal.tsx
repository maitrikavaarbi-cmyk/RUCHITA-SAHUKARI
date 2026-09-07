import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  BookOpen, 
  Calendar, 
  Tag, 
  CheckCircle2, 
  Share2, 
  Play, 
  Sparkles, 
  FileText,
  Clock,
  Laptop
} from 'lucide-react';
import { WorkItem } from '../types';

interface StoryModalProps {
  work: WorkItem | null;
  onClose: () => void;
}

export const StoryModal: React.FC<StoryModalProps> = ({ work, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!work) return null;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(work.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const getPlatformColor = (platform: string) => {
    if (platform.includes('Hans')) return 'bg-blue-600';
    if (platform.includes('Substack')) return 'bg-[#FF6719]';
    if (platform.includes('Instagram') || platform.includes('Lit Scroll')) return 'bg-gradient-to-r from-pink-600 to-amber-600';
    return 'bg-[#d9823e]';
  };

  return (
    <div 
      id="story-preview-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div 
        id="story-preview-modal-content"
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-pink-200 shadow-2xl text-zinc-900 flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Top Bar */}
        <div className="sticky top-0 z-20 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-6 py-4 border-b border-pink-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white uppercase tracking-wider ${getPlatformColor(work.publicationOrPlatform)}`}>
              {work.publicationOrPlatform}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              &bull; {work.date}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              title="Copy link to clipboard"
              className="p-2 rounded-xl bg-pink-50 dark:bg-zinc-800 hover:bg-pink-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-pink-200 dark:border-zinc-700 transition-colors flex items-center gap-1 text-xs cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4 text-pink-600 dark:text-pink-400" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy Link'}</span>
            </button>

            <button
              id="story-modal-close-btn"
              onClick={onClose}
              className="p-2 rounded-xl bg-pink-50 dark:bg-zinc-800 hover:bg-pink-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-pink-200 dark:border-zinc-700 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Work Definition & Role Strip (if specified) */}
          {(work.projectType || work.rolePlayed || work.collaborators) && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-amber-50 dark:from-zinc-800 dark:to-zinc-800/80 border border-pink-200/80 dark:border-zinc-700 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {work.projectType && (
                  <span className="px-3 py-1 rounded-lg bg-pink-600 text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                    {work.projectType}
                  </span>
                )}
                {work.rolePlayed && (
                  <span className="px-3 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-pink-200 dark:border-zinc-700 text-xs text-zinc-800 dark:text-zinc-200 font-medium">
                    Role: <strong className="text-pink-600 dark:text-pink-400 font-semibold">{work.rolePlayed}</strong>
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-lg bg-white/70 dark:bg-zinc-900/70 text-xs font-mono text-zinc-600 dark:text-zinc-400 border border-pink-100 dark:border-zinc-700">
                  Format: {work.format || 'Project'}
                </span>
              </div>

              {work.collaborators && (
                <div className="text-xs text-zinc-600 dark:text-zinc-400 pt-1 border-t border-pink-200/50 dark:border-zinc-700 flex items-center gap-1.5">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">Collaborators & Team:</span>
                  <span>{work.collaborators}</span>
                </div>
              )}
            </div>
          )}

          {/* Visual Header Image if exists */}
          {work.imageUrl && (
            <div className="relative h-60 sm:h-72 w-full rounded-2xl overflow-hidden bg-pink-50 dark:bg-zinc-800 border border-pink-200 dark:border-zinc-700">
              <img
                src={work.imageUrl}
                alt={work.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {work.readTimeOrDuration && (
                <div className="absolute bottom-4 left-4 px-3 py-1 rounded-lg bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-pink-200 dark:border-zinc-700 text-xs font-mono text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5 shadow-sm">
                  <Clock className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                  <span>{work.readTimeOrDuration}</span>
                </div>
              )}
            </div>
          )}

          {/* Headline */}
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-white leading-tight">
            {work.title}
          </h2>

          {/* Excerpt / Lead */}
          <div className="p-4 rounded-xl bg-pink-50/70 dark:bg-zinc-800/60 border-l-4 border-pink-500 text-sm sm:text-base text-zinc-800 dark:text-zinc-200 leading-relaxed font-editorial italic">
            "{work.excerpt}"
          </div>

          {/* Full Description & Context */}
          {work.fullDescription && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-pink-700 dark:text-pink-400">
                Work Overview & Role Impact
              </h4>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans whitespace-pre-line">
                {work.fullDescription}
              </p>
            </div>
          )}

          {/* Key Takeaways */}
          {work.keyTakeaways && work.keyTakeaways.length > 0 && (
            <div className="p-5 rounded-2xl bg-pink-50/50 dark:bg-zinc-800/50 border border-pink-200 dark:border-zinc-700 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-pink-700 dark:text-pink-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                <span>Key Highlights & Production Takeaways</span>
              </h4>
              <ul className="space-y-2">
                {work.keyTakeaways.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-pink-600 dark:text-pink-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {work.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg bg-pink-50 dark:bg-zinc-800 border border-pink-200 dark:border-zinc-700 text-xs text-pink-700 dark:text-pink-400 font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>

        </div>

        {/* Modal Sticky Bottom Action Footer */}
        <div className="sticky bottom-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-6 py-4 border-t border-pink-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-zinc-500 dark:text-zinc-400 text-center sm:text-left">
            Platform / Medium: <span className="text-zinc-900 dark:text-white font-semibold">{work.publicationOrPlatform}</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-pink-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-pink-100 dark:hover:bg-zinc-700 border border-pink-200 dark:border-zinc-700 text-xs font-semibold cursor-pointer"
            >
              Close
            </button>

            {work.url && work.url !== '#' && (
              <a
                id="modal-direct-read-btn"
                href={work.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-pink-500/20 cursor-pointer"
              >
                {work.format === 'film' ? (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Watch Film / Video</span>
                  </>
                ) : work.format === 'magazine' ? (
                  <>
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read Publication / Issue</span>
                  </>
                ) : work.format === 'app' || work.url.includes('vercel.app') ? (
                  <>
                    <Laptop className="w-3.5 h-3.5" />
                    <span>Launch Live Web App</span>
                  </>
                ) : work.format === 'reel' ? (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Watch on Instagram</span>
                  </>
                ) : (
                  <>
                    <span>Open Work Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </>
                )}
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
