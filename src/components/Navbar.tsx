import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Sparkles, 
  Menu, 
  X, 
  ExternalLink, 
  Edit3, 
  MessageSquareQuote, 
  BookOpen, 
  Film, 
  Send,
  User,
  Share2,
  Check,
  Camera,
  PlusCircle,
  Key,
  Eye,
  Lock,
  ArrowLeft
} from 'lucide-react';
import { UserProfile, PortfolioMode } from '../types';
import { ThemeToggle } from './ThemeToggle';
import { copyToClipboardSafe } from '../utils/clipboard';

interface NavbarProps {
  profile: UserProfile;
  mode?: PortfolioMode;
  onOpenEditor: () => void;
  onOpenChangePhoto?: () => void;
  onOpenShareModal?: () => void;
  onSwitchMode?: (targetMode: PortfolioMode) => void;
  onOpenUnlockModal?: () => void;
  worksCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  profile, 
  mode = 'editor',
  onOpenEditor, 
  onOpenChangePhoto, 
  onOpenShareModal,
  onSwitchMode,
  onOpenUnlockModal,
  worksCount 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShareClick = async () => {
    if (onOpenShareModal) {
      onOpenShareModal();
    } else {
      await copyToClipboardSafe('https://maitrikavaarbi-cmyk.github.io/RUCHITA-SAHUKARI/');
    }
  };

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'Work', href: '#work' },
    { label: 'Journalism', href: '#journalism' },
    { label: 'The Lit Scroll', href: '#the-lit-scroll' },
    { label: 'Substack', href: '#substack' },
    { label: 'Communications', href: '#communications' },
    { label: 'About', href: '#about' },
    { label: 'Recommendations', href: '#testimonials' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header 
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-pink-200/90 shadow-sm py-3' 
          : 'bg-[#fff5f7]/80 backdrop-blur-sm border-b border-pink-100/60 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Monogram Brand Logo */}
        <a 
          id="nav-brand-logo"
          href="#hero" 
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 via-rose-400 to-pink-500 flex items-center justify-center shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform duration-300">
            <span className="font-serif font-bold text-lg text-white tracking-tighter">RS.</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-bold text-zinc-900 tracking-wide group-hover:text-pink-600 transition-colors">
              {profile.name}
            </span>
            <span className="text-[11px] tracking-widest text-pink-700/80 uppercase font-sans -mt-0.5 font-semibold">
              Journalism & Comms
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav id="desktop-nav-links" className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              href={link.href}
              className="px-3 py-1.5 text-xs xl:text-sm font-medium text-zinc-700 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div id="nav-cta-actions" className="hidden md:flex items-center gap-2.5">
          
          {/* 1-Click Dark / Light Mode Toggle for Viewers */}
          <ThemeToggle id="nav-desktop-theme-toggle" />

          {mode === 'editor' ? (
            <div 
              id="nav-owner-studio-segment"
              className="flex items-center gap-1.5 p-1 pl-2.5 rounded-2xl bg-white border border-pink-300 shadow-sm backdrop-blur-md"
            >
              <div className="flex items-center gap-1.5 mr-1 text-[11px] font-bold text-pink-600">
                <Sparkles className="w-3.5 h-3.5 text-pink-600" />
                <span className="hidden xl:inline">Studio</span>
              </div>

              {/* Upload Work Button */}
              <button
                id="nav-btn-upload-work"
                onClick={onOpenEditor}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 hover:brightness-105 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm shadow-pink-500/20 transition-transform hover:scale-105 cursor-pointer"
                title="Upload and add new articles, research, or career milestones"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Upload</span>
                <span className="px-1.5 py-0.2 rounded-full bg-white/25 text-white text-[10px] font-bold">
                  {worksCount}
                </span>
              </button>

              {/* Change / Crop Photo Trigger */}
              {onOpenChangePhoto && (
                <button
                  id="nav-btn-change-photo"
                  onClick={onOpenChangePhoto}
                  title="Crop profile & field photos"
                  className="px-2.5 py-1.5 rounded-xl text-zinc-700 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 border border-pink-200 transition-all flex items-center gap-1 text-xs cursor-pointer font-medium"
                >
                  <Camera className="w-3.5 h-3.5 text-pink-600" />
                  <span className="hidden xl:inline">Photos</span>
                </button>
              )}

              {/* Share Portfolio Button */}
              <button
                id="nav-btn-share"
                onClick={handleShareClick}
                title="Share Portfolio Links"
                className="p-1.5 rounded-xl text-zinc-700 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 border border-pink-200 transition-all flex items-center text-xs cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-pink-600" />
              </button>

              {/* Done / Back to Public Site Button */}
              {onSwitchMode && (
                <button
                  id="nav-btn-done-back"
                  onClick={() => onSwitchMode('public')}
                  title="Finished with edits? Click here to return to clean public visitor view"
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-pink-50 text-zinc-800 hover:text-pink-900 border border-pink-300 transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm cursor-pointer active:scale-95"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-pink-600" />
                  <span>Done / Back to Site</span>
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Public Mode: Share */}
              <button
                id="nav-btn-share-public"
                onClick={handleShareClick}
                title="Share Portfolio Links"
                className="p-2 rounded-xl text-zinc-700 hover:text-pink-700 bg-white hover:bg-pink-50 border border-pink-200 transition-all flex items-center gap-1.5 text-xs cursor-pointer shadow-sm"
              >
                <Share2 className="w-4 h-4 text-pink-600" />
                <span className="hidden xl:inline">Share</span>
              </button>

              {/* Owner On-Site Login Button */}
              {onOpenUnlockModal && (
                <button
                  id="nav-btn-owner-login"
                  onClick={onOpenUnlockModal}
                  className="px-3 py-2 rounded-xl bg-pink-100/80 hover:bg-pink-200 text-pink-800 border border-pink-300 transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm cursor-pointer"
                  title="Ruchita: Edit & manage your portfolio directly here on your live website (no AI Studio needed)"
                >
                  <Key className="w-3.5 h-3.5 text-pink-600" />
                  <span>Edit Portfolio</span>
                </button>
              )}
            </>
          )}

          {/* Resume Quick Redirect */}
          <a
            id="nav-btn-resume-cta"
            href={profile.contact.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold text-xs tracking-wide transition-all shadow-md shadow-pink-500/25 hover:shadow-lg flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View Resume</span>
            <ExternalLink className="w-3 h-3 opacity-75" />
          </a>
        </div>

        {/* Mobile Menu & Quick Actions */}
        <div className="flex md:hidden items-center gap-2">
          {/* 1-Tap Mobile Dark Mode Switcher */}
          <ThemeToggle id="nav-mobile-header-theme-toggle" showLabel={false} className="p-2" />

          {mode === 'editor' ? (
            <button
              id="mobile-manage-btn"
              onClick={onOpenEditor}
              className="p-2 rounded-xl bg-pink-50 text-pink-600 border border-pink-200"
              title="Manage & Add Work"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          ) : (
            onOpenUnlockModal && (
              <button
                id="mobile-owner-login-quick"
                onClick={onOpenUnlockModal}
                className="p-2 rounded-xl bg-pink-50 border border-pink-300 text-pink-700 hover:text-pink-900"
                title="Owner: Edit Portfolio on Mobile"
              >
                <Key className="w-4 h-4 text-pink-600" />
              </button>
            )
          )}
          
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white border border-pink-200 text-zinc-800 hover:text-pink-600 focus:outline-none shadow-sm"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="lg:hidden bg-white/95 border-b border-pink-200 px-4 pt-3 pb-6 space-y-2 mt-2 shadow-xl animate-in slide-in-from-top duration-200 backdrop-blur-md">
          
          {/* 1-Click Dark/Light Mode in Drawer */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-pink-50/90 dark:bg-[#232130] border border-pink-200 dark:border-pink-500/20 mb-3">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Appearance Mode</span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">1-click switch between Dark & Light</span>
            </div>
            <ThemeToggle id="mobile-drawer-theme-toggle" />
          </div>

          <div className="grid grid-cols-2 gap-1.5 mb-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                id={`mobile-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-zinc-700 hover:text-pink-600 hover:bg-pink-50 rounded-lg"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-pink-100 flex flex-col gap-2">
            {mode === 'editor' ? (
              <div className="space-y-2">
                <button
                  id="mobile-drawer-manage-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenEditor();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Upload / Manage Works ({worksCount})</span>
                </button>

                {onOpenChangePhoto && (
                  <button
                    id="mobile-drawer-photos-btn"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenChangePhoto();
                    }}
                    className="w-full py-2 px-4 rounded-xl bg-pink-50 text-zinc-800 text-xs font-semibold flex items-center justify-center gap-2 border border-pink-200"
                  >
                    <Camera className="w-4 h-4 text-pink-600" />
                    <span>Crop Profile & Field Photos</span>
                  </button>
                )}

                {onSwitchMode && (
                  <button
                    id="mobile-drawer-done-back-btn"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onSwitchMode('public');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-white text-zinc-800 font-bold text-xs flex items-center justify-center gap-2 border border-pink-300 shadow-sm active:scale-95 transition-all"
                  >
                    <ArrowLeft className="w-4 h-4 text-pink-600" />
                    <span>Done / Back to Public Site</span>
                  </button>
                )}
              </div>
            ) : (
              <>
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl bg-pink-50 text-zinc-800 text-xs font-semibold flex items-center justify-center gap-2 border border-pink-200"
                >
                  <Send className="w-4 h-4 text-pink-600" />
                  <span>Get in Touch / Hire Ruchita</span>
                </a>

                {onOpenUnlockModal && (
                  <button
                    id="mobile-drawer-unlock-btn"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenUnlockModal();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-800 text-xs font-bold flex items-center justify-center gap-2 border border-pink-300 cursor-pointer"
                  >
                    <Key className="w-4 h-4 text-pink-600" />
                    <span>👑 Owner Login (Edit Portfolio)</span>
                  </button>
                )}
              </>
            )}

            <a
              id="mobile-drawer-resume-btn"
              href={profile.contact.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
            >
              <FileText className="w-4 h-4" />
              <span>View Full Resume</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
