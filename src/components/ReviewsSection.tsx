import React, { useState, useRef } from 'react';
import { 
  Star, 
  MessageSquareQuote, 
  PlusCircle, 
  CheckCircle2, 
  Send, 
  Linkedin,
  Image as ImageIcon,
  ExternalLink,
  ShieldCheck,
  Upload,
  X,
  Eye,
  Trash2,
  Share2,
  Sparkles,
  Award,
  Filter
} from 'lucide-react';
import { ReviewItem } from '../types';

interface ReviewsSectionProps {
  reviews: ReviewItem[];
  onAddReview: (review: Omit<ReviewItem, 'id' | 'date'>) => void;
  onDeleteReview?: (id: string) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  onAddReview,
  onDeleteReview
}) => {
  const [showVisitorModal, setShowVisitorModal] = useState(false);
  const [showLinkedInModal, setShowLinkedInModal] = useState(false);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  
  // Screenshot Lightbox Modal State
  const [activeScreenshot, setActiveScreenshot] = useState<{ url: string; title: string } | null>(null);

  // Visitor Form State
  const [authorName, setAuthorName] = useState('');
  const [role, setRole] = useState('');
  const [organization, setOrganization] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [badge, setBadge] = useState('Editorial Mentor');

  // LinkedIn Recommendation Upload Form State
  const [liAuthorName, setLiAuthorName] = useState('');
  const [liRole, setLiRole] = useState('');
  const [liOrganization, setLiOrganization] = useState('');
  const [liProfileUrl, setLiProfileUrl] = useState('');
  const [liComment, setLiComment] = useState('');
  const [liScreenshotUrl, setLiScreenshotUrl] = useState('');
  const [liRating, setLiRating] = useState(5);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Local Image Upload for LinkedIn Screenshot
  const handleScreenshotFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploadingImage(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLiScreenshotUrl(event.target.result as string);
          setIsUploadingImage(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Visitor Review Submission
  const handleVisitorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    onAddReview({
      authorName: authorName.trim(),
      role: role.trim() || 'Reader / Professional',
      organizationOrRelation: organization.trim() || 'Media & Journalism',
      comment: comment.trim(),
      rating,
      verified: true,
      badge: badge || 'Verified Review',
      sourceUrl: sourceUrl.trim() || undefined,
      sourceType: 'direct'
    });

    setAuthorName('');
    setRole('');
    setOrganization('');
    setSourceUrl('');
    setComment('');
    setRating(5);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setShowVisitorModal(false);
    }, 1800);
  };

  // Handle LinkedIn Recommendation Submission with Screenshot
  const handleLinkedInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liAuthorName.trim()) return;

    onAddReview({
      authorName: liAuthorName.trim(),
      role: liRole.trim() || 'Colleague / Mentor',
      organizationOrRelation: liOrganization.trim() || 'LinkedIn Recommendation',
      comment: liComment.trim() || 'Recommended Ruchita Sahukari on LinkedIn.',
      rating: liRating,
      verified: true,
      badge: 'LinkedIn Recommendation',
      sourceUrl: liProfileUrl.trim() || undefined,
      screenshotUrl: liScreenshotUrl.trim() || undefined,
      sourceType: 'linkedin'
    });

    setLiAuthorName('');
    setLiRole('');
    setLiOrganization('');
    setLiProfileUrl('');
    setLiComment('');
    setLiScreenshotUrl('');
    setLiRating(5);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setShowLinkedInModal(false);
    }, 1800);
  };

  const filteredReviews = reviews.filter((r) => {
    if (filterRating === 'all') return true;
    return r.rating === filterRating;
  });

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <section id="reviews" className="py-20 bg-[#fff5f8] text-zinc-900 border-b border-pink-200/80 relative scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* If NO reviews yet: Show single unified endorsement invite card */}
        {reviews.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-pink-200 text-center space-y-6 max-w-3xl mx-auto shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-pink-100 border border-pink-200 flex items-center justify-center text-pink-600 mx-auto">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900">
                Share an Endorsement for Ruchita
              </h3>
              <p className="text-sm text-zinc-600 max-w-lg mx-auto leading-relaxed">
                Have you worked with Ruchita, read her ground reports, or collaborated on editorial projects? Leave your review directly on the site, or add your verified LinkedIn recommendation!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                id="leave-feedback-btn-empty"
                onClick={() => setShowVisitorModal(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 text-white font-bold text-xs tracking-wide transition-all shadow-md shadow-pink-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Write a Recommendation on Site</span>
              </button>

              <button
                id="add-linkedin-screenshot-btn-empty"
                onClick={() => setShowLinkedInModal(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-900 font-semibold text-xs tracking-wide border border-pink-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Linkedin className="w-4 h-4 text-[#0077b5]" />
                <span>Add LinkedIn Screenshot & Quote</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Section Header when reviews exist */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6 border-b border-pink-200/80 pb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquareQuote className="w-4 h-4 text-pink-600" />
                  <span className="text-xs uppercase tracking-widest text-pink-700 font-bold">
                    COMMUNITY & PEER ENDORSEMENTS
                  </span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 tracking-tight">
                  Recommendations & Reviews
                </h2>
                <p className="text-sm sm:text-base text-zinc-600 mt-2 max-w-2xl font-sans">
                  Verified testimonials and endorsements from faculty mentors, newsroom peers, readers, and professional collaborators.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="px-3.5 py-2 rounded-xl bg-white border border-pink-200 shadow-sm flex items-center gap-2.5">
                  <div className="flex items-center gap-1 text-pink-500">
                    <Star className="w-4 h-4 fill-pink-500" />
                    <span className="text-sm font-bold text-zinc-900">{averageRating}</span>
                  </div>
                  <span className="text-xs text-zinc-500">
                    ({reviews.length} {reviews.length === 1 ? 'Endorsement' : 'Endorsements'})
                  </span>
                </div>

                <button
                  id="add-linkedin-screenshot-btn"
                  onClick={() => setShowLinkedInModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-pink-50 text-zinc-800 border border-pink-200 hover:border-pink-300 text-xs font-semibold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                  title="Add a recommendation received on LinkedIn with an attached screenshot"
                >
                  <Linkedin className="w-4 h-4 text-[#0077b5]" />
                  <span>Add LinkedIn Recommendation</span>
                </button>

                <button
                  id="leave-feedback-btn"
                  onClick={() => setShowVisitorModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 text-white font-bold text-xs transition-all shadow-md shadow-pink-500/20 flex items-center gap-2 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Write a Recommendation</span>
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mr-2 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                Filter:
              </span>
              <button
                onClick={() => setFilterRating('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  filterRating === 'all'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-sm'
                    : 'bg-white text-zinc-600 hover:text-zinc-900 border border-pink-200'
                }`}
              >
                All ({reviews.length})
              </button>
              {[5, 4, 3].map((r) => (
                <button
                  key={r}
                  onClick={() => setFilterRating(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                    filterRating === r
                      ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-sm'
                      : 'bg-white text-zinc-600 hover:text-zinc-900 border border-pink-200'
                  }`}
                >
                  <span>{r}</span>
                  <Star className="w-3 h-3 fill-current" />
                </button>
              ))}
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredReviews.map((rev) => (
                <div
                  key={rev.id}
                  id={`review-card-${rev.id}`}
                  className="p-6 sm:p-7 rounded-2xl bg-white border border-pink-200 hover:border-pink-400 transition-all flex flex-col justify-between space-y-4 relative shadow-sm hover:shadow-xl hover:shadow-pink-500/10 group"
                >
                  <div className="space-y-3">
                    
                    {/* Top Row: Stars and Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < rev.rating
                                ? 'text-pink-500 fill-pink-500'
                                : 'text-pink-200'
                            }`}
                          />
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        {rev.sourceType === 'linkedin' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#0077b5]/10 border border-[#0077b5]/30 text-[10px] font-bold text-[#0077b5] flex items-center gap-1">
                            <Linkedin className="w-3 h-3 text-[#0077b5]" />
                            <span>LinkedIn Recommendation</span>
                          </span>
                        )}

                        {rev.badge && rev.sourceType !== 'linkedin' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-pink-100 border border-pink-200 text-[10px] font-bold text-pink-700 uppercase tracking-wider">
                            {rev.badge}
                          </span>
                        )}

                        {onDeleteReview && (
                          <button
                            onClick={() => onDeleteReview(rev.id)}
                            className="p-1 rounded text-zinc-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            title="Delete Recommendation"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Comment text */}
                    {rev.comment && (
                      <p className="font-editorial text-sm sm:text-base text-zinc-800 leading-relaxed italic">
                        "{rev.comment}"
                      </p>
                    )}

                    {/* Attached LinkedIn Screenshot Preview (if available) */}
                    {rev.screenshotUrl && (
                      <div className="mt-3 pt-3 border-t border-pink-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-semibold text-zinc-500 flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5 text-pink-600" />
                            Verified Screenshot Proof
                          </span>
                          <button
                            onClick={() => setActiveScreenshot({ url: rev.screenshotUrl!, title: `${rev.authorName}'s LinkedIn Recommendation` })}
                            className="text-[11px] text-pink-600 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View Full Image</span>
                          </button>
                        </div>
                        <div 
                          onClick={() => setActiveScreenshot({ url: rev.screenshotUrl!, title: `${rev.authorName}'s LinkedIn Recommendation` })}
                          className="relative rounded-xl overflow-hidden border border-pink-200 cursor-pointer max-h-48 group/img"
                        >
                          <img 
                            src={rev.screenshotUrl} 
                            alt={`LinkedIn recommendation by ${rev.authorName}`}
                            className="w-full h-auto object-cover group-hover/img:scale-102 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-pink-900/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold backdrop-blur-xs">
                            <Eye className="w-4 h-4" />
                            <span>Click to Zoom</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Author Footer */}
                  <div className="pt-4 border-t border-pink-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-pink-100 border border-pink-200 flex items-center justify-center text-pink-700 font-bold text-xs">
                        {rev.authorName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                          <span>{rev.authorName}</span>
                          {rev.verified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" title="Verified Review" />
                          )}
                          {rev.sourceUrl && (
                            <a 
                              href={rev.sourceUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-zinc-400 hover:text-[#0077b5] transition-colors"
                              title="View LinkedIn Profile"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-500">
                          {rev.role} &bull; <span className="text-zinc-400">{rev.organizationOrRelation}</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] text-zinc-400 font-mono">
                      {rev.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>

      {/* MODAL 1: Write Review On-Site (For Visitors, Mentors, Peers) */}
      {showVisitorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-pink-200 p-6 sm:p-8 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-pink-100 pb-4">
              <div className="flex items-center gap-2">
                <MessageSquareQuote className="w-5 h-5 text-pink-600" />
                <h3 className="font-serif text-xl font-bold text-zinc-900">
                  Write a Recommendation / Review
                </h3>
              </div>
              <button
                onClick={() => setShowVisitorModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submittedSuccess ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="font-serif text-lg font-bold text-zinc-900">Thank You for Your Endorsement!</h4>
                <p className="text-xs text-zinc-500">Your review has been saved and added to Ruchita's portfolio showcase.</p>
              </div>
            ) : (
              <form onSubmit={handleVisitorSubmit} className="space-y-4 text-xs">
                
                {/* Name */}
                <div>
                  <label className="block text-zinc-700 font-bold uppercase tracking-wider mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Prof. Anand Pradhan / John Doe"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-pink-500 focus:bg-white"
                  />
                </div>

                {/* Role & Org */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-700 font-bold uppercase tracking-wider mb-1">
                      Your Role / Designation
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Senior Editor / Faculty"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-pink-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-700 font-bold uppercase tracking-wider mb-1">
                      Organization / Affiliation
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., IIMC / The Hans India"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-pink-500 focus:bg-white"
                    />
                  </div>
                </div>

                {/* LinkedIn Profile or Link */}
                <div>
                  <label className="block text-zinc-700 font-bold uppercase tracking-wider mb-1">
                    Your LinkedIn Profile / Website URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.linkedin.com/in/yourprofile"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-pink-500 focus:bg-white"
                  />
                </div>

                {/* Star Rating & Category Badge */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-700 font-bold uppercase tracking-wider mb-1">
                      Rating
                    </label>
                    <div className="flex items-center gap-1 py-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          className="p-1 text-zinc-300 hover:text-pink-500 cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= rating
                                ? 'text-pink-500 fill-pink-500'
                                : 'text-zinc-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-700 font-bold uppercase tracking-wider mb-1">
                      Relationship / Category
                    </label>
                    <select
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3 py-2 text-zinc-900 focus:outline-none focus:border-pink-500"
                    >
                      <option value="Editorial Mentor">Editorial Mentor / Faculty</option>
                      <option value="Project Collaborator">Project Peer / Collaborator</option>
                      <option value="Substack Reader">Reader / Audience</option>
                      <option value="Media Professional">Media Recruiter / Editor</option>
                      <option value="Colleague">Colleague</option>
                    </select>
                  </div>
                </div>

                {/* Feedback Comment */}
                <div>
                  <label className="block text-zinc-700 font-bold uppercase tracking-wider mb-1">
                    Your Recommendation / Feedback *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Share your experience working with Ruchita, your feedback on her reporting craft, or your thoughts on her publications..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-pink-50/50 border border-pink-200 rounded-xl p-3 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-pink-500 focus:bg-white"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-3 border-t border-pink-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowVisitorModal(false)}
                    className="px-4 py-2 rounded-xl bg-pink-50 text-zinc-700 hover:bg-pink-100 border border-pink-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 text-white font-bold flex items-center gap-1.5 shadow-md shadow-pink-500/20 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Recommendation</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

      {/* MODAL 2: Add LinkedIn Recommendation (+ Screenshot Upload) */}
      {showLinkedInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-pink-200 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-pink-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#0077b5]/15 text-[#0077b5]">
                  <Linkedin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-zinc-900">
                    Add LinkedIn Recommendation
                  </h3>
                  <p className="text-xs text-zinc-500">Add recommendation text and attach a screenshot from LinkedIn</p>
                </div>
              </div>
              <button
                onClick={() => setShowLinkedInModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submittedSuccess ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="font-serif text-lg font-bold text-zinc-900">LinkedIn Recommendation Added!</h4>
                <p className="text-xs text-zinc-500">The verified recommendation and screenshot are now featured in your portfolio.</p>
              </div>
            ) : (
              <form onSubmit={handleLinkedInSubmit} className="space-y-4 text-xs">
                
                {/* Recommender Name */}
                <div>
                  <label className="block text-zinc-700 font-bold uppercase tracking-wider mb-1">
                    Recommender's Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., John Smith"
                    value={liAuthorName}
                    onChange={(e) => setLiAuthorName(e.target.value)}
                    className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#0077b5] focus:bg-white"
                  />
                </div>

                {/* Role & Org */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-700 font-bold uppercase tracking-wider mb-1">
                      Their Role / Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Senior Producer / Mentor"
                      value={liRole}
                      onChange={(e) => setLiRole(e.target.value)}
                      className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#0077b5] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-700 font-bold uppercase tracking-wider mb-1">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Media Network / IIMC"
                      value={liOrganization}
                      onChange={(e) => setLiOrganization(e.target.value)}
                      className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#0077b5] focus:bg-white"
                    />
                  </div>
                </div>

                {/* LinkedIn Profile URL */}
                <div>
                  <label className="block text-zinc-700 font-bold uppercase tracking-wider mb-1">
                    Their LinkedIn Profile URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.linkedin.com/in/..."
                    value={liProfileUrl}
                    onChange={(e) => setLiProfileUrl(e.target.value)}
                    className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#0077b5] focus:bg-white"
                  />
                </div>

                {/* Screenshot Upload / Image Link */}
                <div className="p-3.5 rounded-xl bg-pink-50/50 border border-pink-200 space-y-3">
                  <label className="block text-zinc-700 font-bold uppercase tracking-wider">
                    Upload Recommendation Screenshot
                  </label>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleScreenshotFileUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2.5 rounded-xl bg-white hover:bg-pink-100 text-zinc-800 font-semibold flex items-center justify-center gap-2 transition-all border border-pink-200 cursor-pointer shadow-sm"
                    >
                      <Upload className="w-4 h-4 text-[#0077b5]" />
                      <span>{isUploadingImage ? 'Uploading...' : 'Choose Screenshot File'}</span>
                    </button>
                    
                    <span className="text-zinc-500 self-center text-[11px]">or enter URL:</span>

                    <input
                      type="url"
                      placeholder="Paste Image URL"
                      value={liScreenshotUrl}
                      onChange={(e) => setLiScreenshotUrl(e.target.value)}
                      className="flex-1 bg-white border border-pink-200 rounded-xl px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#0077b5]"
                    />
                  </div>

                  {liScreenshotUrl && (
                    <div className="relative rounded-lg overflow-hidden border border-pink-200 max-h-36">
                      <img 
                        src={liScreenshotUrl} 
                        alt="Screenshot Preview" 
                        className="w-full h-auto object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setLiScreenshotUrl('')}
                        className="absolute top-2 right-2 p-1 bg-black/70 hover:bg-black text-white rounded-full cursor-pointer"
                        title="Remove screenshot"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Recommendation Text */}
                <div>
                  <label className="block text-zinc-700 font-bold uppercase tracking-wider mb-1">
                    Recommendation Text (Transcribed from LinkedIn)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Paste the recommendation text written by this person on LinkedIn..."
                    value={liComment}
                    onChange={(e) => setLiComment(e.target.value)}
                    className="w-full bg-pink-50/50 border border-pink-200 rounded-xl p-3 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#0077b5] focus:bg-white"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-3 border-t border-pink-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowLinkedInModal(false)}
                    className="px-4 py-2 rounded-xl bg-pink-50 text-zinc-700 hover:bg-pink-100 border border-pink-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#0077b5] hover:bg-[#005582] text-white font-bold flex items-center gap-1.5 shadow-md shadow-[#0077b5]/30 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Save LinkedIn Recommendation</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

      {/* MODAL 3: Lightbox Preview for Screenshot */}
      {activeScreenshot && (
        <div 
          onClick={() => setActiveScreenshot(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white p-2 rounded-2xl border border-pink-200 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-3 border-b border-pink-100 text-xs font-semibold text-zinc-900">
              <span className="flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-[#0077b5]" />
                {activeScreenshot.title}
              </span>
              <button
                onClick={() => setActiveScreenshot(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-auto max-h-[80vh] p-2">
              <img 
                src={activeScreenshot.url} 
                alt={activeScreenshot.title}
                className="w-full h-auto rounded-lg object-contain" 
              />
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
