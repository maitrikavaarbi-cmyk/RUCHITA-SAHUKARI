import React from 'react';
import { 
  Newspaper, 
  ExternalLink, 
  ArrowUpRight, 
  CheckCircle2, 
  Accessibility, 
  Activity, 
  Eye, 
  BookOpen, 
  FileCheck 
} from 'lucide-react';
import { WorkItem } from '../types';

interface JournalismSectionProps {
  journalismWorks: WorkItem[];
  onSelectWork: (work: WorkItem) => void;
  onOpenAddWork?: () => void;
}

export const JournalismSection: React.FC<JournalismSectionProps> = ({
  journalismWorks,
  onSelectWork,
  onOpenAddWork
}) => {
  return (
    <section id="journalism" className="py-20 bg-[#fff0f4] text-zinc-900 border-b border-pink-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-pink-200/80 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Newspaper className="w-4 h-4 text-pink-600" />
              <span className="text-xs uppercase tracking-widest text-pink-600 font-bold">
                PRINT & DIGITAL BYLINES
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 tracking-tight">
              The Hans India & National Reporting
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 mt-2 max-w-2xl font-sans">
              Investigative dispatches and civic reporting focused on universal accessibility, disability rights, public health campaigns, and local governance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onOpenAddWork && (
              <button
                id="journalism-add-byline-btn"
                onClick={onOpenAddWork}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-pink-500/20 cursor-pointer transition-all hover:scale-105"
                title="Upload or add a new byline to this section"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>+ Upload Byline Article</span>
              </button>
            )}
            <span className="px-3 py-1.5 rounded-xl bg-white border border-pink-200 text-xs text-zinc-800 shadow-sm font-semibold">
              Verified Byline Archive ({journalismWorks.length})
            </span>
          </div>
        </div>

        {/* Highlighted Bylines Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {journalismWorks.map((work) => (
            <div
              key={work.id}
              id={`byline-card-${work.id}`}
              className="group relative rounded-2xl bg-white hover:bg-pink-50/20 border border-pink-200 hover:border-pink-400 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-pink-500/10 flex flex-col justify-between"
            >
              <div>
                
                {/* Visual Header Banner with Newspaper Masthead styling */}
                <div className="relative h-56 sm:h-64 w-full bg-pink-100 overflow-hidden">
                  <img
                    src={work.imageUrl || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=800&auto=format&fit=crop"}
                    alt={work.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Masthead Tag */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-pink-500 to-rose-400 text-white text-xs font-bold uppercase tracking-wider shadow-md">
                      {work.publicationOrPlatform}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-sm border border-pink-200 text-[10px] font-bold text-pink-900 uppercase">
                      Byline Dispatch
                    </span>
                  </div>

                  {/* Quick Preview Badge */}
                  <div className="absolute bottom-4 right-4">
                    <button
                      onClick={() => onSelectWork(work)}
                      className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-pink-500 text-zinc-900 hover:text-white border border-pink-200 text-xs font-bold transition-colors flex items-center gap-1.5 backdrop-blur-sm shadow-md cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-pink-600 group-hover:text-white" />
                      <span>Read Story & Notes</span>
                    </button>
                  </div>
                </div>

                {/* Article Body */}
                <div className="p-6 sm:p-8 space-y-4">
                  
                  {/* Headline */}
                  <h3 
                    onClick={() => onSelectWork(work)}
                    className="font-serif text-xl sm:text-2xl font-bold text-zinc-900 group-hover:text-pink-600 transition-colors leading-tight cursor-pointer"
                    title="Click to view full preview & link"
                  >
                    {work.title}
                  </h3>

                  <p className="text-sm text-zinc-600 leading-relaxed font-sans">
                    {work.excerpt}
                  </p>

                  {/* Key Takeaways Checklist */}
                  {work.keyTakeaways && work.keyTakeaways.length > 0 && (
                    <div className="pt-3 border-t border-pink-100 space-y-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-pink-600">
                        Investigation Highlights:
                      </div>
                      <ul className="space-y-1.5">
                        {work.keyTakeaways.map((takeaway, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-zinc-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-pink-600 shrink-0 mt-0.5" />
                            <span>{takeaway}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                </div>

              </div>

              {/* Card Footer Actions */}
              <div className="p-6 sm:px-8 sm:pb-8 pt-0 border-t border-pink-100 mt-4 flex flex-wrap items-center justify-between gap-3">
                
                <div className="flex flex-wrap gap-1.5">
                  {work.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-pink-50 text-[10px] text-pink-800 border border-pink-100 font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Direct Redirection Button */}
                <a
                  id={`byline-redirect-btn-${work.id}`}
                  href={work.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-pink-500/20 group/btn"
                >
                  <span>Open on The Hans India</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </a>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
};
