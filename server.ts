/**
 * Copyright (c) 2026 Ruchita Sahukari. All Rights Reserved.
 *
 * PROPRIETARY AND CONFIDENTIAL:
 * Unauthorized copying, distribution, or recreation of this backend server code
 * and portfolio data management system is strictly prohibited.
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Persistent Portfolio Storage
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "portfolio.json");

// Helper to ensure data directory exists
async function ensureDataDir() {
  const fs = await import("fs/promises");
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    // Directory may already exist
  }
}

// GET saved portfolio data
app.get("/api/portfolio", async (_req, res) => {
  try {
    const fs = await import("fs/promises");
    await ensureDataDir();
    try {
      const data = await fs.readFile(DATA_FILE, "utf-8");
      return res.json({ success: true, data: JSON.parse(data) });
    } catch {
      // File doesn't exist yet, return null
      return res.json({ success: true, data: null });
    }
  } catch (error: any) {
    console.error("Error reading portfolio data:", error);
    return res.status(500).json({ error: "Failed to read portfolio data" });
  }
});

// POST save portfolio data (published from Editor)
app.post("/api/portfolio", async (req, res) => {
  try {
    const { profile, works, reviews } = req.body;
    if (!profile && !works) {
      return res.status(400).json({ error: "Invalid portfolio payload" });
    }
    const fs = await import("fs/promises");
    await ensureDataDir();
    
    const payloadToSave = {
      profile,
      works,
      reviews: reviews || [],
      lastUpdated: new Date().toISOString()
    };
    
    await fs.writeFile(DATA_FILE, JSON.stringify(payloadToSave, null, 2), "utf-8");
    console.log("Successfully persisted updated portfolio data to server disk.");
    return res.json({ success: true, message: "Portfolio saved and published live to all visitors!" });
  } catch (error: any) {
    console.error("Error saving portfolio data:", error);
    return res.status(500).json({ error: "Failed to persist portfolio data" });
  }
});

// POST reset portfolio to default
app.post("/api/portfolio/reset", async (_req, res) => {
  try {
    const fs = await import("fs/promises");
    await ensureDataDir();
    try {
      await fs.unlink(DATA_FILE);
    } catch {}
    return res.json({ success: true, message: "Portfolio reset to initial defaults." });
  } catch (error: any) {
    console.error("Error resetting portfolio data:", error);
    return res.status(500).json({ error: "Failed to reset portfolio data" });
  }
});

// AI Generation for Portfolio Entries (Bylines, Magazines, Films, Apps, Research, Essays, Campaigns, etc.)
app.post("/api/ai/generate-portfolio-entry", async (req, res) => {
  try {
    const {
      title,
      url,
      typeOrFormat = "article",
      category = "journalism",
      projectType = "",
      rolePlayed = "",
      collaborators = "",
      publicationOrPlatform,
      rawContentOrNotes = "",
      tone = "journalistic",
      action = "generate_all",
    } = req.body;

    if (!title && !rawContentOrNotes && !url && !projectType) {
      return res.status(400).json({
        error: "Please provide at least a title, what the work is, link, or brief notes to generate an overview.",
      });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Smart tailored template fallback when API key is not yet set
      const displayWhat = projectType || (
        typeOrFormat === "app" ? "interactive web application"
        : typeOrFormat === "research" ? "research and policy study"
        : typeOrFormat === "case_study" ? "in-depth case study / client deliverable"
        : typeOrFormat === "campaign" ? "strategic corporate campaign"
        : typeOrFormat === "project" ? "fellowship initiative / project"
        : typeOrFormat === "essay" ? "long-form analytical essay"
        : typeOrFormat === "reel" ? "on-camera video report"
        : typeOrFormat === "carousel" ? "curated visual carousel"
        : typeOrFormat === "film" ? "short film / visual production"
        : typeOrFormat === "magazine" ? "print publication / editorial magazine"
        : "featured creative initiative"
      );

      const roleSnippet = rolePlayed ? `as ${rolePlayed}` : "as lead contributor and producer";
      const collabSnippet = collaborators ? ` in collaboration with ${collaborators}` : "";
      const platformSnippet = publicationOrPlatform ? ` presented via ${publicationOrPlatform}` : "";

      return res.json({
        success: true,
        isFallback: true,
        message: "Generated via structured template. Connect GEMINI_API_KEY in Secrets for real-time generative intelligence.",
        data: {
          excerpt: `"${title || "This project"}" is a ${displayWhat}${platformSnippet}, featuring Ruchita Sahukari ${roleSnippet}${collabSnippet}, delivering structured execution and verifiable outcomes.`,
          fullDescription: `"${title || "This project"}" is an ambitious ${displayWhat}${platformSnippet}.\n\nWorking ${roleSnippet}${collabSnippet}, the project was developed through rigorous planning, research, and creative storytelling. It explores core objectives while balancing narrative clarity, stakeholder needs, and high production standards.\n\nThe finished work provides audiences, clients, and partners with contextual depth, practical takeaways, and verified quality.`,
          keyTakeaways: [
            `Spearheaded core deliverables ${roleSnippet}${collabSnippet}`,
            `Integrated rigorous research, ethical standards, and contextual messaging`,
            `High-clarity presentation tailored for digital, print, or broadcast audiences`,
            `Measurable stakeholder engagement and verified editorial or campaign impact`
          ],
          tags: [
            projectType ? projectType.replace(/\s+/g, '') : "CreativeWork",
            rolePlayed ? rolePlayed.replace(/\s+/g, '') : "EditorialLeadership",
            "Communications",
            "Strategy",
            category === "corporate" ? "CorporateComms" : category === "fellowship" ? "Fellowship" : category === "film_media" ? "FilmProduction" : "PortfolioShowcase"
          ],
          suggestedReadTimeOrDuration: projectType || (typeOrFormat === "app" ? "Interactive App" : typeOrFormat === "film" ? "Short Film" : typeOrFormat === "magazine" ? "Print Edition" : typeOrFormat === "campaign" ? "Campaign" : "Featured Work"),
        },
      });
    }

    const prompt = `
You are an expert executive editor, corporate communications strategist, and creative producer mentor for Ruchita Sahukari, a versatile professional specializing in journalism, corporate strategy, film/media production, fellowship initiatives, and multi-format publications.

Task: Generate a polished, high-impact professional portfolio entry based on the user's input. Note that this can be ANY type of work or creative project without artificial boundaries: corporate communications or brand strategy, a short film or documentary, a fellowship initiative, an editorial magazine or publication, an interactive digital tool, research study, news byline, Substack essay, broadcast reel, or public media campaign.

Input Details:
- Title / Headline: "${title || "Untitled"}"
- What is this work / Project Type: "${projectType || typeOrFormat || "Creative & Professional Work"}"
- What Role Ruchita Played: "${rolePlayed || "Producer / Strategist / Lead"}"
- Collaborators / Team: "${collaborators || "Collaborative Team / Independent"}"
- Format / Media Medium: "${typeOrFormat}"
- Category: "${category}"
- Publication / Platform / Company / Client: "${publicationOrPlatform || "Not specified"}"
- Link / URL: "${url || "Not specified"}"
- Rough Notes / Pasted Copy / Description: "${rawContentOrNotes || "None provided"}"
- Tone: "${tone}"
- Requested Action: "${action}"

Requirements:
1. "excerpt": A sharp, compelling 1-2 sentence lead summary (under 45 words) that highlights what this project is, Ruchita's specific role (${rolePlayed || 'lead/producer'}), and the core significance of the work.
2. "fullDescription": A rich, structured 2-3 paragraph professional overview explaining:
   - Paragraph 1: What this work is, its overarching vision, and the organizational, corporate, fellowship, or creative context.
   - Paragraph 2: Ruchita's specific role, responsibilities, and hands-on contributions (e.g. strategic planning, production coordination, direction, research, writing, or stakeholder management).
   - Paragraph 3: Key outcomes, creative execution, audience or client impact, and the lasting value of the project.
3. "keyTakeaways": An array of exactly 4 concise, high-impact bullet points highlighting key milestones, deliverables, teamwork leadership, or strategic outcomes.
4. "tags": An array of 4 to 6 clean, camelCase or TitleCase topic tags reflecting the project type, role, and industry.
5. "suggestedReadTimeOrDuration": A short label representing format or duration (e.g. "Corporate Campaign", "Short Film • 12 min", "Print Edition", "Interactive App", "5 min read").

Write with precision, intellectual depth, and sophisticated tone. Avoid generic hype or buzzwords like 'supercharge' or 'empower'.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            excerpt: {
              type: Type.STRING,
              description: "A punchy 1-2 sentence lead summary highlighting work and role",
            },
            fullDescription: {
              type: Type.STRING,
              description: "Detailed 2-3 paragraph overview covering context, role played, and outcomes",
            },
            keyTakeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "4 impactful key highlights or takeaways",
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "4-6 relevant topic tags",
            },
            suggestedReadTimeOrDuration: {
              type: Type.STRING,
              description: "Duration or format badge label",
            },
          },
          required: [
            "excerpt",
            "fullDescription",
            "keyTakeaways",
            "tags",
            "suggestedReadTimeOrDuration",
          ],
        },
      },
    });

    const jsonText = response.text || "{}";
    const parsedData = JSON.parse(jsonText);

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error("Gemini portfolio generation error:", error);
    return res.status(500).json({
      error: error.message || "Failed to generate portfolio entry",
      details: String(error),
    });
  }
});

// AI Generation for Work Summary (Executive Summary, LinkedIn Post, Elevator Pitch, Key Impact)
app.post("/api/ai/generate-work-summary", async (req, res) => {
  try {
    const {
      title,
      category = "journalism",
      projectType = "",
      rolePlayed = "",
      collaborators = "",
      publicationOrPlatform,
      excerpt = "",
      fullDescription = "",
      keyTakeaways = [],
      targetAudience = "recruiter_editor", // recruiter_editor, public_linkedin, academic_grant
    } = req.body;

    if (!title && !excerpt && !fullDescription && !projectType) {
      return res.status(400).json({
        error: "Please provide work details to generate a work summary.",
      });
    }

    const ai = getGeminiClient();
    if (!ai) {
      const displayWork = projectType || "creative and journalistic initiative";
      const displayRole = rolePlayed ? `as ${rolePlayed}` : "as contributor and lead researcher";
      const displayCollab = collaborators ? ` alongside ${collaborators}` : "";
      const displayPub = publicationOrPlatform ? ` with ${publicationOrPlatform}` : "";

      // High-quality structured fallback
      return res.json({
        success: true,
        isFallback: true,
        data: {
          executiveSummary: `"${title || "This work"}" is a ${displayWork}${displayPub}, produced with Ruchita Sahukari ${displayRole}${displayCollab}. It synthesizes structured research, editorial leadership, and impactful storytelling, delivering measurable public awareness and collaborative excellence.`,
          elevatorPitch: `A ${displayWork} entitled "${title || "Core Initiative"}", where I served ${displayRole}${displayCollab} to translate critical ideas into accessible, high-impact public media.`,
          linkedinPost: `Excited to share our work on "${title || "this project"}" (${displayWork}) ${displayPub}!\n\n🔍 Role & Scope: Served ${displayRole}${displayCollab} to deliver grounded storytelling and high-integrity production.\n\n💡 Read the complete overview and takeaways in my portfolio: https://ruchita-portfolio.vercel.app\n\n#${(projectType || "Storytelling").replace(/\s+/g, '')} #${(rolePlayed || "Producer").replace(/\s+/g, '')} #Journalism #MediaProduction`,
          keyImpactMetrics: [
            `Served ${displayRole}${displayCollab} from inception to final delivery`,
            "Synthesized multi-source evidence and creative direction into verifiable public media",
            "Prioritized inclusive representation, ethical standards, and accessible design",
            "Delivered actionable takeaways for readers, viewers, and community stakeholders"
          ],
          recommendedBioSnippet: `${rolePlayed || "Producer and Author"} of "${title || "featured works"}" (${publicationOrPlatform || displayWork}), specializing in high-impact collaborative storytelling.`
        }
      });
    }

    const prompt = `
You are an expert executive communications advisor, creative producer mentor, and senior talent consultant representing Ruchita Sahukari.

Task: Generate a comprehensive, multi-format professional Work Summary for the following portfolio entry (which can be a corporate strategy initiative, short film, fellowship project, editorial magazine, journalism investigation, or digital tool):

Work Details:
- Title: "${title || "Untitled"}"
- What is this work / Project Type: "${projectType || "Creative / Professional Work"}"
- What Role Ruchita Played: "${rolePlayed || "Producer / Strategist / Lead"}"
- Collaborators / Team: "${collaborators || "Collaborative Team / Independent"}"
- Category: "${category}"
- Publication / Platform / Company / Client: "${publicationOrPlatform || "Not specified"}"
- Lead Excerpt: "${excerpt}"
- Full Description: "${fullDescription}"
- Key Takeaways: ${JSON.stringify(keyTakeaways)}
- Target Audience: "${targetAudience}"

Requirements:
1. "executiveSummary": A powerful, cohesive paragraph (80-120 words) articulating what this work is, Ruchita's specific role (${rolePlayed || 'lead/producer'}), the collaborative or independent execution, and the lasting business, creative, or public significance for clients, recruiters, or production houses.
2. "elevatorPitch": A sharp 2-sentence spoken pitch (under 45 words) highlighting the project and her role that Ruchita could say in an executive interview, film pitch meeting, or conference panel.
3. "linkedinPost": A professional, engaging LinkedIn announcement (with clean line breaks, bullet points, and 3-5 relevant industry hashtags) sharing this work and highlighting the collaborative leadership.
4. "keyImpactMetrics": An array of exactly 4 impact bullet points highlighting research/production rigor, teamwork coordination, audience or client resonance, and craft excellence.
5. "recommendedBioSnippet": A single 1-sentence byline/resume bullet summarizing this accomplishment with her exact role and organization.

Ensure high editorial polish, professional composure, and zero generic buzzwords.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveSummary: {
              type: Type.STRING,
              description: "Executive paragraph summary highlighting project and role",
            },
            elevatorPitch: {
              type: Type.STRING,
              description: "2-sentence elevator pitch",
            },
            linkedinPost: {
              type: Type.STRING,
              description: "Full LinkedIn post text",
            },
            keyImpactMetrics: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "4 impactful bullet points",
            },
            recommendedBioSnippet: {
              type: Type.STRING,
              description: "1-sentence resume/byline bullet",
            },
          },
          required: [
            "executiveSummary",
            "elevatorPitch",
            "linkedinPost",
            "keyImpactMetrics",
            "recommendedBioSnippet",
          ],
        },
      },
    });

    const jsonText = response.text || "{}";
    const parsedData = JSON.parse(jsonText);

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error("Gemini work summary error:", error);
    return res.status(500).json({
      error: error.message || "Failed to generate work summary",
      details: String(error),
    });
  }
});

// AI Generation for Career Summary, Cover Letter Blurb & Portfolio Pitch
app.post("/api/ai/generate-career-summary", async (req, res) => {
  try {
    const {
      targetRole = "Journalist & Communications Specialist",
      specializationFocus = "Investigative Journalism, Field Reporting, Media Ethics, and Strategic Public Relations",
      profileData,
      worksList = [],
    } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        success: true,
        isFallback: true,
        data: {
          headlinePitch: "Dedicated Journalist & Strategic Communicator translating complex societal challenges into clear, ethical, and high-impact stories.",
          careerSummary: `Ruchita Sahukari is an English Journalism graduate from the Indian Institute of Mass Communication (IIMC Dhenkanal) specializing in field reporting, media ethics, digital storytelling, and corporate communications. With published bylines in The Hans India, leadership in digital news initiatives like The Lit Scroll, and creation of interactive journalism tools such as Ethicly, she pairs investigative rigor with empathetic public interest reporting.`,
          coverLetterBlurb: `As a journalism and communications professional trained at IIMC Dhenkanal, I bring a unique combination of on-ground investigative experience, ethical clarity, and modern multimedia storytelling. From reporting on civic affairs and public policy for national publications to directing high-engagement visual news series, I am committed to producing work that informs communities and drives measurable engagement.`,
          keyCompetencies: [
            "Investigative & Field Journalism (The Hans India bylines, on-ground civic dispatches)",
            "Multimedia Newsroom Production (The Lit Scroll video reels, scripts, anchor PTCs)",
            "Media Ethics & Digital Tool Development (Creator of Ethicly)",
            "Long-form Analysis & Substack Essays (Cultural critique, public interest)",
            "Strategic Corporate & Non-Profit Communications (Advocacy copy, press releases)"
          ],
          interviewTalkingPoints: [
            "Proven track record of turning overlooked community issues into national published bylines",
            "Hands-on expertise across print, broadcast video (PTC), digital apps, and newsletter platforms",
            "Uncompromising dedication to verification, ethical standards, and community impact"
          ]
        }
      });
    }

    const prompt = `
You are a senior career mentor and editorial recruiter crafting high-level executive career summaries for Ruchita Sahukari.

Background:
- Candidate: Ruchita Sahukari
- Education: PG Diploma in English Journalism, IIMC Dhenkanal ('26)
- Core Pillars: Ethical Journalism & Bylines (The Hans India), Multimedia Storytelling (The Lit Scroll Group E), Digital Tools (Ethicly), Substack Essays, Corporate Communications.
- Core Identity: Passionate communicator and storyteller with uncompromising dedication to ethics and community voices.
- Target Role: "${targetRole}"
- Specialization Focus: "${specializationFocus}"
- Sample Works Included: ${JSON.stringify(worksList.slice(0, 5).map((w: any) => ({ title: w.title, platform: w.publicationOrPlatform, format: w.format })))}

Task: Generate a customized, compelling Career Summary package.

Requirements:
1. "headlinePitch": A punchy, authoritative 1-sentence value proposition headline (under 25 words).
2. "careerSummary": A sophisticated, comprehensive 2-paragraph career overview highlighting editorial rigor, multimedia agility, and strategic communication outcomes.
3. "coverLetterBlurb": A versatile 3-paragraph tailored cover letter blurb ready to paste into job applications or fellowship proposals.
4. "keyCompetencies": An array of 5 distinct, high-level core competency bullet points with concrete evidence.
5. "interviewTalkingPoints": An array of 3 crisp talking points for executive hiring managers or editors.

Write with intellectual elegance, authority, and warmth.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headlinePitch: {
              type: Type.STRING,
              description: "1-sentence executive headline pitch",
            },
            careerSummary: {
              type: Type.STRING,
              description: "2-paragraph professional career summary",
            },
            coverLetterBlurb: {
              type: Type.STRING,
              description: "Tailored cover letter blurb",
            },
            keyCompetencies: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "5 core competency bullets",
            },
            interviewTalkingPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 talking points for interviews",
            },
          },
          required: [
            "headlinePitch",
            "careerSummary",
            "coverLetterBlurb",
            "keyCompetencies",
            "interviewTalkingPoints",
          ],
        },
      },
    });

    const jsonText = response.text || "{}";
    const parsedData = JSON.parse(jsonText);

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error("Gemini career summary error:", error);
    return res.status(500).json({
      error: error.message || "Failed to generate career summary",
      details: String(error),
    });
  }
});

// AI Generation for Experience & Internship Bullet Points
app.post("/api/ai/generate-experience-bullets", async (req, res) => {
  try {
    const {
      role,
      organization,
      period,
      roughNotes = "",
      experienceType = "internship", // job, internship, research, leadership
    } = req.body;

    if (!role && !organization && !roughNotes) {
      return res.status(400).json({
        error: "Please provide role and organization details.",
      });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        success: true,
        isFallback: true,
        data: {
          polishedRole: role || "Journalism & Communications Intern",
          polishedOrganization: organization || "Editorial Organization",
          polishedDescription: `Led editorial research, ground interviews, and story formulation under tight newsroom deadlines, ensuring strict adherence to media ethics and factual accuracy.`,
          bulletPoints: [
            `Authored and pitched verified news stories and comprehensive field analyses on deadline`,
            `Conducted primary source interviews with community stakeholders, administrators, and subject matter experts`,
            `Drafted engaging multi-platform copy adapted for digital readers and social channels`,
            `Collaborated with senior editors to maintain rigorous fact-checking and ethical reporting standards`
          ],
          skillsUsed: ["Field Reporting", "Fact Checking", "Editorial Research", "Multi-Platform Writing", "Media Ethics"]
        }
      });
    }

    const prompt = `
You are an expert resume writer and journalism mentor for Ruchita Sahukari (IIMC Dhenkanal).

Task: Generate polished, accomplishment-oriented resume bullet points and an executive description for a ${experienceType} entry:

Details:
- Role / Title: "${role || "Journalism Role"}"
- Organization: "${organization || "Media Organization"}"
- Time Period: "${period || "Recent"}"
- Rough Notes / Achievements: "${roughNotes || "Handled reporting, drafting articles, interviewing sources, and digital publishing."}"

Requirements:
1. "polishedRole": Clean, standardized title.
2. "polishedOrganization": Standardized organization name.
3. "polishedDescription": A concise 2-sentence overview of the scope and core responsibilities.
4. "bulletPoints": Exactly 4 high-impact resume bullet points starting with strong action verbs (e.g., Investigated, Spearheaded, Authored, Coordinated, Synthesized) highlighting measurable impact, journalistic rigor, and communication excellence.
5. "skillsUsed": Array of 4-6 relevant skill tags.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            polishedRole: { type: Type.STRING },
            polishedOrganization: { type: Type.STRING },
            polishedDescription: { type: Type.STRING },
            bulletPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            skillsUsed: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            "polishedRole",
            "polishedOrganization",
            "polishedDescription",
            "bulletPoints",
            "skillsUsed",
          ],
        },
      },
    });

    const jsonText = response.text || "{}";
    const parsedData = JSON.parse(jsonText);

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error("Gemini experience bullets error:", error);
    return res.status(500).json({
      error: error.message || "Failed to generate experience bullets",
      details: String(error),
    });
  }
});

// AI Certificate Summarizer Endpoint
app.post("/api/ai/summarize-certificate", async (req, res) => {
  try {
    const { title, issuer, issueDate, credentialId, rawDetails, skills } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        isFallback: true,
        data: {
          title: title || "Professional Certification",
          issuer: issuer || "Accredited Institution",
          issueDate: issueDate || "Recent",
          credentialId: credentialId || "VERIFIED-CREDENTIAL",
          description: rawDetails || `Verified credential awarded by ${issuer || "the issuing body"} demonstrating professional mastery and field competencies.`,
          skills: skills && skills.length > 0 ? skills : ["Professional Excellence", "Industry Standards", "Verified Skills"]
        }
      });
    }

    const prompt = `
You are an expert editorial writer and career advisor for Ruchita Sahukari, a professional journalist and communications strategist (IIMC Dhenkanal).

Task: Summarize and polish a Certificate / Credential / Award entry for her portfolio.

Input:
- Title / Award Name: "${title || "Not specified"}"
- Issuer / Institution / Org: "${issuer || "Not specified"}"
- Date / Year: "${issueDate || "Not specified"}"
- Credential ID / URL: "${credentialId || "Not specified"}"
- Raw Notes / Syllabus / Description: "${rawDetails || "Not provided"}"
- Suggested Skills: "${skills ? skills.join(", ") : ""}"

Requirements:
1. "title": Crisp, formal credential name.
2. "issuer": Verified formal name of institution/organization.
3. "description": A high-impact 2-sentence summary of the competencies mastered, rigors completed, and practical industry relevance.
4. "skills": Array of 3-5 concise skill tags (e.g. ["Investigative Reporting", "Digital Media", "Public Policy"]).
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            issuer: { type: Type.STRING },
            description: { type: Type.STRING },
            skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["title", "issuer", "description", "skills"]
        }
      }
    });

    const jsonText = response.text || "{}";
    const parsed = JSON.parse(jsonText);
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("Gemini certificate summarizer error:", error);
    return res.status(500).json({ error: error.message || "Failed to summarize certificate" });
  }
});

// Vite middleware & Static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Portfolio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
