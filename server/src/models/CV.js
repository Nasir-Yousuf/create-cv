import mongoose from 'mongoose';

const cvSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: 'Untitled Resume',
      trim: true,
    },
    templateId: {
      type: String,
      default: 'onepage-fresher-clean',
      trim: true,
    },
    category: {
      type: String,
      default: 'One-Page CVs',
      trim: true,
    },
    isOnePage: {
      type: Boolean,
      default: true,
    },
    profileType: {
      type: String,
      default: 'student',
      trim: true,
    },
    summary: {
      type: String,
      default: '',
    },
    careerObjective: {
      type: String,
      default: '',
    },
    personalInfo: {
      fullName: { type: String, default: '' },
      jobTitle: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      address: { type: String, default: '' },
      website: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      portfolio: { type: String, default: '' },
      photo: { type: String, default: null },
      photoUrl: { type: String, default: null },
      photoStyle: {
        type: String,
        enum: ['circle', 'square', 'rounded', 'portrait'],
        default: 'circle',
      },
      photoConfig: {
        shape: { type: String, default: 'circle' },
        zoom: { type: Number, default: 1 },
        aspect: { type: Number, default: 1 },
        borderWidth: { type: Number, default: 2 },
        borderColor: { type: String, default: '' },
      },
      summary: { type: String, default: '' },
      careerObjective: { type: String, default: '' },
      // Optional Bangladesh / Gov civil service fields
      fatherName: { type: String, default: '' },
      motherName: { type: String, default: '' },
      dob: { type: String, default: '' },
      dateOfBirth: { type: String, default: '' },
      nationality: { type: String, default: '' },
      nid: { type: String, default: '' },
      religion: { type: String, default: '' },
      maritalStatus: { type: String, default: '' },
      permanentAddress: { type: String, default: '' },
      bloodGroup: { type: String, default: '' },
      gender: { type: String, default: '' },
      presentAddress: { type: String, default: '' },
    },
    personalDetails: {
      fatherName: { type: String, default: '' },
      motherName: { type: String, default: '' },
      dateOfBirth: { type: String, default: '' },
      dob: { type: String, default: '' },
      gender: { type: String, default: '' },
      maritalStatus: { type: String, default: '' },
      nationality: { type: String, default: '' },
      religion: { type: String, default: '' },
      bloodGroup: { type: String, default: '' },
      nid: { type: String, default: '' },
      presentAddress: { type: String, default: '' },
      permanentAddress: { type: String, default: '' },
    },
    sectionConfig: [mongoose.Schema.Types.Mixed],
    designTokens: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({}),
    },
    elementOverrides: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({}),
    },
    customElements: [mongoose.Schema.Types.Mixed],
    design: {
      primaryColor: { type: String, default: '#2563eb' },
      accentColor: { type: String, default: '#0ea5e9' },
      textColor: { type: String, default: '#0f172a' },
      backgroundColor: { type: String, default: '#ffffff' },
      fontFamily: { type: String, default: 'Inter' },
      fontSize: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
      lineSpacing: { type: String, enum: ['compact', 'normal', 'relaxed'], default: 'normal' },
      sectionSpacing: { type: String, enum: ['compact', 'normal', 'relaxed'], default: 'compact' },
      margins: { type: String, enum: ['compact', 'normal', 'wide'], default: 'normal' },
      layout: { type: String, default: 'single-column' },
      pageSize: { type: String, enum: ['A4', 'Letter'], default: 'A4' },
      showPhoto: { type: Boolean, default: true },
      photoSize: { type: String, default: 'md' },
      sectionOrder: {
        type: [String],
        default: [
          'summary',
          'education',
          'experience',
          'projects',
          'skills',
          'certifications',
          'languages',
          'references',
          'declaration',
        ],
      },
    },
    experience: [
      {
        id: String,
        jobTitle: String,
        company: String,
        location: String,
        startDate: String,
        endDate: String,
        current: Boolean,
        description: String,
        highlights: [String],
        visible: { type: Boolean, default: true },
      },
    ],
    internships: [
      {
        id: String,
        jobTitle: String,
        company: String,
        location: String,
        startDate: String,
        endDate: String,
        current: Boolean,
        description: String,
        highlights: [String],
        visible: { type: Boolean, default: true },
      },
    ],
    education: [
      {
        id: String,
        institution: String,
        degree: String,
        fieldOfStudy: String,
        location: String,
        startDate: String,
        endDate: String,
        grade: String,
        description: String,
        highlights: [String],
        visible: { type: Boolean, default: true },
      },
    ],
    skills: [
      {
        id: String,
        name: String,
        level: String,
        category: String,
        visible: { type: Boolean, default: true },
      },
    ],
    projects: [
      {
        id: String,
        name: String,
        title: String,
        role: String,
        url: String,
        link: String,
        github: String,
        date: String,
        startDate: String,
        endDate: String,
        description: String,
        technologies: [String],
        visible: { type: Boolean, default: true },
      },
    ],
    certifications: [
      {
        id: String,
        name: String,
        issuer: String,
        date: String,
        link: String,
        visible: { type: Boolean, default: true },
      },
    ],
    languages: [
      {
        id: String,
        name: String,
        language: String,
        proficiency: String,
        visible: { type: Boolean, default: true },
      },
    ],
    achievements: [
      {
        id: String,
        title: String,
        issuer: String,
        date: String,
        description: String,
        visible: { type: Boolean, default: true },
      },
    ],
    volunteer: [
      {
        id: String,
        role: String,
        organization: String,
        location: String,
        startDate: String,
        endDate: String,
        current: Boolean,
        description: String,
        highlights: [String],
        visible: { type: Boolean, default: true },
      },
    ],
    publications: [
      {
        id: String,
        title: String,
        publisher: String,
        date: String,
        url: String,
        description: String,
        visible: { type: Boolean, default: true },
      },
    ],
    references: [
      {
        id: String,
        name: String,
        designation: String,
        company: String,
        email: String,
        phone: String,
        visible: { type: Boolean, default: true },
      },
    ],
    additionalInfo: [
      {
        id: String,
        title: String,
        description: String,
        visible: { type: Boolean, default: true },
      },
    ],
    declaration: {
      text: { type: String, default: '' },
      date: { type: String, default: '' },
      signedBy: { type: String, default: '' },
    },
    customSections: [
      {
        id: String,
        title: String,
        content: String,
        items: [
          {
            id: String,
            title: String,
            subtitle: String,
            date: String,
            description: String,
          },
        ],
      },
    ],
    // Persistent Export Entitlement & Telemetry
    isExportUnlocked: {
      type: Boolean,
      default: false,
    },
    unlockType: {
      type: String,
      enum: ['none', 'free', 'paid', 'admin'],
      default: 'none',
    },
    unlockedAt: {
      type: Date,
      default: null,
    },
    pdfExportCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    docxExportCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastExportedAt: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    version: {
      type: Number,
      default: 1,
    },
    versionSnapshots: [
      {
        versionNumber: { type: Number, required: true },
        label: { type: String, default: 'Snapshot' },
        createdAt: { type: Date, default: Date.now },
        templateId: { type: String, default: '' },
        snapshot: { type: mongoose.Schema.Types.Mixed, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

cvSchema.index({ userId: 1, isDeleted: 1, updatedAt: -1 });

export const CV = mongoose.model('CV', cvSchema);
export default CV;
