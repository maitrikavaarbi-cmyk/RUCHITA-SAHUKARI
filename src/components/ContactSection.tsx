import React, { useState } from 'react';
import { 
  Mail, 
  Linkedin, 
  Instagram, 
  Youtube, 
  ExternalLink, 
  Copy, 
  Check, 
  Send, 
  FileText, 
  ArrowUpRight, 
  Phone, 
  MapPin, 
  Share2, 
  Download, 
  Sparkles,
  TreePine
} from 'lucide-react';
import { UserProfile } from '../types';

interface ContactSectionProps {
  profile: UserProfile;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  
  // Classic message form state
  const [senderName, setSenderName] = useState('');
  const [senderOrg, setSenderOrg] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderSubject, setSenderSubject] = useState('');
  const [senderMessage, setSenderMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const handleCopyEmail = (email: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email);
      setCopiedEmail(email);
      setTimeout(() => setCopiedEmail(null), 2500);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !senderEmail || !senderMessage) return;

    const composedSubject = senderSubject || `Editorial & Collaboration Inquiry from ${senderName}`;
    const composedBody = `Hi Ruchita,\n\n${senderMessage}\n\nFrom: ${senderName} (${senderEmail}${senderOrg ? `, ${senderOrg}` : ''})`;

    const mailtoUrl = `mailto:${profile.contact.email1}?subject=${encodeURIComponent(composedSubject)}&body=${encodeURIComponent(composedBody)}`;
    
    setMessageSent(true);
    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 600);
  };

  return (
    <section id="contact" className="py-20 bg-[#fff8fa] text-zinc-900 border-b border-pink-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-pink-200/80 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-pink-600" />
              <span className="text-xs uppercase tracking-widest text-pink-700 font-bold">
                CONNECT & COMMUNICATE
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 tracking-tight">
              Get in Touch & Socials
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 mt-2 max-w-2xl font-sans">
              Let's connect for field journalism assignments, content strategy, editorial commissions, or communication collaborations.
            </p>
          </div>
        </div>

        {/* Social Grid with Clean Icons (Instagram, LinkedIn, Substack, Linktree, YouTube, Email) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          
          {/* Instagram */}
          <a
            id="contact-social-instagram"
            href={profile.contact.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-6 rounded-2xl bg-white hover:bg-pink-50/40 border border-pink-200 hover:border-pink-400 transition-all flex items-center justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-pink-500/20">
                <Instagram className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Instagram</div>
                <div className="text-sm font-bold text-zinc-900 group-hover:text-pink-600 transition-colors">@sancharionwheel</div>
                <div className="text-[11px] text-zinc-500">Stories & Carousels</div>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-pink-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </a>

          {/* LinkedIn */}
          <a
            id="contact-social-linkedin"
            href={profile.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-6 rounded-2xl bg-white hover:bg-pink-50/40 border border-pink-200 hover:border-blue-400 transition-all flex items-center justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#0A66C2] flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Linkedin className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-zinc-500 font-bold">LinkedIn</div>
                <div className="text-sm font-bold text-zinc-900 group-hover:text-[#0A66C2] transition-colors">Ruchita Sahukari</div>
                <div className="text-[11px] text-zinc-500">Professional Network</div>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-[#0A66C2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </a>

          {/* Substack */}
          <a
            id="contact-social-substack"
            href={profile.contact.substack}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-6 rounded-2xl bg-white hover:bg-pink-50/40 border border-pink-200 hover:border-orange-400 transition-all flex items-center justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FF6719] flex items-center justify-center text-white shadow-md shadow-[#FF6719]/20">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Substack</div>
                <div className="text-sm font-bold text-zinc-900 group-hover:text-[#FF6719] transition-colors">@ruchitasahukari</div>
                <div className="text-[11px] text-zinc-500">Essays & Long-form</div>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-[#FF6719] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </a>

          {/* Linktree */}
          <a
            id="contact-social-linktree"
            href={profile.contact.linktree}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-6 rounded-2xl bg-white hover:bg-pink-50/40 border border-pink-200 hover:border-emerald-400 transition-all flex items-center justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#43E660] flex items-center justify-center text-black shadow-md shadow-emerald-500/20">
                <TreePine className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Linktree</div>
                <div className="text-sm font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors">sahukariruchita</div>
                <div className="text-[11px] text-zinc-500">All Important Links</div>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </a>

          {/* YouTube */}
          <a
            id="contact-social-youtube"
            href={profile.contact.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-6 rounded-2xl bg-white hover:bg-pink-50/40 border border-pink-200 hover:border-red-400 transition-all flex items-center justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FF0000] flex items-center justify-center text-white shadow-md shadow-red-500/20">
                <Youtube className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-zinc-500 font-bold">YouTube Channel</div>
                <div className="text-sm font-bold text-zinc-900 group-hover:text-red-600 transition-colors">@Sanchar-m2e</div>
                <div className="text-[11px] text-zinc-500">Video Reports & Talks</div>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-red-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </a>

          {/* Primary Email */}
          <div className="group p-6 rounded-2xl bg-white border border-pink-200 hover:border-pink-400 transition-all flex items-center justify-between shadow-sm hover:shadow-md">
            <div className="flex items-center gap-4 overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 flex items-center justify-center text-white shadow-md shadow-pink-500/20 shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Email Inbox</div>
                <div className="text-xs font-bold text-zinc-900 truncate" title={profile.contact.email1}>
                  {profile.contact.email1}
                </div>
                <div className="text-[11px] text-zinc-500 truncate" title={profile.contact.email2}>
                  Alt: {profile.contact.email2}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => handleCopyEmail(profile.contact.email1)}
              className="p-2 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-900 border border-pink-200 shrink-0 transition-colors cursor-pointer"
              title="Copy Email"
            >
              {copiedEmail === profile.contact.email1 ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

        </div>

        {/* 2-Column: Left "Know More / Resume Section", Right "Direct Message Form" */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: "KNOW MORE" / RESUME SECTION */}
          <div id="know-more-resume" className="lg:col-span-6 space-y-6">
            <div className="p-8 rounded-3xl bg-white border border-pink-200 shadow-xl relative overflow-hidden space-y-6">
              
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 border border-pink-200 text-pink-700 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>EDITORIAL & COMMS PROFILE</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900">
                  Professional Background & Competencies
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-sans">
                  Comprehensive experience spanning newsroom reporting at IIMC Dhenkanal, investigative bylines, non-profit communications campaigns, field reporting, and digital media production.
                </p>
              </div>

              {/* Resume Highlights Box */}
              <div className="p-4 rounded-xl bg-pink-50/50 border border-pink-200 space-y-2.5 text-xs text-zinc-700">
                <div className="font-bold uppercase tracking-wider text-[11px] text-pink-700">
                  Core Qualifications & Focus:
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-pink-600" />
                  <span>Academic credentials: PG Diploma in English Journalism (IIMC)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-pink-600" />
                  <span>Published bylines in national dailies (The Hans India)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-pink-600" />
                  <span>Editorial leadership in The Lit Scroll academic news initiative</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-pink-600" />
                  <span>Communications internships at Muskurahat & Asman Foundations</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleCopyEmail(profile.contact.email1)}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md shadow-pink-500/20 flex items-center gap-2 cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Primary Email</span>
                </button>

                <a
                  href={`mailto:${profile.contact.email1}`}
                  className="px-4 py-3 rounded-xl bg-pink-50 hover:bg-pink-100 text-zinc-800 text-xs font-semibold border border-pink-200 transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-pink-600" />
                  <span>Direct Mail</span>
                </a>
              </div>

            </div>
          </div>

          {/* Right: Direct Contact Form */}
          <div className="lg:col-span-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-pink-200 shadow-xl space-y-6">
              
              {/* Header */}
              <div className="border-b border-pink-100 pb-4">
                <h3 className="font-serif text-2xl font-bold text-zinc-900 flex items-center gap-2">
                  <span>Send a Direct Message</span>
                  <Sparkles className="w-4 h-4 text-pink-600" />
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Fill out the form below to reach out directly to Ruchita.
                </p>
              </div>

              {messageSent ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <Check className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="font-serif text-xl font-bold text-zinc-900">Opening Email Client...</h4>
                  <p className="text-xs text-zinc-600 max-w-md mx-auto">
                    Thank you, <strong className="text-zinc-900">{senderName}</strong>! Your note draft is prepared and opening in your default mail app to send to <span className="text-pink-600 font-semibold">{profile.contact.email1}</span>.
                  </p>
                  <button
                    onClick={() => {
                      setMessageSent(false);
                      setSenderName('');
                      setSenderOrg('');
                      setSenderEmail('');
                      setSenderSubject('');
                      setSenderMessage('');
                    }}
                    className="px-4 py-2 rounded-lg bg-pink-50 text-xs font-semibold text-zinc-800 hover:bg-pink-100 border border-pink-200 mt-2 cursor-pointer"
                  >
                    Write Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-4 text-xs">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-700 font-bold uppercase tracking-wider mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Senior Editor / Recruiter"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-pink-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-700 font-bold uppercase tracking-wider mb-1.5">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@publication.com"
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-pink-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-700 font-bold uppercase tracking-wider mb-1.5">
                        Organization / Publication
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Media House / Foundation"
                        value={senderOrg}
                        onChange={(e) => setSenderOrg(e.target.value)}
                        className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-pink-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-700 font-bold uppercase tracking-wider mb-1.5">
                        Subject / Opportunity
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Feature Story Assignment"
                        value={senderSubject}
                        onChange={(e) => setSenderSubject(e.target.value)}
                        className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-pink-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-700 font-bold uppercase tracking-wider mb-1.5">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Write your note, story pitch, or query here..."
                      value={senderMessage}
                      onChange={(e) => setSenderMessage(e.target.value)}
                      className="w-full bg-pink-50/50 border border-pink-200 rounded-xl p-3.5 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-pink-500 focus:bg-white"
                    />
                  </div>

                  <button
                    id="submit-contact-direct-btn"
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-pink-500/20 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message to Ruchita</span>
                  </button>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
