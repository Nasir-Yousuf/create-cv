import api from './api';
import html2pdf from 'html2pdf.js';
import { saveAs } from 'file-saver';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
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

    // 1. Try Client-Side High-Res HTML to PDF
    try {
      let targetEl = null;

      if (elementId) {
        targetEl = document.getElementById(elementId);
      }
      if (!targetEl) {
        targetEl = document.getElementById('cv-export-sheet');
      }
      if (!targetEl && customHtml) {
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = customHtml;
        targetEl = tempContainer.firstElementChild || tempContainer;
      }

      if (targetEl) {
        // Clone element to remove scale transforms so capturing is unscaled 794px A4
        const clone = targetEl.cloneNode(true);
        clone.style.transform = 'none';
        clone.style.webkitTransform = 'none';
        clone.style.transformOrigin = 'top left';
        clone.style.width = '794px';
        clone.style.minHeight = '1123px';
        clone.style.position = 'fixed';
        clone.style.left = '-9999px';
        clone.style.top = '0';
        clone.style.zIndex = '-9999';
        clone.style.opacity = '1';
        clone.style.visibility = 'visible';
        clone.style.background = '#ffffff';

        document.body.appendChild(clone);

        const opt = {
          margin: 0,
          filename: filename,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            logging: false,
            windowWidth: 794,
          },
          jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait',
          },
        };

        const pdfBlob = await html2pdf().set(opt).from(clone).outputPdf('blob');
        clone.remove();

        if (pdfBlob && pdfBlob.size > 1000) {
          triggerDownload(pdfBlob, filename);
          return pdfBlob;
        }
      }
    } catch (clientErr) {
      console.warn('Client-side PDF generation error, trying fallback:', clientErr);
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

  // Client-Side Genuine DOCX Document Export
  async exportDOCX(cvData) {
    const filename = `${(cvData?.personalInfo?.fullName || cvData?.title || 'Resume').replace(/\s+/g, '_')}.docx`;

    try {
      const {
        personalInfo = {},
        experience = [],
        education = [],
        skills = [],
        design = {},
      } = cvData || {};

      const primaryHex = (design?.primaryColor || '#2563EB').replace('#', '');
      const grayHex = '64748B';

      const paragraphs = [];

      // Name & Title
      paragraphs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [
            new TextRun({
              text: personalInfo.fullName || 'Professional Resume',
              bold: true,
              size: 36,
              color: primaryHex,
              font: 'Calibri',
            }),
          ],
        })
      );

      if (personalInfo.jobTitle) {
        paragraphs.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: personalInfo.jobTitle,
                size: 24,
                bold: true,
                color: grayHex,
                font: 'Calibri',
              }),
            ],
          })
        );
      }

      // Contact Line
      const contactInfo = [
        personalInfo.email,
        personalInfo.phone,
        personalInfo.location,
        personalInfo.linkedin,
      ].filter(Boolean);

      if (contactInfo.length > 0) {
        paragraphs.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: contactInfo.join('  •  '),
                size: 18,
                color: grayHex,
                font: 'Calibri',
              }),
            ],
          })
        );
      }

      const createHeading = (text) =>
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
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
              text: text.toUpperCase(),
              bold: true,
              size: 22,
              color: primaryHex,
              font: 'Calibri',
            }),
          ],
        });

      // Summary
      if (personalInfo.summary) {
        paragraphs.push(createHeading('Professional Summary'));
        paragraphs.push(
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: personalInfo.summary,
                size: 20,
                font: 'Calibri',
              }),
            ],
          })
        );
      }

      // Experience
      if (experience && experience.length > 0) {
        paragraphs.push(createHeading('Work Experience'));
        experience.forEach((exp) => {
          paragraphs.push(
            new Paragraph({
              spacing: { before: 100, after: 40 },
              children: [
                new TextRun({
                  text: exp.jobTitle || 'Job Title',
                  bold: true,
                  size: 22,
                  font: 'Calibri',
                }),
                new TextRun({
                  text: `   |   ${exp.startDate || ''} – ${exp.current ? 'Present' : exp.endDate || ''}`,
                  bold: true,
                  size: 18,
                  color: grayHex,
                  font: 'Calibri',
                }),
              ],
            })
          );

          if (exp.company || exp.location) {
            paragraphs.push(
              new Paragraph({
                spacing: { after: 60 },
                children: [
                  new TextRun({
                    text: [exp.company, exp.location].filter(Boolean).join(' • '),
                    italics: true,
                    size: 20,
                    color: grayHex,
                    font: 'Calibri',
                  }),
                ],
              })
            );
          }

          if (exp.description) {
            paragraphs.push(
              new Paragraph({
                spacing: { after: 80 },
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
        });
      }

      // Education
      if (education && education.length > 0) {
        paragraphs.push(createHeading('Education & Qualifications'));
        education.forEach((edu) => {
          paragraphs.push(
            new Paragraph({
              spacing: { before: 100, after: 40 },
              children: [
                new TextRun({
                  text: edu.degree || 'Degree',
                  bold: true,
                  size: 22,
                  font: 'Calibri',
                }),
                new TextRun({
                  text: `   |   ${edu.startDate || ''} – ${edu.endDate || ''}`,
                  bold: true,
                  size: 18,
                  color: grayHex,
                  font: 'Calibri',
                }),
              ],
            })
          );

          if (edu.institution) {
            paragraphs.push(
              new Paragraph({
                spacing: { after: 60 },
                children: [
                  new TextRun({
                    text: edu.institution,
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

      // Skills
      if (skills && skills.length > 0) {
        paragraphs.push(createHeading('Skills & Competencies'));
        const skillList = skills.map((s) => (typeof s === 'string' ? s : s.name)).filter(Boolean);
        paragraphs.push(
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: skillList.join('   •   '),
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
                  top: 720,
                  bottom: 720,
                  left: 720,
                  right: 720,
                },
              },
            },
            children: paragraphs,
          },
        ],
      });

      const docxBlob = await Packer.toBlob(doc);
      triggerDownload(docxBlob, filename);
      return docxBlob;
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
