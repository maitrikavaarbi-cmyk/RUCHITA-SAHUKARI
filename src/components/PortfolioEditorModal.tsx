import React, { useState, useRef } from 'react';
import { 
  X, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  RotateCcw, 
  FileText, 
  User, 
  Link as LinkIcon, 
  Check, 
  Sparkles, 
  ExternalLink,
  Upload,
  Image as ImageIcon,
  Camera,
  MessageSquareQuote,
  Linkedin,
  Star,
  ShieldCheck,
  Eye,
  Wand2,
  Loader2,
  Laptop,
  GraduationCap,
  Layers,
  Play,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Briefcase,
  Key,
  Share2,
  Award,
  Crop,
  ArrowLeft
} from 'lucide-react';
import { UserProfile, WorkItem, ReviewItem, PortfolioMode } from '../types';
import { formatDirectImageUrl } from '../utils/imageUtils';
import { ExperienceEditorTab } from './ExperienceEditorTab';
import { CertificatesEditorTab } from './CertificatesEditorTab';
import { AIWorkSummaryStudio } from './AIWorkSummaryStudio';

interface PortfolioEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  works: WorkItem[];
  reviews: ReviewItem[];
  onUpdateProfile: (updated: UserProfile) => void;
  onAddWork: (work: WorkItem) => void;
  onUpdateWork: (work: WorkItem) => void;
  onDeleteWork: (id: string) => void;
  onAddReview: (review: Omit<ReviewItem, 'id' | 'date'>) => void;
  onDeleteReview: (id: string) => void;
  onResetToDefaults: () => void;
  onSwitchMode?: (mode: PortfolioMode) => void;
  onOpenChangePhoto?: (target?: 'hero' | 'about', tab?: 'source' | 'crop') => void;
}

export const PortfolioEditorModal: React.FC<PortfolioEditorModalProps> = ({
  isOpen,
  onClose,
  profile,
  works,
  reviews,
  onUpdateProfile,
  onAddWork,
  onUpdateWork,
  onDeleteWork,
  onAddReview,
  onDeleteReview,
  onResetToDefaults,
  onSwitchMode,
  onOpenChangePhoto
}) => {
  const [activeTab, setActiveTab] = useState<'works' | 'experience' | 'certificates' | 'ai_studio' | 'profile' | 'links' | 'reviews' | 'security'>('works');
  
  // Work Form State
  const [isAddingWork, setIsAddingWork] = useState(false);
  const [editingWorkId, setEditingWorkId] = useState<string | null>(null);
  const [workTitle, setWorkTitle] = useState('');
  const [workCategory, setWorkCategory] = useState<WorkItem['category']>('journalism');
  const [workPlatform, setWorkPlatform] = useState('');
  const [workUrl, setWorkUrl] = useState('');
  const [workDate, setWorkDate] = useState('');
  const [workExcerpt, setWorkExcerpt] = useState('');
  const [workDescription, setWorkDescription] = useState('');
  const [workImage, setWorkImage] = useState('');
  const [workTags, setWorkTags] = useState('');
  const [workTakeaways, setWorkTakeaways] = useState('');
  const [workFormat, setWorkFormat] = useState<WorkItem['format']>('article');
  const [workDuration, setWorkDuration] = useState('');
  const [workFeatured, setWorkFeatured] = useState(false);
  const workImageFileInputRef = useRef<HTMLInputElement>(null);
  const workDocFileInputRef = useRef<HTMLInputElement>(null);

  // AI Generator States in Work Form
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string | null>(null);
  const [aiRawContext, setAiRawContext] = useState('');
  const [aiTone, setAiTone] = useState<'journalistic' | 'academic' | 'compelling' | 'technical'>('journalistic');
  const [summaryAudience, setSummaryAudience] = useState<'recruiter_editor' | 'public_linkedin' | 'academic_grant'>('recruiter_editor');
  const [showAiContextBox, setShowAiContextBox] = useState(false);
  const [workSummaryData, setWorkSummaryData] = useState<{
    executiveSummary: string;
    elevatorPitch: string;
    linkedinPost: string;
    keyImpactMetrics: string[];
    recommendedBioSnippet: string;
  } | null>(null);

  // Profile Form State
  const [profileForm, setProfileForm] = useState<UserProfile>(profile);
  const [saveNotification, setSaveNotification] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const profileHeroFileInputRef = useRef<HTMLInputElement>(null);
  const profileAboutFileInputRef = useRef<HTMLInputElement>(null);

  // Review Form State
  const [reviewName, setReviewName] = useState('');
  const [reviewRole, setReviewRole] = useState('');
  const [reviewAffiliation, setReviewAffiliation] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewImage, setReviewImage] = useState('');
  const [reviewVerified, setReviewVerified] = useState(true);

  if (!isOpen) return null;

  const showSaveToast = (msg: string = 'Saved & published to portfolio!') => {
    setSaveNotification(msg);
    setTimeout(() => setSaveNotification(null), 3500);
  };

  // Reset or Start Work Form
  const handleStartAddWork = () => {
    setIsAddingWork(true);
    setEditingWorkId(null);
    setWorkTitle('');
    setWorkCategory('journalism');
    setWorkPlatform('The Hans India');
    setWorkUrl('');
    setWorkDate(new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
    setWorkExcerpt('');
    setWorkDescription('');
    setWorkImage('https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=800&auto=format&fit=crop');
    setWorkTags('Journalism, Investigation, MediaEthics');
    setWorkTakeaways('Rigorous on-ground reporting\nVerified source interviews\nAccessible storytelling');
    setWorkFormat('article');
    setWorkDuration('4 min read');
    setWorkFeatured(false);
    setAiRawContext('');
    setAiError(null);
    setAiSuccessMessage(null);
  };

  const handleStartEditWork = (work: WorkItem) => {
    setIsAddingWork(false);
    setEditingWorkId(work.id);
    setWorkTitle(work.title);
    setWorkCategory(work.category);
    setWorkPlatform(work.publicationOrPlatform);
    setWorkUrl(work.url);
    setWorkDate(work.date);
    setWorkExcerpt(work.excerpt);
    setWorkDescription(work.fullDescription || '');
    setWorkImage(work.imageUrl || '');
    setWorkTags(work.tags ? work.tags.join(', ') : '');
    setWorkTakeaways(work.keyTakeaways ? work.keyTakeaways.join('\n') : '');
    setWorkFormat(work.format || 'article');
    setWorkDuration(work.readTimeOrDuration || '4 min read');
    setWorkFeatured(!!work.isFeatured);
    setAiRawContext('');
    setAiError(null);
    setAiSuccessMessage(null);
  };

  const handleCancelWorkForm = () => {
    setIsAddingWork(false);
    setEditingWorkId(null);
    setAiError(null);
    setAiSuccessMessage(null);
  };

  const handleWorkImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('File is larger than 8MB. Please select a smaller photo.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setWorkImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWorkDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setAiRawContext(text.slice(0, 6000));
          if (!workTitle) {
            const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
            setWorkTitle(cleanTitle);
          }
          setShowAiContextBox(true);
          setAiSuccessMessage(`📄 Uploaded draft: "${file.name}" ready for AI summarization!`);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSaveWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workTitle.trim()) return;

    const tagsArray = workTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const takeawaysArray = workTakeaways
      .split('\n')
      .map(t => t.replace(/^[•\-*]\s*/, '').trim())
      .filter(Boolean);

    const workData: WorkItem = {
      id: editingWorkId || `work-${Date.now()}`,
      title: workTitle.trim(),
      category: workCategory,
      publicationOrPlatform: workPlatform.trim() || 'Journalism Desk',
      url: workUrl.trim() || '#',
      date: workDate.trim() || '2026',
      excerpt: workExcerpt.trim() || workTitle,
      fullDescription: workDescription.trim(),
      imageUrl: workImage.trim() || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=800&auto=format&fit=crop',
      tags: tagsArray.length > 0 ? tagsArray : ['Journalism'],
      keyTakeaways: takeawaysArray.length > 0 ? takeawaysArray : undefined,
      format: workFormat,
      readTimeOrDuration: workDuration.trim() || '4 min read',
      isFeatured: workFeatured
    };

    if (editingWorkId) {
      onUpdateWork(workData);
    } else {
      onAddWork(workData);
    }

    handleCancelWorkForm();
    showSaveToast(`Saved "${workData.title}" to portfolio!`);
  };

  const handleDeleteWorkItem = (id: string, title: string) => {
    if (window.confirm(`Delete "${title}" from your portfolio?`)) {
      onDeleteWork(id);
      showSaveToast(`Removed "${title}"`);
    }
  };

  // AI Generation inside Work Form
  const handleGenerateAIWorkDetails = async () => {
    if (!workTitle.trim() && !aiRawContext.trim() && !workUrl.trim()) {
      setAiError('Please provide a title, url, or rough draft notes to generate copy.');
      return;
    }

    setIsGeneratingAI(true);
    setAiError(null);
    setAiSuccessMessage(null);

    try {
      const res = await fetch('/api/ai/generate-portfolio-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: workTitle,
          url: workUrl,
          typeOrFormat: workFormat,
          category: workCategory,
          publicationOrPlatform: workPlatform,
          rawContentOrNotes: aiRawContext,
          tone: aiTone,
          action: 'generate_all'
        })
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || 'Failed to generate');
      }

      if (json.data) {
        const { excerpt, fullDescription, keyTakeaways, tags, suggestedReadTimeOrDuration } = json.data;
        if (excerpt) setWorkExcerpt(excerpt);
        if (fullDescription) setWorkDescription(fullDescription);
        if (Array.isArray(keyTakeaways)) setWorkTakeaways(keyTakeaways.join('\n'));
        if (Array.isArray(tags)) setWorkTags(tags.join(', '));
        if (suggestedReadTimeOrDuration) setWorkDuration(suggestedReadTimeOrDuration);
        setAiSuccessMessage('✨ AI successfully generated executive lead, full description, takeaways & tags!');
      }
    } catch (err: any) {
      console.error('AI generation error:', err);
      setAiError(err.message || 'Error communicating with AI service');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // AI Create Work Summary (Calls /api/ai/generate-work-summary)
  const handleCreateAIWorkSummary = async () => {
    if (!workTitle.trim() && !aiRawContext.trim() && !workUrl.trim() && !workExcerpt.trim()) {
      setAiError('Please enter a title, URL, or draft notes to generate an executive work summary.');
      return;
    }

    setIsGeneratingSummary(true);
    setAiError(null);
    setAiSuccessMessage(null);

    try {
      const res = await fetch('/api/ai/generate-work-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: workTitle || 'Journalistic & Media Dispatch',
          category: workCategory,
          publicationOrPlatform: workPlatform,
          excerpt: workExcerpt,
          fullDescription: workDescription || aiRawContext,
          keyTakeaways: workTakeaways ? workTakeaways.split('\n').filter(Boolean) : [],
          targetAudience: summaryAudience
        })
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || 'Failed to create work summary');
      }

      if (json.data) {
        setWorkSummaryData(json.data);
        setAiSuccessMessage('✨ AI Work Summary created! Click "Apply to Form" below to populate your description and excerpt.');
      }
    } catch (err: any) {
      console.error('AI Work Summary error:', err);
      setAiError(err.message || 'Error communicating with AI service');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleApplyWorkSummaryToFields = () => {
    if (!workSummaryData) return;
    if (workSummaryData.elevatorPitch) {
      setWorkExcerpt(workSummaryData.elevatorPitch);
    }
    if (workSummaryData.executiveSummary) {
      setWorkDescription(prev => prev ? `${workSummaryData.executiveSummary}\n\n${prev}` : workSummaryData.executiveSummary);
    }
    if (workSummaryData.keyImpactMetrics && workSummaryData.keyImpactMetrics.length > 0) {
      setWorkTakeaways(workSummaryData.keyImpactMetrics.join('\n'));
    }
    showSaveToast('Applied AI work summary, lead excerpt & impact points to form fields!');
  };

  // Profile Form Handlers
  const handleProfileHeroUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newUrl = event.target.result as string;
          setProfileForm(prev => ({ ...prev, avatarUrl: newUrl }));
          onUpdateProfile({ ...profileForm, avatarUrl: newUrl });
          showSaveToast('Profile picture updated! Opening crop studio to adjust framing...');
          if (onOpenChangePhoto) {
            setTimeout(() => {
              onOpenChangePhoto('hero', 'crop');
            }, 600);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileAboutUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newUrl = event.target.result as string;
          setProfileForm(prev => ({ ...prev, aboutImageUrl: newUrl }));
          onUpdateProfile({ ...profileForm, aboutImageUrl: newUrl });
          showSaveToast('Field photo updated! Opening crop studio to adjust framing...');
          if (onOpenChangePhoto) {
            setTimeout(() => {
              onOpenChangePhoto('about', 'crop');
            }, 600);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profileForm);
    showSaveToast('Profile bio & details saved!');
  };

  // Review Form Handler
  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewContent.trim()) return;

    onAddReview({
      authorName: reviewName.trim(),
      role: reviewRole.trim() || 'Senior Colleague / Editor',
      organizationOrRelation: reviewAffiliation.trim() || 'Media & Communications',
      comment: reviewContent.trim(),
      rating: reviewRating,
      avatarUrl: reviewImage.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
      verified: reviewVerified
    });

    setReviewName('');
    setReviewRole('');
    setReviewAffiliation('');
    setReviewContent('');
    setReviewImage('');
    showSaveToast('Recommendation added!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[900px] rounded-3xl bg-[#121212] border border-white/15 flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-[#161616] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#d9823e] to-[#a35920] flex items-center justify-center text-black font-bold shadow-lg shadow-[#d9823e]/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>Creator Studio</span>
                <span className="px-2 py-0.5 rounded-full bg-[#d9823e]/20 text-[#d9823e] text-[11px] font-mono font-semibold">
                  Admin Active
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Manage your articles, research, internships, profile pictures & AI summaries
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {saveNotification && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{saveNotification}</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 hover:text-white border border-white/15 transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm hover:border-[#d9823e]/50 active:scale-95"
              title="Done editing — return to portfolio website"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#d9823e]" />
              <span>Done / Back to Site</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Close Editor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Studio Navigation Bar */}
        <div className="px-4 bg-[#141414] border-b border-white/10 flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => {
              setActiveTab('works');
              handleCancelWorkForm();
            }}
            className={`px-3.5 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'works'
                ? 'border-[#d9823e] text-[#d9823e] bg-white/5'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload & Manage Works ({works.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('experience')}
            className={`px-3.5 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'experience'
                ? 'border-[#d9823e] text-[#d9823e] bg-white/5'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Experience & Internships</span>
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-3.5 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'certificates'
                ? 'border-[#d9823e] text-[#d9823e] bg-white/5'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4 text-[#d9823e]" />
            <span>Certificates & Credentials ({(profile.certificates || []).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_studio')}
            className={`px-3.5 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'ai_studio'
                ? 'border-[#d9823e] text-[#d9823e] bg-white/5'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Summary Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#d9823e] text-[#d9823e] bg-white/5'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Bio & Profile Photos</span>
          </button>

          <button
            onClick={() => setActiveTab('links')}
            className={`px-3.5 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'links'
                ? 'border-[#d9823e] text-[#d9823e] bg-white/5'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>Socials, Substack & Links</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3.5 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'reviews'
                ? 'border-[#d9823e] text-[#d9823e] bg-white/5'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <MessageSquareQuote className="w-4 h-4" />
            <span>Reviews ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-3.5 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'border-[#d9823e] text-[#d9823e] bg-white/5'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Passcode & Privacy</span>
          </button>
        </div>

        {/* Tab Contents Area */}
        <div className="flex-1 overflow-y-auto">
          
          {/* TAB 1: Works & Bylines */}
          {activeTab === 'works' && (
            <div className="p-6 space-y-6 text-xs text-white">
              
              {!isAddingWork && editingWorkId === null ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-[#d9823e]" />
                        <span>Published Bylines, Apps & Research Items</span>
                      </h3>
                      <p className="text-zinc-400 text-xs mt-0.5">
                        Add or edit any news article, investigative report, interactive app (Ethicly), Substack essay, or video reel.
                      </p>
                    </div>

                    <button
                      onClick={handleStartAddWork}
                      className="px-4 py-2 rounded-xl bg-[#d9823e] hover:bg-[#c4712f] text-black font-bold text-xs flex items-center gap-1.5 shadow-md shrink-0 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Work / Byline</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {works.map((work) => (
                      <div
                        key={work.id}
                        className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 hover:border-white/20 transition-all space-y-3 flex flex-col justify-between"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={work.imageUrl}
                            alt={work.title}
                            className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0 bg-zinc-950"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=800&auto=format&fit=crop';
                            }}
                          />
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] uppercase font-bold text-[#d9823e] px-2 py-0.5 rounded bg-[#d9823e]/10 border border-[#d9823e]/20">
                                {work.category}
                              </span>
                              <span className="text-[11px] text-zinc-400 truncate">
                                {work.publicationOrPlatform}
                              </span>
                            </div>
                            <h4 className="font-serif text-sm font-bold text-white line-clamp-1">
                              {work.title}
                            </h4>
                            <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                              {work.excerpt}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/10">
                          <span className="font-mono text-[11px] text-zinc-500">
                            {work.date} • {work.format}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleStartEditWork(work)}
                              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-[#d9823e]" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteWorkItem(work.id, work.title)}
                              className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900 text-red-300 cursor-pointer"
                              title="Delete work"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                /* Work Add / Edit Form */
                <form onSubmit={handleSaveWork} className="space-y-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-white">
                        {isAddingWork ? 'Add New Work / Byline' : 'Edit Portfolio Work'}
                      </h3>
                      <p className="text-zinc-400 text-xs mt-0.5">
                        Fill in work metadata, cover photo, links, and use Gemini AI to generate executive copy.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCancelWorkForm}
                      className="px-3.5 py-1.5 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  {/* AI Copy Generator Helper Box */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-[#d9823e]/30 space-y-3 shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#d9823e]/20 text-[#d9823e] flex items-center justify-center">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-white text-xs">Gemini AI Editorial Assistant</span>
                          <p className="text-[10px] text-zinc-400">Generate lead summary, full description, takeaways & tags instantly</p>
                        </div>
                      </div>

                      <div className="flex items-center flex-wrap gap-2">
                        <select
                          value={summaryAudience}
                          onChange={(e) => setSummaryAudience(e.target.value as any)}
                          className="bg-zinc-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-zinc-300 focus:outline-none focus:border-[#d9823e]"
                          title="Target audience for AI summary"
                        >
                          <option value="recruiter_editor">For Recruiters & Editors</option>
                          <option value="public_linkedin">For LinkedIn / Public</option>
                          <option value="academic_grant">For Academic & Grants</option>
                        </select>

                        <button
                          type="button"
                          disabled={isGeneratingSummary || isGeneratingAI}
                          onClick={handleCreateAIWorkSummary}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#d9823e] hover:brightness-110 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50 cursor-pointer"
                          title="Create recruiter-ready executive summary & elevator pitch"
                        >
                          {isGeneratingSummary ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Creating Summary...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Create AI Work Summary</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          disabled={isGeneratingAI || isGeneratingSummary}
                          onClick={handleGenerateAIWorkDetails}
                          className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10 font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                          title="Auto-generate draft excerpt, takeaways, and tags"
                        >
                          {isGeneratingAI ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Generating Fields...</span>
                            </>
                          ) : (
                            <>
                              <Wand2 className="w-3.5 h-3.5 text-[#d9823e]" />
                              <span>Auto-Fill Fields</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-zinc-400">Pasted Draft / Notes or Upload Text/Doc</span>
                        <input
                          type="file"
                          ref={workDocFileInputRef}
                          onChange={handleWorkDocumentUpload}
                          accept=".txt,.md,.doc,.docx,.pdf"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => workDocFileInputRef.current?.click()}
                          className="text-[11px] text-[#d9823e] hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Attach File (.txt, .md, .pdf)</span>
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={aiRawContext}
                        onChange={(e) => setAiRawContext(e.target.value)}
                        placeholder="Optional rough draft, excerpt notes, or pasted article paragraphs for Gemini to analyze..."
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#d9823e]"
                      />
                    </div>

                    {aiSuccessMessage && (
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-[11px]">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>{aiSuccessMessage}</span>
                      </div>
                    )}

                    {aiError && (
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-[11px]">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{aiError}</span>
                      </div>
                    )}

                    {/* AI Generated Work Summary Card */}
                    {workSummaryData && (
                      <div className="p-3.5 rounded-xl bg-zinc-950/90 border border-[#d9823e]/50 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#d9823e] flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Executive Work Summary & Recruiter Pitch</span>
                          </span>
                          <button
                            type="button"
                            onClick={handleApplyWorkSummaryToFields}
                            className="px-3 py-1 rounded-lg bg-[#d9823e] hover:bg-[#c4712f] text-black font-extrabold text-[11px] flex items-center gap-1 shadow cursor-pointer"
                          >
                            <Check className="w-3 h-3" />
                            <span>Apply to Form</span>
                          </button>
                        </div>

                        {/* Executive Summary */}
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-zinc-400">Executive Summary:</span>
                          <p className="text-xs text-zinc-200 leading-relaxed font-sans bg-zinc-900/80 p-2 rounded-lg border border-white/5">
                            {workSummaryData.executiveSummary}
                          </p>
                        </div>

                        {/* Elevator Pitch */}
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-zinc-400">Elevator Pitch (Recommended Excerpt):</span>
                          <p className="text-xs text-zinc-300 italic bg-zinc-900/80 p-2 rounded-lg border border-white/5">
                            "{workSummaryData.elevatorPitch}"
                          </p>
                        </div>

                        {/* Key Impact Points */}
                        {workSummaryData.keyImpactMetrics && workSummaryData.keyImpactMetrics.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-zinc-400">Key Impact & Findings:</span>
                            <ul className="space-y-1">
                              {workSummaryData.keyImpactMetrics.map((metric, idx) => (
                                <li key={idx} className="text-[11px] text-zinc-300 flex items-start gap-1.5">
                                  <span className="text-[#d9823e] font-bold">•</span>
                                  <span>{metric}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Basic Info: Title & Platform */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
                        Title / Headline *
                      </label>
                      <input
                        type="text"
                        required
                        value={workTitle}
                        onChange={(e) => setWorkTitle(e.target.value)}
                        placeholder="e.g. Disability Rights & Public Transport Accessibility"
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-500 focus:border-[#d9823e] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
                        Publication / Platform / Desk *
                      </label>
                      <input
                        type="text"
                        required
                        value={workPlatform}
                        onChange={(e) => setWorkPlatform(e.target.value)}
                        placeholder="e.g. The Hans India / The Lit Scroll / Substack"
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-500 focus:border-[#d9823e] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Category, Format & Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
                        Category Section *
                      </label>
                      <select
                        value={workCategory}
                        onChange={(e) => setWorkCategory(e.target.value as any)}
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-[#d9823e] focus:outline-none"
                      >
                        <option value="journalism">Journalism & National Bylines</option>
                        <option value="the_lit_scroll">The Lit Scroll (Academic/PTC)</option>
                        <option value="substack">Substack Long-form & Essays</option>
                        <option value="communications">Corporate & PR Communications</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
                        Media Format *
                      </label>
                      <select
                        value={workFormat}
                        onChange={(e) => setWorkFormat(e.target.value as any)}
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-[#d9823e] focus:outline-none"
                      >
                        <option value="article">Print / Digital Article</option>
                        <option value="app">Interactive Web App / Tool (e.g. Ethicly)</option>
                        <option value="research">Academic Research Paper</option>
                        <option value="essay">Long-form Essay / Newsletter</option>
                        <option value="reel">Video Broadcast / PTC Reel</option>
                        <option value="carousel">Social Carousel Report</option>
                        <option value="case_study">Communications Case Study</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
                        Publish Date & Read Time
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={workDate}
                          onChange={(e) => setWorkDate(e.target.value)}
                          placeholder="e.g. Feb 2026"
                          className="w-1/2 bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-mono focus:border-[#d9823e] focus:outline-none"
                        />
                        <input
                          type="text"
                          value={workDuration}
                          onChange={(e) => setWorkDuration(e.target.value)}
                          placeholder="e.g. 4 min read"
                          className="w-1/2 bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:border-[#d9823e] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* URLs & Cover Image Upload */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
                        Live Story / Publication Link
                      </label>
                      <input
                        type="url"
                        value={workUrl}
                        onChange={(e) => setWorkUrl(e.target.value)}
                        placeholder="https://thehansindia.com/..."
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-500 focus:border-[#d9823e] focus:outline-none font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
                        Cover Image (Upload File or Enter URL)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={workImage}
                          onChange={(e) => setWorkImage(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="flex-1 bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:border-[#d9823e] focus:outline-none"
                        />
                        <input
                          type="file"
                          ref={workImageFileInputRef}
                          onChange={handleWorkImageUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => workImageFileInputRef.current?.click()}
                          className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1 cursor-pointer shrink-0 border border-white/10"
                        >
                          <Upload className="w-3.5 h-3.5 text-[#d9823e]" />
                          <span>Upload</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Excerpt Lead */}
                  <div>
                    <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
                      Lead Summary / Excerpt *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={workExcerpt}
                      onChange={(e) => setWorkExcerpt(e.target.value)}
                      placeholder="Punchy 1-2 sentence lead summary for card preview..."
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl p-3 text-white placeholder-zinc-500 focus:border-[#d9823e] focus:outline-none leading-relaxed"
                    />
                  </div>

                  {/* Full Description Context */}
                  <div>
                    <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
                      Full Article Description / Investigation Methodology
                    </label>
                    <textarea
                      rows={4}
                      value={workDescription}
                      onChange={(e) => setWorkDescription(e.target.value)}
                      placeholder="Detailed 2-3 paragraph background, investigation scope, source interviews, and findings..."
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl p-3 text-white placeholder-zinc-500 focus:border-[#d9823e] focus:outline-none leading-relaxed font-sans"
                    />
                  </div>

                  {/* Key Takeaways & Tags */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
                        Key Takeaways (1 per line)
                      </label>
                      <textarea
                        rows={3}
                        value={workTakeaways}
                        onChange={(e) => setWorkTakeaways(e.target.value)}
                        placeholder="Ground-level accessibility audit&#10;Interviews with state transport officials&#10;Key policy reform recommendations"
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl p-2.5 text-white placeholder-zinc-500 focus:border-[#d9823e] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        value={workTags}
                        onChange={(e) => setWorkTags(e.target.value)}
                        placeholder="Journalism, MediaEthics, Policy, FieldReport"
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-500 focus:border-[#d9823e] focus:outline-none"
                      />
                      <div className="pt-4 flex items-center">
                        <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                          <input
                            type="checkbox"
                            checked={workFeatured}
                            onChange={(e) => setWorkFeatured(e.target.checked)}
                            className="w-4 h-4 rounded text-[#d9823e] focus:ring-[#d9823e] bg-zinc-900 border-white/20"
                          />
                          <span>Pin to Featured Spotlight Section</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleCancelWorkForm}
                      className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#d9823e] hover:bg-[#c4712f] text-black font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingWorkId ? 'Save Changes' : 'Add to Portfolio'}</span>
                    </button>
                  </div>
                </form>
              )}

            </div>
          )}

          {/* TAB 2: Experience & Internships Timeline */}
          {activeTab === 'experience' && (
            <ExperienceEditorTab
              profile={profile}
              onUpdateProfile={(updated) => {
                onUpdateProfile(updated);
                setProfileForm(updated);
              }}
              onTriggerSaveToast={() => showSaveToast('Experience timeline updated!')}
            />
          )}

          {/* TAB 2.5: Certificates, Credentials & Honors */}
          {activeTab === 'certificates' && (
            <CertificatesEditorTab
              profile={profile}
              onUpdateProfile={(updated) => {
                onUpdateProfile(updated);
                setProfileForm(updated);
              }}
              onTriggerSaveToast={() => showSaveToast('Certificates & credentials updated!')}
            />
          )}

          {/* TAB 3: AI Summary Studio */}
          {activeTab === 'ai_studio' && (
            <AIWorkSummaryStudio
              works={works}
              profile={profile}
              onUpdateWork={onUpdateWork}
              onUpdateProfile={(updated) => {
                onUpdateProfile(updated);
                setProfileForm(updated);
              }}
              onTriggerSaveToast={() => showSaveToast('Applied AI summaries to portfolio!')}
            />
          )}

          {/* TAB 4: Bio & Profile Photos */}
          {activeTab === 'profile' && (
            <div className="p-6 space-y-6 text-xs text-white">
              
              <div className="border-b border-white/10 pb-4">
                <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                  <Camera className="w-5 h-5 text-[#d9823e]" />
                  <span>Profile Imagery & Bio Information</span>
                </h3>
                <p className="text-zinc-400 text-xs mt-0.5">
                  Update your official portraits (Hero & About section), bio statement, and personal philosophy.
                </p>
              </div>

              {/* Photo 1 and Photo 2 Upload Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Spot 1: Main Hero Avatar */}
                <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs flex items-center gap-1.5">
                      <User className="w-4 h-4 text-[#d9823e]" />
                      <span>Spot 1: Main Hero Portrait (Circular / Badge)</span>
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">Hero & Header</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <img
                      src={profileForm.avatarUrl}
                      alt="Hero Avatar Preview"
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-[#d9823e]/50 shadow-md bg-zinc-950 shrink-0"
                    />
                    <div className="space-y-2 flex-1">
                      <input
                        type="file"
                        ref={profileHeroFileInputRef}
                        onChange={handleProfileHeroUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => profileHeroFileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-xl bg-[#d9823e] hover:bg-[#c4712f] text-black font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload New Photo</span>
                        </button>
                        
                        {onOpenChangePhoto && (
                          <>
                            <button
                              type="button"
                              onClick={() => onOpenChangePhoto('hero', 'crop')}
                              className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-[#d9823e] border border-[#d9823e]/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                              title="Crop profile picture with zoom, pan, rotate & round avatar guide"
                            >
                              <Crop className="w-3.5 h-3.5 text-[#d9823e]" />
                              <span>Crop Profile Photo</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => onOpenChangePhoto('hero', 'source')}
                              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1 cursor-pointer border border-white/10"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-[#d9823e]" />
                              <span>Presets</span>
                            </button>
                          </>
                        )}
                      </div>
                      <input
                        type="text"
                        value={profileForm.avatarUrl}
                        onChange={(e) => setProfileForm(p => ({ ...p, avatarUrl: e.target.value }))}
                        placeholder="Or paste image URL..."
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-2.5 py-1.5 text-[11px] text-white focus:outline-none focus:border-[#d9823e]"
                      />
                    </div>
                  </div>
                </div>

                {/* Spot 2: About Me Horizontal Dispatch Image */}
                <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#d9823e]" />
                      <span>Spot 2: About Section Horizontal Dispatch Photo</span>
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">About Section</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <img
                      src={profileForm.aboutImageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop"}
                      alt="About Dispatch Preview"
                      className="w-24 h-16 rounded-xl object-cover border-2 border-white/20 shadow-md bg-zinc-950 shrink-0"
                    />
                    <div className="space-y-2 flex-1">
                      <input
                        type="file"
                        ref={profileAboutFileInputRef}
                        onChange={handleProfileAboutUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => profileAboutFileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-xl bg-[#d9823e] hover:bg-[#c4712f] text-black font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Field Photo</span>
                        </button>

                        {onOpenChangePhoto && (
                          <>
                            <button
                              type="button"
                              onClick={() => onOpenChangePhoto('about', 'crop')}
                              className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-[#d9823e] border border-[#d9823e]/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                              title="Crop field/about photo with 16:9, 4:3, or custom framing"
                            >
                              <Crop className="w-3.5 h-3.5 text-[#d9823e]" />
                              <span>Crop Field Photo (16:9)</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => onOpenChangePhoto('about', 'source')}
                              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1 cursor-pointer border border-white/10"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-[#d9823e]" />
                              <span>Presets</span>
                            </button>
                          </>
                        )}
                      </div>
                      <input
                        type="text"
                        value={profileForm.aboutImageUrl || ''}
                        onChange={(e) => setProfileForm(p => ({ ...p, aboutImageUrl: e.target.value }))}
                        placeholder="Or paste landscape image URL..."
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-2.5 py-1.5 text-[11px] text-white focus:outline-none focus:border-[#d9823e]"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Bio Form Inputs */}
              <form onSubmit={handleSaveProfile} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-[#d9823e] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
                      Professional Tagline / Descriptor *
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.tagline}
                      onChange={(e) => setProfileForm(p => ({ ...p, tagline: e.target.value }))}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-[#d9823e] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
                    Hero Summary (Main Headline Bio) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm(p => ({ ...p, bio: e.target.value }))}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl p-3 text-white focus:border-[#d9823e] focus:outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
                    Extended About Me (Detailed Narrative & Journey) *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={profileForm.extendedBio}
                    onChange={(e) => setProfileForm(p => ({ ...p, extendedBio: e.target.value }))}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl p-3 text-white focus:border-[#d9823e] focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
                      Hero Quote / Philosophy
                    </label>
                    <input
                      type="text"
                      value={profileForm.heroQuote || ''}
                      onChange={(e) => setProfileForm(p => ({ ...p, heroQuote: e.target.value }))}
                      placeholder="e.g. I don't just write stories. I bring clarity to information..."
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-[#d9823e] focus:outline-none italic text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
                      Quote Subtext
                    </label>
                    <input
                      type="text"
                      value={profileForm.quoteSubtext || ''}
                      onChange={(e) => setProfileForm(p => ({ ...p, quoteSubtext: e.target.value }))}
                      placeholder="e.g. I report stories that others overlook."
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-[#d9823e] focus:outline-none text-xs"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#d9823e] hover:bg-[#c4712f] text-black font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Profile Information</span>
                  </button>
                </div>

              </form>

            </div>
          )}

          {/* TAB 5: Socials, Substack & Links */}
          {activeTab === 'links' && (
            <div className="p-6 space-y-6 text-xs text-white">
              
              <div className="border-b border-white/10 pb-4">
                <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-[#d9823e]" />
                  <span>External Channels, Substack & Resume Links</span>
                </h3>
                <p className="text-zinc-400 text-xs mt-0.5">
                  Update your contact email, Resume Google Drive PDF link, Substack newsletter, LinkedIn, and social profiles.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
                      Primary Email Address *
                    </label>
                    <input
                      type="email"
                      value={profileForm.contact.email1}
                      onChange={(e) => setProfileForm(p => ({ ...p, contact: { ...p.contact, email1: e.target.value } }))}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-[#d9823e] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
                      Secondary Email Address
                    </label>
                    <input
                      type="email"
                      value={profileForm.contact.email2 || ''}
                      onChange={(e) => setProfileForm(p => ({ ...p, contact: { ...p.contact, email2: e.target.value } }))}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-[#d9823e] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
                      Resume PDF Link (Google Drive / Direct Link) *
                    </label>
                    <input
                      type="url"
                      value={profileForm.contact.resumeUrl}
                      onChange={(e) => setProfileForm(p => ({ ...p, contact: { ...p.contact, resumeUrl: e.target.value } }))}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs focus:border-[#d9823e] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={profileForm.contact.phone || ''}
                      onChange={(e) => setProfileForm(p => ({ ...p, contact: { ...p.contact, phone: e.target.value } }))}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-[#d9823e] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
                      Substack Newsletter Link
                    </label>
                    <input
                      type="url"
                      value={profileForm.contact.substack || ''}
                      onChange={(e) => setProfileForm(p => ({ ...p, contact: { ...p.contact, substack: e.target.value } }))}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs focus:border-[#d9823e] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
                      LinkedIn Profile Link
                    </label>
                    <input
                      type="url"
                      value={profileForm.contact.linkedin}
                      onChange={(e) => setProfileForm(p => ({ ...p, contact: { ...p.contact, linkedin: e.target.value } }))}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs focus:border-[#d9823e] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
                      Instagram Profile / Journalism Handle
                    </label>
                    <input
                      type="url"
                      value={profileForm.contact.instagram || ''}
                      onChange={(e) => setProfileForm(p => ({ ...p, contact: { ...p.contact, instagram: e.target.value } }))}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs focus:border-[#d9823e] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
                      YouTube / Showreel Video URL
                    </label>
                    <input
                      type="url"
                      value={profileForm.contact.youtube || ''}
                      onChange={(e) => setProfileForm(p => ({ ...p, contact: { ...p.contact, youtube: e.target.value } }))}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs focus:border-[#d9823e] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#d9823e] hover:bg-[#c4712f] text-black font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Contact Links</span>
                  </button>
                </div>
              </form>

            </div>
          )}

          {/* TAB 6: Reviews & Recommendations */}
          {activeTab === 'reviews' && (
            <div className="p-6 space-y-6 text-xs text-white">
              
              <div className="border-b border-white/10 pb-4">
                <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                  <MessageSquareQuote className="w-5 h-5 text-[#d9823e]" />
                  <span>Testimonials & Recommendations</span>
                </h3>
                <p className="text-zinc-400 text-xs mt-0.5">
                  Manage endorsements from editors, professors at IIMC Dhenkanal, and colleagues.
                </p>
              </div>

              {/* Add New Review Form */}
              <form onSubmit={handleSaveReview} className="p-4 rounded-2xl bg-zinc-900 border border-white/10 space-y-4">
                <h4 className="font-serif text-sm font-bold text-white flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-[#d9823e]" />
                  <span>Add New Endorsement / Recommendation</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
                      Author Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="e.g., Prof. Anand Sen"
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:border-[#d9823e] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
                      Role / Position
                    </label>
                    <input
                      type="text"
                      value={reviewRole}
                      onChange={(e) => setReviewRole(e.target.value)}
                      placeholder="e.g., Senior Editor / Faculty"
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:border-[#d9823e] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
                      Affiliation / Org
                    </label>
                    <input
                      type="text"
                      value={reviewAffiliation}
                      onChange={(e) => setReviewAffiliation(e.target.value)}
                      placeholder="e.g., IIMC / The Hans India"
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:border-[#d9823e] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-bold uppercase tracking-wider mb-1">
                    Recommendation Content *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    placeholder="Quotes or endorsement text..."
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl p-2.5 text-white focus:border-[#d9823e] focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 text-zinc-300">
                    <input
                      type="checkbox"
                      checked={reviewVerified}
                      onChange={(e) => setReviewVerified(e.target.checked)}
                      className="w-4 h-4 rounded text-[#d9823e] focus:ring-[#d9823e] bg-zinc-900 border-white/20"
                    />
                    <span>Verified LinkedIn / Academic Endorsement</span>
                  </label>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#d9823e] hover:bg-[#c4712f] text-black font-bold flex items-center gap-1.5 shadow cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Recommendation</span>
                  </button>
                </div>
              </form>

              {/* Existing Reviews List */}
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-zinc-900/60 border border-white/10 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif text-sm font-bold text-white">
                          {rev.authorName}
                        </h4>
                        <span className="text-zinc-400 text-xs">
                          • {rev.authorRole} ({rev.authorAffiliation})
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 italic">
                        "{rev.content}"
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete recommendation from ${rev.authorName}?`)) {
                          onDeleteReview(rev.id);
                          showSaveToast('Recommendation deleted');
                        }
                      }}
                      className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900 text-red-300 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 7: Security & Passcode Settings */}
          {activeTab === 'security' && (
            <div className="p-6 space-y-6 text-xs text-white">
              
              <div className="border-b border-white/10 pb-4">
                <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#d9823e]" />
                  <span>Access Control & Security Model</span>
                </h3>
                <p className="text-zinc-400 text-xs mt-0.5">
                  How your portfolio ensures only you can edit, while casual visitors and employers only view.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5 text-sm">
                    <Eye className="w-4 h-4" />
                    <span>Visitor & Recruiter Experience</span>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">
                    When you share your link with editors or recruiters, all editing badges, studio banners, and change photo buttons are hidden. They see a clean, professional, read-only showcase.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#d9823e]/15 border border-[#d9823e]/40 space-y-2">
                  <div className="font-bold text-[#d9823e] flex items-center gap-1.5 text-sm">
                    <Key className="w-4 h-4" />
                    <span>Owner Security & Password</span>
                  </div>
                  <p className="text-zinc-300 leading-relaxed text-xs">
                    Your portfolio is secured with your private owner password. You can unlock management mode anytime on any device directly on your website to edit content, upload work, and manage photos.
                  </p>
                </div>

              </div>

              {/* Mode Switcher Action */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 space-y-3">
                <h4 className="font-serif text-sm font-bold text-white">
                  Test Public Visitor View
                </h4>
                <p className="text-zinc-400 text-xs">
                  Switch to Public Mode to see exactly what external visitors, editors, and HR recruiters see.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (onSwitchMode) onSwitchMode('employer');
                      onClose();
                    }}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-white/10"
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Switch to Public Read-Only View</span>
                  </button>

                  <button
                    type="button"
                    onClick={onResetToDefaults}
                    className="px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900 text-red-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-red-800/30 ml-auto"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset to Initial Defaults</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-[#161616] flex items-center justify-between shrink-0">
          <div className="text-[11px] text-zinc-400">
            Auto-saves & syncs live to portfolio server
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs cursor-pointer"
          >
            Close Creator Studio
          </button>
        </div>

      </div>
    </div>
  );
};
