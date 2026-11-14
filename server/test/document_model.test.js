import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeCvData, hasExportableCvContent, DEFAULT_DESIGN_TOKENS, DEFAULT_SECTION_CONFIG } from '../../shared/utils/cvNormalize.js';
import CV from '../src/models/CV.js';
import { ALLOWED_CV_FIELDS } from '../src/controllers/cvController.js';
import cvReducer, {
  updatePersonalInfo,
  updateExperience,
  updateDesignTokens,
  updateDesign,
  undo,
  redo,
  resetDesignToTemplateDefaults,
  setSaveStatus,
  setSavingState,
  setElementOverride,
  removeElementOverride,
  clearAllElementOverrides,
  setSectionConfig,
  updateSectionConfigItem,
  toggleSectionVisibility,
  addInternship,
  updateInternship,
  removeInternship,
  addAchievement,
  updateAchievement,
  removeAchievement,
  addVolunteer,
  updateVolunteer,
  removeVolunteer,
  addPublication,
  updatePublication,
  removePublication,
  addAdditionalInfo,
  updateAdditionalInfo,
  removeAdditionalInfo,
  addCustomSection,
  addCustomSectionItem,
  updateCustomSectionItem,
  removeCustomSectionItem,
  removeCustomSection,
  updateSummary,
  updateCareerObjective,
} from '../../client/src/store/cvSlice.js';

test('1. Document Model Normalization: Safe migration defaults for legacy documents', () => {
  const legacyCv = {
    title: 'My Legacy CV',
    personalInfo: {
      fullName: 'John Doe',
      email: 'john@example.com',
      photo: 'data:image/png;base64,abc1234',
      photoStyle: 'circle',
    },
    experience: [
      { role: 'Software Engineer', company: 'Acme Corp' }, // missing id and visible
    ],
    education: [
      { degree: 'B.Sc. Computer Science', institution: 'State University' },
    ],
    design: {
      primaryColor: '#2563eb',
      accentColor: '#38bdf8',
      fontFamily: 'Plus Jakarta Sans',
      columnRatio: '40/60',
      sectionOrder: ['summary', 'experience', 'education', 'skills'],
    },
  };

  const normalized = normalizeCvData(legacyCv);

  // Assert personalInfo enhancements
  assert.equal(normalized.personalInfo.fullName, 'John Doe');
  assert.equal(normalized.personalInfo.photoUrl, 'data:image/png;base64,abc1234');
  assert.equal(normalized.personalInfo.photoConfig.shape, 'circle');
  assert.equal(normalized.personalInfo.fatherName, '');
  assert.equal(normalized.personalInfo.nationality, '');
  assert.equal(normalized.personalInfo.religion, '');
  assert.equal(normalized.personalInfo.bloodGroup, '');

  // Assert root summary and careerObjective
  assert.equal(typeof normalized.summary, 'string');
  assert.equal(typeof normalized.careerObjective, 'string');

  // Assert array sections have stable ids and visible: true
  assert.equal(normalized.experience.length, 1);
  assert.ok(normalized.experience[0].id, 'Experience item must have stable id');
  assert.equal(normalized.experience[0].visible, true);

  assert.equal(normalized.education.length, 1);
  assert.ok(normalized.education[0].id, 'Education item must have stable id');
  assert.equal(normalized.education[0].visible, true);

  // Assert new array sections default to arrays
  assert.ok(Array.isArray(normalized.internships));
  assert.ok(Array.isArray(normalized.achievements));
  assert.ok(Array.isArray(normalized.volunteer));
  assert.ok(Array.isArray(normalized.publications));
  assert.ok(Array.isArray(normalized.additionalInfo));
  assert.ok(Array.isArray(normalized.customSections));

  // Assert sectionConfig is populated
  assert.ok(Array.isArray(normalized.sectionConfig));
  assert.ok(normalized.sectionConfig.length >= 10);
  const expConfig = normalized.sectionConfig.find((s) => s.id === 'experience');
  assert.ok(expConfig, 'Experience section should exist in sectionConfig');
  assert.equal(expConfig.column, 'main');

  // Assert designTokens migration from design
  assert.equal(normalized.designTokens.primaryColor, '#2563EB');
  assert.equal(normalized.designTokens.accentColor, '#38BDF8');
  assert.equal(normalized.designTokens.fontHeading, 'Plus Jakarta Sans');
  assert.equal(normalized.designTokens.fontBody, 'Plus Jakarta Sans');
  assert.equal(normalized.designTokens.columnRatio, '40/60');

  // Assert elementOverrides & customElements
  assert.deepEqual(normalized.elementOverrides, {});
  assert.deepEqual(normalized.customElements, []);
});

test('2. Exportable content detection: Recognizes new sections and fields', () => {
  const cvWithInternships = {
    personalInfo: { fullName: 'Alex intern' },
    internships: [{ role: 'Frontend Intern', company: 'Tech Hub' }],
  };
  assert.equal(hasExportableCvContent(cvWithInternships), true);

  const cvWithAchievements = {
    personalInfo: { fullName: 'Prize Winner' },
    achievements: [{ title: '1st Place Hackathon' }],
  };
  assert.equal(hasExportableCvContent(cvWithAchievements), true);

  const emptyCv = {
    personalInfo: {},
  };
  assert.equal(hasExportableCvContent(emptyCv), false);
});

test('3. MongoDB CV Model Schema: Persists all Mode A and Mode B fields', () => {
  const paths = CV.schema.paths;

  // Root fields
  assert.ok(paths['summary'], 'Mongoose schema must include summary');
  assert.ok(paths['careerObjective'], 'Mongoose schema must include careerObjective');
  assert.ok(paths['sectionConfig'], 'Mongoose schema must include sectionConfig');
  assert.ok(paths['designTokens'], 'Mongoose schema must include designTokens');
  assert.ok(paths['elementOverrides'], 'Mongoose schema must include elementOverrides');
  assert.ok(paths['customElements'], 'Mongoose schema must include customElements');

  // New section arrays
  assert.ok(paths['internships'], 'Mongoose schema must include internships');
  assert.ok(paths['achievements'], 'Mongoose schema must include achievements');
  assert.ok(paths['volunteer'], 'Mongoose schema must include volunteer');
  assert.ok(paths['publications'], 'Mongoose schema must include publications');
  assert.ok(paths['additionalInfo'], 'Mongoose schema must include additionalInfo');

  // PersonalInfo subfields
  assert.ok(paths['personalInfo.portfolio'], 'personalInfo must include portfolio');
  assert.ok(paths['personalInfo.photoUrl'], 'personalInfo must include photoUrl');
  assert.ok(paths['personalInfo.photoConfig.shape'], 'personalInfo must include photoConfig.shape');
  assert.ok(paths['personalInfo.fatherName'], 'personalInfo must include fatherName');
  assert.ok(paths['personalInfo.motherName'], 'personalInfo must include motherName');
  assert.ok(paths['personalInfo.dob'], 'personalInfo must include dob');
  assert.ok(paths['personalInfo.nationality'], 'personalInfo must include nationality');
  assert.ok(paths['personalInfo.nid'], 'personalInfo must include nid');
  assert.ok(paths['personalInfo.religion'], 'personalInfo must include religion');
  assert.ok(paths['personalInfo.maritalStatus'], 'personalInfo must include maritalStatus');
  assert.ok(paths['personalInfo.permanentAddress'], 'personalInfo must include permanentAddress');
  assert.ok(paths['personalInfo.bloodGroup'], 'personalInfo must include bloodGroup');
});

test('4. Backend Controller ALLOWED_CV_FIELDS: Permits saving all new fields', () => {
  const requiredAllowedFields = [
    'summary',
    'careerObjective',
    'sectionConfig',
    'designTokens',
    'elementOverrides',
    'customElements',
    'internships',
    'achievements',
    'volunteer',
    'publications',
    'additionalInfo',
    'personalInfo',
    'education',
    'experience',
    'skills',
    'projects',
    'certifications',
    'languages',
    'references',
    'customSections',
    'design',
  ];

  for (const field of requiredAllowedFields) {
    assert.ok(
      ALLOWED_CV_FIELDS.includes(field),
      `ALLOWED_CV_FIELDS in cvController must allow saving "${field}"`
    );
  }
});

test('5. cvSlice Redux Store: Initial state defaults & saveStatus tracking', () => {
  let state = cvReducer(undefined, { type: '@@INIT' });

  // Initial State assertions
  assert.equal(state.saveStatus, 'saved');
  assert.equal(state.isDirty, false);
  assert.equal(state.isAutosaving, false);
  assert.equal(state.past.length, 0);
  assert.equal(state.future.length, 0);
  assert.ok(state.currentCV.designTokens, 'designTokens must exist on initial state');
  assert.ok(state.currentCV.sectionConfig, 'sectionConfig must exist on initial state');
  assert.deepEqual(state.currentCV.elementOverrides, {});
  assert.deepEqual(state.currentCV.customElements, []);

  // Update content triggers 'unsaved', isDirty: true, and pushes to past
  state = cvReducer(state, updatePersonalInfo({ fullName: 'Bruce Wayne' }));
  assert.equal(state.currentCV.personalInfo.fullName, 'Bruce Wayne');
  assert.equal(state.saveStatus, 'unsaved');
  assert.equal(state.isDirty, true);
  assert.equal(state.past.length, 1);

  // Transitions to saving and saved
  state = cvReducer(state, setSaveStatus('saving'));
  assert.equal(state.saveStatus, 'saving');
  assert.equal(state.isAutosaving, true);

  state = cvReducer(state, setSaveStatus('saved'));
  assert.equal(state.saveStatus, 'saved');
  assert.equal(state.isDirty, false);
  assert.equal(state.isAutosaving, false);
  assert.ok(state.lastSavedAt, 'lastSavedAt should be set on saved');

  // Error state
  state = cvReducer(state, setSaveStatus('error'));
  assert.equal(state.saveStatus, 'error');
});

test('6. cvSlice Undo / Redo History Stack (max 40 snapshots)', () => {
  let state = cvReducer(undefined, { type: '@@INIT' });

  // Perform 45 mutations
  for (let i = 1; i <= 45; i++) {
    state = cvReducer(state, updatePersonalInfo({ fullName: `Version ${i}` }));
  }

  // History stack must be capped at 40
  assert.equal(state.past.length, 40, 'History stack must not exceed 40 snapshots');
  assert.equal(state.currentCV.personalInfo.fullName, 'Version 45');

  // Undo restores previous
  state = cvReducer(state, undo());
  assert.equal(state.currentCV.personalInfo.fullName, 'Version 44');
  assert.equal(state.future.length, 1);

  // Redo reapplies
  state = cvReducer(state, redo());
  assert.equal(state.currentCV.personalInfo.fullName, 'Version 45');
  assert.equal(state.future.length, 0);
});

test('7. cvSlice Mode B: Granular elementOverrides & customElements', () => {
  let state = cvReducer(undefined, { type: '@@INIT' });

  // Add element override
  state = cvReducer(
    state,
    setElementOverride({
      path: 'personalInfo.fullName',
      overrides: { fontSize: 24, fontWeight: 'bold', color: '#1e40af' },
    })
  );

  assert.deepEqual(state.currentCV.elementOverrides['personalInfo.fullName'], {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
  });

  // Partial update on existing override
  state = cvReducer(
    state,
    setElementOverride({
      path: 'personalInfo.fullName',
      overrides: { italic: true },
    })
  );

  assert.equal(state.currentCV.elementOverrides['personalInfo.fullName'].fontSize, 24);
  assert.equal(state.currentCV.elementOverrides['personalInfo.fullName'].italic, true);

  // Remove specific override
  state = cvReducer(state, removeElementOverride('personalInfo.fullName'));
  assert.equal(state.currentCV.elementOverrides['personalInfo.fullName'], undefined);

  // Clear all overrides
  state = cvReducer(
    state,
    setElementOverride({ path: 'summary', overrides: { fontSize: 14 } })
  );
  assert.ok(state.currentCV.elementOverrides['summary']);
  state = cvReducer(state, clearAllElementOverrides());
  assert.deepEqual(state.currentCV.elementOverrides, {});
});

test('8. cvSlice Mode B: sectionConfig ordering, visibility, and column assignment', () => {
  let state = cvReducer(undefined, { type: '@@INIT' });

  // Update section config item
  state = cvReducer(
    state,
    updateSectionConfigItem({ id: 'experience', column: 'sidebar', label: 'Work History' })
  );
  const expConfig = state.currentCV.sectionConfig.find((s) => s.id === 'experience');
  assert.equal(expConfig.column, 'sidebar');
  assert.equal(expConfig.label, 'Work History');

  // Toggle visibility
  state = cvReducer(state, toggleSectionVisibility('education'));
  const eduConfig = state.currentCV.sectionConfig.find((s) => s.id === 'education');
  assert.equal(eduConfig.visible, false);
  // design.sectionOrder should exclude hidden sections
  assert.ok(!state.currentCV.design.sectionOrder.includes('education'));

  // Toggle visibility back on
  state = cvReducer(state, toggleSectionVisibility('education'));
  const eduConfigBack = state.currentCV.sectionConfig.find((s) => s.id === 'education');
  assert.equal(eduConfigBack.visible, true);
  assert.ok(state.currentCV.design.sectionOrder.includes('education'));
});

test('9. cvSlice CRUD actions for new sections and design token sync', () => {
  let state = cvReducer(undefined, { type: '@@INIT' });

  // Internships
  state = cvReducer(state, addInternship());
  assert.equal(state.currentCV.internships.length, 1);
  state = cvReducer(
    state,
    updateInternship({ index: 0, data: { role: 'ML Intern', company: 'DeepMind' } })
  );
  assert.equal(state.currentCV.internships[0].role, 'ML Intern');
  state = cvReducer(state, removeInternship(0));
  assert.equal(state.currentCV.internships.length, 0);

  // Achievements
  state = cvReducer(state, addAchievement());
  assert.equal(state.currentCV.achievements.length, 1);
  state = cvReducer(
    state,
    updateAchievement({ index: 0, data: { title: 'First Place Hackathon' } })
  );
  assert.equal(state.currentCV.achievements[0].title, 'First Place Hackathon');
  state = cvReducer(state, removeAchievement(0));
  assert.equal(state.currentCV.achievements.length, 0);

  // Volunteer
  state = cvReducer(state, addVolunteer());
  assert.equal(state.currentCV.volunteer.length, 1);
  state = cvReducer(state, removeVolunteer(0));
  assert.equal(state.currentCV.volunteer.length, 0);

  // Publications
  state = cvReducer(state, addPublication());
  assert.equal(state.currentCV.publications.length, 1);
  state = cvReducer(state, removePublication(0));
  assert.equal(state.currentCV.publications.length, 0);

  // AdditionalInfo
  state = cvReducer(state, addAdditionalInfo());
  assert.equal(state.currentCV.additionalInfo.length, 1);
  state = cvReducer(state, removeAdditionalInfo(0));
  assert.equal(state.currentCV.additionalInfo.length, 0);

  // Custom Sections & Items
  state = cvReducer(state, addCustomSection({ title: 'Leadership' }));
  const customSec = state.currentCV.customSections[0];
  assert.ok(customSec);
  assert.equal(customSec.title, 'Leadership');

  state = cvReducer(
    state,
    addCustomSectionItem({ sectionId: customSec.id, item: { title: 'Team Captain' } })
  );
  assert.equal(state.currentCV.customSections[0].items.length, 2);
  assert.equal(state.currentCV.customSections[0].items[1].title, 'Team Captain');

  state = cvReducer(state, removeCustomSection(customSec.id));
  assert.equal(state.currentCV.customSections.length, 0);

  // Summary & Career Objective
  state = cvReducer(state, updateSummary('Executive summary text'));
  assert.equal(state.currentCV.summary, 'Executive summary text');
  assert.equal(state.currentCV.personalInfo.summary, 'Executive summary text');

  state = cvReducer(state, updateCareerObjective('Looking for AI roles'));
  assert.equal(state.currentCV.careerObjective, 'Looking for AI roles');
  assert.equal(state.currentCV.personalInfo.careerObjective, 'Looking for AI roles');

  // Design Tokens sync
  state = cvReducer(
    state,
    updateDesignTokens({ primaryColor: '#059669', fontHeading: 'Lora' })
  );
  assert.equal(state.currentCV.designTokens.primaryColor, '#059669');
  assert.equal(state.currentCV.designTokens.fontHeading, 'Lora');
  assert.equal(state.currentCV.design.primaryColor, '#059669');

  // Reset design to defaults
  state = cvReducer(state, resetDesignToTemplateDefaults());
  assert.equal(state.currentCV.designTokens.primaryColor, '#2563EB');
  assert.equal(state.currentCV.design.primaryColor, '#2563EB');
});
