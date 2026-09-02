import React from 'react';
import { 
  Megaphone, 
  PenTool, 
  Share2, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Heart, 
  CheckCircle2, 
  ArrowRight,
  Layers
} from 'lucide-react';

export const CommunicationsSection: React.FC = () => {
  const commSkills = [
    {
      title: "Content Writing & Editorial Copy",
      description: "Crafting structured, fact-checked news reports, long-form essays, opinion pieces, and website copy that commands attention.",
      tags: ["Long-form", "News Writing", "Headline Crafting", "SEO & Digital"]
    },
    {
      title: "Social Media Strategy & Carousels",
      description: "Designing engaging multi-slide Instagram carousels, vertical video scripts (PTC), and data cards optimized for reader retention.",
      tags: ["Instagram Carousels", "Vertical Video Scripts", "Visual Pacing", "Audience Growth"]
    },
    {
      title: "Non-Profit & Crowdfunding Comms",
      description: "Developing human-centered donor communication, impact reports, and social advocacy campaigns for grassroots social organizations.",
      tags: ["Donor Relations", "Advocacy", "Impact Reporting", "Community Outreach"]
    },
    {
      title: "Brand Communication & Public Relations",
      description: "Building trustworthy brand narratives, media releases, corporate announcements, and stakeholder messaging that resonate.",
      tags: ["Media Relations", "Press Releases", "Brand Tone", "Strategic Comms"]
    },
    {
      title: "Inclusive & Accessible Storytelling",
      description: "Championing disability accessibility, universal design in media packaging, alt-text standards, and sensitive reporting practices.",
      tags: ["Disability Advocacy", "Accessibility Standards", "Inclusive Language", "Ethics"]
    }
  ];

  return (
    <section id="communications" className="py-20 bg-[#fff5f8] text-zinc-900 border-b border-pink-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-pink-200/80 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Megaphone className="w-4 h-4 text-pink-600" />
              <span className="text-xs uppercase tracking-widest text-pink-700 font-bold">
                COMMUNICATIONS & BRAND STORYTELLING
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 tracking-tight">
              Content & Communications
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 mt-2 max-w-2xl font-sans">
              Content that informs, engages, and drives meaningful action across print, digital news, social channels, and institutional communications.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-pink-100 border border-pink-200 text-pink-700 text-xs font-bold">
              Strategic & Practical Expertise
            </span>
          </div>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {commSkills.map((skill, index) => (
            <div
              key={skill.title}
              className="p-6 rounded-2xl bg-white hover:bg-pink-50/20 border border-pink-200 hover:border-pink-400 transition-all duration-300 flex flex-col justify-between space-y-4 group shadow-sm hover:shadow-xl hover:shadow-pink-500/10"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-pink-700 px-2 py-0.5 rounded bg-pink-100 border border-pink-200">
                    0{index + 1}
                  </span>
                  <Sparkles className="w-4 h-4 text-pink-400 group-hover:text-pink-600 transition-colors" />
                </div>

                <h3 className="font-serif text-lg font-bold text-zinc-900 group-hover:text-pink-600 transition-colors">
                  {skill.title}
                </h3>

                <p className="text-xs sm:text-sm text-zinc-600 mt-2 leading-relaxed font-sans">
                  {skill.description}
                </p>
              </div>

              <div className="pt-3 border-t border-pink-100 flex flex-wrap gap-1.5">
                {skill.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-pink-50 text-[10px] text-pink-800 border border-pink-100 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* Quick Consultation CTA Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-pink-100 via-rose-50 to-pink-50 border border-pink-300 flex flex-col justify-between space-y-4 shadow-md">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-pink-700 mb-1">
                Collaborate & Commission
              </div>
              <h3 className="font-serif text-xl font-bold text-zinc-900">
                Need Impact-Driven Content or Coverage?
              </h3>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                Available for on-ground journalistic assignments, freelance reporting, digital content campaigns, and communications consulting.
              </p>
            </div>

            <a
              href="#contact"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-pink-500/20"
            >
              <span>Get in Touch</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
