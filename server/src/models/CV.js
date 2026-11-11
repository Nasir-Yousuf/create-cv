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
      photo: { type: String, default: null },
      photoStyle: {
        type: String,
        enum: ['circle', 'square', 'rounded', 'portrait'],
        default: 'circle',
      },
      summary: { type: String, default: '' },
    },
    personalDetails: {
      fatherName: { type: String, default: '' },
      motherName: { type: String, default: '' },
      dateOfBirth: { type: String, default: '' },
      gender: { type: String, default: '' },
      maritalStatus: { type: String, default: '' },
      nationality: { type: String, default: '' },
      religion: { type: String, default: '' },
      bloodGroup: { type: String, default: '' },
      nid: { type: String, default: '' },
      presentAddress: { type: String, default: '' },
      permanentAddress: { type: String, default: '' },
    },
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
      },
    ],
    skills: [
      {
        id: String,
        name: String,
        level: String,
        category: String,
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
      },
    ],
    certifications: [
      {
        id: String,
        name: String,
        issuer: String,
        date: String,
        link: String,
      },
    ],
    languages: [
      {
        id: String,
        name: String,
        language: String,
        proficiency: String,
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
  },
  {
    timestamps: true,
  }
);

cvSchema.index({ userId: 1, isDeleted: 1, updatedAt: -1 });

export const CV = mongoose.model('CV', cvSchema);
export default CV;
