import React from 'react';
import { 
  Instagram, 
  Play, 
  ExternalLink, 
  GraduationCap, 
  Users, 
  Film, 
  CheckCircle2,
  Laptop,
  Sparkles,
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';
import { UserProfile, WorkItem } from '../types';

interface TheLitScrollSectionProps {
  profile: UserProfile;
  litScrollWorks: WorkItem[];
  onSelectWork: (work: WorkItem) => void;
}

export const TheLitScrollSection: React.FC<TheLitScrollSectionProps> = ({
  profile,
  litScrollWorks,
  onSelectWork,
}) => {
  const ethiclyWork = litScrollWorks.find(w => w.id.includes('ethicly') || w.url.includes('ethicly'));

  return (
    <section id="the-lit-scroll" className="py-20 bg-[#fff5f8] text-zinc-900 border-b border-pink-200/80 relative overflow-hidden">
      
      {/* Subtle Background Elements */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-pink-300/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Banner Header */}
        <div className="mb-12 border-b border-pink-200/80 pb-8">
          <div className="space-y-3">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 border border-pink-200 text-pink-700 text-xs font-bold uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              <span>Academic Projects & Media Initiatives &bull; IIMC Dhenkanal</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 tracking-tight">
              Academic Projects & the_lit.scrol
            </h2>

            <p className="text-sm sm:text-base text-zinc-600 max-w-3xl leading-relaxed">
              Explore academic initiatives and media innovations developed during the PG Journalism program at <strong className="text-pink-600">IIMC Dhenkanal</strong> — including <strong className="text-zinc-900">Ethicly</strong> (an interactive digital journalism ethics mentor app) and <strong className="text-zinc-900">The Lit Scroll</strong> (Group E's carousel news portal & Peace to Camera video shorts).
            </p>
          </div>
        </div>

        {/* FEATURED ACADEMIC TOOL: ETHICLY */}
        <div className="mb-14">
          <div className="relative rounded-3xl bg-white border-2 border-pink-300 hover:border-pink-500 p-6 sm:p-8 shadow-xl transition-all overflow-hidden group">
            
            {/* Decorative background glow */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-sm">
                    <Laptop className="w-3.5 h-3.5" />
                    Interactive Academic Web App
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold text-zinc-600 bg-pink-50 border border-pink-200">
                    Live on Vercel
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold text-pink-700 bg-pink-100 border border-pink-200">
                    IIMC Academic Project
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 group-hover:text-pink-600 transition-colors">
                  Ethicly – Your Digital Journalism Ethics & Writing Mentor
                </h3>

                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-3xl">
                  An interactive pedagogical application and newsroom writing assistant built to provide <strong className="text-pink-600">instant grammatical corrections</strong>, <strong className="text-pink-600">content enhancement suggestions</strong>, and guided frameworks for resolving real-world ethical dilemmas, source confidentiality issues, and verification protocols.
                </p>

                {/* Key feature pills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-start gap-2 text-xs text-zinc-700">
                    <Sparkles className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
                    <span><strong>Grammatical correction</strong> & news copy polish</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-zinc-700">
                    <CheckCircle2 className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
                    <span><strong>Content enhancement</strong> & tone suggestions</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-zinc-700">
                    <ShieldCheck className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
                    <span>Interactive media ethics decision-trees & source safety</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-zinc-700">
                    <GraduationCap className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
                    <span>Built for journalism students, reporters & editors</span>
                  </div>
                </div>

              </div>

              {/* Action Column */}
              <div className="lg:col-span-4 flex flex-col justify-center items-stretch sm:items-end gap-3 border-t lg:border-t-0 lg:border-l border-pink-100 pt-6 lg:pt-0 lg:pl-8">
                
                <a
                  id="ethicly-launch-btn"
                  href="https://ethicly-your-digital-journalism-men.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-6 py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-pink-500/20 hover:scale-[1.02]"
                >
                  <Laptop className="w-4 h-4" />
                  <span>Launch Live Web App</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                {ethiclyWork && (
                  <button
                    onClick={() => onSelectWork(ethiclyWork)}
                    className="w-full px-4 py-2.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-900 border border-pink-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>View Project Details & Overview</span>
                  </button>
                )}

                <div className="text-[11px] text-zinc-500 text-center sm:text-right font-mono">
                  Hosted at: ethicly-your-digital-journalism-men.vercel.app
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Project Context & Overview Grid: THE LIT SCROLL GROUP E */}
        <div className="mb-16">
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-pink-200 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-100 pb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-pink-100 text-pink-600">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-zinc-900 uppercase tracking-wider">
                    Group E Project Mandate
                  </h3>
                  <p className="text-xs text-zinc-500">Indian Institute of Mass Communication (IIMC Dhenkanal)</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-3.5 py-1.5 rounded-xl bg-pink-50 border border-pink-200 text-center">
                  <span className="text-xs font-bold text-pink-700">On-Camera Broadcast</span>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-pink-50 border border-pink-200 text-center">
                  <span className="text-xs font-bold text-pink-700">Digital News Packaging</span>
                </div>
              </div>
            </div>

            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
              {profile.litScrollProject.summary}
            </p>

            <div className="pt-2 space-y-3">
              <div className="text-xs font-bold text-pink-700 uppercase tracking-wider">
                Ruchita's Core Contributions & Role:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#fff0f4] border border-pink-200 space-y-2">
                  <div className="flex items-center gap-2 text-zinc-900 font-semibold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-pink-600 shrink-0" />
                    <span>On-Camera Reporting (PTC)</span>
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Hosted and delivered field-tested Peace to Camera video dispatches covering major political and budgetary events.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#fff0f4] border border-pink-200 space-y-2">
                  <div className="flex items-center gap-2 text-zinc-900 font-semibold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-pink-600 shrink-0" />
                    <span>Fast-Paced News Scripting</span>
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Converted complex fiscal policies and election data into concise 60-second broadcast scripts.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#fff0f4] border border-pink-200 space-y-2">
                  <div className="flex items-center gap-2 text-zinc-900 font-semibold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-pink-600 shrink-0" />
                    <span>Fact Verification</span>
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Maintained strict adherence to fact-checking and unbiased presentation under The Lit Scroll's editorial standards.
                  </p>
                </div>
              </div>

              {/* Story Highlights Access Bar */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-gradient-to-r from-pink-100 via-rose-50 to-pink-100 border border-pink-300">
                <div className="flex items-center gap-2.5 text-xs text-zinc-700">
                  <Instagram className="w-4 h-4 text-pink-600 shrink-0" />
                  <span>Curated Instagram Highlights of verified news coverage and broadcasts</span>
                </div>
                <a
                  id="group-e-highlights-story-link"
                  href={profile.litScrollProject.highlightsUrl || "https://www.instagram.com/stories/highlights/17858919864548458/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm shrink-0"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Open Instagram Story Highlights</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Peace to Camera (PTC) Video Reel Spotlight */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <Film className="w-5 h-5 text-pink-600" />
              <h3 className="font-serif text-2xl font-bold text-zinc-900">
                Peace to Camera (PTC) Video Shorts
              </h3>
            </div>
            <span className="text-xs text-zinc-500 font-medium">
              Direct Instagram Video Dispatches
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Reel 1 */}
            <div className="group rounded-2xl bg-white border border-pink-200 hover:border-pink-400 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-pink-500/10 transition-all">
              <div className="p-6 flex flex-col justify-between h-full space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-pink-100 text-pink-700 border border-pink-200 flex items-center gap-1">
                      <Play className="w-2.5 h-2.5 fill-pink-600 text-pink-600" />
                      Peace to Camera &bull; Short 1
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">Bihar Election 2025</span>
                  </div>

                  <h4 className="font-serif text-lg font-bold text-zinc-900 group-hover:text-pink-600 transition-colors">
                    Belaganj By-Polls: JDU Overturns RJD Bastion by 95,000 Votes
                  </h4>

                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    <strong className="text-zinc-900 font-semibold">"A seismic political shift in Bihar’s by-polls:"</strong> Manorama Devi dismantles RJD’s safest seat with a decisive 95,000-vote win over Viswanath Singh Kumar. Field reporting on-camera by Ruchita Sahukari with video journalist Vriti Jain for <em>The Lit Scroll</em> — where it’s not cap, just facts.
                  </p>
                </div>

                <div className="pt-4 border-t border-pink-100 flex items-center justify-between">
                  <span className="text-xs text-zinc-500 font-medium">
                    Published on Instagram Reel
                  </span>
                  
                  <a
                    id="litscroll-reel-1-link"
                    href="https://www.instagram.com/reel/DRCymAmDO0h/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-pink-500/20"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Watch Reel 1</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Reel 2 */}
            <div className="group rounded-2xl bg-white border border-pink-200 hover:border-pink-400 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-pink-500/10 transition-all">
              <div className="p-6 flex flex-col justify-between h-full space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-pink-100 text-pink-700 border border-pink-200 flex items-center gap-1">
                      <Play className="w-2.5 h-2.5 fill-pink-600 text-pink-600" />
                      Peace to Camera &bull; Short 2
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">Union Budget 2025–26 &bull; Health</span>
                  </div>

                  <h4 className="font-serif text-lg font-bold text-zinc-900 group-hover:text-pink-600 transition-colors">
                    Union Budget 2025–26: Healthcare Allocations & Updates
                  </h4>

                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    <strong className="text-zinc-900 font-semibold">"Decoding health sector budget in 60 seconds:"</strong> An on-camera broadcast breakdown simplifying key healthcare allocations, medical infrastructure funding, and public health policy shifts on <em>The Lit Scroll</em>.
                  </p>
                </div>

                <div className="pt-4 border-t border-pink-100 flex items-center justify-between">
                  <span className="text-xs text-zinc-500 font-medium">
                    Published on Instagram Reel
                  </span>
                  
                  <a
                    id="litscroll-reel-2-link"
                    href="https://www.instagram.com/reel/DUNwcoyiXvk/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-pink-500/20"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Watch Reel 2</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
