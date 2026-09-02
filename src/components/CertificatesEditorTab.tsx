import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Wand2, 
  Save, 
  ExternalLink,
  Tag
} from 'lucide-react';
import { UserProfile } from '../types';

interface CertificatesEditorTabProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onTriggerSaveToast: () => void;
}

export const CertificatesEditorTab: React.FC<CertificatesEditorTabProps> = ({
  profile,
  onUpdateProfile,
  onTriggerSaveToast
}) => {
  const certificates = profile.certificates || [];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form states
  const [certTitle, setCertTitle] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certDate, setCertDate] = useState('');
  const [certCredentialUrl, setCertCredentialUrl] = useState('');
  const [certCredentialId, setCertCredentialId] = useState('');
  const [certDescription, setCertDescription] = useState('');
  const [certSkills, setCertSkills] = useState('');

  // AI Generator state
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiSuccess, setAiSuccess] = useState<string | null>(null);

  const handleStartAdd = () => {
    setIsAddingNew(true);
    setEditingId(null);
    setCertTitle('');
    setCertIssuer('');
    setCertDate(new Date().getFullYear().toString());
    setCertCredentialUrl('');
    setCertCredentialId('');
    setCertDescription('');
    setCertSkills('');
    setAiError(null);
    setAiSuccess(null);
  };

  const handleStartEdit = (id: string) => {
    const item = certificates.find(c => c.id === id);
    if (!item) return;
    setEditingId(id);
    setIsAddingNew(false);
    setCertTitle(item.title);
    setCertIssuer(item.issuer);
    setCertDate(item.issueDate);
    setCertCredentialUrl(item.credentialUrl || '');
    setCertCredentialId(item.credentialId || '');
    setCertDescription(item.description || '');
    setCertSkills(item.skills ? item.skills.join(', ') : '');
    setAiError(null);
    setAiSuccess(null);
  };

  const handleCancelForm = () => {
    setIsAddingNew(false);
    setEditingId(null);
    setAiError(null);
    setAiSuccess(null);
  };

  const handleAISummarize = async () => {
    if (!certTitle.trim() && !certIssuer.trim() && !certDescription.trim()) {
      setAiError('Please enter a certificate title, issuer, or paste raw syllabus details first.');
      return;
    }

    setIsGeneratingAI(true);
    setAiError(null);
    setAiSuccess(null);

    try {
      const res = await fetch('/api/ai/summarize-certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: certTitle,
          issuer: certIssuer,
          issueDate: certDate,
          credentialId: certCredentialId,
          rawDetails: certDescription,
          skills: certSkills.split(',').map(s => s.trim()).filter(Boolean)
        })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to summarize certificate');
      }

      if (data.data) {
        if (data.data.title && !certTitle) setCertTitle(data.data.title);
        if (data.data.issuer && !certIssuer) setCertIssuer(data.data.issuer);
        if (data.data.description) setCertDescription(data.data.description);
        if (data.data.skills && Array.isArray(data.data.skills)) {
          setCertSkills(data.data.skills.join(', '));
        }
        setAiSuccess('Gemini AI formatted and generated professional certificate summary!');
      }
    } catch (err: any) {
      console.error('Certificate AI error:', err);
      setAiError(err.message || 'Could not summarize certificate with AI.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSaveCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle.trim() || !certIssuer.trim()) return;

    const skillsArray = certSkills
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const newCert = {
      id: isAddingNew ? `cert-${Date.now()}` : (editingId || `cert-${Date.now()}`),
      title: certTitle.trim(),
      issuer: certIssuer.trim(),
      issueDate: certDate.trim() || 'Verified',
      credentialUrl: certCredentialUrl.trim() || undefined,
      credentialId: certCredentialId.trim() || undefined,
      description: certDescription.trim() || undefined,
      skills: skillsArray.length > 0 ? skillsArray : undefined
    };

    let updatedList = [...certificates];
    if (isAddingNew) {
      updatedList = [newCert, ...updatedList];
    } else if (editingId) {
      updatedList = updatedList.map(c => c.id === editingId ? newCert : c);
    }

    onUpdateProfile({
      ...profile,
      certificates: updatedList
    });

    handleCancelForm();
    onTriggerSaveToast();
  };

  const handleDeleteCertificate = (id: string, name: string) => {
    if (window.confirm(`Delete certificate "${name}"?`)) {
      const updatedList = certificates.filter(c => c.id !== id);
      onUpdateProfile({
        ...profile,
        certificates: updatedList
      });
      onTriggerSaveToast();
    }
  };

  return (
    <div className="p-6 space-y-6 text-xs text-white">
      
      {!isAddingNew && editingId === null ? (
        <>
          {/* Header & Add Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-[#d9823e]" />
                <span>Certificates, Credentials & Honors ({certificates.length})</span>
              </h3>
              <p className="text-zinc-400 text-xs mt-0.5">
                Add diplomas, fellowships, journalism licenses, course certificates, and institutional recognitions.
              </p>
            </div>

            <button
              onClick={handleStartAdd}
              className="px-4 py-2 rounded-xl bg-[#d9823e] hover:bg-[#c4712f] text-black font-bold text-xs flex items-center gap-1.5 shadow-md shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Certificate</span>
            </button>
          </div>

          {/* List of Certificates */}
          {certificates.length === 0 ? (
            <div className="text-center py-12 px-4 bg-zinc-900/40 rounded-2xl border border-white/5 space-y-3">
              <Award className="w-10 h-10 text-zinc-600 mx-auto" />
              <div className="text-sm font-bold text-white">No certificates added yet</div>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Add diplomas, journalism fellowships, digital certifications, or workshop credentials with AI summaries.
              </p>
              <button
                onClick={handleStartAdd}
                className="px-4 py-2 rounded-xl bg-[#d9823e] text-black font-bold text-xs inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Certificate</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="p-4 rounded-2xl bg-zinc-900/70 border border-white/10 hover:border-[#d9823e]/40 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] font-bold text-[#d9823e] px-2 py-0.5 rounded bg-[#d9823e]/10 border border-[#d9823e]/20">
                        {cert.issueDate}
                      </span>
                      {cert.credentialId && (
                        <span className="text-[10px] text-zinc-400 font-mono">
                          ID: {cert.credentialId}
                        </span>
                      )}
                    </div>

                    <h4 className="font-serif text-sm font-bold text-white line-clamp-1">
                      {cert.title}
                    </h4>

                    <div className="text-xs font-semibold text-zinc-400">
                      {cert.issuer}
                    </div>

                    {cert.description && (
                      <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed font-sans pt-1">
                        {cert.description}
                      </p>
                    )}

                    {cert.skills && cert.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {cert.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-400 border border-white/5 font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    {cert.credentialUrl ? (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-[#d9823e] hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>View Verified Link</span>
                      </a>
                    ) : (
                      <span className="text-[10px] text-zinc-500">Verified Credential</span>
                    )}

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleStartEdit(cert.id)}
                        className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1 border border-white/10 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3 text-[#d9823e]" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteCertificate(cert.id, cert.title)}
                        className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900 text-red-300 text-xs border border-red-800/30 cursor-pointer"
                        title="Delete certificate"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* Form for Adding / Editing Certificate */
        <form onSubmit={handleSaveCertificate} className="space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-[#d9823e]" />
                <span>{isAddingNew ? 'Add New Certificate & Credential' : 'Edit Certificate Entry'}</span>
              </h3>
              <p className="text-zinc-400 text-xs mt-0.5">
                Include verified credentials, professional certificates, or training achievements.
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

          {/* AI Helper for Certificate Summarizer */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-[#d9823e]/30 space-y-3 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#d9823e]/20 text-[#d9823e] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white text-xs">Gemini AI Certificate Summarizer</span>
                  <p className="text-[10px] text-zinc-400">Auto-generate professional summary & key skill tags from raw course or diploma details.</p>
                </div>
              </div>

              <button
                type="button"
                disabled={isGeneratingAI}
                onClick={handleAISummarize}
                className="px-3.5 py-1.5 rounded-xl bg-[#d9823e] hover:bg-[#c4712f] text-black font-bold text-xs flex items-center gap-1.5 shadow transition-all disabled:opacity-50 cursor-pointer"
              >
                {isGeneratingAI ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Summarizing...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>AI Summarize & Tag</span>
                  </>
                )}
              </button>
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
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
                Certificate / Award Title *
              </label>
              <input
                type="text"
                required
                value={certTitle}
                onChange={(e) => setCertTitle(e.target.value)}
                placeholder="e.g., Postgraduate Diploma in English Journalism / Digital Reporting Fellow"
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-500 focus:border-[#d9823e] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
                Issuing Organization / Institute *
              </label>
              <input
                type="text"
                required
                value={certIssuer}
                onChange={(e) => setCertIssuer(e.target.value)}
                placeholder="e.g., Indian Institute of Mass Communication (IIMC) / Muskurahat Foundation"
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-500 focus:border-[#d9823e] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
                Issue Date / Year *
              </label>
              <input
                type="text"
                required
                value={certDate}
                onChange={(e) => setCertDate(e.target.value)}
                placeholder="e.g., 2025 – 2026 / Mar 2024"
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-500 focus:border-[#d9823e] focus:outline-none font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
                Credential ID / License Number
              </label>
              <input
                type="text"
                value={certCredentialId}
                onChange={(e) => setCertCredentialId(e.target.value)}
                placeholder="e.g., IIMC-DHN-ENG-26"
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-500 focus:border-[#d9823e] focus:outline-none font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
                Verification Link (Google Drive / URL)
              </label>
              <input
                type="url"
                value={certCredentialUrl}
                onChange={(e) => setCertCredentialUrl(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-500 focus:border-[#d9823e] focus:outline-none font-mono text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
              Skills & Competencies (comma separated)
            </label>
            <input
              type="text"
              value={certSkills}
              onChange={(e) => setCertSkills(e.target.value)}
              placeholder="e.g., Print Journalism, News Editing, Peace to Camera (PTC), Media Ethics"
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-500 focus:border-[#d9823e] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
              Certificate Description & Significance
            </label>
            <textarea
              rows={3}
              value={certDescription}
              onChange={(e) => setCertDescription(e.target.value)}
              placeholder="Comprehensive details of what this certification covered, key achievements, or click 'AI Summarize & Tag' above..."
              className="w-full bg-zinc-950 border border-white/10 rounded-xl p-3 text-white placeholder-zinc-500 focus:border-[#d9823e] focus:outline-none leading-relaxed"
            />
          </div>

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
              <span>Save Certificate</span>
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
