import api from './api';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RenderCVTemplate } from '../templates';
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

// Helper to safely trigger mobile-friendly download
export const triggerDownload = (blob, filename) => {
  try {
    saveAs(blob, filename);
  } catch (err) {
    console.warn('saveAs failed, falling back to direct anchor:', err);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      a.remove();
      window.URL.revokeObjectURL(url);
    }, 15000);
  }
};

export const exportService = {
  // Client-Side Native Vector-Crisp PDF Export (Mobile & Desktop 100% Reliable)
  async exportPDF(cvData, customHtml = '', elementId = 'cv-export-sheet') {
    const filename = `${(cvData?.personalInfo?.fullName || cvData?.title || 'Resume').replace(/\s+/g, '_')}.pdf`;

    // 1. Try Client-Side High-Res HTML to Canvas to jsPDF
    let exportContainer = null;
    let tempRoot = null;

    try {
      // Find the template sheet element to export
      let sheetEl = null;

      // Check specific element ID if provided
      if (elementId) {
        const el = document.getElementById(elementId);
        if (el) {
          sheetEl = el.querySelector('#cv-export-sheet') || el;
        }
      }

      // Check template-specific ID if cvData has templateId
      if (!sheetEl && cvData?.templateId) {
        const cardEl =
          document.getElementById(`preview-sheet-${cvData.templateId}`) ||
          document.getElementById(`gallery-preview-sheet-${cvData.templateId}`);
        if (cardEl) {
          sheetEl = cardEl.querySelector('#cv-export-sheet') || cardEl;
        }
      }

      // Check fullscreen modal preview sheet
      if (!sheetEl) {
        const modalEl = document.getElementById('modal-preview-sheet');
        if (modalEl) {
          sheetEl = modalEl.querySelector('#cv-export-sheet') || modalEl;
        }
      }

      // Check generic fallback
      if (!sheetEl) {
        sheetEl = document.getElementById('cv-export-sheet');
      }

      // Create an isolated, off-screen export container at (0, 0) with z-index behind root
      exportContainer = document.createElement('div');
      exportContainer.id = 'active-pdf-export-stage';
      exportContainer.style.cssText = `
        position: fixed;
        left: 0;
        top: 0;
        width: 794px;
        min-height: 1123px;
        z-index: -99999;
        background: #ffffff;
        opacity: 1;
        visibility: visible;
        pointer-events: none;
        overflow: visible;
        margin: 0;
        padding: 0;
      `;
      document.body.appendChild(exportContainer);

      let captureTarget = null;

      if (sheetEl) {
        // Clone the existing rendered DOM sheet so all current input/DOM states are preserved
        captureTarget = sheetEl.cloneNode(true);
        captureTarget.style.transform = 'none';
        captureTarget.style.webkitTransform = 'none';
        captureTarget.style.width = '794px';
        captureTarget.style.minHeight = '1123px';
        captureTarget.style.height = 'auto';
        captureTarget.style.maxHeight = 'none';
        captureTarget.style.margin = '0';
        captureTarget.style.padding = '0';
        captureTarget.style.boxShadow = 'none';
        captureTarget.style.borderRadius = '0';
        captureTarget.style.overflow = 'visible';
        captureTarget.style.boxSizing = 'border-box';

        // 1. Remove rounded outer container clipping and overflow-hidden from root
        captureTarget.classList.remove('overflow-hidden', 'rounded-sm', 'rounded-md', 'rounded-lg');

        // 2. Remove any editor selection pips, focus rings, or badges from the export clone
        const rings = captureTarget.querySelectorAll('.ring-2, [class*="ring-indigo"]');
        rings.forEach((r) =>
          r.classList.remove('ring-2', 'ring-indigo-500', 'ring-offset-1', 'bg-indigo-50/30')
        );
        const pips = captureTarget.querySelectorAll(
          'span.rounded-full.bg-indigo-600, div.bg-indigo-600, span.bg-indigo-600, .group\\/editable > span'
        );
        pips.forEach((p) => p.remove());

        // 3. Remove hover outlines from editable elements
        const hoverOutlines = captureTarget.querySelectorAll('[class*="hover:outline"]');
        hoverOutlines.forEach((el) => {
          el.classList.remove(
            'hover:outline-dashed',
            'hover:outline-1',
            'hover:outline-indigo-400/80',
            'hover:bg-indigo-50/10'
          );
        });

        exportContainer.appendChild(captureTarget);
      } else if (customHtml) {
        // If customHtml is provided, inject it
        exportContainer.innerHTML = customHtml;
        captureTarget = exportContainer.firstElementChild || exportContainer;
      } else {
        // Dynamic React render fallback directly using RenderCVTemplate
        tempRoot = ReactDOM.createRoot(exportContainer);
        tempRoot.render(
          React.createElement(RenderCVTemplate, {
            cvData: cvData,
            scale: 1,
          })
        );
        captureTarget = exportContainer;
      }

      // Allow a brief tick for DOM layout calculation
      await new Promise((r) => setTimeout(r, 100));

      // Global cleanup on captureTarget across all templates:
      // Remove .truncate and tight overflow so font descenders are never clipped
      if (captureTarget) {
        captureTarget.classList.remove('overflow-hidden');
        const truncates = captureTarget.querySelectorAll('.truncate');
        truncates.forEach((el) => {
          el.classList.remove('truncate');
          el.style.overflow = 'visible';
          el.style.textOverflow = 'clip';
          el.style.whiteSpace = 'normal';
          el.style.wordBreak = 'break-word';
          el.style.lineHeight = 'normal';
        });

        const scrollables = captureTarget.querySelectorAll('.overflow-x-auto, .overflow-y-auto');
        scrollables.forEach((el) => {
          el.classList.remove('overflow-x-auto', 'overflow-y-auto');
          el.style.overflow = 'visible';
        });
      }

      // Wait for fonts to finish loading
      if (document.fonts && document.fonts.ready) {
        try {
          await document.fonts.ready;
        } catch (e) {
          // ignore font loading error
        }
      }

      // Ensure CORS on all images inside the export container
      const images = exportContainer.querySelectorAll('img');
      images.forEach((img) => {
        img.crossOrigin = 'anonymous';
      });

      if (images.length > 0) {
        await Promise.all(
          Array.from(images).map((img) => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve;
              setTimeout(resolve, 800); // 800ms safety timeout
            });
          })
        );
      }

      // Allow final tick for layout stabilization
      await new Promise((r) => setTimeout(r, 100));

      // Capture with html2canvas at 2x crisp print scale (1588 x 2246)
      // windowWidth and width are both exactly 794px to preserve 1:1 A4 layout
      const canvas = await html2canvas(captureTarget, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 794,
        windowWidth: 794,
        scrollX: 0,
        scrollY: 0,
      });

      if (canvas && canvas.width > 0 && canvas.height > 0) {
        const imgData = canvas.toDataURL('image/jpeg', 0.98);

        const isLetter = cvData?.design?.pageSize === 'Letter';
        const pageWidth = isLetter ? 215.9 : 210; // mm
        const pageHeight = isLetter ? 279.4 : 297; // mm
        const format = isLetter ? 'letter' : 'a4';

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format,
          compress: true,
        });

        const pdfHeight = (canvas.height * pageWidth) / canvas.width;
        // Allow up to 18% height tolerance (up to ~350mm) to cleanly fit 1 page
        // without awkward page cuts through headers or sections
        const singlePageThreshold = pageHeight * 1.18;

        if (pdfHeight <= singlePageThreshold) {
          // Standard single page fit: renders entire document cleanly on 1 page
          const renderHeight = pdfHeight >= pageHeight * 0.94 ? pageHeight : pdfHeight;
          pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, renderHeight, undefined, 'FAST');
        } else {
          // Truly multi-page document
          let heightLeft = pdfHeight;
          let position = 0;

          pdf.addImage(imgData, 'JPEG', 0, position, pageWidth, pdfHeight, undefined, 'FAST');
          heightLeft -= pageHeight;

          while (heightLeft > 25) {
            position = position - pageHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, position, pageWidth, pdfHeight, undefined, 'FAST');
            heightLeft -= pageHeight;
          }
        }

        // Save PDF directly to mobile or desktop device
        pdf.save(filename);

        // Also return the blob
        const pdfBlob = pdf.output('blob');
        return pdfBlob;
      }
    } catch (clientErr) {
      console.warn('Client-side PDF generation error, trying fallback:', clientErr);
    } finally {
      if (tempRoot) {
        try {
          tempRoot.unmount();
        } catch (e) {}
      }
      if (exportContainer && exportContainer.parentNode) {
        exportContainer.remove();
      }
    }

    // 2. Fallback to Backend Server Export if available
    try {
      const sheetEl = document.getElementById(elementId) || document.getElementById('cv-export-sheet');
      const html = customHtml || (sheetEl ? sheetEl.outerHTML : '');

      const res = await api.post(
        '/export/pdf',
        { cvData, html },
        {
          responseType: 'blob',
        }
      );

      // Verify not index.html redirect
      if (res.data?.type !== 'text/html') {
        triggerDownload(res.data, filename);
        return res.data;
      }
    } catch (apiErr) {
      console.warn('Backend PDF export error:', apiErr);
    }

    // 3. Fallback: Native Print to PDF on mobile
    window.print();
    return null;
  },

  // Client-Side Genuine Microsoft Word (.docx) Document Export
  async exportDOCX(cvData) {
    const rawName = (cvData?.personalInfo?.fullName || cvData?.title || 'Resume').trim();
    const cleanName = rawName.replace(/[^a-zA-Z0-9_\-\s]/g, '').replace(/\s+/g, '_') || 'Resume';
    const filename = `${cleanName}.docx`;

    try {
      const {
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
        design = {},
      } = cvData || {};

      const primaryHex = (design?.primaryColor || '#1E40AF').replace('#', '');
      const darkTextHex = '1E293B';
      const grayHex = '475569';
      const lightGrayHex = '64748B';

      const paragraphs = [];

      // 1. HEADER: FULL NAME
      paragraphs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 80 },
          children: [
            new TextRun({
              text: personalInfo.fullName || 'CURRICULUM VITAE',
              bold: true,
              size: 52, // 26pt
              color: primaryHex,
              font: 'Calibri',
            }),
          ],
        })
      );

      // Job Title / Headline
      if (personalInfo.jobTitle) {
        paragraphs.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 100 },
            children: [
              new TextRun({
                text: personalInfo.jobTitle.toUpperCase(),
                bold: true,
                size: 26, // 13pt
                color: grayHex,
                font: 'Calibri',
              }),
            ],
          })
        );
      }

      // Contact Line: Email, Phone, Location, LinkedIn, Website
      const contactItems = [
        personalInfo.phone,
        personalInfo.email,
        personalInfo.location || personalInfo.address,
        personalInfo.linkedin,
        personalInfo.website,
      ].filter(Boolean);

      if (contactItems.length > 0) {
        paragraphs.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 220 },
            children: [
              new TextRun({
                text: contactItems.join('   •   '),
                size: 19, // 9.5pt
                color: grayHex,
                font: 'Calibri',
              }),
            ],
          })
        );
      }

      // Section Heading Builder
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
              size: 24, // 12pt
              color: primaryHex,
              font: 'Calibri',
            }),
          ],
        });

      // 2. CAREER OBJECTIVE / SUMMARY
      if (personalInfo.summary) {
        paragraphs.push(createHeading('Career Objective & Summary'));
        paragraphs.push(
          new Paragraph({
            spacing: { after: 180, line: 280 },
            children: [
              new TextRun({
                text: personalInfo.summary,
                size: 21, // 10.5pt
                color: darkTextHex,
                font: 'Calibri',
              }),
            ],
          })
        );
      }

      // 3. WORK EXPERIENCE
      if (experience && experience.length > 0) {
        paragraphs.push(createHeading('Professional Work Experience'));

        experience.forEach((exp) => {
          const dateRange = [
            exp.startDate,
            exp.current ? 'Present' : exp.endDate,
          ].filter(Boolean).join(' – ');

          // Line 1: Job Title & Date
          paragraphs.push(
            new Paragraph({
              spacing: { before: 120, after: 40 },
              children: [
                new TextRun({
                  text: exp.jobTitle || 'Role / Position',
                  bold: true,
                  size: 22, // 11pt
                  color: darkTextHex,
                  font: 'Calibri',
                }),
                ...(dateRange
                  ? [
                      new TextRun({
                        text: `   |   ${dateRange}`,
                        bold: true,
                        size: 19,
                        color: lightGrayHex,
                        font: 'Calibri',
                      }),
                    ]
                  : []),
              ],
            })
          );

          // Line 2: Company & Location
          const companyLocation = [exp.company, exp.location].filter(Boolean).join(' • ');
          if (companyLocation) {
            paragraphs.push(
              new Paragraph({
                spacing: { after: 60 },
                children: [
                  new TextRun({
                    text: companyLocation,
                    italics: true,
                    size: 20,
                    color: grayHex,
                    font: 'Calibri',
                  }),
                ],
              })
            );
          }

          // Line 3: Description / Bullet points
          if (exp.description) {
            const lines = exp.description.split('\n').map((l) => l.trim()).filter(Boolean);
            lines.forEach((line) => {
              const cleanLine = line.replace(/^[•\-\*]\s*/, '');
              paragraphs.push(
                new Paragraph({
                  bullet: { level: 0 },
                  spacing: { after: 40, line: 260 },
                  children: [
                    new TextRun({
                      text: cleanLine,
                      size: 20,
                      color: darkTextHex,
                      font: 'Calibri',
                    }),
                  ],
                })
              );
            });
          }
        });
      }

      // 4. EDUCATION & QUALIFICATIONS
      if (education && education.length > 0) {
        paragraphs.push(createHeading('Academic Qualifications'));

        education.forEach((edu) => {
          const dateRange = [edu.startDate, edu.endDate].filter(Boolean).join(' – ');

          // Line 1: Degree & Dates
          paragraphs.push(
            new Paragraph({
              spacing: { before: 120, after: 40 },
              children: [
                new TextRun({
                  text: edu.degree || 'Degree / Examination',
                  bold: true,
                  size: 22,
                  color: darkTextHex,
                  font: 'Calibri',
                }),
                ...(dateRange
                  ? [
                      new TextRun({
                        text: `   |   ${dateRange}`,
                        bold: true,
                        size: 19,
                        color: lightGrayHex,
                        font: 'Calibri',
                      }),
                    ]
                  : []),
              ],
            })
          );

          // Line 2: Institution & Field
          const eduDetails = [
            edu.institution,
            edu.fieldOfStudy,
            edu.gpa ? `Result: ${edu.gpa}` : null,
          ].filter(Boolean).join(' • ');

          if (eduDetails) {
            paragraphs.push(
              new Paragraph({
                spacing: { after: 60 },
                children: [
                  new TextRun({
                    text: eduDetails,
                    italics: true,
                    size: 20,
                    color: grayHex,
                    font: 'Calibri',
                  }),
                ],
              })
            );
          }
        });
      }

      // 5. SKILLS & COMPETENCIES
      if (skills && skills.length > 0) {
        paragraphs.push(createHeading('Technical & Core Competencies'));
        const skillList = skills
          .map((s) => (typeof s === 'string' ? s : s.name))
          .filter(Boolean);

        if (skillList.length > 0) {
          paragraphs.push(
            new Paragraph({
              spacing: { after: 160, line: 280 },
              children: [
                new TextRun({
                  text: skillList.join('   •   '),
                  bold: true,
                  size: 21,
                  color: darkTextHex,
                  font: 'Calibri',
                }),
              ],
            })
          );
        }
      }

      // 6. PERSONAL DETAILS (Bangladeshi Recruiter Format)
      const bdFields = [
        { label: "Father's Name", value: personalDetails.fatherName },
        { label: "Mother's Name", value: personalDetails.motherName },
        { label: 'Date of Birth', value: personalDetails.dateOfBirth },
        { label: 'Gender', value: personalDetails.gender },
        { label: 'Marital Status', value: personalDetails.maritalStatus },
        { label: 'Nationality', value: personalDetails.nationality || 'Bangladeshi' },
        { label: 'Religion', value: personalDetails.religion },
        { label: 'National ID (NID)', value: personalDetails.nid || personalDetails.nationalId },
        { label: 'Blood Group', value: personalDetails.bloodGroup },
        { label: 'Present Address', value: personalDetails.presentAddress },
        { label: 'Permanent Address', value: personalDetails.permanentAddress },
      ].filter((f) => Boolean(f.value));

      if (bdFields.length > 0) {
        paragraphs.push(createHeading('Personal Details'));

        const tableRows = bdFields.map(
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
                          size: 20,
                          color: grayHex,
                          font: 'Calibri',
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
                          size: 20,
                          color: darkTextHex,
                          font: 'Calibri',
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
            rows: tableRows,
          })
        );
      }

      // 7. PROJECTS & PORTFOLIO
      if (projects && projects.length > 0) {
        paragraphs.push(createHeading('Projects & Key Works'));

        projects.forEach((proj) => {
          paragraphs.push(
            new Paragraph({
              spacing: { before: 100, after: 40 },
              children: [
                new TextRun({
                  text: proj.name || proj.title || 'Project Name',
                  bold: true,
                  size: 22,
                  color: darkTextHex,
                  font: 'Calibri',
                }),
                ...(proj.technologies
                  ? [
                      new TextRun({
                        text: `   [${proj.technologies}]`,
                        italics: true,
                        size: 19,
                        color: lightGrayHex,
                        font: 'Calibri',
                      }),
                    ]
                  : []),
              ],
            })
          );

          if (proj.description) {
            paragraphs.push(
              new Paragraph({
                spacing: { after: 60, line: 260 },
                children: [
                  new TextRun({
                    text: proj.description,
                    size: 20,
                    color: darkTextHex,
                    font: 'Calibri',
                  }),
                ],
              })
            );
          }

          if (proj.link) {
            paragraphs.push(
              new Paragraph({
                spacing: { after: 80 },
                children: [
                  new TextRun({
                    text: `Project URL: ${proj.link}`,
                    italics: true,
                    size: 18,
                    color: primaryHex,
                    font: 'Calibri',
                  }),
                ],
              })
            );
          }
        });
      }

      // 8. CERTIFICATIONS
      if (certifications && certifications.length > 0) {
        paragraphs.push(createHeading('Certifications & Licenses'));

        certifications.forEach((cert) => {
          const certInfo = [cert.issuer, cert.date || cert.year].filter(Boolean).join(' • ');
          paragraphs.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 40 },
              children: [
                new TextRun({
                  text: cert.name || cert.title || 'Certification',
                  bold: true,
                  size: 20,
                  color: darkTextHex,
                  font: 'Calibri',
                }),
                ...(certInfo
                  ? [
                      new TextRun({
                        text: ` (${certInfo})`,
                        italics: true,
                        size: 19,
                        color: lightGrayHex,
                        font: 'Calibri',
                      }),
                    ]
                  : []),
              ],
            })
          );
        });
      }

      // 9. LANGUAGES
      if (languages && languages.length > 0) {
        paragraphs.push(createHeading('Languages'));
        const langItems = languages.map((lang) => {
          if (typeof lang === 'string') return lang;
          return `${lang.language || lang.name || ''} ${lang.proficiency ? `(${lang.proficiency})` : ''}`.trim();
        }).filter(Boolean);

        paragraphs.push(
          new Paragraph({
            spacing: { after: 140 },
            children: [
              new TextRun({
                text: langItems.join('   •   '),
                size: 20,
                color: darkTextHex,
                font: 'Calibri',
              }),
            ],
          })
        );
      }

      // 10. REFERENCES
      if (references && references.length > 0) {
        paragraphs.push(createHeading('References'));

        references.forEach((ref) => {
          paragraphs.push(
            new Paragraph({
              spacing: { before: 80, after: 20 },
              children: [
                new TextRun({
                  text: ref.name || 'Reference Person',
                  bold: true,
                  size: 21,
                  color: darkTextHex,
                  font: 'Calibri',
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
                spacing: { after: 60 },
                children: [
                  new TextRun({
                    text: refDetails,
                    size: 19,
                    color: grayHex,
                    font: 'Calibri',
                  }),
                ],
              })
            );
          }
        });
      }

      // 11. DECLARATION
      paragraphs.push(createHeading('Declaration'));
      paragraphs.push(
        new Paragraph({
          spacing: { after: 180, line: 260 },
          children: [
            new TextRun({
              text:
                declaration?.text ||
                'I hereby declare that all the information provided above is true and correct to the best of my knowledge and belief.',
              italics: true,
              size: 20,
              color: darkTextHex,
              font: 'Calibri',
            }),
          ],
        })
      );

      // Signature / Name at bottom right
      paragraphs.push(
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { before: 180, after: 80 },
          children: [
            new TextRun({
              text: personalInfo.fullName || 'Authorized Signature',
              bold: true,
              size: 21,
              color: primaryHex,
              font: 'Calibri',
            }),
          ],
        })
      );

      // Create doc with 0.6 inch margins
      const doc = new Document({
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: 864, // 0.6 inch (864 dxa)
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

      const docxBlob = await Packer.toBlob(doc);
      const fileBlob = new Blob([docxBlob], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      triggerDownload(fileBlob, filename);
      return fileBlob;
    } catch (clientDocxErr) {
      console.warn('Client-side DOCX export error, trying backend fallback:', clientDocxErr);
    }

    // Backend fallback
    try {
      const res = await api.post('/export/docx', { cvData }, { responseType: 'blob' });
      if (res.data?.type !== 'text/html') {
        triggerDownload(res.data, filename);
        return res.data;
      }
    } catch (apiErr) {
      console.error('All DOCX export strategies failed:', apiErr);
    }

    return null;
  },
};

export default exportService;
