export type PortfolioMode = 'editor' | 'employer' | 'public';

export type WorkCategory = 
  | 'all' 
  | 'journalism' 
  | 'the_lit_scroll' 
  | 'research'
  | 'apps'
  | 'substack' 
  | 'instagram' 
  | 'communications'
  | string;

export interface WorkItem {
  id: string;
  title: string;
  category: string;
  publicationOrPlatform: string;
  url: string;
  date: string;
  excerpt: string;
  fullDescription?: string;
  keyTakeaways?: string[];
  tags: string[];
  imageUrl?: string;
  isFeatured?: boolean;
  isPieceToCamera?: boolean;
  isAcademicProject?: boolean;
  format?: string;
  readTimeOrDuration?: string;
  // Flexible creative & career attributes
  projectType?: string; // What is this work (e.g., Academic Magazine, Short Film, Campus Journal, Podcast, Documentary)
  rolePlayed?: string; // What role I played (e.g., Producer, Editor-in-Chief & Designer, Co-Director, Lead Reporter)
  collaborators?: string; // Team or collaborators (e.g., Academic Student Team of 5, Independent Film Crew)
}

export interface ReviewItem {
  id: string;
  authorName: string;
  role: string;
  organizationOrRelation: string;
  comment: string;
  rating: number;
  date: string;
  verified: boolean;
  avatarUrl?: string;
  badge?: string;
  screenshotUrl?: string;
  sourceUrl?: string;
  sourceType?: 'linkedin' | 'website' | 'email' | 'direct';
}

export interface UserProfile {
  name: string;
  tagline: string;
  bio: string;
  extendedBio: string;
  heroQuote: string;
  quoteSubtext: string;
  avatarUrl: string; // Spot 1: Main Hero Profile Portrait
  aboutImageUrl?: string; // Spot 2: About / Field Work Photo
  heroImageUrl: string;
  location: string;
  contact: {
    email1: string;
    email2: string;
    phone: string;
    location: string;
    linkedin: string;
    instagram: string;
    substack: string;
    linktree: string;
    youtube: string;
    resumeUrl: string;
  };
  pillars: {
    id: string;
    number: string;
    title: string;
    subtitle: string;
    description: string;
    tags: string[];
  }[];
  experience: {
    period: string;
    role: string;
    organization: string;
    description: string;
    highlight?: boolean;
  }[];
  certificates?: {
    id: string;
    title: string;
    issuer: string;
    issueDate: string;
    credentialUrl?: string;
    credentialId?: string;
    description?: string;
    skills?: string[];
  }[];
  values: {
    iconName: string;
    title: string;
    description: string;
  }[];
  litScrollProject: {
    title: string;
    group: string;
    role: string;
    summary: string;
    highlightsDescription: string;
    highlightsUrl?: string;
  };
}
