import React, { useState, useMemo } from 'react';
import { 
  ExternalLink, 
  BookOpen, 
  Search, 
  Filter, 
  PlusCircle, 
  Sparkles, 
  Play, 
  Layers, 
  FileText, 
  ArrowUpRight, 
  Eye, 
  Share2,
  Calendar,
  Tag,
  CheckCircle,
  Clock,
  Laptop
} from 'lucide-react';
import { WorkItem, WorkCategory, PortfolioMode } from '../types';

interface WorkShowcaseProps {
  works: WorkItem[];
  activeCategory: WorkCategory;
  mode?: PortfolioMode;
  onSelectCategory: (category: WorkCategory) => void;
  onSelectWork: (work: WorkItem) => void;
  onOpenAddModal?: () => void;
}

export const WorkShowcase: React.FC<WorkShowcaseProps> = ({
  works,
  activeCategory,
  mode = 'editor',
  onSelectCategory,
  onSelectWork,
  onOpenAddModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<'all' | 'article' | 'reel' | 'carousel' | 'essay' | 'campaign' | 'app' | 'research' | 'case_study'>('all');

  const categories = useMemo(() => {
    const allCategories: { id: WorkCategory; label: string }[] = [
      { id: 'all', label: 'All Works' },
      { id: 'journalism', label: 'Journalism & Bylines' },
      { id: 'the_lit_scroll', label: 'Academic & The Lit Scroll' },
      { id: 'apps', label: 'Apps & Tools' },
      { id: 'research', label: 'Research & Papers' },
      { id: 'substack', label: 'Substack In-Depth' },
      { id: 'instagram', label: 'Instagram & Carousels' },
      { id: 'communications', label: 'Communications' }
    ];
    return allCategories.filter(cat => cat.id === 'all' || works.some(w => w.category === cat.id));
  }, [works]);

  const filteredWorks = useMemo(() => {
    return works.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesFormat = selectedFormat === 'all' || item.format === selectedFormat;
      const matchesQuery = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.publicationOrPlatform.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesFormat && matchesQuery;
    });
  }, [works, activeCategory, selectedFormat, searchQuery]);

  const getFormatBadge = (format?: string) => {
    switch (format) {
      case 'app':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 flex items-center gap-1">
            <Laptop className="w-2.5 h-2.5 text-emerald-300" />
            Interactive App
          </span>
        );
      case 'research':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-950/80 text-indigo-300 border border-indigo-800/50 flex items-center gap-1">
            <FileText className="w-2.5 h-2.5 text-indigo-300" />
            Research Study
          </span>
        );
      case 'case_study':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-950/80 text-cyan-300 border border-cyan-800/50 flex items-center gap-1">
            <FileText className="w-2.5 h-2.5 text-cyan-300" />
            Case Study
          </span>
        );
      case 'reel':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-950/80 text-rose-300 border border-rose-800/50 flex items-center gap-1">
            <Play className="w-2.5 h-2.5 fill-rose-300" />
            PTC Reel
          </span>
        );
      case 'carousel':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-950/80 text-amber-300 border border-amber-800/50 flex items-center gap-1">
            <Layers className="w-2.5 h-2.5" />
            Carousel
          </span>
        );
      case 'essay':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-950/80 text-purple-300 border border-purple-800/50 flex items-center gap-1">
            <FileText className="w-2.5 h-2.5" />
            Long-form Essay
          </span>
        );
      case 'campaign':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            Comms Campaign
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-950/80 text-blue-300 border border-blue-800/50 flex items-center gap-1">
            <BookOpen className="w-2.5 h-2.5" />
            Byline Article
          </span>
        );
    }
  };

  return (
    <section id="work" className="py-20 bg-[#fff8fa] text-zinc-900 border-b border-pink-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-pink-200/80 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
              <span className="text-xs uppercase tracking-widest text-pink-600 font-bold">
                CURATED REPOSITORY
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 tracking-tight">
              Featured Work & Bylines
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 mt-2 max-w-2xl font-sans">
              Explore ground reportage published in national media, digital carousels from The Lit Scroll academic project, in-depth Substack essays, and strategic communications.
            </p>
          </div>

          {/* Quick Action / Manage Content Button */}
          <div className="flex items-center gap-3">
            {onOpenAddModal ? (
              <div className="flex items-center gap-2">
                <button
                  id="work-add-new-btn"
                  onClick={onOpenAddModal}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-pink-500/20 cursor-pointer transition-all hover:scale-105"
                  title="Upload or add new article, Substack story, app, or case study"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Upload Work / Byline</span>
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/25 text-white text-[10px] font-mono font-bold">
                    {works.length}
                  </span>
                </button>
              </div>
            ) : (
              <div className="px-3.5 py-2 rounded-xl bg-white border border-pink-200 text-xs text-zinc-800 flex items-center gap-2 shadow-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-bold text-zinc-900">{works.length} Verified Entries</span>
              </div>
            )}
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const count = cat.id === 'all' 
                ? works.length 
                : works.filter(w => w.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  id={`filter-btn-${cat.id}`}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold shadow-md shadow-pink-500/20'
                      : 'bg-white text-zinc-700 hover:text-pink-600 hover:bg-pink-50 border border-pink-200'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    activeCategory === cat.id ? 'bg-white/30 text-white font-bold' : 'bg-pink-50 text-pink-700'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-pink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="work-search-input"
              type="text"
              placeholder="Search bylines, topics, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-pink-200 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-pink-500 shadow-sm"
            />
          </div>

        </div>

        {/* Works Grid */}
        {filteredWorks.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-pink-200 shadow-sm">
            <BookOpen className="w-12 h-12 text-pink-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-zinc-900">No stories match your filter</h3>
            <p className="text-xs text-zinc-600 mt-1 max-w-sm mx-auto">
              Try adjusting your search terms or switch category filters.
            </p>
            <button
              onClick={() => { onSelectCategory('all'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 rounded-xl bg-pink-100 text-xs font-bold text-pink-700 hover:bg-pink-200 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorks.map((work) => (
              <article
                key={work.id}
                id={`work-card-${work.id}`}
                className="group relative flex flex-col rounded-2xl bg-white hover:bg-pink-50/20 border border-pink-200 hover:border-pink-400 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-pink-500/10 hover:-translate-y-1"
              >
                {/* Thumbnail Image / Visual Header */}
                <div 
                  className="relative h-48 sm:h-52 w-full bg-pink-100 overflow-hidden cursor-pointer"
                  onClick={() => onSelectWork(work)}
                >
                  <img
                    src={work.imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop"}
                    alt={work.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Badges on Thumbnail */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    {getFormatBadge(work.format)}
                    {work.isFeatured && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Read Time / Duration */}
                  {work.readTimeOrDuration && (
                    <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-sm border border-white/20 text-[10px] font-medium text-white flex items-center gap-1">
                      <Clock className="w-3 h-3 text-pink-300" />
                      <span>{work.readTimeOrDuration}</span>
                    </div>
                  )}

                  {/* Interactive Quick View Indicator on Hover */}
                  <div className="absolute inset-0 bg-pink-900/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <span className="px-3.5 py-1.5 rounded-xl bg-white text-pink-700 text-xs font-bold shadow-lg flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      Quick Preview
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
                  
                  <div>
                    {/* Publication & Date Bar */}
                    <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
                      <span className="font-bold text-pink-600 uppercase tracking-wider text-[11px] truncate max-w-[70%]">
                        {work.publicationOrPlatform}
                      </span>
                      <span className="text-[11px] text-zinc-500 shrink-0">
                        {work.date}
                      </span>
                    </div>

                    {/* Headline */}
                    <h3 
                      onClick={() => onSelectWork(work)}
                      className="font-serif text-lg font-bold text-zinc-900 group-hover:text-pink-600 transition-colors leading-snug cursor-pointer line-clamp-2"
                      title={work.title}
                    >
                      {work.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs sm:text-sm text-zinc-600 mt-2 line-clamp-3 leading-relaxed">
                      {work.excerpt}
                    </p>
                  </div>

                  {/* Tags & Action Buttons */}
                  <div className="pt-3 border-t border-pink-100 space-y-3">
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {work.tags.slice(0, 3).map((tag, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-pink-50 text-[10px] text-pink-800 border border-pink-100 font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Bottom Actions Row */}
                    <div className="flex items-center justify-between pt-1">
                      
                      {/* Interactive Preview Trigger */}
                      <button
                        onClick={() => onSelectWork(work)}
                        className="text-xs font-semibold text-zinc-700 hover:text-pink-600 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-pink-500" />
                        <span>Interactive Read</span>
                      </button>

                      {/* Direct Outbound Redirect Button */}
                      <a
                        id={`work-direct-link-${work.id}`}
                        href={work.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-500 text-pink-900 hover:text-white border border-pink-200 text-xs font-bold transition-all flex items-center gap-1.5 group/btn shadow-sm"
                        title="Read original source directly"
                      >
                        <span>Open Source</span>
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </a>

                    </div>

                  </div>

                </div>

              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
