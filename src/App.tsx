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
import { CheckCircle2, Sparkles, Camera, Briefcase, Eye, Key, ArrowLeft } from 'lucide-react';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const STORAGE_KEY_PROFILE = 'ruchita_portfolio_profile_v10';
const STORAGE_KEY_WORKS = 'ruchita_portfolio_works_v12';
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
      return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  });

  const [works, setWorks] = useState<WorkItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WORKS);
      if (saved) {
        return JSON.parse(saved);
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

  // 1. Initial Load: Fetch latest saved portfolio data from server (so all visitors get the updated content & photos)
  useEffect(() => {
    async function loadServerData() {
      try {
        const res = await fetch('/api/portfolio');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            if (json.data.profile) setProfile(json.data.profile);
            if (json.data.works && Array.isArray(json.data.works) && json.data.works.length > 0) {
              setWorks(json.data.works);
            }
            if (json.data.reviews && Array.isArray(json.data.reviews)) {
              setReviews(json.data.reviews);
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
    updatedReviews: ReviewItem[] = reviews
  ) => {
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
        showToast('Changes saved & published live to your portfolio!');
      }
    } catch (err) {
      console.warn('Server sync error', err);
    }
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
