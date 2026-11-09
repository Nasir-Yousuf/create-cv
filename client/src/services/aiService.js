import api from './api';

export const aiService = {
  // Generate full CV structure conversationally
  async generateCV(prompt, targetRole) {
    const res = await api.post('/ai/generate-cv', { prompt, targetRole });
    return res.data;
  },

  // Generate / rewrite professional summary
  async generateSummary(cvData, tone = 'professional') {
    const res = await api.post('/ai/generate-summary', { cvData, tone });
    return res.data;
  },

  // Improve work experience bullet points
  async improveExperience(experienceItem, role) {
    const res = await api.post('/ai/improve-experience', { experienceItem, role });
    return res.data;
  },

  // Suggest relevant industry skills
  async suggestSkills(jobTitle, existingSkills) {
    const res = await api.post('/ai/suggest-skills', { jobTitle, existingSkills });
    return res.data;
  },

  // Match CV against target job description
  async matchJobDescription(cvData, jobDescription) {
    const res = await api.post('/ai/match-job', { cvData, jobDescription });
    return res.data;
  },

  // Review CV completeness, ATS score, and improvements
  async reviewCV(cvData) {
    const res = await api.post('/ai/review-cv', { cvData });
    return res.data;
  },

  // Natural language design assistant
  async assistantDesign(instruction, currentDesign) {
    const res = await api.post('/ai/design-assistant', { instruction, currentDesign });
    return res.data;
  },
};

export default aiService;

