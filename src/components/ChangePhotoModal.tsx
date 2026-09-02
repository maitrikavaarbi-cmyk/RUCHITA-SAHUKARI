import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, 
  Upload, 
  Link as LinkIcon, 
  Sparkles, 
  Camera, 
  Check, 
  RotateCcw, 
  AlertCircle, 
  Eye, 
  Crop, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Move, 
  FlipHorizontal,
  Layers,
  User,
  ArrowLeft
} from 'lucide-react';
import { formatDirectImageUrl } from '../utils/imageUtils';
import ruchitaProfileImg from '../assets/images/ruchita_profile_avatar_1788342494401.jpg';
import ruchitaAboutImg from '../assets/images/regenerated_image_1788347932672.jpg';

export type PhotoTargetOption = 'hero' | 'about';
// Alias for backward compatibility
export type PhotoTargetSpot = PhotoTargetOption;

interface ChangePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentHeroUrl: string;
  currentAboutUrl: string;
  initialTarget?: PhotoTargetOption;
  initialTab?: 'source' | 'crop';
  onSavePhoto: (target: PhotoTargetOption, newUrl: string) => void;
  onSaveBothPhotos?: (heroUrl: string, aboutUrl: string) => void;
  userName?: string;
}

// Preset photos for Photo 1 (Main Portrait Photo)
const PRESET_HERO_PHOTOS = [
  {
    id: 'hero-preset-official',
    label: 'Ruchita Sahukari (Official Portrait)',
    url: ruchitaProfileImg,
    tag: 'Official Profile'
  },
  {
    id: 'hero-preset-1',
    label: 'Professional Journalist (Classic Portrait)',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
    tag: 'Classic Press'
  },
  {
    id: 'hero-preset-2',
    label: 'Editorial Newsroom Lead',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop',
    tag: 'Editorial Desk'
  },
  {
    id: 'hero-preset-3',
    label: 'Digital Media Communicator',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
    tag: 'Creative Comms'
  },
  {
    id: 'hero-preset-4',
    label: 'Academic Fellow / Investigator',
    url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop',
    tag: 'Research Fellow'
  }
];

// Preset photos for Photo 2 (Horizontal / Landscape / Field Photo)
const PRESET_ABOUT_PHOTOS = [
  {
    id: 'about-preset-official',
    label: 'Ruchita Sahukari (Field / Editorial Portrait)',
    url: ruchitaAboutImg,
    tag: 'Official Field Photo'
  },
  {
    id: 'about-preset-1',
    label: 'Field Reporting & Dispatch (Horizontal)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop',
    tag: 'Field Dispatch'
  },
  {
    id: 'about-preset-2',
    label: 'Documentary Storyteller (Wide)',
    url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=1200&auto=format&fit=crop',
    tag: 'Documentary'
  },
  {
    id: 'about-preset-3',
    label: 'Media Room & Press Conference',
    url: 'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?q=80&w=1200&auto=format&fit=crop',
    tag: 'Media Room'
  },
  {
    id: 'about-preset-4',
    label: 'Broadcast Newsroom Studio',
    url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=1200&auto=format&fit=crop',
    tag: 'Broadcast Work'
  }
];

type AspectRatioType = '16:9' | '4:3' | '3:4' | '1:1' | 'original';

export const ChangePhotoModal: React.FC<ChangePhotoModalProps> = ({
  isOpen,
  onClose,
  currentHeroUrl,
  currentAboutUrl,
  initialTarget = 'hero',
  initialTab = 'source',
  onSavePhoto,
  onSaveBothPhotos,
  userName = "Ruchita Sahukari"
}) => {
  // Active photo being edited: Photo 1 (Main Hero) vs Photo 2 (Horizontal About)
  const [activePhotoType, setActivePhotoType] = useState<PhotoTargetOption>(initialTarget);
  
  // Independent image URLs for both photos
  const [heroPhoto, setHeroPhoto] = useState<string>(currentHeroUrl);
  const [aboutPhoto, setAboutPhoto] = useState<string>(currentAboutUrl);

  // Tab mode: Choose Source vs Crop Studio
  const [activeTab, setActiveTab] = useState<'source' | 'crop'>(initialTab);
  const [photoSource, setPhotoSource] = useState<'upload' | 'url' | 'presets'>('upload');
  const [urlInput, setUrlInput] = useState<string>('');

  // Active raw source and active working preview
  const currentSourceUrl = activePhotoType === 'hero' ? heroPhoto : aboutPhoto;
  const [sourceImageUrl, setSourceImageUrl] = useState<string>(currentSourceUrl);
  const [previewUrl, setPreviewUrl] = useState<string>(currentSourceUrl);

  // Transform / Crop state
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>(activePhotoType === 'hero' ? (initialTab === 'crop' ? '1:1' : '3:4') : '16:9');
  const [showCircularMask, setShowCircularMask] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hasUnappliedCrop, setHasUnappliedCrop] = useState<boolean>(false);

  // UI state
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [cropSuccess, setCropSuccess] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropContainerRef = useRef<HTMLDivElement>(null);

  // Sync on modal open or when initialTarget changes
  useEffect(() => {
    if (isOpen) {
      setActivePhotoType(initialTarget);
      setHeroPhoto(currentHeroUrl);
      setAboutPhoto(currentAboutUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop');
      
      const targetUrl = initialTarget === 'hero' 
        ? currentHeroUrl 
        : (currentAboutUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop');
      
      setSourceImageUrl(targetUrl);
      setPreviewUrl(targetUrl);
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setRotation(0);
      setIsFlipped(false);
      setAspectRatio(initialTarget === 'hero' ? (initialTab === 'crop' ? '1:1' : '3:4') : '16:9');
      setHasUnappliedCrop(false);
      setErrorMessage(null);
      setSavedSuccess(false);
      setCropSuccess(false);
      setActiveTab(initialTab || 'source');
      setUrlInput('');
    }
  }, [isOpen, initialTarget, initialTab, currentHeroUrl, currentAboutUrl]);

  // Handle switching between Photo 1 (Main) and Photo 2 (Horizontal)
  const handleSwitchPhoto = (photoType: PhotoTargetOption) => {
    setActivePhotoType(photoType);
    const targetUrl = photoType === 'hero' ? heroPhoto : aboutPhoto;
    setSourceImageUrl(targetUrl);
    setPreviewUrl(targetUrl);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setRotation(0);
    setIsFlipped(false);
    setAspectRatio(photoType === 'hero' ? '3:4' : '16:9');
    setHasUnappliedCrop(false);
    setErrorMessage(null);
    setUrlInput('');
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Client-side image optimization
  const processFile = (file: File) => {
    setErrorMessage(null);
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (JPEG, PNG, WEBP, etc.)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      if (!rawDataUrl) {
        setErrorMessage('Failed to read the image file.');
        return;
      }

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1920;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const optimized = canvas.toDataURL('image/jpeg', 0.92);
          setSourceImageUrl(optimized);
          setPreviewUrl(optimized);
          if (activePhotoType === 'hero') setHeroPhoto(optimized);
          else setAboutPhoto(optimized);
        } else {
          setSourceImageUrl(rawDataUrl);
          setPreviewUrl(rawDataUrl);
          if (activePhotoType === 'hero') setHeroPhoto(rawDataUrl);
          else setAboutPhoto(rawDataUrl);
        }

        // Reset transforms and enter crop framing tab
        setZoom(1);
        setPan({ x: 0, y: 0 });
        setRotation(0);
        setIsFlipped(false);
        setHasUnappliedCrop(false);
        setAspectRatio(activePhotoType === 'hero' ? '3:4' : '16:9');
        setActiveTab('crop');
      };
      img.onerror = () => {
        setSourceImageUrl(rawDataUrl);
        setPreviewUrl(rawDataUrl);
        if (activePhotoType === 'hero') setHeroPhoto(rawDataUrl);
        else setAboutPhoto(rawDataUrl);
        setActiveTab('crop');
      };
      img.src = rawDataUrl;
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read the image file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    const url = formatDirectImageUrl(urlInput.trim());
    setSourceImageUrl(url);
    setPreviewUrl(url);
    if (activePhotoType === 'hero') setHeroPhoto(url);
    else setAboutPhoto(url);

    setZoom(1);
    setPan({ x: 0, y: 0 });
    setRotation(0);
    setIsFlipped(false);
    setHasUnappliedCrop(false);
    setErrorMessage(null);
    setAspectRatio(activePhotoType === 'hero' ? '3:4' : '16:9');
    setActiveTab('crop');
  };

  // Drag panning in crop canvas
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
    setHasUnappliedCrop(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
    setHasUnappliedCrop(true);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Crop & Render to high quality Data URL
  const generateCroppedImage = useCallback((): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          
          let targetW = 1200;
          let targetH = 675; // 16:9 default
          if (aspectRatio === '16:9') {
            targetW = 1280;
            targetH = 720;
          } else if (aspectRatio === '4:3') {
            targetW = 1200;
            targetH = 900;
          } else if (aspectRatio === '3:4') {
            targetW = 900;
            targetH = 1200;
          } else if (aspectRatio === '1:1') {
            targetW = 1000;
            targetH = 1000;
          } else if (aspectRatio === 'original') {
            targetW = img.width;
            targetH = img.height;
          }

          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(sourceImageUrl);
            return;
          }

          ctx.fillStyle = '#141414';
          ctx.fillRect(0, 0, targetW, targetH);

          ctx.save();
          ctx.translate(targetW / 2 + (pan.x * (targetW / 280)), targetH / 2 + (pan.y * (targetH / 280)));
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.scale(isFlipped ? -zoom : zoom, zoom);

          const scaleToFit = Math.max(targetW / img.width, targetH / img.height);
          const drawW = img.width * scaleToFit;
          const drawH = img.height * scaleToFit;

          ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
          ctx.restore();

          const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
          resolve(croppedDataUrl);
        } catch (err) {
          console.error("Cropping canvas error:", err);
          resolve(sourceImageUrl);
        }
      };
      img.onerror = () => {
        resolve(sourceImageUrl);
      };
      img.src = sourceImageUrl;
    });
  }, [sourceImageUrl, aspectRatio, pan, rotation, isFlipped, zoom]);

  const handleApplyCrop = async () => {
    setErrorMessage(null);
    try {
      const croppedUrl = await generateCroppedImage();
      setPreviewUrl(croppedUrl);
      if (activePhotoType === 'hero') setHeroPhoto(croppedUrl);
      else setAboutPhoto(croppedUrl);
      
      setHasUnappliedCrop(false);
      setCropSuccess(true);
      setTimeout(() => setCropSuccess(false), 2000);
    } catch (err) {
      setErrorMessage('Could not render cropped image.');
    }
  };

  const handleResetCrop = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setRotation(0);
    setIsFlipped(false);
    setAspectRatio(activePhotoType === 'hero' ? '3:4' : '16:9');
    setPreviewUrl(sourceImageUrl);
    setHasUnappliedCrop(false);
  };

  // Save changes
  const handleSave = async () => {
    let currentCropped = previewUrl;
    if (hasUnappliedCrop || zoom !== 1 || pan.x !== 0 || pan.y !== 0 || rotation !== 0 || isFlipped) {
      try {
        currentCropped = await generateCroppedImage();
      } catch (e) {
        currentCropped = previewUrl || sourceImageUrl;
      }
    }

    const finalHero = activePhotoType === 'hero' ? currentCropped : heroPhoto;
    const finalAbout = activePhotoType === 'about' ? currentCropped : aboutPhoto;

    if (onSaveBothPhotos) {
      onSaveBothPhotos(finalHero, finalAbout);
    } else {
      onSavePhoto(activePhotoType, currentCropped);
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const activePresets = activePhotoType === 'hero' ? PRESET_HERO_PHOTOS : PRESET_ABOUT_PHOTOS;

  if (!isOpen) return null;

  return (
    <div 
      id="change-photo-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div 
        id="change-photo-modal-container"
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#141414] border border-white/15 text-white shadow-2xl flex flex-col scrollbar-thin scrollbar-thumb-zinc-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-20 bg-[#141414]/95 backdrop-blur-md px-5 sm:px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#d9823e]/15 border border-[#d9823e]/30 flex items-center justify-center text-[#d9823e]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white tracking-tight">
                Photo Manager (2 Separate Photos)
              </h3>
              <p className="text-xs text-zinc-400">
                Upload your Main Portrait Photo and your Horizontal / Landscape Photo separately
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="change-photo-back-to-site-btn"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 hover:text-white border border-white/15 transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm hover:border-[#d9823e]/50 active:scale-95"
              title="Done cropping — return to portfolio website"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#d9823e]" />
              <span>Done / Back to Site</span>
            </button>

            <button
              id="change-photo-modal-close-btn"
              type="button"
              aria-label="Close"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <X className="w-5 h-5 pointer-events-none" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5">
          
          {/* STEP 1: SELECT WHICH PHOTO TO EDIT (Main Photo vs Horizontal Photo) */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <span>Select Photo to Change:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* PHOTO 1: MAIN PORTRAIT PHOTO */}
              <button
                id="select-photo-main-btn"
                type="button"
                onClick={() => handleSwitchPhoto('hero')}
                className={`p-3 rounded-2xl border-2 transition-all text-left flex items-center gap-3.5 ${
                  activePhotoType === 'hero'
                    ? 'border-[#d9823e] bg-[#d9823e]/10 shadow-lg ring-2 ring-[#d9823e]/20'
                    : 'border-white/10 bg-zinc-900/60 hover:bg-zinc-900 hover:border-white/25'
                }`}
              >
                <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-black shrink-0 border border-white/20">
                  <img 
                    src={heroPhoto} 
                    alt="Main Portrait Photo" 
                    className="w-full h-full object-cover object-top"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-1 left-1 px-1 py-0.2 rounded text-[8px] font-bold bg-black/80 text-[#d9823e]">
                    1
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Photo 1: Main Portrait Photo
                    </span>
                    {activePhotoType === 'hero' && (
                      <span className="px-2 py-0.5 rounded-full bg-[#d9823e] text-black font-bold text-[9px] uppercase">
                        Editing Now
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">
                    Top hero editorial card, navigation avatar & bylines
                  </p>
                </div>
              </button>

              {/* PHOTO 2: HORIZONTAL / LANDSCAPE PHOTO */}
              <button
                id="select-photo-horizontal-btn"
                type="button"
                onClick={() => handleSwitchPhoto('about')}
                className={`p-3 rounded-2xl border-2 transition-all text-left flex items-center gap-3.5 ${
                  activePhotoType === 'about'
                    ? 'border-[#d9823e] bg-[#d9823e]/10 shadow-lg ring-2 ring-[#d9823e]/20'
                    : 'border-white/10 bg-zinc-900/60 hover:bg-zinc-900 hover:border-white/25'
                }`}
              >
                <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-black shrink-0 border border-white/20">
                  <img 
                    src={aboutPhoto} 
                    alt="Horizontal Photo" 
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-1 left-1 px-1 py-0.2 rounded text-[8px] font-bold bg-black/80 text-[#d9823e]">
                    2
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Photo 2: Horizontal Photo
                    </span>
                    {activePhotoType === 'about' && (
                      <span className="px-2 py-0.5 rounded-full bg-[#d9823e] text-black font-bold text-[9px] uppercase">
                        Editing Now
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">
                    Horizontal wide photo for About & Field dispatch
                  </p>
                </div>
              </button>

            </div>
          </div>

          {/* Mode Switcher: 1. Source (Upload/URL/Presets) vs 2. Interactive Crop Studio */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-zinc-900 border border-white/10">
            <button
              id="mode-tab-source"
              type="button"
              onClick={() => setActiveTab('source')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'source'
                  ? 'bg-zinc-800 text-white shadow-sm border border-white/10'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>1. Choose / Upload {activePhotoType === 'hero' ? 'Main Photo' : 'Horizontal Photo'}</span>
            </button>

            <button
              id="mode-tab-crop"
              type="button"
              onClick={() => setActiveTab('crop')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'crop'
                  ? 'bg-[#d9823e] text-black shadow-md font-extrabold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Crop className="w-3.5 h-3.5" />
              <span>2. Crop & Adjust Framing</span>
            </button>
          </div>

          {/* TAB 1: SOURCE SELECTION */}
          {activeTab === 'source' && (
            <div className="space-y-4">
              {/* Method Sub-Tabs */}
              <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-zinc-950 border border-white/10">
                <button
                  id="photo-tab-upload"
                  onClick={() => { setPhotoSource('upload'); setErrorMessage(null); }}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    photoSource === 'upload'
                      ? 'bg-zinc-800 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload File</span>
                </button>

                <button
                  id="photo-tab-url"
                  onClick={() => { setPhotoSource('url'); setErrorMessage(null); }}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    photoSource === 'url'
                      ? 'bg-zinc-800 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Image URL</span>
                </button>

                <button
                  id="photo-tab-presets"
                  onClick={() => { setPhotoSource('presets'); setErrorMessage(null); }}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    photoSource === 'presets'
                      ? 'bg-zinc-800 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{activePhotoType === 'hero' ? 'Main' : 'Horizontal'} Presets ({activePresets.length})</span>
                </button>
              </div>

              {/* Direct File Upload Dropzone */}
              {photoSource === 'upload' && (
                <div
                  id="photo-dropzone"
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                    dragActive 
                      ? 'border-[#d9823e] bg-[#d9823e]/10 scale-[1.01]' 
                      : 'border-white/20 bg-zinc-900/50 hover:bg-zinc-900 hover:border-white/40'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center text-[#d9823e]">
                    <Upload className="w-6 h-6" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-white">
                      Upload {activePhotoType === 'hero' ? 'Photo 1: Main Portrait' : 'Photo 2: Horizontal Image'}
                    </p>
                    <p className="text-xs text-zinc-400 mt-1">
                      Supports JPG, PNG, WEBP, HEIC (Auto-optimized for crisp rendering)
                    </p>
                  </div>

                  <div className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 border border-white/10">
                    Select File from Device
                  </div>
                </div>
              )}

              {/* Web Image Link */}
              {photoSource === 'url' && (
                <form onSubmit={handleApplyUrl} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
                      Direct Image URL for {activePhotoType === 'hero' ? 'Main Portrait Photo' : 'Horizontal Photo'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        required
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://images.unsplash.com/... or direct image link"
                        className="flex-1 bg-zinc-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 font-mono focus:border-[#d9823e] focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-xl bg-[#d9823e] hover:bg-[#c4712f] text-black font-bold text-xs shrink-0"
                      >
                        Load Image
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Presets Grid */}
              {photoSource === 'presets' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {activePresets.map((preset) => {
                      const isSelected = sourceImageUrl === preset.url;
                      return (
                        <div
                          key={preset.id}
                          onClick={() => {
                            setSourceImageUrl(preset.url);
                            setPreviewUrl(preset.url);
                            if (activePhotoType === 'hero') setHeroPhoto(preset.url);
                            else setAboutPhoto(preset.url);
                            
                            setZoom(1);
                            setPan({ x: 0, y: 0 });
                            setRotation(0);
                            setIsFlipped(false);
                            setHasUnappliedCrop(false);
                            setErrorMessage(null);
                            setAspectRatio(activePhotoType === 'hero' ? '3:4' : '16:9');
                            setActiveTab('crop');
                          }}
                          className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all p-1.5 bg-zinc-900 group ${
                            isSelected 
                              ? 'border-[#d9823e] ring-2 ring-[#d9823e]/30' 
                              : 'border-white/10 hover:border-white/30'
                          }`}
                        >
                          <div className={`relative ${activePhotoType === 'hero' ? 'h-24' : 'h-20'} w-full rounded-lg overflow-hidden bg-black`}>
                            <img
                              src={preset.url}
                              alt={preset.label}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              referrerPolicy="no-referrer"
                            />
                            {isSelected && (
                              <div className="absolute inset-0 bg-[#d9823e]/20 flex items-center justify-center">
                                <div className="w-6 h-6 rounded-full bg-[#d9823e] text-black flex items-center justify-center shadow-lg">
                                  <Check className="w-4 h-4 stroke-[3]" />
                                </div>
                              </div>
                            )}
                            <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-black/80 text-zinc-200">
                              {preset.tag}
                            </span>
                          </div>
                          <div className="pt-1 text-[11px] font-semibold text-zinc-300 truncate">
                            {preset.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INTERACTIVE CROP STUDIO */}
          {activeTab === 'crop' && (
            <div className="space-y-4 animate-in fade-in">
              
              {/* Aspect Ratio Selector */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Framing Ratio ({activePhotoType === 'hero' ? 'Photo 1: Main' : 'Photo 2: Horizontal'}):
                </span>
                <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => { setAspectRatio('16:9'); setHasUnappliedCrop(true); }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      aspectRatio === '16:9' ? 'bg-[#d9823e] text-black' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    16:9 (Wide Horizontal)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAspectRatio('4:3'); setHasUnappliedCrop(true); }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      aspectRatio === '4:3' ? 'bg-[#d9823e] text-black' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    4:3 (Landscape)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAspectRatio('3:4'); setHasUnappliedCrop(true); }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      aspectRatio === '3:4' ? 'bg-[#d9823e] text-black' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    3:4 (Portrait)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAspectRatio('1:1'); setHasUnappliedCrop(true); }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      aspectRatio === '1:1' ? 'bg-[#d9823e] text-black' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    1:1 (Square)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAspectRatio('original'); setHasUnappliedCrop(true); }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      aspectRatio === 'original' ? 'bg-[#d9823e] text-black' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Original Ratio
                  </button>
                </div>
              </div>

              {/* Interactive Crop Viewport / Framing Canvas */}
              <div className="relative rounded-2xl bg-zinc-950 border border-white/15 overflow-hidden flex items-center justify-center p-4">
                
                <div className="absolute top-2 left-3 z-10 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[11px] text-zinc-300 flex items-center gap-1.5 pointer-events-none">
                  <Move className="w-3.5 h-3.5 text-[#d9823e]" />
                  <span>Click & drag to reposition {activePhotoType === 'hero' ? 'Main Portrait' : 'Horizontal'} image</span>
                </div>

                <div 
                  ref={cropContainerRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  style={{
                    aspectRatio: aspectRatio === '16:9' ? '16 / 9' : aspectRatio === '4:3' ? '4 / 3' : aspectRatio === '1:1' ? '1 / 1' : aspectRatio === 'original' ? 'auto' : '3 / 4',
                    maxHeight: '320px',
                    width: aspectRatio === '16:9' ? '360px' : aspectRatio === '4:3' ? '320px' : aspectRatio === '1:1' ? '280px' : '240px'
                  }}
                  className={`relative overflow-hidden rounded-xl border-2 border-[#d9823e] shadow-2xl bg-black cursor-grab active:cursor-grabbing select-none ${
                    isDragging ? 'ring-4 ring-[#d9823e]/30' : ''
                  }`}
                >
                  <div 
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      transform: `translate(${pan.x}px, ${pan.y}px)`
                    }}
                  >
                    <img
                      src={sourceImageUrl}
                      alt="Crop framing"
                      draggable={false}
                      className="max-w-none transition-transform duration-75 select-none pointer-events-none"
                      style={{
                        transform: `rotate(${rotation}deg) scale(${isFlipped ? -zoom : zoom}, ${zoom})`,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Rule of Thirds Grid Overlay */}
                  <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/20">
                    <div className="border-r border-b border-white/15" />
                    <div className="border-r border-b border-white/15" />
                    <div className="border-b border-white/15" />
                    <div className="border-r border-b border-white/15" />
                    <div className="border-r border-b border-white/15" />
                    <div className="border-b border-white/15" />
                    <div className="border-r border-b border-white/15" />
                    <div className="border-r border-b border-white/15" />
                    <div />
                  </div>

                  {/* Circular Avatar Guide for Hero Profile (Shows exact face framing in circular badge) */}
                  {activePhotoType === 'hero' && showCircularMask && (
                    <div 
                      className="absolute inset-2 pointer-events-none rounded-full border-2 border-dashed border-[#d9823e] shadow-[0_0_0_9999px_rgba(0,0,0,0.25)] flex items-center justify-center"
                      title="Circular Avatar Safe Zone"
                    >
                      <span className="text-[9px] font-bold text-[#d9823e] bg-black/70 px-1.5 py-0.5 rounded-full uppercase tracking-wider absolute bottom-2">
                        Avatar Ring
                      </span>
                    </div>
                  )}
                </div>

              </div>

              {/* Crop Controls & Sliders */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-white/10 space-y-3">
                
                {/* Zoom Slider */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-zinc-400 text-xs font-semibold shrink-0">
                    <ZoomIn className="w-4 h-4 text-[#d9823e]" />
                    <span>Zoom ({Math.round(zoom * 100)}%)</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => { setZoom(prev => Math.max(0.8, Number((prev - 0.1).toFixed(2)))); setHasUnappliedCrop(true); }}
                    className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>

                  <input
                    type="range"
                    min="0.8"
                    max="3.0"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => { setZoom(parseFloat(e.target.value)); setHasUnappliedCrop(true); }}
                    className="flex-1 accent-[#d9823e] cursor-pointer h-1.5 bg-zinc-950 rounded-lg"
                  />

                  <button
                    type="button"
                    onClick={() => { setZoom(prev => Math.min(3.0, Number((prev + 0.1).toFixed(2)))); setHasUnappliedCrop(true); }}
                    className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Transform Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => { setRotation(prev => (prev + 90) % 360); setHasUnappliedCrop(true); }}
                      className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 flex items-center gap-1.5"
                    >
                      <RotateCw className="w-3.5 h-3.5 text-[#d9823e]" />
                      <span>Rotate 90°</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setIsFlipped(prev => !prev); setHasUnappliedCrop(true); }}
                      className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 ${
                        isFlipped ? 'bg-[#d9823e] text-black font-bold' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                      }`}
                    >
                      <FlipHorizontal className="w-3.5 h-3.5" />
                      <span>Flip</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleResetCrop}
                      className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-400 hover:text-white flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>

                    {activePhotoType === 'hero' && (
                      <button
                        type="button"
                        onClick={() => setShowCircularMask(prev => !prev)}
                        className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
                          showCircularMask 
                            ? 'bg-amber-950/60 border border-[#d9823e]/50 text-[#d9823e] font-semibold' 
                            : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                        title="Toggle circular avatar preview guide"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>{showCircularMask ? 'Avatar Ring On' : 'Avatar Ring Off'}</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleApplyCrop}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      cropSuccess
                        ? 'bg-emerald-500 text-black'
                        : 'bg-[#d9823e] hover:bg-[#c4712f] text-black shadow-md'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{cropSuccess ? 'Crop Applied!' : `Apply Crop to ${activePhotoType === 'hero' ? 'Main' : 'Horizontal'} Photo`}</span>
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* LIVE DUAL PREVIEWS: Photo 1 and Photo 2 Side by Side */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#d9823e]" />
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Both Photos Side-by-Side
                </span>
              </div>
              <span className="text-[11px] text-zinc-400">
                Click any preview to switch and edit
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* 1. PHOTO 1: MAIN PORTRAIT CARD PREVIEW */}
              <div 
                onClick={() => handleSwitchPhoto('hero')}
                className={`relative rounded-xl overflow-hidden bg-zinc-900 border transition-all cursor-pointer flex flex-col justify-between ${
                  activePhotoType === 'hero' 
                    ? 'border-[#d9823e] ring-2 ring-[#d9823e]/30' 
                    : 'border-white/15 opacity-85 hover:opacity-100'
                }`}
              >
                <div className="bg-zinc-950 px-3 py-1.5 border-b border-white/10 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                  <span className="text-zinc-200 font-bold">PHOTO 1: MAIN PORTRAIT</span>
                  <span className="text-[#d9823e]">HERO CARD</span>
                </div>

                <div className="relative h-44 bg-zinc-950 overflow-hidden">
                  <img
                    src={heroPhoto}
                    alt="Main Portrait Photo Preview"
                    className="w-full h-full object-cover object-top"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="p-2 bg-zinc-900 text-[10px] text-zinc-300 text-center font-medium flex items-center justify-center gap-1">
                  <span>Top Hero Portrait Card</span>
                  {activePhotoType === 'hero' && <span className="text-[#d9823e] font-bold">(Active)</span>}
                </div>
              </div>

              {/* 2. PHOTO 2: HORIZONTAL / LANDSCAPE PHOTO PREVIEW */}
              <div 
                onClick={() => handleSwitchPhoto('about')}
                className={`relative rounded-xl overflow-hidden bg-zinc-900 border transition-all cursor-pointer flex flex-col justify-between ${
                  activePhotoType === 'about' 
                    ? 'border-[#d9823e] ring-2 ring-[#d9823e]/30' 
                    : 'border-white/15 opacity-85 hover:opacity-100'
                }`}
              >
                <div className="bg-zinc-950 px-3 py-1.5 border-b border-white/10 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                  <span className="text-zinc-200 font-bold">PHOTO 2: HORIZONTAL PHOTO</span>
                  <span className="text-[#d9823e]">ABOUT SECTION</span>
                </div>

                <div className="relative h-44 bg-zinc-950 overflow-hidden flex items-center justify-center">
                  <img
                    src={aboutPhoto}
                    alt="Horizontal Photo Preview"
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="p-2 bg-zinc-900 text-[10px] text-zinc-300 text-center font-medium flex items-center justify-center gap-1">
                  <span>About & Experience Section (Horizontal)</span>
                  {activePhotoType === 'about' && <span className="text-[#d9823e] font-bold">(Active)</span>}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="sticky bottom-0 z-20 bg-[#141414]/95 backdrop-blur-md px-5 sm:px-6 py-4 border-t border-white/10 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-200 hover:text-white text-xs font-bold active:scale-95 transition-all flex items-center gap-1.5 border border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#d9823e]" />
            <span>Back to Portfolio</span>
          </button>

          <button
            id="save-profile-photo-btn"
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-[#d9823e] hover:bg-[#c4712f] text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-[#d9823e]/25 active:scale-95 cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Photos Saved & Updated!</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Apply & Save Photos</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
