import test from 'node:test';
import assert from 'node:assert/strict';
import {
  improveSummary,
  rewriteObjective,
  improveExperience,
  fixGrammarAndConcise,
  suggestSkills,
  matchJobDescription,
  detectCVIssues,
} from '../src/services/ai/geminiService.js';

test('AI Service Suite', async (t) => {
  await t.test('1. improveSummary: generates high-impact variations without hallucinating fake facts', async () => {
    const result = await improveSummary({
      text: 'I worked on frontend react code and helped backend team.',
      role: 'Full Stack Engineer',
    });

    assert.equal(result.success, true);
    assert.ok(Array.isArray(result.options) && result.options.length >= 2);
    assert.ok(result.options[0].text.length > 20);
    // Anti-fabrication check: does not invent arbitrary fake companies
    assert.doesNotMatch(result.options[0].text, /worked at Google|worked at Meta/i);
  });

  await t.test('2. rewriteObjective: generates tailored career objective for freshers', async () => {
    const result = await rewriteObjective({
      text: 'Want an entry level job to start my career.',
      role: 'Junior Software Engineer',
      education: 'B.Sc. in Computer Science',
    });

    assert.equal(result.success, true);
    assert.ok(Array.isArray(result.options) && result.options.length >= 2);
    assert.ok(result.options[0].text.includes('Junior Software Engineer') || result.options[0].text.includes('engineer') || result.options[0].text.includes('candidate'));
  });

  await t.test('3. improveExperience: converts to action verbs and inserts [X]% placeholders for unquantified text', async () => {
    const result = await improveExperience({
      experienceItem: { jobTitle: 'Web Developer', company: 'TechCorp' },
      targetBullet: 'helped speed up the website and fixed bugs',
    });

    assert.equal(result.success, true);
    assert.ok(Array.isArray(result.bullets) && result.bullets.length > 0);
    const bulletText = result.bullets[0].text;
    assert.ok(bulletText.length > 20);
    // Verify it contains a bracketed metric placeholder prompting user for real figure
    assert.ok(bulletText.includes('[X]') || bulletText.includes('[Number]') || bulletText.includes('[X]%') || bulletText.includes('['));
  });

  await t.test('4. fixGrammarAndConcise: eliminates wordy filler while preserving facts', async () => {
    const wordy = 'In order to build the app, I was responsible for writing the API due to the fact that we needed data.';
    const result = await fixGrammarAndConcise({ text: wordy });

    assert.equal(result.success, true);
    assert.ok(result.corrected.length < wordy.length);
    assert.doesNotMatch(result.corrected, /\bin order to\b/i);
    assert.doesNotMatch(result.corrected, /\bdue to the fact that\b/i);
  });

  await t.test('5. suggestSkills: recommends relevant skills and excludes already added skills', async () => {
    const existing = ['React', 'JavaScript'];
    const result = await suggestSkills({
      jobTitle: 'Frontend Engineer',
      existingSkills: existing,
    });

    assert.equal(result.success, true);
    assert.ok(Array.isArray(result.technicalSkills));
    // Verify existing skills are filtered out
    assert.ok(!result.technicalSkills.includes('React'));
    assert.ok(result.technicalSkills.length > 0);
  });

  await t.test('6. matchJobDescription: computes ATS match score, matched & missing keywords', async () => {
    const cvData = {
      personalInfo: { jobTitle: 'Full Stack Developer' },
      skills: ['React', 'Node.js', 'PostgreSQL', 'Git'],
      experience: [{ jobTitle: 'Software Engineer', company: 'Acme', highlights: ['Built web services'] }],
    };
    const jobDescription = 'Looking for a Full Stack Developer with React, Node.js, and Docker experience to build microservices with Kubernetes.';

    const result = await matchJobDescription({ cvData, jobDescription });
    assert.equal(result.success, true);
    assert.ok(result.matchScore > 0 && result.matchScore <= 100);
    assert.ok(result.matchedKeywords.length > 0);
  });

  await t.test('7. detectCVIssues: flags missing contact info, missing dates, and bullets > 200 characters', async () => {
    const cvData = {
      personalInfo: { fullName: 'Alex', email: '', phone: '' },
      education: [{ degree: 'B.Sc.', institution: '', year: '' }],
      experience: [
        {
          jobTitle: 'Developer',
          company: 'Acme',
          startDate: '',
          highlights: [
            'Short bullet',
            'This is an extremely long bullet point that goes on and on without stopping to take a breath and describes thirty different tasks in a single sentence which makes it virtually impossible for an executive recruiter to quickly scan or understand within the 6-second resume review benchmark!'.repeat(2),
          ],
        },
      ],
      skills: [],
    };

    const result = detectCVIssues(cvData);
    assert.equal(result.success, true);
    assert.ok(result.totalIssues >= 4);

    const lengthIssues = result.issues.filter((i) => i.type === 'length');
    assert.ok(lengthIssues.length >= 1);
    assert.ok(lengthIssues[0].bulletText.length > 200);

    const missingEmail = result.issues.find((i) => i.field === 'email');
    assert.ok(missingEmail);
  });
});
