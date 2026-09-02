import React from 'react';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  ArrowRight, 
  Award, 
  CheckCircle2, 
  HeartHandshake, 
  Camera, 
  ShieldCheck, 
  Laptop,
  Pencil,
  Crop,
  Plus
} from 'lucide-react';
import { UserProfile } from '../types';

interface AboutExperienceSectionProps {
  profile: UserProfile;
  onOpenChangePhoto?: () => void;
  onOpenAddExperience?: () => void;
  onOpenAddCertificate?: () => void;
}

export const AboutExperienceSection: React.FC<AboutExperienceSectionProps> = ({ 
  profile, 
  onOpenChangePhoto,
  onOpenAddExperience,
  onOpenAddCertificate
}) => {
  return (
    <section id="about" className="py-20 bg-[#fff8fa] text-zinc-900 border-b border-pink-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-pink-200/80 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-pink-600" />
              <span className="text-xs uppercase tracking-widest text-pink-700 font-bold">
                BACKGROUND & MILESTONES
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 tracking-tight">
              About Me & Experience
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 mt-2 max-w-2xl font-sans">
              Shaped by field reporting, academic rigor at IIMC Dhenkanal, and a relentless drive for inclusive storytelling.
            </p>
          </div>
        </div>

        {/* 2-Column Layout: Left Narrative & Experience, Right Portrait & Quote */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Narrative & Timeline */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Narrative Card */}
            <div className="p-7 sm:p-8 rounded-2xl bg-white border border-pink-200 space-y-4 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-pink-700">
                  A storyteller. A listener. A communicator.
                </span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-zinc-900 leading-snug">
                Amplifying unheard voices through ethical journalism and purposeful communications.
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed font-sans">
                {profile.extendedBio}
              </p>

              {/* Dignity, Equality & Professional Space Callout */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#fff0f4] border border-pink-300 space-y-2">
                <div className="flex items-center gap-2 text-pink-700 font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-pink-600" />
                  <span>Navigating Life with Osteogenesis Imperfecta</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
                  I navigate life with Osteogenesis Imperfecta (Brittle Bone Disease). This is neither a limitation nor a matter of concern—I deserve and claim my rightful space with equality, respect, and professional dignity in every newsroom, field assignment, and editorial collaboration.
                </p>
              </div>

              <p className="text-sm text-zinc-600 leading-relaxed font-sans">
                Whether investigating the lack of wheelchair accessibility in festive pandals for <em>The Hans India</em>, anchoring vertical video news shorts for <em>The Lit Scroll</em>, or crafting donor advocacy copy for child welfare foundations, my focus remains constant: ensuring every piece of communication is authentic, clear, and impactful.
              </p>
              
              <div className="pt-4 border-t border-pink-100 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                  <MapPin className="w-4 h-4 text-pink-600" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                  <GraduationCap className="w-4 h-4 text-pink-600" />
                  <span>IIMC Dhenkanal ('26)</span>
                </div>
              </div>
            </div>

            {/* Experience & Education Timeline */}
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-pink-600" />
                  <h3 className="font-serif text-2xl font-bold text-zinc-900">
                    Education & Experience Timeline
                  </h3>
                </div>
                {onOpenAddExperience && (
                  <button
                    id="about-add-experience-btn"
                    onClick={onOpenAddExperience}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-pink-500/20 cursor-pointer transition-all hover:scale-105"
                    title="Add new role, internship, fellowship or degree"
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>+ Add Experience</span>
                  </button>
                )}
              </div>

              <div className="relative pl-6 sm:pl-8 border-l-2 border-pink-200 space-y-8">
                {profile.experience.map((exp, idx) => (
                  <div key={idx} className="relative group">
                    
                    {/* Node Dot */}
                    <div className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 transition-all ${
                      exp.highlight 
                        ? 'bg-pink-600 border-white ring-4 ring-pink-300/50' 
                        : 'bg-pink-100 border-pink-300 group-hover:border-pink-600'
                    }`} />

                    <div className="p-5 rounded-2xl bg-white hover:bg-pink-50/20 border border-pink-200 hover:border-pink-400 transition-all space-y-2 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-pink-700 px-2.5 py-0.5 rounded bg-pink-100 border border-pink-200">
                          {exp.period}
                        </span>
                        {exp.highlight && (
                          <span className="text-[10px] uppercase tracking-wider font-bold text-pink-800 bg-pink-50 border border-pink-200 px-2 py-0.5 rounded">
                            Current Milestone
                          </span>
                        )}
                      </div>

                      <h4 className="font-serif text-lg font-bold text-zinc-900 group-hover:text-pink-600 transition-colors">
                        {exp.role}
                      </h4>

                      <div className="text-xs font-semibold text-zinc-500">
                        {exp.organization}
                      </div>

                      <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed pt-1">
                        {exp.description}
                      </p>

                      {exp.highlight && (
                        <div className="pt-2 flex flex-wrap items-center gap-2">
                          <a
                            id="timeline-ethicly-link"
                            href="https://ethicly-your-digital-journalism-men.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 text-emerald-800 text-xs font-semibold transition-colors"
                          >
                            <Laptop className="w-3.5 h-3.5" />
                            <span>Explore Ethicly App</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Editorial Portrait & Quote Frame */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="relative rounded-2xl bg-white border border-pink-200 overflow-hidden shadow-xl">
              
              {/* Photo 2: Horizontal / Landscape Photo Container */}
              <div className="relative aspect-[16/11] w-full bg-pink-50 overflow-hidden group">
                <img
                  src={profile.aboutImageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop"}
                  alt={`${profile.name} - Field & Dispatch Photo`}
                  className="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Photo Badge & Edit Buttons */}
                {onOpenChangePhoto && (
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                    <button
                      id="about-pencil-edit-btn"
                      onClick={onOpenChangePhoto}
                      className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-pink-600 text-pink-900 hover:text-white border border-pink-200 backdrop-blur-md text-xs font-bold flex items-center gap-1.5 transition-all shadow-md hover:scale-105 cursor-pointer group/pencil"
                      title="Edit photo 2 (About landscape) & crop framing"
                    >
                      <Pencil className="w-3.5 h-3.5 text-pink-600 group-hover/pencil:text-white" />
                      <span>Edit / Crop</span>
                    </button>
                  </div>
                )}

                {/* Change Photo Button Trigger */}
                {onOpenChangePhoto && (
                  <button
                    id="about-change-photo-btn"
                    onClick={onOpenChangePhoto}
                    className="absolute top-3 left-3 z-10 px-2.5 py-1.5 rounded-xl bg-white/90 hover:bg-pink-50 text-pink-900 border border-pink-200 backdrop-blur-md text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md hover:scale-105 cursor-pointer"
                    title="Change Photo 2 (About & Field)"
                  >
                    <Camera className="w-3.5 h-3.5 text-pink-600" />
                    <span>Photo 2</span>
                  </button>
                )}
              </div>

              {/* Quote Block in soft pink editorial styling */}
              <div className="p-6 sm:p-7 bg-[#fff0f4] border-t border-pink-200 text-zinc-900 space-y-3">
                <div className="text-pink-600 font-serif text-3xl font-bold leading-none">“</div>
                <blockquote className="font-editorial text-base sm:text-lg italic font-medium leading-snug text-zinc-800 -mt-2">
                  "I don't just write stories. I bring clarity to information, voice to people and purpose to communication."
                </blockquote>
                <div className="pt-2 border-t border-pink-200 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-500">
                  <span>Ruchita Sahukari</span>
                  <span className="font-script text-xl font-bold text-pink-600 normal-case tracking-normal">
                    S. Ruchita
                  </span>
                </div>
              </div>

            </div>

            {/* Verified Certifications & Honors Highlight Card */}
            <div className="p-6 rounded-2xl bg-white border border-pink-200 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-pink-600" />
                  <h4 className="font-serif text-base font-bold text-zinc-900">
                    Certificates & Credentials
                  </h4>
                </div>

                {onOpenAddCertificate && (
                  <button
                    id="about-add-certificate-btn"
                    onClick={onOpenAddCertificate}
                    className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 text-white font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer shadow-md shadow-pink-500/20"
                    title="Add new certificate with AI summarizer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ Add Certificate</span>
                  </button>
                )}
              </div>

              {profile.certificates && profile.certificates.length > 0 ? (
                <div className="space-y-3">
                  {profile.certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="p-3.5 rounded-xl bg-[#fff8fa] border border-pink-200 hover:border-pink-400 transition-all space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-zinc-900">
                          {cert.title}
                        </span>
                        <span className="font-mono text-[10px] text-pink-700 shrink-0 font-semibold">
                          {cert.issueDate}
                        </span>
                      </div>

                      <div className="text-[11px] text-zinc-500 font-medium">
                        {cert.issuer} {cert.credentialId && `• ID: ${cert.credentialId}`}
                      </div>

                      {cert.description && (
                        <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed font-sans">
                          {cert.description}
                        </p>
                      )}

                      <div className="pt-1 flex items-center justify-between">
                        {cert.skills && cert.skills.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {cert.skills.slice(0, 3).map((skill, sIdx) => (
                              <span
                                key={sIdx}
                                className="px-1.5 py-0.2 rounded text-[9px] bg-pink-100 text-pink-800 border border-pink-200"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        ) : <div />}

                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-pink-700 hover:underline flex items-center gap-1 shrink-0 font-medium"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Verify Link</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-500">
                  Postgraduate diploma in journalism, fellowship recognitions and verified skills.
                </p>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
