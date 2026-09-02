import React from 'react';
import { 
  ArrowRight, 
  BookOpen, 
  Sparkles, 
  FileText, 
  Camera, 
  PenTool, 
  ExternalLink,
  Flame,
  CheckCircle2,
  Award,
  Pencil,
  Crop
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeroSectionProps {
  profile: UserProfile;
  onFilterCategory: (category: any) => void;
  onOpenChangePhoto?: () => void;
  onOpenAddWork?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  profile, 
  onFilterCategory, 
  onOpenChangePhoto,
  onOpenAddWork
}) => {
  return (
    <section 
      id="hero" 
      className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-[#fff5f7] text-zinc-900 border-b border-pink-200/80"
    >
      {/* Background Subtle Gradient & Grid Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-rose-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 dot-pattern opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Hero Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Headlines & Callout */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Status / Badge Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-pink-300 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
              <span className="text-xs font-bold text-pink-900 tracking-wider uppercase">
                Journalist &bull; Digital Communicator &bull; Storyteller
              </span>
            </div>

            {/* Main Editorial Hero Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.15] text-zinc-900 tracking-tight">
              Stories that <span className="italic text-pink-600 font-semibold">inform</span>. 
              <br />
              Content that <span className="italic text-pink-600 font-semibold">connects</span>. 
              <br />
              Communication that creates <span className="italic text-pink-600 font-semibold">impact</span>.
            </h1>

            {/* Intro Summary paragraph */}
            <p className="text-base sm:text-lg text-zinc-700 max-w-2xl leading-relaxed font-sans">
              <span className="text-zinc-900 font-semibold">I'm {profile.name}</span>, a journalist and communications professional passionate about inclusive storytelling, clear communication and meaningful impact.
            </p>

            {/* Highlighted Tags / Credentials */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-3 py-1 rounded-xl bg-white border border-pink-200 text-xs text-zinc-800 flex items-center gap-1.5 shadow-sm font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-pink-600" />
                IIMC Dhenkanal (English Journalism)
              </span>
              <span className="px-3 py-1 rounded-xl bg-white border border-pink-200 text-xs text-zinc-800 flex items-center gap-1.5 shadow-sm font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-pink-600" />
                The Hans India Bylines
              </span>
              <span className="px-3 py-1 rounded-xl bg-white border border-pink-200 text-xs text-zinc-800 flex items-center gap-1.5 shadow-sm font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-pink-600" />
                The Lit Scroll (Group E Lead)
              </span>
            </div>

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                id="hero-explore-work-btn"
                href="#work"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold text-sm tracking-wider uppercase transition-all shadow-md shadow-pink-500/25 hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
              >
                <span>EXPLORE MY WORK</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                id="hero-read-bylines-btn"
                href="#journalism"
                className="px-5 py-3.5 rounded-xl bg-white hover:bg-pink-50 text-zinc-800 hover:text-pink-900 border border-pink-300 text-sm font-bold transition-all flex items-center gap-2 shadow-sm"
              >
                <BookOpen className="w-4 h-4 text-pink-600" />
                <span>Read Bylines</span>
              </a>

              {/* Owner-Only Quick Upload Work Button */}
              {onOpenAddWork && (
                <button
                  id="hero-upload-work-btn"
                  onClick={onOpenAddWork}
                  className="px-5 py-3.5 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-900 border border-pink-300 font-bold text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                  title="Upload new article byline, research paper, app, or story"
                >
                  <Sparkles className="w-4 h-4 text-pink-600" />
                  <span>+ Upload Work / Byline</span>
                </button>
              )}
            </div>

          </div>

          {/* Right Column: Editorial Visual Card with Handwritten Script */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Main Portrait Frame with Press Aesthetic */}
            <div className="relative w-full max-w-md">
              
              {/* Outer decorative borders */}
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-pink-300/40 via-rose-200/30 to-pink-100/40 blur-sm" />
              
              <div className="relative rounded-2xl overflow-hidden bg-white border border-pink-200/90 shadow-2xl">
                
                {/* Press Stamp Header */}
                <div className="bg-pink-50 px-4 py-2.5 border-b border-pink-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
                    <span className="text-[11px] font-bold text-pink-900 press-badge tracking-widest">
                      PRESS CORPS &bull; ON-GROUND DISPATCH
                    </span>
                  </div>
                  <span className="text-[10px] text-pink-700 font-mono font-bold bg-pink-100 px-2 py-0.5 rounded border border-pink-300">
                    IIMC '26
                  </span>
                </div>

                {/* Portrait Image Container */}
                <div className="relative h-80 sm:h-96 w-full bg-pink-50 overflow-hidden group/portrait">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover object-top transition-all duration-700 hover:scale-105"
                    referrerPolicy="no-referrer"
                  />

                  {/* Profile Picture Edit & Crop Options */}
                  {onOpenChangePhoto && (
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                      <button
                        id="hero-pencil-edit-btn"
                        onClick={onOpenChangePhoto}
                        className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-pink-500 text-zinc-900 hover:text-white border border-pink-300 backdrop-blur-md text-xs font-bold flex items-center gap-1.5 transition-all shadow-md hover:scale-105 cursor-pointer group/pencil"
                        title="Edit profile photo & crop framing"
                      >
                        <Pencil className="w-3.5 h-3.5 text-pink-600 group-hover/pencil:text-white" />
                        <span>Edit / Crop</span>
                      </button>
                    </div>
                  )}

                  {onOpenChangePhoto && (
                    <button
                      id="hero-change-photo-btn"
                      onClick={onOpenChangePhoto}
                      className="absolute top-3 left-3 z-10 px-2.5 py-1.5 rounded-xl bg-white/90 hover:bg-pink-50 text-zinc-800 hover:text-pink-900 border border-pink-300 backdrop-blur-md text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md hover:scale-105 cursor-pointer"
                      title="Change Photo 1 (Main Portrait)"
                    >
                      <Camera className="w-3.5 h-3.5 text-pink-600" />
                      <span>Photo 1</span>
                    </button>
                  )}
                </div>

                {/* Footer Tagline on Card */}
                <div className="p-4 bg-white border-t border-pink-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-pink-700/80 font-semibold">Specialization</div>
                    <div className="text-sm font-bold text-zinc-900">Investigative, Accessibility & Digital News</div>
                  </div>
                  {onOpenChangePhoto ? (
                    <button
                      id="hero-camera-action-btn"
                      onClick={onOpenChangePhoto}
                      className="px-3 py-1.5 rounded-xl bg-pink-100 hover:bg-pink-200 border border-pink-300 flex items-center gap-1.5 text-pink-800 transition-all cursor-pointer shadow-sm text-xs font-bold"
                      title="Edit photo or crop picture"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit Photo</span>
                    </button>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-pink-100 border border-pink-300 flex items-center justify-center text-pink-600" title="Verified Journalist">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* 3 Pillars Section */}
        <div id="hero-pillars" className="mt-16 pt-12 border-t border-pink-200/80 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pillar 01: REPORT */}
          <div 
            onClick={() => onFilterCategory('journalism')}
            className="group relative p-6 rounded-2xl bg-white hover:bg-pink-50/50 border border-pink-200 hover:border-pink-400 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs font-bold text-pink-700 px-2.5 py-1 rounded-lg bg-pink-100 border border-pink-200">
                01
              </span>
              <ArrowRight className="w-4 h-4 text-pink-400 group-hover:text-pink-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-serif text-xl font-bold text-zinc-900 group-hover:text-pink-600 transition-colors">
              REPORT
            </h3>
            <p className="text-xs font-semibold uppercase tracking-wider text-pink-700 mt-0.5 mb-2.5">
              Journalism & Reporting
            </p>
            <p className="text-sm text-zinc-600 leading-relaxed">
              On-ground stories, features, investigative interviews and civic issues that matter.
            </p>
          </div>

          {/* Pillar 02: CREATE */}
          <div 
            onClick={() => onFilterCategory('the_lit_scroll')}
            className="group relative p-6 rounded-2xl bg-white hover:bg-pink-50/50 border border-pink-200 hover:border-pink-400 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs font-bold text-pink-700 px-2.5 py-1 rounded-lg bg-pink-100 border border-pink-200">
                02
              </span>
              <ArrowRight className="w-4 h-4 text-pink-400 group-hover:text-pink-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-serif text-xl font-bold text-zinc-900 group-hover:text-pink-600 transition-colors">
              CREATE
            </h3>
            <p className="text-xs font-semibold uppercase tracking-wider text-pink-700 mt-0.5 mb-2.5">
              Content & Storytelling
            </p>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Articles, blogs, Instagram carousels, video shorts, and digital stories that engage deeply.
            </p>
          </div>

          {/* Pillar 03: COMMUNICATE */}
          <div 
            onClick={() => onFilterCategory('communications')}
            className="group relative p-6 rounded-2xl bg-white hover:bg-pink-50/50 border border-pink-200 hover:border-pink-400 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs font-bold text-pink-700 px-2.5 py-1 rounded-lg bg-pink-100 border border-pink-200">
                03
              </span>
              <ArrowRight className="w-4 h-4 text-pink-400 group-hover:text-pink-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-serif text-xl font-bold text-zinc-900 group-hover:text-pink-600 transition-colors">
              COMMUNICATE
            </h3>
            <p className="text-xs font-semibold uppercase tracking-wider text-pink-700 mt-0.5 mb-2.5">
              Corporate Communications
            </p>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Communications, PR, campaigns, and content strategy that builds brands and trust.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
