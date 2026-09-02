import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Briefcase, 
  GraduationCap, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Wand2, 
  Star, 
  Save, 
  RotateCcw,
  BookOpen,
  Laptop
} from 'lucide-react';
import { UserProfile } from '../types';

interface ExperienceEditorTabProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onTriggerSaveToast: () => void;
}

export const ExperienceEditorTab: React.FC<ExperienceEditorTabProps> = ({
  profile,
  onUpdateProfile,
  onTriggerSaveToast
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form states
  const [expRole, setExpRole] = useState('');
  const [expOrg, setExpOrg] = useState('');
  const [expPeriod, setExpPeriod] = useState('');
  const [expDescription, setExpDescription] = useState('');
  const [expHighlight, setExpHighlight] = useState(false);
  const [expType, setExpType] = useState<'job' | 'internship' | 'research' | 'leadership'>('internship');

  // AI Generator state
  const [roughNotes, setRoughNotes] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiSuccess, setAiSuccess] = useState<string | null>(null);
  const [generatedBullets, setGeneratedBullets] = useState<string[]>([]);

  const handleStartAdd = () => {
    setIsAddingNew(true);
    setEditingIndex(null);
    setExpRole('');
    setExpOrg('');
    setExpPeriod('2025 – Present');
    setExpDescription('');
    setExpHighlight(false);
    setExpType('internship');
    setRoughNotes('');
    setAiError(null);
    setAiSuccess(null);
    setGeneratedBullets([]);
  };

  const handleStartEdit = (idx: number) => {
    const item = profile.experience[idx];
    if (!item) return;
    setEditingIndex(idx);
    setIsAddingNew(false);
    setExpRole(item.role);
    setExpOrg(item.organization);
    setExpPeriod(item.period);
    setExpDescription(item.description);
    setExpHighlight(!!item.highlight);
    setRoughNotes('');
    setAiError(null);
    setAiSuccess(null);
    setGeneratedBullets([]);
  };

  const handleCancelForm = () => {
    setIsAddingNew(false);
    setEditingIndex(null);
    setAiError(null);
    setAiSuccess(null);
    setGeneratedBullets([]);
  };

  const handleSaveExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expRole.trim() || !expOrg.trim()) return;

    const newExperienceItem = {
      period: expPeriod.trim() || 'Recent',
      role: expRole.trim(),
      organization: expOrg.trim(),
      description: expDescription.trim(),
      highlight: expHighlight
    };

    let updatedList = [...profile.experience];
    if (isAddingNew) {
      updatedList = [newExperienceItem, ...updatedList];
    } else if (editingIndex !== null) {
      updatedList[editingIndex] = newExperienceItem;
    }

    onUpdateProfile({
      ...profile,
      experience: updatedList
    });

    handleCancelForm();
    onTriggerSaveToast();
  };

  const handleDeleteExperience = (idx: number) => {
    if (window.confirm(`Delete "${profile.experience[idx].role}" from your experience timeline?`)) {
      const updatedList = profile.experience.filter((_, i) => i !== idx);
      onUpdateProfile({
        ...profile,
        experience: updatedList
      });
      onTriggerSaveToast();
    }
  };

  const handleAIGenerateBullets = async () => {
    if (!expRole.trim() && !expOrg.trim() && !roughNotes.trim()) {
      setAiError('Please enter a role title, organization, or some rough notes so Gemini AI can generate bullet points.');
      return;
    }

    setIsGeneratingAI(true);
    setAiError(null);
    setAiSuccess(null);

    try {
      const res = await fetch('/api/ai/generate-experience-bullets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: expRole,
          organization: expOrg,
          period: expPeriod,
          roughNotes: roughNotes || expDescription,
          experienceType: expType
        })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to generate bullet points');
      }

      if (data.data) {
        if (data.data.polishedRole && (!expRole || expRole.length < 5)) {
          setExpRole(data.data.polishedRole);
        }
        if (data.data.polishedOrganization && !expOrg) {
          setExpOrg(data.data.polishedOrganization);
        }
        if (data.data.polishedDescription) {
          setExpDescription(data.data.polishedDescription);
        }
        if (Array.isArray(data.data.bulletPoints) && data.data.bulletPoints.length > 0) {
          setGeneratedBullets(data.data.bulletPoints);
        }
        setAiSuccess('✨ AI generated polished role description and resume accomplishment bullets!');
      }
    } catch (err: any) {
      console.error('AI error:', err);
      setAiError(err.message || 'Unable to generate experience bullets. Please try again.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleAppendBulletToDescription = (bullet: string) => {
    setExpDescription((prev) => {
      const clean = prev.trim();
      return clean ? `${clean}\n• ${bullet}` : `• ${bullet}`;
    });
  };

  return (
    <div className="p-6 space-y-6 text-xs text-white">
      
      {!isAddingNew && editingIndex === null ? (
        <>
          {/* Header & Add Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#d9823e]" />
                <span>Experience, Internships & Research Timeline</span>
              </h3>
              <p className="text-zinc-400 text-xs mt-0.5">
                Manage your internships, reporting jobs, academic research projects, and newsroom roles shown in the About section.
              </p>
            </div>

            <button
              onClick={handleStartAdd}
              className="px-4 py-2 rounded-xl bg-[#d9823e] hover:bg-[#c4712f] text-black font-bold text-xs flex items-center gap-1.5 shadow-md shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Experience</span>
            </button>
          </div>

          {/* List of Current Experiences */}
          <div className="space-y-3">
            {profile.experience.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  item.highlight
                    ? 'bg-zinc-900/90 border-[#d9823e]/40 shadow-lg'
                    : 'bg-zinc-900/60 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-[#d9823e] px-2 py-0.5 rounded bg-[#d9823e]/10 border border-[#d9823e]/20">
                      {item.period}
                    </span>
                    {item.highlight && (
                      <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                        <span>Highlighted Milestone</span>
                      </span>
                    )}
                  </div>

                  <h4 className="font-serif text-sm font-bold text-white">
                    {item.role}
                  </h4>

                  <div className="text-xs text-zinc-400 font-semibold">
                    {item.organization}
                  </div>

                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed font-sans pt-1">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleStartEdit(idx)}
                    className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-white/10"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#d9823e]" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDeleteExperience(idx)}
                    className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900 text-red-300 text-xs border border-red-800/30 cursor-pointer"
                    title="Delete experience"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Form for Adding or Editing Experience */
        <form onSubmit={handleSaveExperience} className="space-y-5">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                {isAddingNew ? 'Add New Experience & Internship' : 'Edit Experience Entry'}
              </h3>
              <p className="text-zinc-400 text-xs mt-0.5">
                Add reporting roles, internship stints, academic research positions, or digital projects.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCancelForm}
              className="px-3.5 py-1.5 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
          </div>

          {/* AI Helper for Experience Bullets */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-[#d9823e]/30 space-y-3 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#d9823e]/20 text-[#d9823e] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white text-xs">Gemini AI Resume Bullet & Description Writer</span>
                  <p className="text-[10px] text-zinc-400">Generate high-impact action bullets with quantifiable journalistic impact.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={expType}
                  onChange={(e) => setExpType(e.target.value as any)}
                  className="bg-zinc-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-zinc-300 focus:outline-none focus:border-[#d9823e]"
                >
                  <option value="internship">Internship</option>
                  <option value="job">Newsroom Job / Editorial Role</option>
                  <option value="research">Academic Research & Study</option>
                  <option value="leadership">Campus / Student Leadership</option>
                </select>

                <button
                  type="button"
                  disabled={isGeneratingAI}
                  onClick={handleAIGenerateBullets}
                  className="px-3 py-1.5 rounded-xl bg-[#d9823e] hover:bg-[#c4712f] text-black font-bold text-xs flex items-center gap-1.5 shadow transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isGeneratingAI ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Writing Bullets...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>Generate AI Bullets</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Rough Notes / Key Tasks */}
            <div>
              <textarea
                rows={2}
                value={roughNotes}
                onChange={(e) => setRoughNotes(e.target.value)}
                placeholder="Optional rough notes (e.g. Conducted 10 field interviews on accessibility, published bylines, managed social video scripts)..."
                className="w-full bg-zinc-950 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#d9823e]"
              />
            </div>

            {aiSuccess && (
              <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-[11px]">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{aiSuccess}</span>
              </div>
            )}

            {aiError && (
              <div className="flex items-center gap-2 p-2 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-[11px]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{aiError}</span>
              </div>
            )}

            {/* Suggested Generated Bullets for 1-click Append */}
            {generatedBullets.length > 0 && (
              <div className="space-y-2 pt-1 border-t border-white/10">
                <span className="text-[10px] uppercase tracking-wider text-[#d9823e] font-bold">
                  Click any bullet to add to your description:
                </span>
                <div className="space-y-1.5">
                  {generatedBullets.map((bullet, bIdx) => (
                    <div
                      key={bIdx}
                      onClick={() => handleAppendBulletToDescription(bullet)}
                      className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/5 hover:border-[#d9823e]/50 cursor-pointer flex items-start gap-2 text-zinc-300 hover:text-white transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#d9823e] shrink-0 mt-0.5" />
                      <span className="text-xs leading-relaxed">{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Role & Organization */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
                Role / Title *
              </label>
              <input
                type="text"
                required
                value={expRole}
                onChange={(e) => setExpRole(e.target.value)}
                placeholder="e.g., Reporting Intern / English Journalism Fellow / Founder"
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-500 focus:border-[#d9823e] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
                Organization / Company / Publication *
              </label>
              <input
                type="text"
                required
                value={expOrg}
                onChange={(e) => setExpOrg(e.target.value)}
                placeholder="e.g., The Hans India / IIMC Dhenkanal / Ethicly Project"
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-500 focus:border-[#d9823e] focus:outline-none"
              />
            </div>
          </div>

          {/* Time Period & Highlight Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
                Time Period / Dates *
              </label>
              <input
                type="text"
                required
                value={expPeriod}
                onChange={(e) => setExpPeriod(e.target.value)}
                placeholder="e.g., 2025 – 2026 / Summer 2025 / 2024"
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-500 focus:border-[#d9823e] focus:outline-none font-mono text-xs"
              />
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer text-zinc-300 font-medium">
                <input
                  type="checkbox"
                  checked={expHighlight}
                  onChange={(e) => setExpHighlight(e.target.checked)}
                  className="w-4 h-4 rounded text-[#d9823e] focus:ring-[#d9823e] bg-zinc-900 border-white/20"
                />
                <span>Highlight as Current Major Milestone</span>
              </label>
            </div>
          </div>

          {/* Scope & Description */}
          <div>
            <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
              Description & Key Accomplishments *
            </label>
            <textarea
              rows={4}
              required
              value={expDescription}
              onChange={(e) => setExpDescription(e.target.value)}
              placeholder="Detailed description of your newsroom reporting, research methodology, editorial coordination, and published output..."
              className="w-full bg-zinc-950 border border-white/10 rounded-xl p-3 text-white placeholder-zinc-500 focus:border-[#d9823e] focus:outline-none leading-relaxed"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleCancelForm}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#d9823e] hover:bg-[#c4712f] text-black font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Experience Entry</span>
            </button>
          </div>

        </form>
      )}

    </div>
  );
};
