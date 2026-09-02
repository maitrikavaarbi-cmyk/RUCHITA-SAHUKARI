import { UserProfile, WorkItem, ReviewItem } from '../types';
import ruchitaProfileImg from '../assets/images/ruchita_profile_avatar_1788342494401.jpg';
import ruchitaAboutImg from '../assets/images/regenerated_image_1788347932672.jpg';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: "Ruchita Sahukari",
  tagline: "Stories that inform. Content that connects. Communication that creates impact.",
  bio: "I'm Ruchita Sahukari, a journalist and communications professional passionate about inclusive storytelling, clear communication and meaningful impact.",
  extendedBio: "A storyteller. A listener. A communicator. I am a postgraduate candidate in English Journalism at IIMC Dhenkanal. Navigating life with Osteogenesis Imperfecta, I believe physical conditions are neither a limitation nor a matter of concern—I deserve and claim my space with equality, respect, and professional dignity. My journey is shaped by curiosity, empathy, and a deep conviction in the power of words to drive tangible social change, break barriers, and amplify voices that are often ignored.",
  heroQuote: "I don't just write stories. I bring clarity to information, voice to people and purpose to communication.",
  quoteSubtext: "I report stories that others overlook.",
  avatarUrl: ruchitaProfileImg, // Spot 1: Ruchita's official profile portrait
  aboutImageUrl: ruchitaAboutImg, // Spot 2: On-ground field dispatch portrait / regenerated photo
  heroImageUrl: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=1200&auto=format&fit=crop", // Newspaper / press vibes
  location: "Andhra Pradesh / Odisha, India",
  contact: {
    email1: "sahukariruchita2000@gmail.com",
    email2: "ruchitacreates93@gmail.com",
    phone: "+91 84570 13630",
    location: "Andhra Pradesh / Dhenkanal, India",
    linkedin: "https://www.linkedin.com/in/ruchita-sahukari-50aa53212/",
    instagram: "https://www.instagram.com/sancharionwheel/",
    substack: "https://substack.com/@ruchitasahukari",
    linktree: "https://linktr.ee/sahukariruchita",
    youtube: "https://www.youtube.com/@Sanchar-m2e",
    resumeUrl: "https://drive.google.com/file/d/1ZO_62j92Chttim1KqlghCRAHWWNvTiM0/view?usp=sharing"
  },
  pillars: [
    {
      id: "report",
      number: "01",
      title: "REPORT",
      subtitle: "Journalism & Reporting",
      description: "On-ground field stories, investigative features, interviews and issues that matter.",
      tags: ["Field Reporting", "Accessibility", "Community", "Investigative"]
    },
    {
      id: "create",
      number: "02",
      title: "CREATE",
      subtitle: "Content & Storytelling",
      description: "Articles, blogs, social media content, carousel news, and digital stories that engage deeply.",
      tags: ["Digital Journalism", "Carousels", "Social Copy", "Visual Narratives"]
    },
    {
      id: "communicate",
      number: "03",
      title: "COMMUNICATE",
      subtitle: "Corporate Communications",
      description: "Strategic communications, PR, campaigns, and content that builds brands and authentic trust.",
      tags: ["Brand Voice", "Advocacy", "Media Strategy", "Public Relations"]
    }
  ],
  experience: [
    {
      period: "2025 – 2026",
      role: "PG Diploma in English Journalism",
      organization: "Indian Institute of Mass Communication (IIMC Dhenkanal)",
      description: "Intensive training in print & digital journalism, news editing, Peace to Camera (PTC), broadcast reporting, media ethics, and developmental journalism. Spearheaded The Lit Scroll digital news project and developed 'Ethicly' (an interactive web application for journalism ethics mentoring, grammatical correction, and news copy enhancement).",
      highlight: true
    },
    {
      period: "Jan – Mar 2024",
      role: "Crowdfunding & Communications Intern",
      organization: "Muskurahat Foundation",
      description: "Spearheaded storytelling initiatives and outreach campaigns to mobilize community funding and support for grassroots child education programs.",
      highlight: false
    },
    {
      period: "Aug – Nov 2021",
      role: "Digital Marketing Intern",
      organization: "Asman Foundation",
      description: "Created social media campaigns, drafted impactful copy, and increased engagement for non-profit social welfare causes.",
      highlight: false
    },
    {
      period: "Prior Experience",
      role: "VCS Associate (Work From Home)",
      organization: "Amazon Development Centre, Rajahmundry",
      description: "Delivered high-tier customer communication, issue resolution, and quality adherence under rapid operational standards.",
      highlight: false
    }
  ],
  certificates: [
    {
      id: "cert-iimc-journalism",
      title: "Postgraduate Diploma in English Journalism",
      issuer: "Indian Institute of Mass Communication (IIMC)",
      issueDate: "2025 – 2026",
      credentialUrl: "https://drive.google.com/file/d/1ZO_62j92Chttim1KqlghCRAHWWNvTiM0/view?usp=sharing",
      credentialId: "IIMC-DHN-ENG-26",
      description: "Comprehensive training in print and broadcast journalism, Peace to Camera (PTC), developmental reporting, and media ethics.",
      skills: ["Print Journalism", "PTC Reporting", "News Editing", "Media Ethics"]
    },
    {
      id: "cert-muskurahat-advocacy",
      title: "Grassroots Communications & Storytelling Fellow",
      issuer: "Muskurahat Foundation",
      issueDate: "Mar 2024",
      credentialUrl: "https://drive.google.com/file/d/1ZO_62j92Chttim1KqlghCRAHWWNvTiM0/view?usp=sharing",
      credentialId: "MF-COMM-2024",
      description: "Excellence in community mobilization, non-profit donor storytelling, and advocacy campaign management for child education.",
      skills: ["Non-Profit Communications", "Advocacy", "Content Strategy"]
    },
    {
      id: "cert-digital-media-asman",
      title: "Digital Media & Campaign Outreach Specialist",
      issuer: "Asman Foundation",
      issueDate: "Nov 2021",
      credentialUrl: "https://drive.google.com/file/d/1ZO_62j92Chttim1KqlghCRAHWWNvTiM0/view?usp=sharing",
      credentialId: "AF-DMC-2021",
      description: "Social media campaign design, visual narratives, and public engagement for grassroots community impact.",
      skills: ["Social Media Campaigns", "Visual Content", "Digital Outreach"]
    }
  ],
  values: [
    {
      iconName: "ShieldCheck",
      title: "TRUTH & EMPATHY",
      description: "I believe in responsible, ethical storytelling that respects people and centers the human element behind every headline."
    },
    {
      iconName: "Megaphone",
      title: "CLARITY",
      description: "I simplify complex policies, civic issues, and grassroots realities into clear, impactful, and accessible narratives."
    },
    {
      iconName: "Users",
      title: "INCLUSION & ACCESSIBILITY",
      description: "I advocate for accessibility and inclusive communication for persons with disabilities and underrepresented communities."
    },
    {
      iconName: "Sparkles",
      title: "IMPACT",
      description: "I create content and journalism that doesn't just inform but sparks dialogue, awareness, and institutional action."
    },
    {
      iconName: "Target",
      title: "CONTINUOUS GROWTH",
      description: "I keep learning, unlearning, and evolving with every on-ground dispatch and digital narrative."
    }
  ],
  litScrollProject: {
    title: "The Lit Scroll (@the_lit.scrol)",
    group: "Academic Journalism Initiative — Group E (IIMC Dhenkanal)",
    role: "Core Contributor, News Writer & On-Camera Reporter",
    summary: "The Lit Scroll is an academic collaborative project spearheaded by Group E. We conceptualized and launched a dedicated digital news portal on Instagram designed to deliver fast, verified, aesthetically engaging carousel news cards and dynamic Peace to Camera (PTC) video shorts for a modern mobile audience.",
    highlightsDescription: "My contributions include writing concise, rigorously fact-checked multi-slide carousel news stories, curating Instagram Highlights of breaking and cultural developments, and scripting & hosting on-location Peace to Camera (PTC) video shorts.",
    highlightsUrl: "https://www.instagram.com/stories/highlights/17858919864548458/"
  }
};

export const INITIAL_WORKS: WorkItem[] = [
  // THE HANS INDIA BYLINES
  {
    id: "hans-collector-urges-fitness",
    title: "Collector urges people to stay fit",
    category: "journalism",
    publicationOrPlatform: "The Hans India",
    url: "https://www.thehansindia.com/news/national/collector-urges-people-to-stay-fit-1002272",
    date: "National Daily",
    excerpt: "Coverage of the district administration's fitness campaign and community wellness drives organized to encourage healthy lifestyles.",
    fullDescription: "Detailed reportage on the District Collector's address emphasizing routine physical activity, preventive health habits, and community participation in state wellness initiatives.",
    keyTakeaways: [
      "Administrative reporting and public health communication",
      "Direct quotes and policy directives from District Administration",
      "Community wellness mobilization coverage"
    ],
    tags: ["Health", "Administration", "Public Policy", "National News"],
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop",
    isFeatured: true,
    format: "article",
    readTimeOrDuration: "3 min read"
  },
  {
    id: "hans-disabled-friendly-pandals",
    title: "Laxmi Puja pandals not disabled-friendly in Dhenkanal",
    category: "journalism",
    publicationOrPlatform: "The Hans India",
    url: "https://www.thehansindia.com/news/national/laxmi-puja-pandals-not-disabled-friendly-in-dhenkanal-1014785",
    date: "National Daily",
    excerpt: "An on-ground investigative report highlighting accessibility barriers and the urgent need for ramp access and inclusive design at major festive pandals.",
    fullDescription: "During Dhenkanal's famous Laxmi Puja festival, this investigative byline exposed the severe lack of wheelchair ramps and accessible pathways across major pandals, sparking conversation among local authorities and organizing committees about universal accessibility.",
    keyTakeaways: [
      "Field investigation across multiple festival pandals in Dhenkanal",
      "Interviews with persons with disabilities and local festival committee leaders",
      "Advocated for compliance with the Rights of Persons with Disabilities (RPwD) Act"
    ],
    tags: ["Accessibility", "Field Journalism", "Human Rights", "Civic Issues"],
    imageUrl: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=80&w=800&auto=format&fit=crop",
    isFeatured: true,
    format: "article",
    readTimeOrDuration: "4 min read"
  },

  // ACADEMIC PROJECTS & INNOVATIONS (IIMC DHENKANAL)
  {
    id: "ethicly-digital-journalism-mentor",
    title: "Ethicly – Your Digital Journalism Ethics & Writing Mentor",
    category: "the_lit_scroll",
    publicationOrPlatform: "Academic Innovation • IIMC Dhenkanal",
    url: "https://ethicly-your-digital-journalism-men.vercel.app/",
    date: "Academic Project • Interactive Ethics & Editing Tool",
    excerpt: "An interactive digital ethics mentor and editorial enhancement web app that provides grammatical corrections, style suggestions, and ethical decision-making frameworks for journalists and students.",
    fullDescription: "Ethicly is an interactive digital journalism mentor and writing assistant created as part of academic studies at IIMC Dhenkanal. Designed to bridge media ethics theory with daily newsroom workflow, the web application provides intelligent grammatical corrections and content enhancement suggestions while guiding reporters through practical case studies, press council guidelines, source protection, conflict-of-interest assessments, and digital verification standards.\n\n👉 Test and explore the interactive web app directly on Vercel.",
    keyTakeaways: [
      "Intelligent grammatical correction and contextual suggestions to enhance written news copy",
      "Interactive decision-trees and mentorship for media ethics, source protection & verification",
      "Scenario-based training on conflict of interest, sensationalism prevention, and press standards",
      "Created as an academic media innovation project at IIMC Dhenkanal • Live on Vercel"
    ],
    tags: ["JournalismEthics", "GrammarEnhancement", "Copyediting", "AcademicProject", "DigitalJournalism", "InteractiveApp", "IIMC", "Ethicly"],
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=900&auto=format&fit=crop",
    isFeatured: true,
    isAcademicProject: true,
    format: "app",
    readTimeOrDuration: "Interactive Web App"
  },

  // THE LIT SCROLL - ACADEMIC PROJECT GROUP E
  {
    id: "litscroll-ptc-reel-1",
    title: "Bihar By-Polls: JDU's Historic Win in Belaganj Stronghold",
    category: "the_lit_scroll",
    publicationOrPlatform: "The Lit Scroll (@the_lit.scrol) - Group E",
    url: "https://www.instagram.com/reel/DRCymAmDO0h/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==",
    date: "Group E Academic Project &bull; Bihar Election",
    excerpt: "A seismic political shift in Bihar’s by-polls: JD(U)’s Manorama Devi dismantles RJD’s safest seat in Belaganj by nearly 95,000 votes.",
    fullDescription: "On-camera election dispatch from Belaganj constituency reporting on JD(U) candidate Manorama Devi's historic win by nearly 95,000 votes over RJD's Viswanath Singh Kumar. Traditionally an impenetrable RJD stronghold, this outcome signals a decisive recalibration of Bihar's political landscape. Reported on ground by Ruchita Sahukari alongside video journalist Vriti Jain for The Lit Scroll.",
    keyTakeaways: [
      "Manorama Devi (JD(U)) defeats RJD's Viswanath Singh Kumar by ~95,000 votes",
      "Breaching a decades-long RJD stronghold in Belaganj",
      "Field dispatch by Ruchita Sahukari & Video Journalist Vriti Jain for The Lit Scroll ('No Cap, Just Facts')"
    ],
    tags: ["BiharElection2025", "Peace to Camera", "Belaganj", "Political Reporting", "The Lit Scroll"],
    imageUrl: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=800&auto=format&fit=crop",
    isFeatured: true,
    isPieceToCamera: true,
    isAcademicProject: true,
    format: "reel",
    readTimeOrDuration: "0:50 reel"
  },
  {
    id: "litscroll-ptc-reel-2",
    title: "Union Budget 2025–26: Healthcare Allocations & Health Sector Updates",
    category: "the_lit_scroll",
    publicationOrPlatform: "The Lit Scroll (@the_lit.scrol) - Group E",
    url: "https://www.instagram.com/reel/DUNwcoyiXvk/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA==",
    date: "Group E Academic Project &bull; Union Budget (Health)",
    excerpt: "Decoding Union Budget 2025–26 in 60 seconds: Critical healthcare sector allocations, medical infrastructure funding, and policy shifts broken down for digital viewers.",
    fullDescription: "An on-camera Peace to Camera (PTC) broadcast dispatch dissecting the Union Budget 2025–26 announcements with a dedicated focus on the health sector. Delivered in a punchy 60-second vertical format for The Lit Scroll, translating complex healthcare fiscal outlays, medical infrastructure schemes, and public health policy shifts into accessible digital news.\n\n👉 Watch the full 60-second on-camera report on Instagram Reels.",
    keyTakeaways: [
      "Union Budget 2025–26 healthcare budget allocations & policy updates",
      "Translating complex fiscal healthcare spending into a crisp 60-second mobile broadcast",
      "On-camera Piece to Camera (PTC) reporting with The Lit Scroll's signature 'No cap, just facts' editorial tone"
    ],
    tags: ["UnionBudget2025", "HealthSector", "HealthcareBudget", "Peace to Camera", "The Lit Scroll", "Reels"],
    imageUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800&auto=format&fit=crop",
    isFeatured: true,
    isPieceToCamera: true,
    isAcademicProject: true,
    format: "reel",
    readTimeOrDuration: "0:50 reel"
  },

  // SUBSTACK ESSAYS & IN-DEPTH INVESTIGATIONS
  {
    id: "substack-life-on-margins",
    title: "Life on the Margins: Ground Reality",
    category: "substack",
    publicationOrPlatform: "Ruchita's Substack",
    url: "https://ruchitasahukari.substack.com/p/life-on-the-margins-ground-reality-2e5",
    date: "In-depth Essay",
    excerpt: "A deeply moving narrative chronicling the daily struggles, resilience, and overlooked socioeconomic realities of marginalized communities.",
    fullDescription: "A long-form field dispatch investigating how urban and semi-rural marginalized populations navigate systemic gaps, highlighting first-person testimonies and poignant human moments.",
    keyTakeaways: [
      "Empathetic long-form storytelling",
      "Direct interviews with grassroots residents",
      "Critical analysis of welfare delivery"
    ],
    tags: ["Long-form", "Social Justice", "Human Rights", "Field Essay"],
    imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop",
    isFeatured: true,
    format: "essay",
    readTimeOrDuration: "6 min read"
  },
  {
    id: "substack-journalism-in-action",
    title: "Journalism in Action: Students Turn",
    category: "substack",
    publicationOrPlatform: "Ruchita's Substack",
    url: "https://ruchitasahukari.substack.com/p/journalism-in-action-students-turn",
    date: "Academic & Media Analysis",
    excerpt: "Reflecting on how student journalists step outside classrooms into the real world to report hard truths and master the trade.",
    fullDescription: "An analytical essay capturing the transformative experience of budding journalists confronting ethical dilemmas, editorial deadlines, and ground realities during practical journalism assignments.",
    keyTakeaways: [
      "First-hand reflections on journalistic ethics and training",
      "The role of young reporters in modern democracy",
      "Behind-the-scenes look at student field investigations"
    ],
    tags: ["Media Ethics", "Journalism Education", "Opinion", "Analysis"],
    imageUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop",
    isFeatured: false,
    format: "essay",
    readTimeOrDuration: "5 min read"
  },
  {
    id: "substack-jeevan-jyothi-school",
    title: "Jeevan Jyothi School: Where the Lives Transform",
    category: "substack",
    publicationOrPlatform: "Ruchita's Substack",
    url: "https://ruchitasahukari.substack.com/p/jeevan-jyothi-school-where-the-lives-e11",
    date: "Special Feature",
    excerpt: "An inspiring feature story spotlighting how dedicated educators at Jeevan Jyothi School nurture children with special needs.",
    fullDescription: "A heartening human-interest story exploring the pedagogical methods, care, and transformative impact created by Jeevan Jyothi School for children with diverse physical and intellectual needs.",
    keyTakeaways: [
      "In-depth spotlight on inclusive education",
      "Interviews with teachers, parents, and young learners",
      "Documenting resilience and grassroots institutional support"
    ],
    tags: ["Special Education", "Inclusion", "Human Interest", "Children"],
    imageUrl: "https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=800&auto=format&fit=crop",
    isFeatured: true,
    format: "essay",
    readTimeOrDuration: "5 min read"
  },
  {
    id: "substack-medical-infrastructure",
    title: "Does India Have Proper Medical Infrastructure?",
    category: "substack",
    publicationOrPlatform: "Ruchita's Substack",
    url: "https://ruchitasahukari.substack.com/p/does-india-have-proper-medical-infrastructure",
    date: "Healthcare Policy Critique",
    excerpt: "A data-driven critique examining disparities in healthcare accessibility, doctor-to-patient ratios, and rural medical centers in India.",
    fullDescription: "An exhaustive look into India's public health apparatus, comparing metropolitan facilities with rural primary healthcare centers and evaluating access for disabled patients.",
    keyTakeaways: [
      "Data-backed healthcare policy breakdown",
      "Evaluating rural vs urban hospital readiness",
      "Recommendations for patient-centric health reforms"
    ],
    tags: ["Public Health", "Policy", "Infrastructure", "Data Journalism"],
    imageUrl: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=800&auto=format&fit=crop",
    isFeatured: false,
    format: "essay",
    readTimeOrDuration: "7 min read"
  },

  // INSTAGRAM WRITE-UPS & CAROUSEL JOURNALISM
  {
    id: "insta-post-1",
    title: "The History Behind Bihar’s 2016 Liquor Ban: Domestic Abuse, Jeevika & The 3 Phases",
    category: "instagram",
    publicationOrPlatform: "Instagram (@sancharionwheel)",
    url: "https://www.instagram.com/p/DRVzqiEkt7B/?utm_source=ig_web_copy_link&igsi=NTc4MTIwNjQ2YQ==",
    date: "Bihar Election 2025 • Policy History",
    excerpt: "52% domestic abuse in drinking homes & 4,000 annual FIRs: How grassroots Jeevika women in Gaya & Nalanda triggered Bihar's 2016 total alcohol ban.",
    fullDescription: "Behind Bihar's 2016 prohibition lies an alarming reality: ~4,000 domestic violence cases every year and NFHS-4 data showing 52% spousal abuse in drinking homes. Discover how grassroots protests led by Jeevika women across Gaya, Nawada, and Nalanda forced the state into a 3-phase total ban.\n\n👉 Tap below to view the full on-ground visual dispatch & data breakdown on Instagram.",
    keyTakeaways: [
      "~4,000 annual Section 498A domestic abuse cases linked to alcohol abuse",
      "NFHS-4 data: 52% spousal abuse in drinking homes vs 26% non-drinking",
      "Mass women-led protests across Gaya, Nawada & Nalanda backed by Jeevika SHGs",
      "The 3-phase policy rollout: Country liquor → Total ban → Stringent penalties"
    ],
    tags: ["BiharLiquorBan", "Prohibition2016", "Jeevika", "NFHS4", "WomenRights", "BiharElection2025", "SanchariOnWheel"],
    imageUrl: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=900&auto=format&fit=crop",
    isFeatured: true,
    format: "carousel",
    readTimeOrDuration: "1 min read"
  },
  {
    id: "insta-post-2",
    title: "Watchdog or Partner? IPS Abhinav Sonkar on Press & Police Synergy at IIMC",
    category: "instagram",
    publicationOrPlatform: "Instagram (@sancharionwheel)",
    url: "https://www.instagram.com/p/DNa-UQvStMG/?img_index=1",
    date: "IIMC Campus Event • First-Person Photo Story",
    excerpt: "‘I see journalists as partners, not just watchdogs.’ IPS Abhinav Sonkar addresses budding reporters at IIMC on ground reporting and police collaboration.",
    fullDescription: "When asked whether police view the press merely as a watchdog or a partner, Chief Guest IPS Abhinav Sonkar shared a compelling insight with IIMC journalism students: 'Journalists uncover deep ground truths that police cannot always access — I see journalists as partners.'\n\nA first-person photo-story and visual carousel capturing his keynote on law enforcement and ground reporting realities.\n\n👉 Tap below to view the full photo carousel & campus discussion on Instagram.",
    keyTakeaways: [
      "Keynote by IPS Abhinav Sonkar at IIMC on law enforcement & reporting",
      "Core takeaway: 'I see journalists as partners' in bringing ground truth to light",
      "First-person photo story and interactive campus carousel"
    ],
    tags: ["IIMC", "IPSAbhinavSonkar", "PressAndPolice", "GroundReporting", "LawEnforcement", "WatchdogOrPartner", "CampusJournalism", "SanchariOnWheel"],
    imageUrl: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=900&auto=format&fit=crop",
    isFeatured: true,
    format: "carousel",
    readTimeOrDuration: "1 min read"
  }
];

export const INITIAL_REVIEWS: ReviewItem[] = [];
