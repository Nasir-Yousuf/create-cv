import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ImageRun,
} from 'docx';
import { resolveTemplateId } from '../../../../shared/constants/cvDefaults.js';
import {
  normalizeCvData,
  toDocxHex,
  stripXmlUnsafeChars,
  detectImageFormatFromBytes,
} from '../../../../shared/utils/cvNormalize.js';

/**
 * Resolves an image buffer + explicit OpenXML image type from base64 data URI or remote HTTP URL safely.
 */
const resolveImageBuffer = async (photoUri) => {
  if (!photoUri || typeof photoUri !== 'string') return null;

  try {
    let buf = null;
    if (photoUri.startsWith('data:image')) {
      const commaIndex = photoUri.indexOf(',');
      if (commaIndex !== -1) {
        const base64Data = photoUri.slice(commaIndex + 1);
        buf = Buffer.from(base64Data, 'base64');
      }
    } else if (photoUri.startsWith('http://') || photoUri.startsWith('https://')) {
      const res = await fetch(photoUri, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const arrayBuf = await res.arrayBuffer();
        buf = Buffer.from(arrayBuf);
      }
    }

    if (buf && Buffer.isBuffer(buf) && buf.length >= 8) {
      const type = detectImageFormatFromBytes(buf);
      if (type) {
        return { buffer: buf, type };
      }
    }
  } catch (err) {
    console.warn('Failed to resolve photo for DOCX embed:', err.message);
  }
  return null;
};

/**
 * Generates genuine, fully-editable Microsoft Word (.docx) document
 * with true headings, tables, bullet points, and embedded profile photos.
 */
export const generateDOCX = async (rawCvData) => {
  const cvData = normalizeCvData(rawCvData);
  const {
    templateId: rawTemplateId = 'onepage-fresher-clean',
    personalInfo = {},
    personalDetails = {},
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    languages = [],
    references = [],
    declaration = {},
    customSections = [],
    design = {},
  } = cvData;

  const templateId = resolveTemplateId(rawTemplateId);

  const isLetter = design?.pageSize === 'Letter';
  const primaryHex = toDocxHex(design?.primaryColor, '1E40AF');
  const darkTextHex = '1E293B';
  const grayHex = '475569';
  const lightGrayHex = '64748B';

  const fontName =
    design?.fontFamily === 'Merriweather'
      ? 'Georgia'
      : design?.fontFamily === 'JetBrains Mono'
      ? 'Consolas'
      : 'Calibri';

  const safeRun = (text, options = {}) =>
    new TextRun({
      font: fontName,
      ...options,
      text: stripXmlUnsafeChars(text),
    });

  const paragraphs = [];

  // 1. Resolve photo for embedding (omitted for ATS-compliant templates)
  let photoResult = null;
  if (templateId !== 'ats-classic' && design?.showPhoto !== false && personalInfo?.photo) {
    photoResult = await resolveImageBuffer(personalInfo.photo);
  }

  // 2. HEADER
  if (photoResult) {
    // Header with Photo (Table with 2 cells: Name & Info on left, Photo on right)
    paragraphs.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.SINGLE, size: 8, color: primaryHex },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
          insideHorizontal: { style: BorderStyle.NONE },
          insideVertical: { style: BorderStyle.NONE },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 75, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.NONE },
                  bottom: { style: BorderStyle.NONE },
                  left: { style: BorderStyle.NONE },
                  right: { style: BorderStyle.NONE },
                },
                children: [
                  new Paragraph({
                    spacing: { before: 0, after: 60 },
                    children: [
                      safeRun(personalInfo.fullName || 'CURRICULUM VITAE', {
                        bold: true,
                        size: 44, // 22pt
                        color: primaryHex,
                      }),
                    ],
                  }),
                  ...(personalInfo.jobTitle
                    ? [
                        new Paragraph({
                          spacing: { before: 0, after: 80 },
                          children: [
                            safeRun(String(personalInfo.jobTitle).toUpperCase(), {
                              bold: true,
                              size: 22,
                              color: grayHex,
                            }),
                          ],
                        }),
                      ]
                    : []),
                  new Paragraph({
                    spacing: { before: 0, after: 120 },
                    children: [
                      safeRun(
                        [
                          personalInfo.location,
                          personalInfo.phone,
                          personalInfo.email,
                          personalInfo.linkedin,
                        ]
                          .filter(Boolean)
                          .join('  •  '),
                        { size: 19, color: grayHex }
                      ),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 25, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.NONE },
                  bottom: { style: BorderStyle.NONE },
                  left: { style: BorderStyle.NONE },
                  right: { style: BorderStyle.NONE },
                },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    spacing: { before: 0, after: 120 },
                    children: [
                      new ImageRun({
                        data: photoResult.buffer,
                        type: photoResult.type,
                        transformation: { width: 95, height: 120 },
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      })
    );
  } else {
    // Standard Centered Header (No Photo)
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 60 },
        children: [
          safeRun(personalInfo.fullName || 'CURRICULUM VITAE', {
            bold: true,
            size: 48, // 24pt
            color: primaryHex,
          }),
        ],
      })
    );

    if (personalInfo.jobTitle) {
      paragraphs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 80 },
          children: [
            safeRun(String(personalInfo.jobTitle).toUpperCase(), {
              bold: true,
              size: 24,
              color: grayHex,
            }),
          ],
        })
      );
    }

    const contactItems = [
      personalInfo.phone,
      personalInfo.email,
      personalInfo.location,
      personalInfo.linkedin,
      personalInfo.website,
    ].filter(Boolean);

    if (contactItems.length > 0) {
      paragraphs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 200 },
          children: [
            safeRun(contactItems.join('   •   '), { size: 19, color: grayHex }),
          ],
        })
      );
    }
  }

  // Section Heading Helper
  const createHeading = (title) =>
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 120 },
      border: {
        bottom: {
          color: primaryHex,
          space: 4,
          style: BorderStyle.SINGLE,
          size: 12,
        },
      },
      children: [
        safeRun(String(title || '').toUpperCase(), {
          bold: true,
          size: 22, // 11pt
          color: primaryHex,
        }),
      ],
    });

  // Modular Section Generators
  const renderSummary = () => {
    const summaryText = personalInfo.summary || personalInfo.objective;
    if (!summaryText) return [];
    return [
      createHeading(personalInfo.summary ? 'Professional Summary' : 'Career Objective'),
      new Paragraph({
        spacing: { after: 160, line: 260 },
        children: [safeRun(summaryText, { size: 20, color: darkTextHex })],
      }),
    ];
  };

  const renderExperience = () => {
    if (!experience || experience.length === 0) return [];
    const items = [createHeading('Work Experience')];

    experience.forEach((exp) => {
      const dateRange = [
        exp.startDate,
        exp.current ? 'Present' : exp.endDate,
      ].filter(Boolean).join(' – ');

      items.push(
        new Paragraph({
          spacing: { before: 100, after: 30 },
          children: [
            safeRun(exp.jobTitle || 'Role / Position', {
              bold: true,
              size: 21,
              color: darkTextHex,
            }),
            ...(dateRange
              ? [
                  safeRun(`   |   ${dateRange}`, {
                    bold: true,
                    size: 18,
                    color: lightGrayHex,
                  }),
                ]
              : []),
          ],
        })
      );

      const compLoc = [exp.company, exp.location].filter(Boolean).join(' • ');
      if (compLoc) {
        items.push(
          new Paragraph({
            spacing: { after: 50 },
            children: [
              safeRun(compLoc, { italics: true, size: 19, color: grayHex }),
            ],
          })
        );
      }

      if (exp.description) {
        items.push(
          new Paragraph({
            spacing: { after: 50, line: 240 },
            children: [
              safeRun(exp.description, { size: 20, color: darkTextHex }),
            ],
          })
        );
      }

      if (Array.isArray(exp.highlights) && exp.highlights.length > 0) {
        exp.highlights.forEach((h) => {
          if (typeof h === 'string' && h.trim()) {
            items.push(
              new Paragraph({
                bullet: { level: 0 },
                spacing: { after: 30, line: 240 },
                children: [
                  safeRun(h.replace(/^•\s*/, ''), { size: 19, color: darkTextHex }),
                ],
              })
            );
          }
        });
      }
    });

    return items;
  };

  const renderEducation = () => {
    if (!education || education.length === 0) return [];
    const items = [createHeading('Academic Qualifications')];

    if ((templateId.includes('bd') || templateId.includes('bangladesh')) && education.length > 0) {
      const headerRow = new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: 'F1F5F9' },
            children: [
              new Paragraph({
                children: [safeRun('Exam / Degree', { bold: true, size: 19 })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 35, type: WidthType.PERCENTAGE },
            shading: { fill: 'F1F5F9' },
            children: [
              new Paragraph({
                children: [safeRun('Institute / Board', { bold: true, size: 19 })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 18, type: WidthType.PERCENTAGE },
            shading: { fill: 'F1F5F9' },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [safeRun('Passing Year', { bold: true, size: 19 })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 17, type: WidthType.PERCENTAGE },
            shading: { fill: 'F1F5F9' },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [safeRun('Result', { bold: true, size: 19 })],
              }),
            ],
          }),
        ],
      });

      const dataRows = education.map(
        (edu) =>
          new TableRow({
            children: [
              new TableCell({
                width: { size: 30, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [safeRun(edu.degree || '', { bold: true, size: 19 })],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 35, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [safeRun(edu.institution || '', { size: 19 })],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 18, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [safeRun(edu.endDate || edu.startDate || '', { size: 19 })],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 17, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [safeRun(edu.grade || '', { bold: true, size: 19 })],
                  }),
                ],
              }),
            ],
          })
      );

      items.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [headerRow, ...dataRows],
        })
      );
    } else {
      education.forEach((edu) => {
        const dateRange = [edu.startDate, edu.endDate].filter(Boolean).join(' – ');
        items.push(
          new Paragraph({
            spacing: { before: 80, after: 20 },
            children: [
              safeRun(edu.degree || 'Degree', {
                bold: true,
                size: 21,
                color: darkTextHex,
              }),
              ...(dateRange
                ? [
                    safeRun(`   |   ${dateRange}`, {
                      bold: true,
                      size: 18,
                      color: lightGrayHex,
                    }),
                  ]
                : []),
            ],
          })
        );

        const eduDetails = [
          edu.institution,
          edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : null,
          edu.grade ? `GPA: ${edu.grade}` : null,
        ].filter(Boolean).join(' • ');

        if (eduDetails) {
          items.push(
            new Paragraph({
              spacing: { after: 50 },
              children: [
                safeRun(eduDetails, { italics: true, size: 19, color: grayHex }),
              ],
            })
          );
        }
      });
    }

    return items;
  };

  const renderSkills = () => {
    if (!skills || skills.length === 0) return [];
    const skillList = skills
      .map((s) => (typeof s === 'string' ? s : s?.name))
      .filter(Boolean);

    if (skillList.length === 0) return [];
    return [
      createHeading('Skills & Competencies'),
      new Paragraph({
        spacing: { after: 140, line: 260 },
        children: [
          safeRun(skillList.join('   •   '), {
            bold: true,
            size: 20,
            color: darkTextHex,
          }),
        ],
      }),
    ];
  };

  const renderProjects = () => {
    if (!projects || projects.length === 0) return [];
    const items = [createHeading('Key Projects')];

    projects.forEach((proj) => {
      const hasTech = Array.isArray(proj.technologies) && proj.technologies.length > 0;
      items.push(
        new Paragraph({
          spacing: { before: 80, after: 20 },
          children: [
            safeRun(proj.title || proj.name || 'Project Name', {
              bold: true,
              size: 20,
              color: darkTextHex,
            }),
            ...(hasTech
              ? [
                  safeRun(`   [${proj.technologies.join(', ')}]`, {
                    italics: true,
                    size: 18,
                    color: lightGrayHex,
                  }),
                ]
              : []),
          ],
        })
      );

      if (proj.description) {
        items.push(
          new Paragraph({
            spacing: { after: 50, line: 240 },
            children: [
              safeRun(proj.description, { size: 19, color: darkTextHex }),
            ],
          })
        );
      }
    });

    return items;
  };

  const renderCertifications = () => {
    if (!certifications || certifications.length === 0) return [];
    const items = [createHeading('Certifications & Licenses')];

    certifications.forEach((cert) => {
      const certInfo = [cert.issuer, cert.date || cert.year].filter(Boolean).join(' • ');
      items.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 30 },
          children: [
            safeRun(cert.name || 'Certification', {
              bold: true,
              size: 19,
              color: darkTextHex,
            }),
            ...(certInfo
              ? [
                  safeRun(` (${certInfo})`, {
                    italics: true,
                    size: 18,
                    color: lightGrayHex,
                  }),
                ]
              : []),
          ],
        })
      );
    });

    return items;
  };

  const renderLanguages = () => {
    if (!languages || languages.length === 0) return [];
    const langItems = languages
      .map((lang) => {
        if (typeof lang === 'string') return lang;
        return `${lang.language || lang.name || ''} ${lang.proficiency ? `(${lang.proficiency})` : ''}`.trim();
      })
      .filter(Boolean);

    if (langItems.length === 0) return [];
    return [
      createHeading('Languages'),
      new Paragraph({
        spacing: { after: 120 },
        children: [
          safeRun(langItems.join('   •   '), { size: 20, color: darkTextHex }),
        ],
      }),
    ];
  };

  const renderPersonalDetails = () => {
    const isBdTemplate = templateId.includes('bd') || templateId.includes('bangladesh');
    const bdFields = [
      { label: "Father's Name", value: personalDetails.fatherName },
      { label: "Mother's Name", value: personalDetails.motherName },
      { label: 'Date of Birth', value: personalDetails.dob || personalDetails.dateOfBirth },
      { label: 'Gender', value: personalDetails.gender },
      { label: 'Marital Status', value: personalDetails.maritalStatus },
      {
        label: 'Nationality',
        value: personalDetails.nationality || (isBdTemplate ? 'Bangladeshi' : ''),
      },
      { label: 'National ID (NID)', value: personalDetails.nid || personalDetails.nationalId },
      { label: 'Blood Group', value: personalDetails.bloodGroup },
      { label: 'Religion', value: personalDetails.religion },
      { label: 'Present Address', value: personalDetails.presentAddress },
      { label: 'Permanent Address', value: personalDetails.permanentAddress },
    ].filter((f) => Boolean(f.value));

    if (bdFields.length === 0) return [];

    const rows = bdFields.map(
      (field) =>
        new TableRow({
          children: [
            new TableCell({
              width: { size: 35, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
              },
              children: [
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    safeRun(`${field.label}:`, {
                      bold: true,
                      size: 19,
                      color: grayHex,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 65, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
              },
              children: [
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    safeRun(field.value, { size: 19, color: darkTextHex }),
                  ],
                }),
              ],
            }),
          ],
        })
    );

    return [
      createHeading('Personal Details'),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
          insideHorizontal: { style: BorderStyle.NONE },
          insideVertical: { style: BorderStyle.NONE },
        },
        rows,
      }),
    ];
  };

  const renderReferences = () => {
    if (!references || references.length === 0) return [];
    const items = [createHeading('References')];

    references.forEach((ref) => {
      items.push(
        new Paragraph({
          spacing: { before: 60, after: 20 },
          children: [
            safeRun(ref.name || 'Reference Person', {
              bold: true,
              size: 20,
              color: darkTextHex,
            }),
          ],
        })
      );

      const refDetails = [
        ref.designation,
        ref.company,
        ref.phone ? `Phone: ${ref.phone}` : null,
        ref.email ? `Email: ${ref.email}` : null,
      ].filter(Boolean).join('   |   ');

      if (refDetails) {
        items.push(
          new Paragraph({
            spacing: { after: 50 },
            children: [
              safeRun(refDetails, { size: 18, color: grayHex }),
            ],
          })
        );
      }
    });

    return items;
  };

  const renderInterests = () => {
    const list = (Array.isArray(cvData.interests) ? cvData.interests : [])
      .map((item) => (typeof item === 'string' ? item.trim() : item?.name || ''))
      .filter(Boolean);

    if (list.length === 0) return [];
    return [
      createHeading('Interests & Activities'),
      new Paragraph({
        spacing: { after: 120 },
        children: [
          safeRun(list.join('   •   '), { size: 19, color: darkTextHex }),
        ],
      }),
    ];
  };

  const renderCustomSections = () => {
    if (!customSections || customSections.length === 0) return [];
    const items = [];

    customSections.forEach((sec) => {
      if (!sec || (!sec.content && (!Array.isArray(sec.items) || sec.items.length === 0))) {
        return;
      }
      items.push(createHeading(sec.title || 'Additional Information'));

      if (sec.content) {
        items.push(
          new Paragraph({
            spacing: { after: 80, line: 240 },
            children: [
              safeRun(sec.content, { size: 19, color: darkTextHex }),
            ],
          })
        );
      }

      if (Array.isArray(sec.items) && sec.items.length > 0) {
        sec.items.forEach((item) => {
          const headline = [item.title, item.subtitle, item.date].filter(Boolean).join(' • ');
          if (headline) {
            items.push(
              new Paragraph({
                bullet: { level: 0 },
                spacing: { after: 30, line: 240 },
                children: [
                  safeRun(headline, { bold: true, size: 19, color: darkTextHex }),
                ],
              })
            );
          }
          if (item.description) {
            items.push(
              new Paragraph({
                spacing: { after: 40, line: 240 },
                children: [
                  safeRun(item.description, { size: 18, color: grayHex }),
                ],
              })
            );
          }
        });
      }
    });

    return items;
  };

  const renderDeclaration = () => {
    if (!declaration || (!declaration.signedBy && !declaration.text)) return [];
    return [
      createHeading('Declaration'),
      new Paragraph({
        spacing: { after: 120, line: 240 },
        children: [
          safeRun(
            declaration.text || 'I hereby declare that all information provided above is true and correct.',
            { italics: true, size: 19, color: darkTextHex }
          ),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { before: 120, after: 60 },
        children: [
          safeRun(
            declaration.signedBy || personalInfo.fullName || 'Authorized Signature',
            { bold: true, size: 20, color: primaryHex }
          ),
        ],
      }),
    ];
  };

  const sectionGenerators = {
    summary: renderSummary,
    experience: renderExperience,
    education: renderEducation,
    skills: renderSkills,
    projects: renderProjects,
    certifications: renderCertifications,
    languages: renderLanguages,
    personalDetails: renderPersonalDetails,
    references: renderReferences,
    interests: renderInterests,
    customSections: renderCustomSections,
    declaration: renderDeclaration,
  };

  const mapSectionKey = (key) => {
    if (!key || typeof key !== 'string') return null;
    const lower = key.trim().toLowerCase();
    if (lower === 'summary' || lower === 'objective' || lower === 'about' || lower === 'professionalsummary') return 'summary';
    if (lower === 'experience' || lower === 'work' || lower === 'workexperience' || lower === 'employment') return 'experience';
    if (lower === 'education' || lower === 'academic' || lower === 'qualifications') return 'education';
    if (lower === 'skills' || lower === 'competencies' || lower === 'technicalskills') return 'skills';
    if (lower === 'projects' || lower === 'keyprojects' || lower === 'portfolio') return 'projects';
    if (lower === 'certifications' || lower === 'certificates' || lower === 'licenses') return 'certifications';
    if (lower === 'languages' || lower === 'language') return 'languages';
    if (lower === 'personaldetails' || lower === 'personal_details' || lower === 'bdpersonaldetails') return 'personalDetails';
    if (lower === 'references' || lower === 'reference') return 'references';
    if (lower === 'interests' || lower === 'hobbies') return 'interests';
    if (lower === 'declaration' || lower === 'signature') return 'declaration';
    if (lower === 'customsections' || lower === 'custom_sections' || lower.startsWith('custom')) return 'customSections';
    return lower;
  };

  const defaultOrder = [
    'summary',
    'experience',
    'education',
    'skills',
    'projects',
    'certifications',
    'languages',
    'personalDetails',
    'references',
    'interests',
    'customSections',
    'declaration',
  ];

  const rawOrder = Array.isArray(design?.sectionOrder) && design.sectionOrder.length > 0
    ? design.sectionOrder
    : defaultOrder;

  const executedSections = new Set();
  const orderedKeys = [];

  for (const rawKey of rawOrder) {
    const canonicalKey = mapSectionKey(rawKey);
    if (canonicalKey && sectionGenerators[canonicalKey] && !executedSections.has(canonicalKey)) {
      executedSections.add(canonicalKey);
      orderedKeys.push(canonicalKey);
    }
  }

  // Fallback append any sections not specified in sectionOrder to guarantee zero data loss
  for (const fallbackKey of defaultOrder) {
    if (!executedSections.has(fallbackKey)) {
      executedSections.add(fallbackKey);
      orderedKeys.push(fallbackKey);
    }
  }

  // Render all sections in user's chosen sectionOrder
  for (const key of orderedKeys) {
    const generator = sectionGenerators[key];
    if (generator) {
      const generatedItems = generator();
      if (Array.isArray(generatedItems) && generatedItems.length > 0) {
        paragraphs.push(...generatedItems);
      }
    }
  }

  // Construct Document with accurate page dimensions
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: isLetter ? 12240 : 11906, // Letter vs A4 dxa
              height: isLetter ? 15840 : 16838,
            },
            margin: {
              top: 864, // 0.6 inch
              bottom: 864,
              left: 864,
              right: 864,
            },
          },
        },
        children: paragraphs,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  // Validate generated DOCX buffer (magic header PK\x03\x04 for zip)
  if (!buffer || buffer.length < 2000) {
    throw new Error('DOCX generation produced an empty or corrupted document.');
  }

  const magic = buffer.subarray(0, 4).toString('hex');
  if (magic !== '504b0304') {
    throw new Error('Generated DOCX does not contain valid OpenXML ZIP header.');
  }

  return buffer;
};

export default generateDOCX;
