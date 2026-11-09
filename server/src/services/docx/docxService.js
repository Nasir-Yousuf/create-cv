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
} from 'docx';

export const generateDOCX = async (cvData) => {
  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    languages = [],
    customSections = [],
    design = {},
  } = cvData;

  const primaryColorHex = (design?.primaryColor || '#4F46E5').replace('#', '');
  const textColorHex = '1E293B';
  const grayColorHex = '64748B';

  const sections = [];

  // 1. Header: Name & Target Role
  sections.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: personalInfo.fullName || 'Your Name',
          bold: true,
          size: 36, // 18pt
          color: primaryColorHex,
          font: 'Calibri',
        }),
      ],
    })
  );

  if (personalInfo.jobTitle) {
    sections.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: personalInfo.jobTitle,
            size: 24, // 12pt
            bold: true,
            color: grayColorHex,
            font: 'Calibri',
          }),
        ],
      })
    );
  }

  // Contact Strip
  const contactParts = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.website,
    personalInfo.linkedin,
    personalInfo.github,
  ].filter(Boolean);

  if (contactParts.length > 0) {
    sections.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 250 },
        children: [
          new TextRun({
            text: contactParts.join('  |  '),
            size: 18, // 9pt
            color: grayColorHex,
            font: 'Calibri',
          }),
        ],
      })
    );
  }

  // Section Heading Helper
  const createSectionHeading = (title) => {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 100 },
      border: {
        bottom: {
          color: primaryColorHex,
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
          color: primaryColorHex,
          font: 'Calibri',
        }),
      ],
    });
  };

  // 2. Summary
  if (personalInfo.summary) {
    sections.push(createSectionHeading('Professional Summary'));
    sections.push(
      new Paragraph({
        spacing: { after: 180 },
        children: [
          new TextRun({
            text: personalInfo.summary,
            size: 20, // 10pt
            font: 'Calibri',
          }),
        ],
      })
    );
  }

  // 3. Work Experience
  if (experience && experience.length > 0) {
    sections.push(createSectionHeading('Work Experience'));

    experience.forEach((exp) => {
      // Job Title and Date
      sections.push(
        new Paragraph({
          spacing: { before: 120, after: 40 },
          children: [
            new TextRun({
              text: exp.jobTitle || 'Job Title',
              bold: true,
              size: 22,
              font: 'Calibri',
            }),
            new TextRun({
              text: `\t${exp.startDate || ''} – ${exp.current ? 'Present' : exp.endDate || ''}`,
              bold: true,
              size: 18,
              color: grayColorHex,
              font: 'Calibri',
            }),
          ],
        })
      );

      // Company and Location
      const compLoc = [exp.company, exp.location].filter(Boolean).join(' • ');
      if (compLoc) {
        sections.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: compLoc,
                italics: true,
                size: 20,
                color: grayColorHex,
                font: 'Calibri',
              }),
            ],
          })
        );
      }

      // Description
      if (exp.description) {
        sections.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: exp.description,
                size: 20,
                font: 'Calibri',
              }),
            ],
          })
        );
      }

      // Highlights / Bullets
      if (exp.highlights && exp.highlights.length > 0) {
        exp.highlights.forEach((h) => {
          if (h && h.trim()) {
            sections.push(
              new Paragraph({
                bullet: { level: 0 },
                spacing: { after: 40 },
                children: [
                  new TextRun({
                    text: h.replace(/^•\s*/, ''),
                    size: 20,
                    font: 'Calibri',
                  }),
                ],
              })
            );
          }
        });
      }
    });
  }

  // 4. Skills
  if (skills && skills.length > 0) {
    sections.push(createSectionHeading('Skills & Competencies'));
    const skillStrings = skills.map((s) => (s.level ? `${s.name} (${s.level})` : s.name));
    sections.push(
      new Paragraph({
        spacing: { after: 180 },
        children: [
          new TextRun({
            text: skillStrings.join('   •   '),
            size: 20,
            font: 'Calibri',
          }),
        ],
      })
    );
  }

  // 5. Education
  if (education && education.length > 0) {
    sections.push(createSectionHeading('Education'));

    education.forEach((edu) => {
      sections.push(
        new Paragraph({
          spacing: { before: 100, after: 40 },
          children: [
            new TextRun({
              text: `${edu.degree || 'Degree'}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}`,
              bold: true,
              size: 22,
              font: 'Calibri',
            }),
            new TextRun({
              text: `\t${edu.startDate || ''} – ${edu.endDate || ''}`,
              bold: true,
              size: 18,
              color: grayColorHex,
              font: 'Calibri',
            }),
          ],
        })
      );

      const instGrade = [edu.institution, edu.grade ? `GPA: ${edu.grade}` : null].filter(Boolean).join(' • ');
      if (instGrade) {
        sections.push(
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: instGrade,
                italics: true,
                size: 20,
                color: grayColorHex,
                font: 'Calibri',
              }),
            ],
          })
        );
      }
    });
  }

  // 6. Projects
  if (projects && projects.length > 0) {
    sections.push(createSectionHeading('Key Projects'));

    projects.forEach((proj) => {
      sections.push(
        new Paragraph({
          spacing: { before: 100, after: 40 },
          children: [
            new TextRun({
              text: proj.title || 'Project',
              bold: true,
              size: 22,
              font: 'Calibri',
            }),
            ...(proj.startDate
              ? [
                  new TextRun({
                    text: `\t${proj.startDate} – ${proj.endDate || 'Present'}`,
                    size: 18,
                    color: grayColorHex,
                    font: 'Calibri',
                  }),
                ]
              : []),
          ],
        })
      );

      if (proj.description) {
        sections.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: proj.description,
                size: 20,
                font: 'Calibri',
              }),
            ],
          })
        );
      }

      if (proj.technologies && proj.technologies.length > 0) {
        sections.push(
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: `Technologies: ${proj.technologies.join(', ')}`,
                italics: true,
                size: 18,
                color: grayColorHex,
                font: 'Calibri',
              }),
            ],
          })
        );
      }
    });
  }

  // 7. Certifications & Languages
  if (certifications && certifications.length > 0) {
    sections.push(createSectionHeading('Certifications'));
    certifications.forEach((c) => {
      sections.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: `${c.name} (${c.issuer})${c.date ? ` — ${c.date}` : ''}`,
              size: 20,
              font: 'Calibri',
            }),
          ],
        })
      );
    });
  }

  if (languages && languages.length > 0) {
    sections.push(createSectionHeading('Languages'));
    const langStrings = languages.map((l) => `${l.language}: ${l.proficiency}`);
    sections.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: langStrings.join('   •   '),
            size: 20,
            font: 'Calibri',
          }),
        ],
      })
    );
  }

  // 8. Personal Details (Bangladesh Recruiter standard)
  const { personalDetails = {}, references = [], declaration = {} } = cvData;
  if (personalDetails && (personalDetails.fatherName || personalDetails.nid)) {
    sections.push(createSectionHeading('Personal Details'));
    const details = [
      personalDetails.fatherName ? `Father's Name: ${personalDetails.fatherName}` : null,
      personalDetails.motherName ? `Mother's Name: ${personalDetails.motherName}` : null,
      personalDetails.dob ? `Date of Birth: ${personalDetails.dob}` : null,
      personalDetails.nationality ? `Nationality: ${personalDetails.nationality}` : null,
      personalDetails.nid ? `National ID (NID): ${personalDetails.nid}` : null,
      personalDetails.bloodGroup ? `Blood Group: ${personalDetails.bloodGroup}` : null,
      personalDetails.permanentAddress ? `Permanent Address: ${personalDetails.permanentAddress}` : null,
    ].filter(Boolean);

    details.forEach((d) => {
      sections.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: d,
              size: 20,
              font: 'Calibri',
            }),
          ],
        })
      );
    });
  }

  // 9. References
  if (references && references.length > 0) {
    sections.push(createSectionHeading('References'));
    references.forEach((ref) => {
      sections.push(
        new Paragraph({
          spacing: { after: 20 },
          children: [
            new TextRun({
              text: ref.name,
              bold: true,
              size: 20,
              font: 'Calibri',
            }),
            new TextRun({
              text: ` — ${ref.designation}, ${ref.company}`,
              size: 20,
              font: 'Calibri',
            }),
            ...(ref.phone
              ? [
                  new TextRun({
                    text: ` (Phone: ${ref.phone})`,
                    size: 18,
                    color: grayColorHex,
                    font: 'Calibri',
                  }),
                ]
              : []),
          ],
        })
      );
    });
  }

  // 10. Declaration
  if (declaration && (declaration.signedBy || declaration.text)) {
    sections.push(createSectionHeading('Declaration'));
    sections.push(
      new Paragraph({
        spacing: { before: 80, after: 120 },
        children: [
          new TextRun({
            text: declaration.text || 'I hereby declare that all the information provided above is true and correct.',
            italics: true,
            size: 18,
            color: grayColorHex,
            font: 'Calibri',
          }),
        ],
      })
    );
    sections.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { before: 100 },
        children: [
          new TextRun({
            text: `Signed by: ${declaration.signedBy || personalInfo.fullName || 'Applicant'}`,
            bold: true,
            size: 20,
            font: 'Calibri',
          }),
        ],
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 inch (720 dxa)
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: sections,
      },
    ],
  });

  return await Packer.toBuffer(doc);
};

export default generateDOCX;

