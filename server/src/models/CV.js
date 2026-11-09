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
      default: 'modern-minimal',
      trim: true,
    },
    personalInfo: {
      fullName: { type: String, default: '' },
      jobTitle: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      website: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      photo: { type: String, default: null },
      photoStyle: { type: String, enum: ['circle', 'square', 'rounded'], default: 'circle' },
      summary: { type: String, default: '' },
    },
    design: {
      primaryColor: { type: String, default: '#4f46e5' },
      accentColor: { type: String, default: '#0ea5e9' },
      textColor: { type: String, default: '#1e293b' },
      backgroundColor: { type: String, default: '#ffffff' },
      fontFamily: { type: String, default: 'Inter' },
      fontSize: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
      lineSpacing: { type: String, enum: ['compact', 'normal', 'relaxed'], default: 'normal' },
      sectionSpacing: { type: String, enum: ['compact', 'normal', 'relaxed'], default: 'normal' },
      margins: { type: String, enum: ['compact', 'normal', 'wide'], default: 'normal' },
      pageSize: { type: String, enum: ['A4', 'Letter'], default: 'A4' },
      showPhoto: { type: Boolean, default: true },
      sectionOrder: {
        type: [String],
        default: ['summary', 'experience', 'skills', 'education', 'projects', 'certifications', 'languages'],
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
        startDate: String,
        endDate: String,
        grade: String,
        description: String,
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
        title: String,
        link: String,
        github: String,
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
        language: String,
        proficiency: String,
      },
    ],
    references: [
      {
        id: String,
        name: String,
        company: String,
        email: String,
        phone: String,
      },
    ],
    customSections: [
      {
        id: String,
        title: String,
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
    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

export const CV = mongoose.model('CV', cvSchema);
export default CV;
