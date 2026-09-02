import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Loader2, 
  Copy, 
  Check, 
  FileText, 
  Share2, 
  Linkedin, 
  Award, 
  Send, 
  ArrowRight, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle,
  Briefcase,
  Layers,
  ChevronRight
} from 'lucide-react';
import { WorkItem, UserProfile } from '../types';

interface AIWorkSummaryStudioProps {
  works: WorkItem[];
  profile: UserProfile;
  onUpdateWork?: (work: WorkItem) => void;
  onUpdateProfile?: (profile: UserProfile) => void;
  onTriggerSaveToast?: () => void;
}

export const AIWorkSummaryStudio: React.FC<AIWorkSummaryStudioProps> = ({
  works,
  profile,
  onUpdateWork,
  onUpdateProfile,
  onTriggerSaveToast
}) => {
  const [generationMode, setGenerationMode] = useState<'work_summary' | 'career_summary'>('work_summary');
  
  // Work Summary State
  const [selectedWorkId, setSelectedWorkId] = useState<string>(works[0]?.id || '');
  const [customWorkTitle, setCustomWorkTitle] = useState('');
  const [customPublication, setCustomPublication] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [targetAudience, setTargetAudience] = useState<'recruiter_editor' | 'public_linkedin' | 'academic_grant'>('recruiter_editor');

  // Career Summary State
  const [targetRole, setTargetRole] = useState('Journalist & Communications Specialist');
  const [specializationFocus, setSpecializationFocus] = useState('Investigative Field Reporting, Media Ethics, and Multi-Platform Digital Storytelling');

  // Loading & Result States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);

  // Result payloads
  const [workSummaryResult, setWorkSummaryResult] = useState<{
    executiveSummary: string;
    elevatorPitch: string;
    linkedinPost: string;
    keyImpactMetrics: string[];
    recommendedBioSnippet: string;
  } | null>(null);

  const [careerSummaryResult, setCareerSummaryResult] = useState<{
    headlinePitch: string;
    careerSummary: string;
    coverLetterBlurb: string;
    keyCompetencies: string[];
    interviewTalkingPoints: string[];
  } | null>(null);

  const handleCopyText = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  const handleGenerateWorkSummary = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setAppliedNotification(null);

    const selectedWork = works.find(w => w.id === selectedWorkId);
    const title = selectedWork ? selectedWork.title : customWorkTitle;
    const category = selectedWork ? selectedWork.category : 'journalism';
    const publicationOrPlatform = selectedWork ? selectedWork.publicationOrPlatform : customPublication;
    const excerpt = selectedWork ? selectedWork.excerpt : '';
    const fullDescription = selectedWork ? selectedWork.fullDescription : customNotes;
    const keyTakeaways = selectedWork ? selectedWork.keyTakeaways : [];

    if (!title && !customNotes) {
      setErrorMsg('Please select a portfolio byline or enter a title/notes.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/ai/generate-work-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          publicationOrPlatform,
          excerpt,
          fullDescription,
          keyTakeaways,
          targetAudience
        })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to generate summary');
      }

      if (data.data) {
        setWorkSummaryResult(data.data);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error communicating with AI service');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCareerSummary = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setAppliedNotification(null);

    try {
      const res = await fetch('/api/ai/generate-career-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole,
          specializationFocus,
          profileData: profile,
          worksList: works
        })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to generate career summary');
      }

      if (data.data) {
        setCareerSummaryResult(data.data);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error generating career summary');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyToWorkItem = () => {
    if (!workSummaryResult || !selectedWorkId || !onUpdateWork) return;
    const currentWork = works.find(w => w.id === selectedWorkId);
    if (!currentWork) return;

    const updatedWork: WorkItem = {
      ...currentWork,
      excerpt: workSummaryResult.elevatorPitch || currentWork.excerpt,
      fullDescription: `${workSummaryResult.executiveSummary}\n\n${currentWork.fullDescription || ''}`.trim(),
      keyTakeaways: workSummaryResult.keyImpactMetrics && workSummaryResult.keyImpactMetrics.length > 0
        ? workSummaryResult.keyImpactMetrics
        : currentWork.keyTakeaways
    };

    onUpdateWork(updatedWork);
    setAppliedNotification(`Updated "${currentWork.title}" with AI summaries & impact points!`);
    if (onTriggerSaveToast) onTriggerSaveToast();
  };

  const handleApplyToProfileBio = () => {
    if (!careerSummaryResult || !onUpdateProfile) return;

    onUpdateProfile({
      ...profile,
      bio: careerSummaryResult.headlinePitch || profile.bio,
      extendedBio: `${careerSummaryResult.careerSummary}\n\n${profile.extendedBio || ''}`.trim()
    });

    setAppliedNotification('Updated your Profile Hero Bio & Extended Bio with AI summary!');
    if (onTriggerSaveToast) onTriggerSaveToast();
  };

  return (
    <div className="p-6 space-y-6 text-xs text-white">
      
      {/* Header Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-[#d9823e]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#d9823e] to-[#a35920] flex items-center justify-center text-black shadow-lg shadow-[#d9823e]/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
              <span>Gemini AI Editorial & Work Summary Studio</span>
              <span className="px-2 py-0.5 rounded-full bg-[#d9823e]/20 text-[#d9823e] text-[10px] font-mono">
                Gemini 3.7 Flash
              </span>
            </h3>
            <p className="text-zinc-400 text-xs mt-0.5">
              Generate executive work summaries, LinkedIn publications, elevator pitches, and tailored career overviews.
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex rounded-xl bg-zinc-950 p-1 border border-white/10 shrink-0">
          <button
            type="button"
            onClick={() => setGenerationMode('work_summary')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              generationMode === 'work_summary'
                ? 'bg-[#d9823e] text-black shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Byline & Work Summarizer
          </button>
          <button
            type="button"
            onClick={() => setGenerationMode('career_summary')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              generationMode === 'career_summary'
                ? 'bg-[#d9823e] text-black shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Career & Pitch Studio
          </button>
        </div>
      </div>

      {appliedNotification && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{appliedNotification}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Mode 1: Work Summary Generation */}
      {generationMode === 'work_summary' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 space-y-4">
              <h4 className="font-serif text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#d9823e]" />
                <span>Select Work or Enter Notes</span>
              </h4>

              <div>
                <label className="block text-zinc-300 font-bold uppercase tracking-wider text-[11px] mb-1">
                  Choose from Existing Portfolio ({works.length} items)
                </label>
                <select
                  value={selectedWorkId}
                  onChange={(e) => {
                    setSelectedWorkId(e.target.value);
                    setCustomWorkTitle('');
                  }}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#d9823e]"
                >
                  <option value="">-- Or enter custom new work below --</option>
                  {works.map((w) => (
                    <option key={w.id} value={w.id}>
                      [{w.category.toUpperCase()}] {w.title} ({w.publicationOrPlatform})
                    </option>
                  ))}
                </select>
              </div>

              {!selectedWorkId && (
                <>
                  <div>
                    <label className="block text-zinc-300 font-bold uppercase tracking-wider text-[11px] mb-1">
                      New Byline / Project Title
                    </label>
                    <input
                      type="text"
                      value={customWorkTitle}
                      onChange={(e) => setCustomWorkTitle(e.target.value)}
                      placeholder="e.g. In-Depth Report on Disability Rights"
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d9823e]"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-bold uppercase tracking-wider text-[11px] mb-1">
                      Publication / Platform
                    </label>
                    <input
                      type="text"
                      value={customPublication}
                      onChange={(e) => setCustomPublication(e.target.value)}
                      placeholder="e.g. The Hans India / Substack"
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d9823e]"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-bold uppercase tracking-wider text-[11px] mb-1">
                      Rough Notes or Raw Article Text
                    </label>
                    <textarea
                      rows={3}
                      value={customNotes}
                      onChange={(e) => setCustomNotes(e.target.value)}
                      placeholder="Paste excerpt, draft points, or key quotes here..."
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#d9823e]"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-zinc-300 font-bold uppercase tracking-wider text-[11px] mb-1">
                  Target Tone & Audience
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d9823e]"
                >
                  <option value="recruiter_editor">Editor & Hiring Manager (Executive & Rigorous)</option>
                  <option value="public_linkedin">Public & LinkedIn (High Engagement & Virality)</option>
                  <option value="academic_grant">Academic, Fellowship & Grant Reviewers</option>
                </select>
              </div>

              <button
                type="button"
                disabled={isLoading}
                onClick={handleGenerateWorkSummary}
                className="w-full py-3 rounded-xl bg-[#d9823e] hover:bg-[#c4712f] text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing & Synthesizing with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Generate Complete Work Summary</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Results Column */}
          <div className="lg:col-span-7 space-y-4">
            
            {workSummaryResult ? (
              <div className="space-y-4 animate-in fade-in">
                
                {/* Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-zinc-900 border border-white/10">
                  <span className="text-xs font-bold text-[#d9823e] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>AI Synthesis Complete</span>
                  </span>

                  {selectedWorkId && onUpdateWork && (
                    <button
                      type="button"
                      onClick={handleApplyToWorkItem}
                      className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Apply to this Portfolio Work</span>
                    </button>
                  )}
                </div>

                {/* 1. Executive Summary */}
                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#d9823e]" />
                      <span>Executive Overview (For Editors & Recruiters)</span>
                    </span>
                    <button
                      onClick={() => handleCopyText(workSummaryResult.executiveSummary, 'exec')}
                      className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'exec' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'exec' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                    {workSummaryResult.executiveSummary}
                  </p>
                </div>

                {/* 2. Elevator Pitch */}
                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-400" />
                      <span>2-Sentence Elevator Pitch</span>
                    </span>
                    <button
                      onClick={() => handleCopyText(workSummaryResult.elevatorPitch, 'pitch')}
                      className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'pitch' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'pitch' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-zinc-200 italic leading-relaxed font-serif">
                    "{workSummaryResult.elevatorPitch}"
                  </p>
                </div>

                {/* 3. LinkedIn Announcement */}
                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs flex items-center gap-1.5">
                      <Linkedin className="w-4 h-4 text-sky-400" />
                      <span>LinkedIn Ready Post</span>
                    </span>
                    <button
                      onClick={() => handleCopyText(workSummaryResult.linkedinPost, 'linkedin')}
                      className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'linkedin' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'linkedin' ? 'Copied' : 'Copy Post'}</span>
                    </button>
                  </div>
                  <pre className="text-xs text-zinc-300 font-sans whitespace-pre-wrap leading-relaxed bg-zinc-950 p-3 rounded-xl border border-white/5">
                    {workSummaryResult.linkedinPost}
                  </pre>
                </div>

                {/* 4. Impact Metrics Bullets */}
                {workSummaryResult.keyImpactMetrics && (
                  <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-2">
                    <span className="font-bold text-white text-xs flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Key Impact Takeaways</span>
                    </span>
                    <ul className="space-y-1.5 text-xs text-zinc-300 font-sans">
                      {workSummaryResult.keyImpactMetrics.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#d9823e] mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            ) : (
              <div className="h-64 rounded-2xl border border-dashed border-white/15 flex flex-col items-center justify-center p-6 text-center text-zinc-400 space-y-3">
                <Wand2 className="w-8 h-8 text-zinc-600 animate-pulse" />
                <div>
                  <h4 className="font-serif text-sm font-bold text-zinc-300">AI Summary Output</h4>
                  <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                    Select a portfolio byline or enter raw draft notes on the left and click Generate to produce multi-format executive summaries.
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* Mode 2: Career Summary & Pitch Studio */}
      {generationMode === 'career_summary' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 space-y-4">
              <h4 className="font-serif text-sm font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#d9823e]" />
                <span>Target Role & Focus</span>
              </h4>

              <div>
                <label className="block text-zinc-300 font-bold uppercase tracking-wider text-[11px] mb-1">
                  Target Role / Position Title
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Investigative Journalist / Corporate Communications Lead"
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d9823e]"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-bold uppercase tracking-wider text-[11px] mb-1">
                  Core Specialization & Themes
                </label>
                <textarea
                  rows={3}
                  value={specializationFocus}
                  onChange={(e) => setSpecializationFocus(e.target.value)}
                  placeholder="e.g. Field reporting, disability advocacy, media ethics, Substack commentary..."
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#d9823e]"
                />
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-white/5 space-y-1.5 text-[11px] text-zinc-400">
                <div className="font-bold text-zinc-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#d9823e]" />
                  <span>Integrated Portfolio Data</span>
                </div>
                <p>
                  Gemini will synthesize your {works.length} published bylines, IIMC education, Osteogenesis Imperfecta advocacy, and The Hans India reporting automatically.
                </p>
              </div>

              <button
                type="button"
                disabled={isLoading}
                onClick={handleGenerateCareerSummary}
                className="w-full py-3 rounded-xl bg-[#d9823e] hover:bg-[#c4712f] text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Career Profile...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Executive Career Summary</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            {careerSummaryResult ? (
              <div className="space-y-4 animate-in fade-in">
                
                {/* Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-zinc-900 border border-white/10">
                  <span className="text-xs font-bold text-[#d9823e] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Career Summary Generated</span>
                  </span>

                  {onUpdateProfile && (
                    <button
                      type="button"
                      onClick={handleApplyToProfileBio}
                      className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Update Portfolio Bio & About Me</span>
                    </button>
                  )}
                </div>

                {/* Headline Pitch */}
                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#d9823e]" />
                      <span>Executive Headline Pitch</span>
                    </span>
                    <button
                      onClick={() => handleCopyText(careerSummaryResult.headlinePitch, 'headline')}
                      className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'headline' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'headline' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-white font-bold font-serif leading-relaxed">
                    {careerSummaryResult.headlinePitch}
                  </p>
                </div>

                {/* Career Summary */}
                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <span>Comprehensive Career Summary</span>
                    </span>
                    <button
                      onClick={() => handleCopyText(careerSummaryResult.careerSummary, 'summary')}
                      className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'summary' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'summary' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans whitespace-pre-line">
                    {careerSummaryResult.careerSummary}
                  </p>
                </div>

                {/* Cover Letter Blurb */}
                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs flex items-center gap-1.5">
                      <Send className="w-4 h-4 text-sky-400" />
                      <span>Tailored Cover Letter Opener</span>
                    </span>
                    <button
                      onClick={() => handleCopyText(careerSummaryResult.coverLetterBlurb, 'cover')}
                      className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'cover' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'cover' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="text-xs text-zinc-300 font-sans whitespace-pre-wrap leading-relaxed bg-zinc-950 p-3 rounded-xl border border-white/5">
                    {careerSummaryResult.coverLetterBlurb}
                  </pre>
                </div>

                {/* Key Competencies */}
                {careerSummaryResult.keyCompetencies && (
                  <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-2">
                    <span className="font-bold text-white text-xs flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>Verified Core Competencies</span>
                    </span>
                    <ul className="space-y-1.5 text-xs text-zinc-300 font-sans">
                      {careerSummaryResult.keyCompetencies.map((comp, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-[#d9823e] mt-0.5 shrink-0" />
                          <span>{comp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            ) : (
              <div className="h-64 rounded-2xl border border-dashed border-white/15 flex flex-col items-center justify-center p-6 text-center text-zinc-400 space-y-3">
                <Briefcase className="w-8 h-8 text-zinc-600 animate-pulse" />
                <div>
                  <h4 className="font-serif text-sm font-bold text-zinc-300">Executive Career Synthesis</h4>
                  <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                    Customize your target role on the left to generate comprehensive career summaries and cover letters.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
