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

/**
 * Validates image buffer magic bytes to ensure compatibility with Word OpenXML.
 */
const isValidImageBuffer = (buf) => {
  if (!buf || !Buffer.isBuffer(buf) || buf.length < 8) return false;
  // PNG: 89 50 4E 47
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return true;
  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return true;
  // GIF: 47 49 46
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return true;
  return false;
};

/**
 * Resolves an image buffer from base64 data URI or remote HTTP URL safely.
 */
const resolveImageBuffer = async (photoUri) => {
  if (!photoUri || typeof photoUri !== 'string') return null;

  try {
    if (photoUri.startsWith('data:image')) {
      const commaIndex = photoUri.indexOf(',');
      if (commaIndex !== -1) {
        const base64Data = photoUri.slice(commaIndex + 1);
        const buf = Buffer.from(base64Data, 'base64');
        return isValidImageBuffer(buf) ? buf : null;
      }
    } else if (photoUri.startsWith('http://') || photoUri.startsWith('https://')) {
      const res = await fetch(photoUri, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const arrayBuf = await res.arrayBuffer();
        const buf = Buffer.from(arrayBuf);
        return isValidImageBuffer(buf) ? buf : null;
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
export const generateDOCX = async (cvData) => {
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
  } = cvData || {};

  const templateId = resolveTemplateId(rawTemplateId);

  const isLetter = design?.pageSize === 'Letter';
  const primaryHex = (design?.primaryColor || '#1E40AF').replace('#', '');
  const darkTextHex = '1E293B';
  const grayHex = '475569';
  const lightGrayHex = '64748B';

  const fontName =
    design?.fontFamily === 'Merriweather'
      ? 'Georgia'
      : design?.fontFamily === 'JetBrains Mono'
      ? 'Consolas'
      : 'Calibri';

  const paragraphs = [];

  // 1. Resolve photo for embedding (omitted for ATS-compliant templates)
  let photoBuffer = null;
  if (templateId !== 'ats-classic' && design?.showPhoto !== false && personalInfo?.photo) {
    photoBuffer = await resolveImageBuffer(personalInfo.photo);
  }

  // 2. HEADER
  if (photoBuffer) {
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
                      new TextRun({
                        text: personalInfo.fullName || 'CURRICULUM VITAE',
                        bold: true,
                        size: 44, // 22pt
                        color: primaryHex,
                        font: fontName,
                      }),
                    ],
                  }),
                  ...(personalInfo.jobTitle
                    ? [
                        new Paragraph({
                          spacing: { before: 0, after: 80 },
                          children: [
                            new TextRun({
                              text: personalInfo.jobTitle.toUpperCase(),
                              bold: true,
                              size: 22,
                              color: grayHex,
                              font: fontName,
                            }),
                          ],
                        }),
                      ]
                    : []),
                  new Paragraph({
                    spacing: { before: 0, after: 120 },
                    children: [
                      new TextRun({
                        text: [
                          personalInfo.location,
                          personalInfo.phone,
                          personalInfo.email,
                          personalInfo.linkedin,
                        ]
                          .filter(Boolean)
                          .join('  •  '),
                        size: 19,
                        color: grayHex,
                        font: fontName,
                      }),
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
                        data: photoBuffer,
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
          new TextRun({
            text: personalInfo.fullName || 'CURRICULUM VITAE',
            bold: true,
            size: 48, // 24pt
            color: primaryHex,
            font: fontName,
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
            new TextRun({
              text: personalInfo.jobTitle.toUpperCase(),
              bold: true,
              size: 24,
              color: grayHex,
              font: fontName,
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
            new TextRun({
              text: contactItems.join('   •   '),
              size: 19,
              color: grayHex,
              font: fontName,
            }),
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
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 22, // 11pt
          color: primaryHex,
          font: fontName,
        }),
      ],
    });

  // 3. CAREER SUMMARY
  if (personalInfo.summary) {
    paragraphs.push(createHeading('Professional Summary'));
    paragraphs.push(
      new Paragraph({
        spacing: { after: 160, line: 260 },
        children: [
          new TextRun({
            text: personalInfo.summary,
            size: 20,
            color: darkTextHex,
            font: fontName,
          }),
        ],
      })
    );
  }

  // 4. WORK EXPERIENCE
  if (experience && experience.length > 0) {
    paragraphs.push(createHeading('Work Experience'));

    experience.forEach((exp) => {
      const dateRange = [
        exp.startDate,
        exp.current ? 'Present' : exp.endDate,
      ].filter(Boolean).join(' – ');

      paragraphs.push(
        new Paragraph({
          spacing: { before: 100, after: 30 },
          children: [
            new TextRun({
              text: exp.jobTitle || 'Role / Position',
              bold: true,
              size: 21,
              color: darkTextHex,
              font: fontName,
            }),
            ...(dateRange
              ? [
                  new TextRun({
                    text: `   |   ${dateRange}`,
                    bold: true,
                    size: 18,
                    color: lightGrayHex,
                    font: fontName,
                  }),
                ]
              : []),
          ],
        })
      );

      const compLoc = [exp.company, exp.location].filter(Boolean).join(' • ');
      if (compLoc) {
        paragraphs.push(
          new Paragraph({
            spacing: { after: 50 },
            children: [
              new TextRun({
                text: compLoc,
                italics: true,
                size: 19,
                color: grayHex,
                font: fontName,
              }),
            ],
          })
        );
      }

      if (exp.description) {
        paragraphs.push(
          new Paragraph({
            spacing: { after: 50, line: 240 },
            children: [
              new TextRun({
                text: exp.description,
                size: 20,
                color: darkTextHex,
                font: fontName,
              }),
            ],
          })
        );
      }

      if (exp.highlights && exp.highlights.length > 0) {
        exp.highlights.forEach((h) => {
          if (h && h.trim()) {
            paragraphs.push(
              new Paragraph({
                bullet: { level: 0 },
                spacing: { after: 30, line: 240 },
                children: [
                  new TextRun({
                    text: h.replace(/^•\s*/, ''),
                    size: 19,
                    color: darkTextHex,
                    font: fontName,
                  }),
                ],
              })
            );
          }
        });
      }
    });
  }

  // 5. EDUCATION & QUALIFICATIONS
  if (education && education.length > 0) {
    paragraphs.push(createHeading('Academic Qualifications'));

    // Check if Bangladesh Standard: Render Table
    if (templateId.includes('bd') || templateId.includes('bangladesh')) {
      const headerRow = new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: 'F1F5F9' },
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'Exam / Degree', bold: true, size: 19, font: fontName })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 35, type: WidthType.PERCENTAGE },
            shading: { fill: 'F1F5F9' },
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'Institute / Board', bold: true, size: 19, font: fontName })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 18, type: WidthType.PERCENTAGE },
            shading: { fill: 'F1F5F9' },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'Passing Year', bold: true, size: 19, font: fontName })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 17, type: WidthType.PERCENTAGE },
            shading: { fill: 'F1F5F9' },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'Result', bold: true, size: 19, font: fontName })],
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
                    children: [new TextRun({ text: edu.degree || '', bold: true, size: 19, font: fontName })],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 35, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: edu.institution || '', size: 19, font: fontName })],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 18, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: edu.endDate || edu.startDate || '', size: 19, font: fontName })],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 17, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: edu.grade || '', bold: true, size: 19, font: fontName })],
                  }),
                ],
              }),
            ],
          })
      );

      paragraphs.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [headerRow, ...dataRows],
        })
      );
    } else {
      // Standard List Style
      education.forEach((edu) => {
        const dateRange = [edu.startDate, edu.endDate].filter(Boolean).join(' – ');
        paragraphs.push(
          new Paragraph({
            spacing: { before: 80, after: 20 },
            children: [
              new TextRun({
                text: edu.degree || 'Degree',
                bold: true,
                size: 21,
                color: darkTextHex,
                font: fontName,
              }),
              ...(dateRange
                ? [
                    new TextRun({
                      text: `   |   ${dateRange}`,
                      bold: true,
                      size: 18,
                      color: lightGrayHex,
                      font: fontName,
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
          paragraphs.push(
            new Paragraph({
              spacing: { after: 50 },
              children: [
                new TextRun({
                  text: eduDetails,
                  italics: true,
                  size: 19,
                  color: grayHex,
                  font: fontName,
                }),
              ],
            })
          );
        }
      });
    }
  }

  // 6. SKILLS
  if (skills && skills.length > 0) {
    paragraphs.push(createHeading('Skills & Competencies'));
    const skillList = skills
      .map((s) => (typeof s === 'string' ? s : s.name))
      .filter(Boolean);

    if (skillList.length > 0) {
      paragraphs.push(
        new Paragraph({
          spacing: { after: 140, line: 260 },
          children: [
            new TextRun({
              text: skillList.join('   •   '),
              bold: true,
              size: 20,
              color: darkTextHex,
              font: fontName,
            }),
          ],
        })
      );
    }
  }

  // 7. KEY PROJECTS
  if (projects && projects.length > 0) {
    paragraphs.push(createHeading('Key Projects'));

    projects.forEach((proj) => {
      paragraphs.push(
        new Paragraph({
          spacing: { before: 80, after: 20 },
          children: [
            new TextRun({
              text: proj.title || proj.name || 'Project Name',
              bold: true,
              size: 20,
              color: darkTextHex,
              font: fontName,
            }),
            ...(proj.technologies
              ? [
                  new TextRun({
                    text: `   [${Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}]`,
                    italics: true,
                    size: 18,
                    color: lightGrayHex,
                    font: fontName,
                  }),
                ]
              : []),
          ],
        })
      );

      if (proj.description) {
        paragraphs.push(
          new Paragraph({
            spacing: { after: 50, line: 240 },
            children: [
              new TextRun({
                text: proj.description,
                size: 19,
                color: darkTextHex,
                font: fontName,
              }),
            ],
          })
        );
      }
    });
  }

  // 8. CERTIFICATIONS & LANGUAGES
  if (certifications && certifications.length > 0) {
    paragraphs.push(createHeading('Certifications & Licenses'));
    certifications.forEach((cert) => {
      const certInfo = [cert.issuer, cert.date || cert.year].filter(Boolean).join(' • ');
      paragraphs.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 30 },
          children: [
            new TextRun({
              text: cert.name || 'Certification',
              bold: true,
              size: 19,
              color: darkTextHex,
              font: fontName,
            }),
            ...(certInfo
              ? [
                  new TextRun({
                    text: ` (${certInfo})`,
                    italics: true,
                    size: 18,
                    color: lightGrayHex,
                    font: fontName,
                  }),
                ]
              : []),
          ],
        })
      );
    });
  }

  if (languages && languages.length > 0) {
    paragraphs.push(createHeading('Languages'));
    const langItems = languages.map((lang) => {
      if (typeof lang === 'string') return lang;
      return `${lang.language || lang.name || ''} ${lang.proficiency ? `(${lang.proficiency})` : ''}`.trim();
    }).filter(Boolean);

    paragraphs.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: langItems.join('   •   '),
            size: 20,
            color: darkTextHex,
            font: fontName,
          }),
        ],
      })
    );
  }

  // 9. PERSONAL DETAILS (BD Standard)
  const bdFields = [
    { label: "Father's Name", value: personalDetails.fatherName },
    { label: "Mother's Name", value: personalDetails.motherName },
    { label: 'Date of Birth', value: personalDetails.dob || personalDetails.dateOfBirth },
    { label: 'Gender', value: personalDetails.gender },
    { label: 'Marital Status', value: personalDetails.maritalStatus },
    { label: 'Nationality', value: personalDetails.nationality || 'Bangladeshi' },
    { label: 'National ID (NID)', value: personalDetails.nid || personalDetails.nationalId },
    { label: 'Blood Group', value: personalDetails.bloodGroup },
    { label: 'Present Address', value: personalDetails.presentAddress },
    { label: 'Permanent Address', value: personalDetails.permanentAddress },
  ].filter((f) => Boolean(f.value));

  if (bdFields.length > 0) {
    paragraphs.push(createHeading('Personal Details'));

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
                    new TextRun({
                      text: `${field.label}:`,
                      bold: true,
                      size: 19,
                      color: grayHex,
                      font: fontName,
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
                    new TextRun({
                      text: String(field.value),
                      size: 19,
                      color: darkTextHex,
                      font: fontName,
                    }),
                  ],
                }),
              ],
            }),
          ],
        })
    );

    paragraphs.push(
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
      })
    );
  }

  // 10. REFERENCES
  if (references && references.length > 0) {
    paragraphs.push(createHeading('References'));

    references.forEach((ref) => {
      paragraphs.push(
        new Paragraph({
          spacing: { before: 60, after: 20 },
          children: [
            new TextRun({
              text: ref.name || 'Reference Person',
              bold: true,
              size: 20,
              color: darkTextHex,
              font: fontName,
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
        paragraphs.push(
          new Paragraph({
            spacing: { after: 50 },
            children: [
              new TextRun({
                text: refDetails,
                size: 18,
                color: grayHex,
                font: fontName,
              }),
            ],
          })
        );
      }
    });
  }

  // 11. DECLARATION
  if (declaration && (declaration.signedBy || declaration.text)) {
    paragraphs.push(createHeading('Declaration'));
    paragraphs.push(
      new Paragraph({
        spacing: { after: 120, line: 240 },
        children: [
          new TextRun({
            text: declaration.text || 'I hereby declare that all information provided above is true and correct.',
            italics: true,
            size: 19,
            color: darkTextHex,
            font: fontName,
          }),
        ],
      })
    );
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { before: 120, after: 60 },
        children: [
          new TextRun({
            text: declaration.signedBy || personalInfo.fullName || 'Authorized Signature',
            bold: true,
            size: 20,
            color: primaryHex,
            font: fontName,
          }),
        ],
      })
    );
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
  if (!buffer || buffer.length < 3000) {
    throw new Error('DOCX generation produced an empty or corrupted document.');
  }

  const magic = buffer.subarray(0, 4).toString('hex');
  if (magic !== '504b0304') {
    throw new Error('Generated DOCX does not contain valid OpenXML ZIP header.');
  }

  return buffer;
};

export default generateDOCX;
