import React, { useState } from 'react';
import { 
  ArrowUp, 
  Instagram, 
  Linkedin, 
  FileText, 
  Youtube, 
  Mail, 
  ExternalLink,
  TreePine,
  Sparkles,
  Lock,
  ShieldCheck,
  X
} from 'lucide-react';
import { UserProfile, PortfolioMode } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface FooterProps {
  profile: UserProfile;
  currentMode?: PortfolioMode;
  onOpenUnlockModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  profile,
  currentMode = 'public',
  onOpenUnlockModal 
}) => {
  const [showRightsModal, setShowRightsModal] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-white text-zinc-900 border-t border-pink-200 relative overflow-hidden">
      
      {/* Moodboard Quote Ribbon Bar */}
      <div className="bg-pink-50/70 border-b border-pink-200 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          
          <div className="flex items-center gap-3">
            <span className="text-2xl text-pink-600 font-serif">“</span>
            <p className="font-editorial text-sm sm:text-base italic text-zinc-700 max-w-3xl leading-snug">
              {profile.heroQuote}
            </p>
          </div>

          <div className="shrink-0">
            <span className="font-script text-3xl font-bold text-pink-600 tracking-wide">
              {profile.name}
            </span>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 flex items-center justify-center text-white font-serif font-bold text-lg shadow-sm">
                RS.
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-zinc-900">{profile.name}</h3>
                <p className="text-xs text-zinc-500">Journalist & Communications Professional</p>
              </div>
            </div>
            
            <p className="text-xs text-zinc-600 max-w-md leading-relaxed font-sans">
              Curated portfolio documenting field reportage, The Lit Scroll academic journalism, Substack essays, and strategic communications.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <a
                href={profile.contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-pink-50 hover:bg-pink-100 text-zinc-600 hover:text-pink-600 border border-pink-200 transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={profile.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-pink-50 hover:bg-pink-100 text-zinc-600 hover:text-[#0A66C2] border border-pink-200 transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={profile.contact.substack}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-pink-50 hover:bg-pink-100 text-zinc-600 hover:text-[#FF6719] border border-pink-200 transition-colors"
                title="Substack"
              >
                <FileText className="w-4 h-4" />
              </a>
              <a
                href={profile.contact.linktree}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-pink-50 hover:bg-pink-100 text-zinc-600 hover:text-emerald-600 border border-pink-200 transition-colors"
                title="Linktree"
              >
                <TreePine className="w-4 h-4" />
              </a>
              <a
                href={profile.contact.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-pink-50 hover:bg-pink-100 text-zinc-600 hover:text-red-600 border border-pink-200 transition-colors"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-pink-700">
              Sections
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600">
              <li><a href="#hero" className="hover:text-pink-600 transition-colors">Home</a></li>
              <li><a href="#work" className="hover:text-pink-600 transition-colors">Featured Works</a></li>
              <li><a href="#journalism" className="hover:text-pink-600 transition-colors">The Hans India Bylines</a></li>
              <li><a href="#the-lit-scroll" className="hover:text-pink-600 transition-colors">The Lit Scroll (Group E)</a></li>
              <li><a href="#substack" className="hover:text-pink-600 transition-colors">Substack Publications</a></li>
              <li><a href="#about" className="hover:text-pink-600 transition-colors">About & Experience</a></li>
              <li><a href="#recommendations" className="hover:text-pink-600 transition-colors">Recommendations & Feedback</a></li>
              <li><a href="#contact" className="hover:text-pink-600 transition-colors">Contact & Connect</a></li>
            </ul>
          </div>

          {/* Direct Actions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-pink-700">
              Direct Contact
            </h4>
            <div className="space-y-2 text-xs">
              <a
                href={profile.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded-xl bg-pink-50/50 hover:bg-pink-100/70 border border-pink-200 text-zinc-800 font-medium hover:border-pink-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span>LinkedIn Profile</span>
                  <ExternalLink className="w-3.5 h-3.5 text-pink-600" />
                </div>
              </a>
              <a
                href={`mailto:${profile.contact.email1}`}
                className="block p-3 rounded-xl bg-pink-50/50 hover:bg-pink-100/70 border border-pink-200 text-zinc-800 font-medium hover:border-pink-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span>Direct Email</span>
                  <Mail className="w-3.5 h-3.5 text-pink-600" />
                </div>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright, reservation of rights & Back to top */}
        <div className="pt-8 border-t border-pink-200 dark:border-pink-500/20 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left flex-wrap">
            <span className="font-semibold text-zinc-700 dark:text-zinc-200">
              &copy; {new Date().getFullYear()} {profile.name}. All Rights Reserved.
            </span>
            <span className="hidden sm:inline text-pink-300 dark:text-pink-600">&bull;</span>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Strictly Proprietary &bull; Unauthorized recreation or reproduction prohibited.
            </span>
            <button
              onClick={() => setShowRightsModal(true)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-pink-50 dark:bg-[#222030] text-pink-700 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-[#2d2940] border border-pink-200 dark:border-pink-500/30 text-[11px] font-bold transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3 h-3 text-pink-600 dark:text-pink-400" />
              <span>Rights Notice</span>
            </button>
            
            {onOpenUnlockModal && (
              <button
                id="footer-admin-login-btn"
                onClick={onOpenUnlockModal}
                className="text-zinc-500 hover:text-pink-600 transition-colors flex items-center gap-1 cursor-pointer ml-1"
                title={currentMode === 'editor' ? "Ruchita's Admin Active" : "Owner / Admin Login"}
              >
                <Lock className="w-3 h-3 text-pink-600" />
                <span>{currentMode === 'editor' ? "Studio Active" : "Admin Login"}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle id="footer-theme-toggle" />
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-pink-50 hover:bg-pink-100 dark:bg-[#222030] dark:hover:bg-[#2b283c] text-zinc-700 dark:text-zinc-200 hover:text-pink-700 border border-pink-200 dark:border-pink-500/30 transition-all flex items-center gap-1.5 font-bold cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Legal & Intellectual Property Rights Modal */}
        {showRightsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#181724] border border-pink-200 dark:border-pink-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-zinc-800 dark:text-zinc-200">
              <div className="flex items-center justify-between pb-4 border-b border-pink-100 dark:border-pink-500/20 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-pink-100 dark:bg-pink-950/50 flex items-center justify-center text-pink-600 dark:text-pink-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-zinc-900 dark:text-zinc-100">Intellectual Property & Rights Notice</h3>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">All Rights Reserved &bull; Proprietary Protection</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowRightsModal(false)}
                  className="p-1.5 rounded-lg hover:bg-pink-50 dark:hover:bg-[#242236] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300 max-h-[65vh] overflow-y-auto pr-1">
                <div className="p-3 rounded-xl bg-pink-50/70 dark:bg-[#232033] border border-pink-200/80 dark:border-pink-500/20">
                  <p className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">Copyright &copy; 2026 {profile.name}. All Rights Reserved.</p>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                    This website, its source code, design architecture, visual layouts, written journalistic articles, photographs, and media dispatches are the exclusive proprietary property of {profile.name}.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. Strict Anti-Recreation Policy</h4>
                  <p>
                    No individual, organization, or automated scraper is authorized to copy, clone, reproduce, recreate, or duplicate this website, its design styling, or its underlying codebase in any form or medium.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. Journalistic Bylines & Media Protection</h4>
                  <p>
                    All reporting, investigative stories, video packages, and essays displayed (including published work from <em>The Hans India</em>, <em>The Lit Scroll</em>, and <em>Substack</em>) remain protected under copyright law and accredited publisher agreements.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. Permitted Evaluation Use</h4>
                  <p>
                    Prospective employers, editorial hiring committees, academic institutions, and collaborators are granted permission to browse and review this portfolio solely for employment evaluation and journalistic assessment purposes.
                  </p>
                </div>

                <div className="pt-2 border-t border-pink-100 dark:border-pink-500/20 text-[11px] text-zinc-500 dark:text-zinc-400">
                  For licensing, syndication inquiries, or official press rights, please contact: <strong className="text-zinc-800 dark:text-zinc-200">{profile.contact.email1}</strong>.
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-pink-100 dark:border-pink-500/20 flex justify-end">
                <button
                  onClick={() => setShowRightsModal(false)}
                  className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
                >
                  Understood & Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </footer>
  );
};
