import React from 'react';
import { 
  FileText, 
  ExternalLink, 
  ArrowUpRight, 
  BookOpen, 
  Mail, 
  Sparkles, 
  Eye, 
  Clock, 
  Flame 
} from 'lucide-react';
import { WorkItem } from '../types';

interface SubstackSectionProps {
  substackWorks: WorkItem[];
  onSelectWork: (work: WorkItem) => void;
}

export const SubstackSection: React.FC<SubstackSectionProps> = ({
  substackWorks,
  onSelectWork,
}) => {
  return (
    <section id="substack" className="py-20 bg-[#fff8fa] text-zinc-900 border-b border-pink-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Substack branding */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6 border-b border-pink-200/80 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF6719]" />
              <span className="text-xs uppercase tracking-widest text-[#FF6719] font-bold">
                LONG-FORM JOURNALISM & ESSAYS
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 tracking-tight">
              Substack Publications
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 mt-2 max-w-2xl font-sans">
              Thoughtful, immersive long-form investigations into social equity, special education transformations, medical infrastructure, and student journalism realities.
            </p>
          </div>

          <a
            id="substack-profile-subscribe-btn"
            href="https://substack.com/@ruchitasahukari"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-[#FF6719] hover:bg-[#e0560e] text-white font-bold text-xs tracking-wide transition-all shadow-md shadow-orange-500/25 flex items-center gap-2 shrink-0"
          >
            <Mail className="w-4 h-4" />
            <span>Subscribe on Substack (@ruchitasahukari)</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>

        {/* Substack Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {substackWorks.map((work) => (
            <article
              key={work.id}
              id={`substack-card-${work.id}`}
              className="group rounded-2xl bg-white hover:bg-pink-50/20 border border-pink-200 hover:border-pink-400 transition-all duration-300 overflow-hidden p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-pink-500/10 hover:-translate-y-1"
            >
              <div className="space-y-4">
                
                {/* Meta Row */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#FF6719] uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    Substack Dispatch
                  </span>
                  {work.readTimeOrDuration && (
                    <span className="text-zinc-500 flex items-center gap-1 font-mono text-[11px]">
                      <Clock className="w-3 h-3 text-[#FF6719]" />
                      {work.readTimeOrDuration}
                    </span>
                  )}
                </div>

                {/* Article Headline */}
                <h3 
                  onClick={() => onSelectWork(work)}
                  className="font-serif text-xl font-bold text-zinc-900 group-hover:text-pink-600 transition-colors leading-snug cursor-pointer"
                >
                  {work.title}
                </h3>

                {/* Excerpt */}
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-sans">
                  {work.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {work.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-pink-50 text-[10px] text-pink-800 border border-pink-100 font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

              </div>

              {/* Bottom Actions */}
              <div className="pt-5 border-t border-pink-100 mt-5 flex items-center justify-between">
                <button
                  onClick={() => onSelectWork(work)}
                  className="text-xs font-semibold text-zinc-600 hover:text-pink-600 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-[#FF6719]" />
                  <span>Preview Excerpt</span>
                </button>

                <a
                  id={`substack-redirect-btn-${work.id}`}
                  href={work.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-pink-50 hover:bg-[#FF6719] text-zinc-800 hover:text-white border border-pink-200 hover:border-[#FF6719] text-xs font-bold transition-all flex items-center gap-1.5 group/btn shadow-sm"
                >
                  <span>Read on Substack</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </a>
              </div>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
