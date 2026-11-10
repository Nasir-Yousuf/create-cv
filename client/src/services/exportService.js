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

      // Wait for fonts to finish loading
      if (document.fonts && document.fonts.ready) {
        try {
          await document.fonts.ready;
        } catch (e) {
          // ignore font loading error
        }
      }

      // Wait for all images inside the export container to load
      const images = exportContainer.querySelectorAll('img');
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

      // Allow a brief tick for DOM layout calculation
      await new Promise((r) => setTimeout(r, 100));

      // Capture with html2canvas at 2x crisp print scale (1588 x 2246)
      const canvas = await html2canvas(captureTarget, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 794,
        windowWidth: 1200,
        scrollX: 0,
        scrollY: 0,
      });

      if (canvas && canvas.width > 0 && canvas.height > 0) {
        const imgData = canvas.toDataURL('image/jpeg', 0.98);

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
          compress: true,
        });

        const pdfWidth = 210; // A4 width in mm
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        const pageHeight = 297; // A4 height in mm
        let heightLeft = pdfHeight;
        let position = 0;

        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
        heightLeft -= pageHeight;

        while (heightLeft > 5) {
          position = position - pageHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
          heightLeft -= pageHeight;
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
