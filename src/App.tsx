/**
 * Copyright (c) 2026 Ruchita Sahukari. All Rights Reserved.
 *
 * PROPRIETARY AND CONFIDENTIAL:
 * This source code, interface designs, visual styling, and editorial portfolio 
 * materials are the exclusive property of Ruchita Sahukari. Unauthorized copying,
 * reproduction, cloning, or recreation of this application or code without prior
 * written consent is strictly prohibited.
 */

import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, WorkItem, ReviewItem, WorkCategory, PortfolioMode } from './types';
import { INITIAL_USER_PROFILE, INITIAL_WORKS, INITIAL_REVIEWS } from './data/initialData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ValuesBanner } from './components/ValuesBanner';
import { WorkShowcase } from './components/WorkShowcase';
import { JournalismSection } from './components/JournalismSection';
import { TheLitScrollSection } from './components/TheLitScrollSection';
import { SubstackSection } from './components/SubstackSection';
import { CommunicationsSection } from './components/CommunicationsSection';
import { AboutExperienceSection } from './components/AboutExperienceSection';
import { ReviewsSection } from './components/ReviewsSection';
import { ContactSection } from './components/ContactSection';
import { StoryModal } from './components/StoryModal';
import { PortfolioEditorModal } from './components/PortfolioEditorModal';
import { ChangePhotoModal, PhotoTargetSpot } from './components/ChangePhotoModal';
import { ShareLinksModal } from './components/ShareLinksModal';
import { UnlockEditorModal } from './components/UnlockEditorModal';
import { Footer } from './components/Footer';
import { CheckCircle2, Sparkles, Camera, Briefcase, Eye, Key, ArrowLeft, Globe, Loader2 } from 'lucide-react';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const STORAGE_KEY_PROFILE = 'ruchita_portfolio_profile_v11';
const STORAGE_KEY_WORKS = 'ruchita_portfolio_works_v13';
const STORAGE_KEY_REVIEWS = 'ruchita_portfolio_reviews_v2';
const SESSION_KEY_ADMIN = 'ruchita_admin_unlocked';
const LOCAL_STORAGE_KEY_ADMIN = 'ruchita_owner_unlocked_v1';

function PortfolioAppContent() {
  const { isDark } = useTheme();

  // Determine if visitor is Ruchita (Owner / Editor) or an Employer/Public Visitor
  const [mode, setMode] = useState<PortfolioMode>(() => {
    if (typeof window === 'undefined') return 'public';
    try {
      const params = new URLSearchParams(window.location.search);
      const isParamEditor = 
        params.get('studio') === 'ruchita' ||
        params.get('studio') === 'true' ||
        params.has('studio') ||
        params.get('edit') === 'ruchita' ||
        params.get('admin') === 'ruchita' ||
        params.get('edit') === 'true' ||
        params.get('admin') === 'true' ||
        params.get('mode') === 'editor' ||
        params.get('mode') === 'studio';

      if (isParamEditor) {
        sessionStorage.setItem(SESSION_KEY_ADMIN, 'true');
        localStorage.setItem(LOCAL_STORAGE_KEY_ADMIN, 'true');
        return 'editor';
      }
      
      const isStoredOwner = 
        sessionStorage.getItem(SESSION_KEY_ADMIN) === 'true' ||
        localStorage.getItem(LOCAL_STORAGE_KEY_ADMIN) === 'true';
      return isStoredOwner ? 'editor' : 'public';
    } catch {
      return 'public';
    }
  });

  // Load State from LocalStorage or Fallback to Initial Data
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.experience)) {
          parsed.experience = parsed.experience.filter(
            (e: any) => !(e.role && e.role.includes('The Eastern Lens'))
          );
        }
        return parsed;
      }
      return INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  });

  const [works, setWorks] = useState<WorkItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WORKS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(
            w => w.id !== 'research-accessibility-audit' && 
                 w.id !== 'the-eastern-lens-magazine' &&
                 !(w.title && w.title.toLowerCase().includes('eastern lens')) &&
                 !(w.title && w.title.toLowerCase().includes('universal accessibility') && w.title.toLowerCase().includes('barrier-free'))
          );
          return filtered;
        }
      }
      return INITIAL_WORKS;
    } catch {
      return INITIAL_WORKS;
    }
  });

  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REVIEWS);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // UI State
  const [activeCategory, setActiveCategory] = useState<WorkCategory>('all');
  const [selectedStory, setSelectedStory] = useState<WorkItem | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const params = new URLSearchParams(window.location.search);
      return (
        params.has('studio') ||
        params.get('edit') === 'ruchita' ||
        params.get('admin') === 'ruchita' ||
        params.get('mode') === 'editor'
      );
    } catch {
      return false;
    }
  });
  const [isChangePhotoOpen, setIsChangePhotoOpen] = useState(false);
  const [photoModalTarget, setPhotoModalTarget] = useState<PhotoTargetSpot>('hero');
  const [photoModalTab, setPhotoModalTab] = useState<'source' | 'crop'>('source');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isInitialMount = useRef(true);

  // Show a temporary toast banner
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Sync state for live publication
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');
  const [isPublishingLive, setIsPublishingLive] = useState(false);

  // 1. Initial Load: Fetch latest saved portfolio data from server (so all visitors get the updated content & photos)
  useEffect(() => {
    async function loadServerData() {
      try {
        const res = await fetch('/api/portfolio');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const isUnwanted = (w: WorkItem) =>
              w.id === 'research-accessibility-audit' ||
              w.id === 'the-eastern-lens-magazine' ||
              Boolean(w.title && w.title.toLowerCase().includes('eastern lens')) ||
              Boolean(w.title && w.title.toLowerCase().includes('universal accessibility') && w.title.toLowerCase().includes('barrier-free'));

            const serverWorks: WorkItem[] = (Array.isArray(json.data.works) ? json.data.works : []).filter(w => !isUnwanted(w));

            if (json.data.profile && Array.isArray(json.data.profile.experience)) {
              json.data.profile.experience = json.data.profile.experience.filter(
                (e: any) => !(e.role && e.role.includes('The Eastern Lens'))
              );
            }
            
            // Check if this PC's local storage contains works that are not yet on the server
            let localWorks: WorkItem[] = [];
            try {
              const saved = localStorage.getItem(STORAGE_KEY_WORKS);
              if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                  localWorks = parsed.filter(w => !isUnwanted(w));
                  localStorage.setItem(STORAGE_KEY_WORKS, JSON.stringify(localWorks));
                }
              }
            } catch {}

            const serverWorkIds = new Set(serverWorks.map(w => w.id));
            const serverWorkTitles = new Set(serverWorks.map(w => w.title?.toLowerCase().trim()));
            const localExtraWorks = localWorks.filter(
              lw => !serverWorkIds.has(lw.id) && !serverWorkTitles.has(lw.title?.toLowerCase().trim())
            );

            if (localExtraWorks.length > 0) {
              console.log(`Discovered ${localExtraWorks.length} uploaded work(s) in local PC storage not yet on server. Merging and publishing live...`);
              const mergedWorks = [...localExtraWorks, ...serverWorks];
              setWorks(mergedWorks);
              const mergedProfile = json.data.profile || profile;
              const mergedReviews = json.data.reviews || reviews;
              if (json.data.profile) setProfile(json.data.profile);
              if (json.data.reviews) setReviews(json.data.reviews);
              
              // Immediately publish the merged list to the live server
              syncToServer(mergedProfile, mergedWorks, mergedReviews, false);
            } else if (serverWorks.length > 0) {
              setWorks(serverWorks);
              localStorage.setItem(STORAGE_KEY_WORKS, JSON.stringify(serverWorks));
              if (json.data.profile) {
                setProfile(json.data.profile);
                localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(json.data.profile));
              }
              if (json.data.reviews && Array.isArray(json.data.reviews)) {
                setReviews(json.data.reviews);
                localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(json.data.reviews));
              }
              setSyncStatus('synced');
            }
          } else {
            // Server has no saved portfolio data yet (e.g., fresh container start)
            // Check if this PC has uploaded works stored in localStorage
            let localWorks: WorkItem[] = [];
            try {
              const saved = localStorage.getItem(STORAGE_KEY_WORKS);
              if (saved) localWorks = JSON.parse(saved);
            } catch {}

            if (localWorks.length > 0) {
              console.log(`Publishing ${localWorks.length} works from local PC storage to live server...`);
              syncToServer(profile, localWorks, reviews, false);
            }
          }
        }
      } catch (err) {
        console.warn('Could not load portfolio from server, using local/default cache', err);
      }
    }
    loadServerData();
  }, []);

  // 2. Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn("Storage sync failed", e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WORKS, JSON.stringify(works));
    } catch (e) {
      console.warn("Storage sync failed", e);
    }
  }, [works]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
    } catch (e) {
      console.warn("Storage sync failed", e);
    }
  }, [reviews]);

  // 3. Persistent Sync to Server when Admin edits content or photos
  const syncToServer = async (
    updatedProfile: UserProfile = profile, 
    updatedWorks: WorkItem[] = works, 
    updatedReviews: ReviewItem[] = reviews,
    showSuccessToast = true
  ): Promise<boolean> => {
    setIsPublishingLive(true);
    setSyncStatus('syncing');
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: updatedProfile,
          works: updatedWorks,
          reviews: updatedReviews
        })
      });
      if (res.ok) {
        setSyncStatus('synced');
        setIsPublishingLive(false);
        if (showSuccessToast) {
          showToast(`Published live! All ${updatedWorks.length} works are now visible to everyone.`);
        }
        return true;
      } else {
        const errJson = await res.json().catch(() => ({}));
        setSyncStatus('error');
        setIsPublishingLive(false);
        showToast(`Sync warning: ${errJson.error || res.statusText}. Click "Publish Live" to retry.`);
        return false;
      }
    } catch (err) {
      console.warn('Server sync error', err);
      setSyncStatus('error');
      setIsPublishingLive(false);
      showToast('Network error while publishing. Please check connection and click "Publish Live".');
      return false;
    }
  };

  const handlePublishLive = async () => {
    return await syncToServer(profile, works, reviews, true);
  };

  // Handlers for Managing Works & Profile Photos (2 Distinct Spots)
  const handleSavePhoto = (target: PhotoTargetSpot, newUrl: string) => {
    const updated = {
      ...profile,
      ...(target === 'hero' ? { avatarUrl: newUrl } : { aboutImageUrl: newUrl })
    };
    setProfile(updated);
    syncToServer(updated, works, reviews);
  };

  const handleSaveBothPhotos = (heroUrl: string, aboutUrl: string) => {
    const updated = {
      ...profile,
      avatarUrl: heroUrl,
      aboutImageUrl: aboutUrl
    };
    setProfile(updated);
    syncToServer(updated, works, reviews);
  };

  const handleUpdateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    syncToServer(newProfile, works, reviews);
  };

  const handleAddWork = (newWork: WorkItem) => {
    const updated = [newWork, ...works];
    setWorks(updated);
    syncToServer(profile, updated, reviews);
  };

  const handleUpdateWork = (updatedWork: WorkItem) => {
    const updated = works.map(w => w.id === updatedWork.id ? updatedWork : w);
    setWorks(updated);
    syncToServer(profile, updated, reviews);
  };

  const handleDeleteWork = (id: string) => {
    const updated = works.filter(w => w.id !== id);
    setWorks(updated);
    syncToServer(profile, updated, reviews);
  };

  const handleAddReview = (newReview: Omit<ReviewItem, 'id' | 'date'>) => {
    const reviewItem: ReviewItem = {
      ...newReview,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };
    const updated = [reviewItem, ...reviews];
    setReviews(updated);
    syncToServer(profile, works, updated);
  };

  const handleDeleteReview = (id: string) => {
    const updated = reviews.filter(r => r.id !== id);
    setReviews(updated);
    syncToServer(profile, works, updated);
  };

  const handleResetToDefaults = async () => {
    setProfile(INITIAL_USER_PROFILE);
    setWorks(INITIAL_WORKS);
    setReviews(INITIAL_REVIEWS);
    localStorage.removeItem(STORAGE_KEY_PROFILE);
    localStorage.removeItem(STORAGE_KEY_WORKS);
    localStorage.removeItem(STORAGE_KEY_REVIEWS);
    try {
      await fetch('/api/portfolio/reset', { method: 'POST' });
    } catch {}
    showToast('Reset portfolio to initial defaults.');
  };

  const handleSwitchMode = (targetMode: PortfolioMode) => {
    setMode(targetMode);
    if (targetMode === 'editor') {
      sessionStorage.setItem(SESSION_KEY_ADMIN, 'true');
      localStorage.setItem(LOCAL_STORAGE_KEY_ADMIN, 'true');
      showToast('👑 Owner Studio Unlocked — You can now edit and manage your portfolio directly on your website!');
    } else {
      sessionStorage.removeItem(SESSION_KEY_ADMIN);
      localStorage.removeItem(LOCAL_STORAGE_KEY_ADMIN);
      showToast('Switched to Employer View (All edit controls hidden).');
    }
  };

  const handleFilterAndScroll = (category: WorkCategory) => {
    setActiveCategory(category);
    const targetElement = document.getElementById('work');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filtered subsets for dedicated sections
  const journalismWorks = works.filter(w => w.category === 'journalism');
  const litScrollWorks = works.filter(w => w.category === 'the_lit_scroll');
  const substackWorks = works.filter(w => w.category === 'substack');

  const isEditor = mode === 'editor';

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-[#0d0c12] text-[#f5f3ef]' : 'bg-[#fff5f7] text-[#2d1b24]'} font-sans selection:bg-pink-200 selection:text-pink-900 dark:selection:bg-pink-900 dark:selection:text-pink-100 relative transition-colors duration-200`}>
      
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div 
          id="global-toast-notification"
          className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-white border border-pink-300 shadow-xl text-zinc-900 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <Sparkles className="w-4 h-4 text-pink-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Fixed Navigation (Unified Single Masthead) */}
      <Navbar 
        profile={profile}
        mode={mode}
        onOpenEditor={() => setIsEditorOpen(true)}
        onOpenChangePhoto={isEditor ? () => {
          setPhotoModalTarget('hero');
          setIsChangePhotoOpen(true);
        } : undefined}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onSwitchMode={handleSwitchMode}
        onOpenUnlockModal={() => setIsUnlockModalOpen(true)}
        worksCount={works.length}
        onPublishLive={handlePublishLive}
        isPublishingLive={isPublishingLive}
        syncStatus={syncStatus}
      />

      <main id="main-content">
        
        {/* 1. Hero Section with 3-Pillar Foundation (Spot 1 Photo) */}
        <HeroSection 
          profile={profile}
          onFilterCategory={handleFilterAndScroll}
          onOpenChangePhoto={isEditor ? () => {
            setPhotoModalTarget('hero');
            setIsChangePhotoOpen(true);
          } : undefined}
          onOpenAddWork={isEditor ? () => setIsEditorOpen(true) : undefined}
        />

        {/* 2. "What Drives Me" Values Banner */}
        <ValuesBanner values={profile.values} />

        {/* 3. Filterable Master Work Showcase with Search & Quick Preview */}
        <WorkShowcase 
          works={works}
          activeCategory={activeCategory}
          mode={mode}
          onSelectCategory={setActiveCategory}
          onSelectWork={(work) => setSelectedStory(work)}
          onOpenAddModal={isEditor ? () => setIsEditorOpen(true) : undefined}
        />

        {/* 4. The Hans India & National Reporting Bylines */}
        <JournalismSection 
          journalismWorks={journalismWorks}
          onSelectWork={(work) => setSelectedStory(work)}
          onOpenAddWork={isEditor ? () => setIsEditorOpen(true) : undefined}
        />

        {/* 5. Dedicated "The Lit Scroll" (Group E Academic Journalism & PTC Shorts) */}
        <TheLitScrollSection 
          profile={profile}
          litScrollWorks={litScrollWorks}
          onSelectWork={(work) => setSelectedStory(work)}
        />

        {/* 6. Substack In-Depth Publications & Long-form Essays */}
        <SubstackSection 
          substackWorks={substackWorks}
          onSelectWork={(work) => setSelectedStory(work)}
        />

        {/* 7. Content & Corporate Communications Matrix */}
        <CommunicationsSection />

        {/* 8. About Me & Education/Experience Timeline (Spot 2 Photo) */}
        <AboutExperienceSection 
          profile={profile} 
          onOpenChangePhoto={isEditor ? () => {
            setPhotoModalTarget('about');
            setIsChangePhotoOpen(true);
          } : undefined}
          onOpenAddExperience={isEditor ? () => setIsEditorOpen(true) : undefined}
          onOpenAddCertificate={isEditor ? () => setIsEditorOpen(true) : undefined}
        />

        {/* 9. Testimonials, Recommendations & Feedback Hub */}
        <ReviewsSection 
          reviews={reviews}
          onAddReview={handleAddReview}
          onDeleteReview={isEditor ? handleDeleteReview : undefined}
        />

        {/* 10. Contact, Social Hub & "Know More" Resume Showcase */}
        <ContactSection profile={profile} />

      </main>

      {/* Editorial Footer */}
      <Footer 
        profile={profile} 
        currentMode={mode}
        onOpenUnlockModal={() => setIsUnlockModalOpen(true)}
      />

      {/* Interactive Story Reader / Quick Preview Modal */}
      <StoryModal 
        work={selectedStory}
        onClose={() => setSelectedStory(null)}
      />

      {/* Profile Photo Quick Changer Modal (Supports Both Spot 1 & Spot 2 with Crop Studio) */}
      <ChangePhotoModal 
        isOpen={isChangePhotoOpen}
        onClose={() => setIsChangePhotoOpen(false)}
        currentHeroUrl={profile.avatarUrl}
        currentAboutUrl={profile.aboutImageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop"}
        initialTarget={photoModalTarget}
        initialTab={photoModalTab}
        onSavePhoto={handleSavePhoto}
        onSaveBothPhotos={handleSaveBothPhotos}
        userName={profile.name}
      />

      {/* Share Portfolio & Direct Links Hub Modal */}
      <ShareLinksModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onOpenEditor={() => setIsEditorOpen(true)}
        onSwitchMode={handleSwitchMode}
        currentMode={mode}
      />

      {/* Admin Passcode Unlock Modal */}
      <UnlockEditorModal 
        isOpen={isUnlockModalOpen}
        onClose={() => setIsUnlockModalOpen(false)}
        onConfirmSwitch={handleSwitchMode}
        currentMode={mode}
      />

      {/* Portfolio Add / Edit Manager Modal */}
      <PortfolioEditorModal 
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        profile={profile}
        works={works}
        reviews={reviews}
        onUpdateProfile={handleUpdateProfile}
        onAddWork={handleAddWork}
        onUpdateWork={handleUpdateWork}
        onDeleteWork={handleDeleteWork}
        onAddReview={handleAddReview}
        onDeleteReview={handleDeleteReview}
        onResetToDefaults={handleResetToDefaults}
        onSwitchMode={handleSwitchMode}
        onOpenChangePhoto={(target, tab) => {
          setPhotoModalTarget(target || 'hero');
          setPhotoModalTab(tab || 'crop');
          setIsEditorOpen(false);
          setIsChangePhotoOpen(true);
        }}
        onPublishLive={handlePublishLive}
        isPublishingLive={isPublishingLive}
        syncStatus={syncStatus}
      />

      {/* Floating On-Site Owner Dock (Visible when unlocked in Owner Mode) */}
      {isEditor && (
        <aside 
          id="floating-owner-cms-dock"
          aria-label="Owner website content management controls"
          className="fixed bottom-6 right-6 z-40 p-1.5 rounded-2xl bg-white/95 border border-pink-300 shadow-2xl backdrop-blur-md flex items-center gap-1.5 text-xs animate-in fade-in slide-in-from-bottom-3 duration-300"
        >
          <button
            id="floating-upload-work-btn"
            onClick={() => setIsEditorOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 hover:brightness-105 text-white font-extrabold flex items-center gap-1.5 shadow-md shadow-pink-500/25 border border-pink-300/40 cursor-pointer transition-transform hover:scale-105"
            title="Upload new article, byline, internship, or role"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>+ Upload Work</span>
          </button>

          {/* Quick 1-Click Publish Live to All Visitors */}
          <button
            id="floating-publish-live-btn"
            onClick={handlePublishLive}
            disabled={isPublishingLive}
            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 border border-emerald-400/40 cursor-pointer transition-transform hover:scale-105 disabled:opacity-50"
            title="Publish all works live to web so external visitors and other devices can see them immediately"
          >
            {isPublishingLive ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Globe className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">
              {isPublishingLive ? 'Publishing...' : 'Publish Live'}
            </span>
          </button>

          <button
            id="floating-crop-photos-btn"
            onClick={() => {
              setPhotoModalTarget('hero');
              setPhotoModalTab('crop');
              setIsChangePhotoOpen(true);
            }}
            className="px-3 py-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-900 border border-pink-200 font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            title="Crop & adjust profile photo or field photo"
          >
            <Camera className="w-3.5 h-3.5 text-pink-600" />
            <span className="hidden sm:inline">Crop</span><span>Photos</span>
          </button>

          <button
            id="floating-manage-portfolio-btn"
            onClick={() => setIsEditorOpen(true)}
            className="px-3 py-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-900 border border-pink-200 font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            title="Manage bio, experiences, skills, and links"
          >
            <Briefcase className="w-3.5 h-3.5 text-pink-600" />
            <span className="hidden sm:inline">Edit</span><span>Portfolio</span>
          </button>

          {/* Dedicated Back / Exit Button Once Done with Work */}
          <button
            id="floating-done-back-btn"
            onClick={() => handleSwitchMode('public')}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-pink-50 text-zinc-800 hover:text-pink-900 border border-pink-300 font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm active:scale-95"
            title="Done editing — return to clean public portfolio website (locks editor & hides controls)"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-pink-600" />
            <span>Done / Back to Site</span>
          </button>
        </aside>
      )}

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PortfolioAppContent />
    </ThemeProvider>
  );
}
