import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Ensure environment variables are loaded
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

const PRIMARY_MODEL = 'gemini-3.5-flash-lite';
const FALLBACK_MODELS = ['gemini-3.8-flash', 'gemini-flash-latest'];

const SYSTEM_PROMPT = `You are NovaCV's elite ATS Resume and Career Optimization AI.
CRITICAL ANTI-FABRICATION RULE:
1. You must NEVER invent, assume, or hallucinate factual claims, companies, job titles, universities, degrees, employment dates, certifications, awards, or arbitrary statistics.
2. Only rewrite, polish, tighten, or restructure information explicitly provided by the user.
3. If the user asks to quantify impact or make bullet points metrics-driven, but has provided no numeric metrics, YOU MUST NOT invent numbers (e.g., do NOT say "increased sales by 35%"). Instead, use clear bracketed placeholders like [X]%, [Number], [$Amount], or [Duration] so the user is directly prompted to fill in their own verified figures.
4. Use active, powerful action verbs (e.g., Architected, Spearheaded, Optimized, Orchestrated, Streamlined, Negotiated). Never use weak verbs (e.g., "Responsible for", "Helped with", "Worked on").
5. Remove all first-person pronouns ("I", "me", "my", "we").
6. Keep bullet points concise and impactful: ideally 1 to 2 lines (under 180 characters, strictly under 200 characters).
`;

/**
 * Execute Gemini model call with model fallback cascade
 */
async function callGemini(prompt, systemInstruction = SYSTEM_PROMPT) {
  if (!genAI) {
    throw new Error('GEMINI_API_KEY not configured on server');
  }

  const modelCandidates = [PRIMARY_MODEL, ...FALLBACK_MODELS];
  let lastError = null;

  for (const modelName of modelCandidates) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction,
        generationConfig: {
          temperature: 0.3, // Lower temperature to avoid hallucinations
          topP: 0.85,
          maxOutputTokens: 1024,
        },
      });

      const result = await model.generateContent(prompt);
      const text = result?.response?.text();
      if (text && text.trim().length > 0) {
        return text.trim();
      }
    } catch (err) {
      lastError = err;
      console.warn(`[GeminiService] Model ${modelName} failed: ${err.message}. Trying next candidate...`);
    }
  }

  throw lastError || new Error('All Gemini model candidates failed');
}

/**
 * Safe JSON parser for LLM responses
 */
function parseJSONResponse(rawText, fallbackObj) {
  try {
    const clean = rawText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();
    return JSON.parse(clean);
  } catch {
    return fallbackObj;
  }
}

// -----------------------------------------------------------------------------
// Contextual AI Actions
// -----------------------------------------------------------------------------

/**
 * 1. Improve Professional Summary
 */
export async function improveSummary({ text = '', role = '', tone = 'professional', existingCV = null }) {
  const currentSummary = text || existingCV?.personalInfo?.summary || existingCV?.summary || '';
  const currentRole = role || existingCV?.personalInfo?.jobTitle || 'Professional';

  try {
    const prompt = `Task: Generate 3 high-impact professional summary variations for a "${currentRole}" based ONLY on the following profile details.
Original Summary: "${currentSummary || 'None provided'}"
Tone Requested: ${tone}

Anti-Fabrication Rules:
- DO NOT invent degrees, employers, or specific fake numbers.
- If no background is provided, focus on core domain competencies standard for "${currentRole}".
- Return JSON strictly in this format:
{
  "options": [
    { "title": "Executive & Impact-Focused", "text": "..." },
    { "title": "ATS & Keyword-Optimized", "text": "..." },
    { "title": "Concise & Modern", "text": "..." }
  ]
}`;

    const raw = await callGemini(prompt);
    const parsed = parseJSONResponse(raw, null);
    if (parsed && Array.isArray(parsed.options) && parsed.options.length > 0) {
      return { success: true, options: parsed.options, original: currentSummary };
    }
  } catch (err) {
    console.warn('[improveSummary] AI generation failed, using intelligent rule-based fallback:', err.message);
  }

  // Fallback Heuristics
  const base = currentSummary.trim();
  const cleanRole = currentRole.trim();
  return {
    success: true,
    original: currentSummary,
    options: [
      {
        title: 'Executive & Impact-Focused',
        text: base
          ? `Accomplished ${cleanRole} with a proven track record of ${base.charAt(0).toLowerCase() + base.slice(1)}. Adept at cross-functional leadership, operational excellence, and delivering measurable business outcomes.`
          : `Results-driven ${cleanRole} with proven expertise in end-to-end project execution, team collaboration, and process optimization. Committed to driving scalable organizational impact and delivering high-quality deliverables.`,
      },
      {
        title: 'ATS & Keyword-Optimized',
        text: base
          ? `Performance-driven ${cleanRole} offering strong competencies in workflow design and problem-solving. ${base}`
          : `Detail-oriented ${cleanRole} skilled in strategic planning, stakeholder communication, and performance optimization. Recognized for technical precision, agile problem-solving, and continuous workflow improvements.`,
      },
      {
        title: 'Concise & Modern',
        text: base
          ? `${cleanRole} dedicated to excellence: ${base.replace(/^I am a /i, '').replace(/^Dedicated /i, '')}`
          : `Versatile ${cleanRole} with a strong foundation in contemporary industry practices. Focused on delivering reliable solutions, optimizing resources, and elevating team benchmarks.`,
      },
    ],
  };
}

/**
 * 2. Rewrite Career Objective
 */
export async function rewriteObjective({ text = '', role = '', field = '', education = '' }) {
  const currentObjective = text || '';
  const currentRole = role || 'Graduate / Entry-Level Role';

  try {
    const prompt = `Task: Rewrite and polish a truthful Career Objective for a candidate seeking a "${currentRole}".
Education/Field: "${education || field || 'Higher Education'}"
Original Text: "${currentObjective || 'None provided'}"

Anti-Fabrication Rules:
- Focus on genuine ambition, academic foundations, and value the candidate brings to the employer.
- DO NOT invent past employers or fake experience.
- Return JSON strictly in this format:
{
  "options": [
    { "title": "Growth & Value-Oriented", "text": "..." },
    { "title": "Academic & Skills-Centered", "text": "..." },
    { "title": "Concise & Forward-Looking", "text": "..." }
  ]
}`;

    const raw = await callGemini(prompt);
    const parsed = parseJSONResponse(raw, null);
    if (parsed && Array.isArray(parsed.options) && parsed.options.length > 0) {
      return { success: true, options: parsed.options, original: currentObjective };
    }
  } catch (err) {
    console.warn('[rewriteObjective] AI generation failed, using intelligent fallback:', err.message);
  }

  // Heuristic Fallback
  const cleanRole = currentRole.trim();
  return {
    success: true,
    original: currentObjective,
    options: [
      {
        title: 'Growth & Value-Oriented',
        text: `Motivated and analytical candidate aiming to leverage solid academic foundations and disciplined problem-solving to contribute to high-impact initiatives as a ${cleanRole}.`,
      },
      {
        title: 'Academic & Skills-Centered',
        text: `Detail-oriented graduate seeking an entry-level ${cleanRole} position to apply strong theoretical training, collaboration abilities, and adaptability in a progressive, fast-paced environment.`,
      },
      {
        title: 'Concise & Forward-Looking',
        text: `Aspiring ${cleanRole} dedicated to delivering high-quality operational support, learning rapidly, and driving team success through proactive execution.`,
      },
    ],
  };
}

/**
 * 3. Convert Responsibilities into Action Bullet Points (Quantify with bracketed metrics)
 */
export async function improveExperience({ experienceItem = {}, role = '', targetBullet = '' }) {
  const originalText = targetBullet || (Array.isArray(experienceItem?.highlights) ? experienceItem.highlights.join('\n') : experienceItem?.description || '');
  const jobRole = role || experienceItem?.jobTitle || experienceItem?.title || 'Professional';
  const company = experienceItem?.company || '';

  try {
    const prompt = `Task: Transform the following resume responsibilities/bullet points for a "${jobRole}" at "${company || 'company'}" into high-impact, ATS-optimized action bullets.
Original Text:
"${originalText}"

Strict Anti-Fabrication & Metric Rules:
1. Begin every bullet with a strong past-tense action verb (e.g., Spearheaded, Architected, Automated, Streamlined).
2. NEVER invent exact numeric figures (e.g., DO NOT write "increased revenue by 42%").
3. Wherever an accomplishment can be measured, insert bracketed placeholders like [X]%, [Number], [$Amount], or [Duration] prompting the user to fill in their real metrics!
4. Keep each bullet point under 180 characters.
5. Return JSON strictly in this format:
{
  "bullets": [
    { "text": "...", "highlightMetric": "[X]%" },
    { "text": "...", "highlightMetric": "[Number]" }
  ],
  "advice": "..."
}`;

    const raw = await callGemini(prompt);
    const parsed = parseJSONResponse(raw, null);
    if (parsed && Array.isArray(parsed.bullets) && parsed.bullets.length > 0) {
      return {
        success: true,
        bullets: parsed.bullets,
        original: originalText,
        advice: parsed.advice || 'Replace bracketed [X]% placeholders with your verified statistics.',
      };
    }
  } catch (err) {
    console.warn('[improveExperience] AI generation failed, using intelligent fallback:', err.message);
  }

  // Heuristic Fallback
  const lines = originalText
    .split('\n')
    .map((l) => l.trim().replace(/^[-•*]\s*/, ''))
    .filter(Boolean);

  const fallbackBullets = (lines.length > 0 ? lines : ['Managed core operational responsibilities and supported team deliverables']).map((line) => {
    let verb = 'Spearheaded';
    if (/design|ui|ux/i.test(line)) verb = 'Architected';
    else if (/code|develop|build|api/i.test(line)) verb = 'Engineered';
    else if (/test|qa|bug/i.test(line)) verb = 'Optimized';
    else if (/lead|manage|coord/i.test(line)) verb = 'Orchestrated';
    else if (/client|customer|support/i.test(line)) verb = 'Streamlined';

    const cleaned = line.replace(/^(responsible for|helped to|worked on|managed|did)\s*/i, '');
    const text = `${verb} ${cleaned.charAt(0).toLowerCase() + cleaned.slice(1)}, improving efficiency by [X]% and reducing turnaround by [Number] days.`;
    return {
      text: text.length > 200 ? text.slice(0, 195) + '...' : text,
      highlightMetric: '[X]%',
    };
  });

  return {
    success: true,
    original: originalText,
    bullets: fallbackBullets,
    advice: 'Customize bracketed placeholders [X]% and [Number] with your real accomplishments.',
  };
}

/**
 * 4. Fix Grammar & Make Concise
 */
export async function fixGrammarAndConcise({ text = '' }) {
  if (!text || text.trim().length === 0) {
    return { success: true, original: '', corrected: '', changes: [] };
  }

  try {
    const prompt = `Task: Fix all grammatical, spelling, and punctuation errors in the following resume text, and make it concise and active without changing ANY factual meaning, tools, dates, or names.
Original Text:
"${text}"

Rules:
- DO NOT invent any facts or metrics.
- Keep the exact same tone and factual substance.
- Return JSON strictly in this format:
{
  "corrected": "...",
  "changes": ["Corrected subject-verb agreement", "Removed wordy filler phrase"]
}`;

    const raw = await callGemini(prompt);
    const parsed = parseJSONResponse(raw, null);
    if (parsed && parsed.corrected) {
      return {
        success: true,
        original: text,
        corrected: parsed.corrected,
        changes: parsed.changes || ['Tightened phrasing and fixed punctuation'],
      };
    }
  } catch (err) {
    console.warn('[fixGrammarAndConcise] AI generation failed, using heuristic cleanup:', err.message);
  }

  // Heuristic cleanup
  let cleaned = text
    .replace(/\s+/g, ' ')
    .replace(/\s([.,!?:;])/g, '$1')
    .replace(/\b(in order to)\b/gi, 'to')
    .replace(/\b(due to the fact that)\b/gi, 'because')
    .replace(/\b(responsible for)\b/gi, 'led')
    .replace(/\b(a wide variety of)\b/gi, 'diverse')
    .replace(/\b(i was able to)\b/gi, 'successfully')
    .trim();

  return {
    success: true,
    original: text,
    corrected: cleaned,
    changes: ['Eliminated wordy phrases and streamlined active voice.'],
  };
}

/**
 * 5. Suggest Relevant Skills for Role
 */
export async function suggestSkills({ jobTitle = '', existingSkills = [], industry = '' }) {
  const title = jobTitle || 'Software Engineer';
  const existingList = Array.isArray(existingSkills)
    ? existingSkills.map((s) => (typeof s === 'string' ? s : s?.name || '')).filter(Boolean)
    : [];

  try {
    const prompt = `Task: Recommend industry-standard, high-demand skills for a candidate in the role of "${title}" (Industry: "${industry || 'General'}").
Existing Skills already listed: ${JSON.stringify(existingList)}

Rules:
- DO NOT include skills already listed.
- Categorize into Technical / Hard Skills and Core Competencies / Soft Skills.
- Return JSON strictly in this format:
{
  "technicalSkills": ["Skill 1", "Skill 2", ...],
  "coreCompetencies": ["Competency 1", "Competency 2", ...]
}`;

    const raw = await callGemini(prompt);
    const parsed = parseJSONResponse(raw, null);
    if (parsed && (Array.isArray(parsed.technicalSkills) || Array.isArray(parsed.coreCompetencies))) {
      return {
        success: true,
        jobTitle: title,
        technicalSkills: (parsed.technicalSkills || []).filter((s) => !existingList.includes(s)),
        coreCompetencies: (parsed.coreCompetencies || []).filter((s) => !existingList.includes(s)),
      };
    }
  } catch (err) {
    console.warn('[suggestSkills] AI generation failed, using intelligent preset fallback:', err.message);
  }

  // Pre-configured industry standard skills
  const lower = title.toLowerCase();
  let tech = ['Git', 'Agile / Scrum', 'RESTful APIs', 'SQL'];
  let soft = ['Problem Solving', 'Cross-Functional Collaboration', 'Critical Thinking', 'Time Management'];

  if (/software|developer|frontend|backend|full stack|web/i.test(lower)) {
    tech = ['TypeScript', 'React.js', 'Node.js', 'PostgreSQL', 'Docker', 'CI/CD Pipelines', 'Tailwind CSS'];
    soft = ['System Design', 'Code Reviews', 'Agile Delivery', 'Technical Documentation'];
  } else if (/data|analytics|business intelligence|bi/i.test(lower)) {
    tech = ['Python', 'SQL Query Optimization', 'Tableau / PowerBI', 'Pandas', 'Statistical Modeling'];
    soft = ['Data Storytelling', 'Stakeholder Communication', 'Quantitative Analysis'];
  } else if (/finance|bank|account|audit/i.test(lower)) {
    tech = ['Financial Modeling', 'Credit Risk Analysis', 'Advanced MS Excel', 'Variance Analysis', 'GAAP / IFRS'];
    soft = ['Regulatory Compliance', 'Fiscal Integrity', 'Client Portfolio Management'];
  } else if (/marketing|seo|growth|content/i.test(lower)) {
    tech = ['Google Analytics 4', 'SEO & SEM', 'HubSpot / CRM', 'Meta Ads Manager', 'Conversion Rate Optimization'];
    soft = ['Brand Positioning', 'A/B Testing Strategy', 'Copywriting & Narrative'];
  } else if (/health|doctor|nurse|medical/i.test(lower)) {
    tech = ['Clinical Diagnosis', 'Patient Triage', 'Electronic Medical Records (EMR)', 'Infection Control'];
    soft = ['Empathetic Patient Care', 'Interdisciplinary Teamwork', 'Crisis Decision Making'];
  }

  return {
    success: true,
    jobTitle: title,
    technicalSkills: tech.filter((s) => !existingList.includes(s)),
    coreCompetencies: soft.filter((s) => !existingList.includes(s)),
  };
}

/**
 * 6. Tailor CV to Job Description
 */
export async function matchJobDescription({ cvData = {}, jobDescription = '' }) {
  if (!jobDescription || jobDescription.trim().length < 20) {
    return {
      success: false,
      message: 'Please provide a job description of at least 20 characters.',
    };
  }

  const cvSummary = {
    jobTitle: cvData?.personalInfo?.jobTitle || '',
    skills: (cvData?.skills || []).map((s) => (typeof s === 'string' ? s : s?.name || '')),
    experienceCount: (cvData?.experience || []).length,
    experienceSnippets: (cvData?.experience || []).slice(0, 3).map((e) => `${e.jobTitle || ''} at ${e.company || ''}: ${e.highlights ? e.highlights.slice(0, 2).join(' ') : ''}`),
  };

  try {
    const prompt = `Task: Compare this candidate's CV profile against the target job posting.
Candidate Profile:
${JSON.stringify(cvSummary, null, 2)}

Target Job Description:
"""
${jobDescription.slice(0, 3000)}
"""

Strict Rules:
- Calculate an ATS Match Score (0 - 100).
- Identify matched keywords found in both.
- Identify critical missing keywords from the job description not in the CV.
- Anti-fabrication: Advise candidate to incorporate only skills and experiences they genuinely possess.
- Return JSON strictly in this format:
{
  "matchScore": 75,
  "matchedKeywords": ["React", "TypeScript", "REST APIs"],
  "missingKeywords": ["AWS Lambda", "Kubernetes"],
  "recommendations": [
    "Highlight scalable backend projects in your work experience.",
    "Ensure your summary explicitly mentions your target role."
  ]
}`;

    const raw = await callGemini(prompt);
    const parsed = parseJSONResponse(raw, null);
    if (parsed && typeof parsed.matchScore === 'number') {
      return {
        success: true,
        matchScore: Math.min(100, Math.max(0, parsed.matchScore)),
        matchedKeywords: parsed.matchedKeywords || [],
        missingKeywords: parsed.missingKeywords || [],
        recommendations: parsed.recommendations || [],
      };
    }
  } catch (err) {
    console.warn('[matchJobDescription] AI generation failed, using keyword extractor fallback:', err.message);
  }

  // Fallback keyword matcher
  const jdWords = new Set(
    jobDescription
      .toLowerCase()
      .replace(/[^a-z0-9+#]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3)
  );

  const matched = [];
  const missingCandidates = ['Docker', 'Cloud Architecture', 'Agile / Scrum', 'CI/CD', 'Leadership', 'Testing'];
  const missing = [];

  for (const s of cvSummary.skills) {
    if (jdWords.has(s.toLowerCase())) matched.push(s);
  }

  for (const c of missingCandidates) {
    if (jdWords.has(c.toLowerCase()) && !cvSummary.skills.some((s) => s.toLowerCase() === c.toLowerCase())) {
      missing.push(c);
    }
  }

  const score = Math.min(95, Math.max(45, Math.round((matched.length / Math.max(1, matched.length + missing.length)) * 100)));

  return {
    success: true,
    matchScore: score,
    matchedKeywords: matched.length > 0 ? matched : ['Core Domain Knowledge'],
    missingKeywords: missing.length > 0 ? missing : ['Specific Cloud / Tool Certification'],
    recommendations: [
      'Align your professional summary directly with the primary responsibilities in the job posting.',
      'Quantify your deliverables using action verbs and verified metrics.',
    ],
  };
}

/**
 * 7. Missing Info & Length Detector
 */
export function detectCVIssues(cvData = {}) {
  const issues = [];
  const personal = cvData?.personalInfo || {};

  // Contact checks
  if (!personal.email || !personal.email.includes('@')) {
    issues.push({
      type: 'missing_info',
      severity: 'error',
      section: 'Personal Info',
      field: 'email',
      message: 'Missing or invalid email address.',
      recommendation: 'Recruiters require a valid email to contact you.',
    });
  }

  if (!personal.phone) {
    issues.push({
      type: 'missing_info',
      severity: 'warning',
      section: 'Personal Info',
      field: 'phone',
      message: 'No contact phone number provided.',
      recommendation: 'Add a contact phone number with country code.',
    });
  }

  if (!personal.jobTitle) {
    issues.push({
      type: 'missing_info',
      severity: 'warning',
      section: 'Personal Info',
      field: 'jobTitle',
      message: 'Job Title / Professional Headline is empty.',
      recommendation: 'Specify your target role so recruiters know your specialty.',
    });
  }

  // Summary checks
  const summaryText = personal.summary || cvData?.summary || '';
  if (!summaryText || summaryText.trim().length === 0) {
    issues.push({
      type: 'missing_info',
      severity: 'suggestion',
      section: 'Summary',
      message: 'Professional Summary is empty.',
      recommendation: 'A 2-3 sentence summary elevates recruiter interest by 40%.',
    });
  }

  // Education checks
  const education = cvData?.education || [];
  if (education.length === 0) {
    issues.push({
      type: 'missing_info',
      severity: 'warning',
      section: 'Education',
      message: 'No education entries added.',
      recommendation: 'List your highest degree, diploma, or certification.',
    });
  } else {
    education.forEach((edu, idx) => {
      if (!edu.institution) {
        issues.push({
          type: 'missing_info',
          severity: 'warning',
          section: 'Education',
          message: `Education #${idx + 1} is missing institution / university name.`,
          recommendation: 'Add the institution name.',
        });
      }
      if (!edu.year && !edu.graduationYear && !edu.startDate && !edu.endDate) {
        issues.push({
          type: 'missing_info',
          severity: 'warning',
          section: 'Education',
          message: `Education #${idx + 1} (${edu.degree || 'Degree'}) is missing graduation year or dates.`,
          recommendation: 'Add your graduation or completion date.',
        });
      }
    });
  }

  // Experience & Bullet Length checks
  const experience = cvData?.experience || [];
  experience.forEach((exp, expIdx) => {
    if (!exp.jobTitle) {
      issues.push({
        type: 'missing_info',
        severity: 'warning',
        section: 'Experience',
        message: `Work Experience #${expIdx + 1} is missing a Job Title.`,
        recommendation: 'Enter your formal position or title.',
      });
    }
    if (!exp.startDate && !exp.year) {
      issues.push({
        type: 'missing_info',
        severity: 'warning',
        section: 'Experience',
        message: `Work Experience #${expIdx + 1} (${exp.jobTitle || 'Job'}) is missing start date.`,
        recommendation: 'Add employment start and end dates.',
      });
    }

    // Bullet lengths
    const highlights = Array.isArray(exp.highlights)
      ? exp.highlights
      : (exp.description || '').split('\n').filter(Boolean);

    highlights.forEach((bullet, bIdx) => {
      const clean = bullet.trim();
      if (clean.length > 200) {
        issues.push({
          type: 'length',
          severity: 'warning',
          section: 'Experience',
          message: `Bullet #${bIdx + 1} in "${exp.company || 'Job ' + (expIdx + 1)}" is too long (${clean.length} characters).`,
          recommendation: 'Recruiters scan quickly. Keep bullets under 200 characters (1-2 lines) for maximum readability.',
          bulletText: clean,
          itemIndex: expIdx,
          bulletIndex: bIdx,
        });
      }
    });
  });

  // Skills checks
  const skills = cvData?.skills || [];
  if (skills.length < 3) {
    issues.push({
      type: 'missing_info',
      severity: 'suggestion',
      section: 'Skills',
      message: `Only ${skills.length} skills listed.`,
      recommendation: 'Aim for at least 5-8 relevant technical and core skills to pass ATS filtering.',
    });
  }

  return {
    success: true,
    totalIssues: issues.length,
    criticalCount: issues.filter((i) => i.severity === 'error').length,
    warningCount: issues.filter((i) => i.severity === 'warning').length,
    suggestionCount: issues.filter((i) => i.severity === 'suggestion').length,
    issues,
  };
}

export default {
  improveSummary,
  rewriteObjective,
  improveExperience,
  fixGrammarAndConcise,
  suggestSkills,
  matchJobDescription,
  detectCVIssues,
};
