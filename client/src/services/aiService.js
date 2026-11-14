import api from './api';

export const aiService = {
  /**
   * 1. Improve Professional Summary
   */
  async improveSummary({ text = '', role = '', tone = 'professional', cvData = null }) {
    const res = await api.post('/ai/improve-summary', { text, role, tone, cvData });
    return res.data;
  },

  /**
   * 2. Rewrite Career Objective
   */
  async rewriteObjective({ text = '', role = '', field = '', education = '' }) {
    const res = await api.post('/ai/rewrite-objective', { text, role, field, education });
    return res.data;
  },

  /**
   * 3. Convert Responsibilities into Action Bullet Points
   */
  async improveExperience({ experienceItem = {}, role = '', targetBullet = '' }) {
    const res = await api.post('/ai/improve-experience', { experienceItem, role, targetBullet });
    return res.data;
  },

  /**
   * 4. Fix Grammar & Make Concise
   */
  async fixGrammar({ text = '' }) {
    const res = await api.post('/ai/fix-grammar', { text });
    return res.data;
  },

  /**
   * 5. Suggest Relevant Skills for Role
   */
  async suggestSkills({ jobTitle = '', existingSkills = [], industry = '' }) {
    const res = await api.post('/ai/suggest-skills', { jobTitle, existingSkills, industry });
    return res.data;
  },

  /**
   * 6. Tailor CV to Job Description
   */
  async matchJobDescription({ cvData = {}, jobDescription = '' }) {
    const res = await api.post('/ai/match-job', { cvData, jobDescription });
    return res.data;
  },

  /**
   * 7. Missing Info & Length Detector
   */
  async detectIssues({ cvData = {} }) {
    const res = await api.post('/ai/detect-issues', { cvData });
    return res.data;
  },

  // Backward-compatible methods
  async generateSummary(cvData, tone = 'professional', prompt = '', role = '') {
    const res = await api.post('/ai/generate-summary', { cvData, tone, prompt, role });
    return res.data;
  },

  async reviewCV(cvData) {
    const res = await api.post('/ai/review-cv', { cvData });
    return res.data;
  },

  async generateCV(prompt, targetRole) {
    const res = await api.post('/ai/improve-summary', { text: prompt, role: targetRole });
    return res.data;
  },
};

export default aiService;
