/**
 * Dedicated Server-Side HTML Renderers for the 10 One-Page A4 CV Templates.
 * Used by Puppeteer when client HTML is not passed (e.g. Dashboard download or API tests).
 */

const esc = (val) =>
  String(val ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const renderPhoto = (personalInfo = {}, design = {}, opts = {}) => {
  if (design?.showPhoto === false || opts.noPhoto) return '';
  if (!personalInfo?.photo) return '';
  const style = opts.shape || personalInfo.photoStyle || 'circle';
  const radius = style === 'circle' ? '9999px' : style === 'square' ? '3px' : '10px';
  const w = style === 'portrait' ? '72px' : '74px';
  const h = style === 'portrait' ? '92px' : '74px';
  const border = opts.borderColor || '#cbd5e1';
  return `
    <div style="width:${w};height:${h};border-radius:${radius};overflow:hidden;border:2px solid ${border};flex-shrink:0;">
      <img src="${esc(personalInfo.photo)}" style="width:100%;height:100%;object-fit:cover;display:block;" />
    </div>
  `;
};

const renderExpList = (experience = [], primary) =>
  (experience || [])
    .map(
      (exp) => `
      <div style="margin-bottom:8px;line-height:1.35;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px;">
          <div>
            <span style="font-size:12px;font-weight:700;color:#0f172a;">${esc(exp.jobTitle)}</span>
            ${exp.company ? `<span style="color:#94a3b8;"> • </span><span style="font-size:11.5px;font-weight:600;color:${primary};">${esc(exp.company)}</span>` : ''}
            ${exp.location ? `<span style="font-size:10.5px;color:#64748b;"> (${esc(exp.location)})</span>` : ''}
          </div>
          <span style="font-size:10.5px;font-weight:600;color:#64748b;white-space:nowrap;">${esc(exp.startDate)}${exp.startDate || exp.endDate || exp.current ? ' – ' : ''}${exp.current ? 'Present' : esc(exp.endDate)}</span>
        </div>
        ${exp.description ? `<p style="font-size:11px;color:#334155;margin:2px 0 0 0;">${esc(exp.description)}</p>` : ''}
        ${
          Array.isArray(exp.highlights) && exp.highlights.filter(Boolean).length > 0
            ? `<ul style="margin:3px 0 0 0;padding-left:16px;font-size:11px;color:#334155;">${exp.highlights
                .filter(Boolean)
                .map((h) => `<li style="margin-bottom:2px;">${esc(h)}</li>`)
                .join('')}</ul>`
            : ''
        }
      </div>
    `
    )
    .join('');

const renderEduList = (education = [], primary) =>
  (education || [])
    .map(
      (edu) => `
      <div style="margin-bottom:6px;line-height:1.35;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px;">
          <span style="font-size:11.5px;font-weight:700;color:#0f172a;">${esc(edu.degree)}</span>
          <span style="font-size:10.5px;font-weight:600;color:#64748b;white-space:nowrap;">${esc(edu.startDate)}${edu.startDate && edu.endDate ? ' – ' : ''}${esc(edu.endDate)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;gap:8px;font-size:11px;color:#475569;">
          <span>${esc(edu.institution)}</span>
          ${edu.grade ? `<span style="font-weight:700;color:${primary};font-size:10.5px;white-space:nowrap;">${esc(edu.grade)}</span>` : ''}
        </div>
      </div>
    `
    )
    .join('');

const renderSectionHead = (title, primary, style = 'underline') => {
  if (style === 'plain') {
    return `<h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${primary};border-bottom:1px solid #cbd5e1;padding-bottom:2px;margin:0 0 6px 0;">${esc(title)}</h2>`;
  }
  if (style === 'bar') {
    return `<div style="display:flex;align-items:center;gap:6px;margin:0 0 6px 0;"><span style="width:4px;height:14px;border-radius:99px;background:${primary};display:inline-block;"></span><h2 style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:#0f172a;margin:0;">${esc(title)}</h2></div>`;
  }
  return `<h2 style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:${primary};border-bottom:2px solid ${primary};padding-bottom:2px;margin:0 0 6px 0;">${esc(title)}</h2>`;
};

const renderProjects = (projects = [], primary, twoCol = true) => {
  if (!projects?.length) return '';
  const cols = twoCol && projects.length > 1 ? 'display:grid;grid-template-columns:1fr 1fr;gap:10px;' : 'display:flex;flex-direction:column;gap:8px;';
  return `
    <div style="${cols}">
      ${projects
        .map((p) => {
          const techs = Array.isArray(p.technologies) ? p.technologies : String(p.technologies || '').split(',');
          return `
            <div style="padding:8px;border:1px solid #e2e8f0;border-radius:6px;background:#f8fafc;line-height:1.35;">
              <div style="display:flex;justify-content:space-between;align-items:baseline;gap:4px;">
                <span style="font-size:11.5px;font-weight:700;color:#0f172a;">${esc(p.name)}</span>
                ${p.role ? `<span style="font-size:9.5px;font-weight:600;color:${primary};">${esc(p.role)}</span>` : ''}
              </div>
              ${p.description ? `<p style="font-size:10.5px;color:#475569;margin:3px 0 0 0;">${esc(p.description)}</p>` : ''}
              ${
                techs.filter((t) => String(t).trim()).length > 0
                  ? `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px;">${techs
                      .map((t) => String(t).trim())
                      .filter(Boolean)
                      .slice(0, 4)
                      .map((t) => `<span style="font-size:9px;padding:1px 6px;background:#fff;border:1px solid #e2e8f0;border-radius:4px;color:#334155;">${esc(t)}</span>`)
                      .join('')}</div>`
                  : ''
              }
            </div>
          `;
        })
        .join('')}
    </div>
  `;
};

export const generateOnePageTemplateHtml = (canonicalId, cvData) => {
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

  const primary = design?.primaryColor || (
    canonicalId === 'onepage-bd-compact' ? '#059669' :
    canonicalId === 'onepage-modern-split' ? '#0284c7' :
    canonicalId === 'onepage-minimal-swiss' ? '#1e293b' :
    canonicalId === 'onepage-tech-grid' ? '#4f46e5' :
    canonicalId === 'onepage-it-sidebar' ? '#0284c7' :
    canonicalId === 'onepage-ats-strict' ? '#0f172a' :
    canonicalId === 'onepage-executive-brief' ? '#1e3a8a' :
    canonicalId === 'onepage-academic-compact' ? '#7c2d12' :
    canonicalId === 'onepage-creative-editorial' ? '#e11d48' :
    '#2563eb'
  );
  const accent = design?.accentColor || '#38bdf8';
  const fontFamily = design?.fontFamily || 'Inter';
  const pageClass = design?.pageSize === 'Letter' ? 'resume-sheet-letter' : 'resume-sheet-a4';
  const contacts = [personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin, personalInfo.github || personalInfo.website].filter(Boolean);

  // 1. BD Graduate & Corporate 1-Page
  if (canonicalId === 'onepage-bd-compact') {
    const facts = [
      personalDetails.nationality ? `Nationality: ${personalDetails.nationality}` : null,
      personalDetails.presentAddress ? `Address: ${personalDetails.presentAddress}` : null,
      personalDetails.dateOfBirth ? `DOB: ${personalDetails.dateOfBirth}` : null,
    ].filter(Boolean);

    return `
      <div class="${pageClass}" style="padding:24px 28px;background:#fff;color:#1e293b;font-family:'${fontFamily}',sans-serif;line-height:1.35;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;padding-bottom:12px;margin-bottom:12px;border-bottom:2px solid ${primary};">
          <div style="flex:1;min-width:0;">
            <span style="font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:${primary};display:block;">Curriculum Vitae</span>
            <h1 style="font-size:22px;font-weight:800;text-transform:uppercase;color:#020617;margin:2px 0 0 0;">${esc(personalInfo.fullName)}</h1>
            <p style="font-size:12.5px;font-weight:700;color:#334155;margin:2px 0 0 0;">${esc(personalInfo.jobTitle)}</p>
            <p style="font-size:10.5px;color:#475569;margin:6px 0 0 0;">${contacts.map(esc).join('  •  ')}</p>
          </div>
          ${renderPhoto(personalInfo, design, { shape: personalInfo.photoStyle === 'circle' ? 'circle' : 'portrait', borderColor: primary })}
        </div>

        ${personalInfo.summary ? `<div style="margin-bottom:10px;">${renderSectionHead('Career Objective', primary, 'bar')}<p style="font-size:11px;color:#334155;margin:0;line-height:1.45;">${esc(personalInfo.summary)}</p></div>` : ''}

        ${education.length ? `
          <div style="margin-bottom:10px;">
            ${renderSectionHead('Academic Qualifications', primary, 'bar')}
            <table style="width:100%;border-collapse:collapse;font-size:10.5px;border:1px solid #cbd5e1;">
              <thead><tr style="background:#f1f5f9;font-weight:700;"><th style="padding:4px 8px;text-align:left;border-bottom:1px solid #cbd5e1;">Exam / Degree</th><th style="padding:4px 8px;text-align:left;border-bottom:1px solid #cbd5e1;">Institution</th><th style="padding:4px 8px;text-align:center;border-bottom:1px solid #cbd5e1;">Year</th><th style="padding:4px 8px;text-align:right;border-bottom:1px solid #cbd5e1;">Result</th></tr></thead>
              <tbody>${education.map((e) => `<tr><td style="padding:4px 8px;font-weight:600;border-bottom:1px solid #e2e8f0;">${esc(e.degree)}</td><td style="padding:4px 8px;border-bottom:1px solid #e2e8f0;">${esc(e.institution)}</td><td style="padding:4px 8px;text-align:center;border-bottom:1px solid #e2e8f0;">${esc(e.endDate || e.startDate)}</td><td style="padding:4px 8px;text-align:right;font-weight:700;color:${primary};border-bottom:1px solid #e2e8f0;">${esc(e.grade)}</td></tr>`).join('')}</tbody>
            </table>
          </div>` : ''}

        ${experience.length ? `<div style="margin-bottom:10px;">${renderSectionHead('Work Experience', primary, 'bar')}${renderExpList(experience, primary)}</div>` : ''}

        ${projects.length ? `<div style="margin-bottom:10px;">${renderSectionHead('Notable Projects', primary, 'bar')}<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:10.5px;">${projects.slice(0, 2).map((p) => `<div style="border-left:2px solid ${primary};padding-left:8px;"><div style="font-weight:700;color:#0f172a;">${esc(p.name)}</div><div style="color:#475569;">${esc(p.description)}</div></div>`).join('')}</div></div>` : ''}

        <div style="display:grid;grid-template-columns:2fr 1fr;gap:14px;margin-bottom:10px;">
          ${skills.length ? `<div>${renderSectionHead('Skills & Competencies', primary, 'bar')}<div style="display:flex;flex-wrap:wrap;gap:5px;">${skills.map((s) => `<span style="padding:2px 8px;background:#f1f5f9;border-radius:4px;font-size:10.5px;font-weight:500;">${esc(s.name)}</span>`).join('')}</div></div>` : ''}
          ${languages.length ? `<div>${renderSectionHead('Languages', primary, 'bar')}<div style="font-size:10.5px;">${languages.map((l) => `<div><strong>${esc(l.name)}</strong>${l.proficiency ? ` — ${esc(l.proficiency)}` : ''}</div>`).join('')}</div></div>` : ''}
        </div>

        ${(facts.length || references.length || declaration?.text) ? `
          <div style="padding-top:8px;border-top:1px solid #e2e8f0;font-size:10px;color:#475569;">
            ${facts.length ? `<p style="margin:0 0 4px 0;"><strong style="color:#1e293b;">Personal Info:</strong> ${esc(facts.join(' • '))}</p>` : ''}
            ${references.length ? `<p style="margin:0 0 4px 0;"><strong style="color:#1e293b;">Reference:</strong> ${esc(references[0].name)}${references[0].designation ? `, ${esc(references[0].designation)}` : ''}${references[0].phone ? ` (${esc(references[0].phone)})` : ''}</p>` : ''}
            ${declaration?.text ? `<div style="display:flex;justify-content:space-between;align-items:flex-end;gap:12px;margin-top:4px;"><span style="font-style:italic;">${esc(declaration.text)}</span><span style="font-weight:700;color:#1e293b;border-top:1px solid #94a3b8;padding:2px 8px 0;white-space:nowrap;">${esc(declaration.signedBy || personalInfo.fullName)}</span></div>` : ''}
          </div>` : ''}
      </div>
    `;
  }

  // 2. Two-Column Sidebar Templates: onepage-modern-split & onepage-it-sidebar
  if (canonicalId === 'onepage-modern-split' || canonicalId === 'onepage-it-sidebar') {
    const isDarkSide = canonicalId === 'onepage-it-sidebar';
    const sideBg = isDarkSide ? '#020617' : `${primary}12`;
    const sideText = isDarkSide ? '#e2e8f0' : '#334155';
    const sideHeading = isDarkSide ? accent : primary;
    const minH = design?.pageSize === 'Letter' ? '1040px' : '1080px';

    return `
      <div class="${pageClass}" style="display:flex;min-height:${minH};background:#fff;color:#0f172a;font-family:'${fontFamily}',sans-serif;line-height:1.35;">
        <aside style="width:31%;flex-shrink:0;padding:24px 18px;background:${sideBg};color:${sideText};${!isDarkSide ? 'border-right:1px solid #e2e8f0;' : ''}">
          <div style="display:flex;justify-content:center;margin-bottom:14px;">
            ${renderPhoto(personalInfo, design, { shape: 'circle', borderColor: sideHeading })}
          </div>
          <div style="margin-bottom:14px;">
            <h3 style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:${sideHeading};border-bottom:1px solid ${isDarkSide ? '#1e293b' : '#cbd5e1'};padding-bottom:3px;margin:0 0 6px 0;">Contact</h3>
            <div style="font-size:10px;word-break:break-word;line-height:1.5;">
              ${contacts.map((c) => `<div>${esc(c)}</div>`).join('')}
            </div>
          </div>
          ${skills.length ? `<div style="margin-bottom:14px;"><h3 style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:${sideHeading};border-bottom:1px solid ${isDarkSide ? '#1e293b' : '#cbd5e1'};padding-bottom:3px;margin:0 0 6px 0;">Skills</h3><div style="display:flex;flex-wrap:wrap;gap:4px;">${skills.map((s) => `<span style="font-size:9.5px;padding:2px 7px;border-radius:4px;background:${isDarkSide ? '#0f172a' : '#fff'};border:1px solid ${isDarkSide ? '#1e293b' : '#cbd5e1'};color:${isDarkSide ? '#f8fafc' : '#1e293b'};">${esc(s.name)}</span>`).join('')}</div></div>` : ''}
          ${certifications.length ? `<div style="margin-bottom:14px;"><h3 style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:${sideHeading};border-bottom:1px solid ${isDarkSide ? '#1e293b' : '#cbd5e1'};padding-bottom:3px;margin:0 0 6px 0;">Certifications</h3><div style="font-size:10px;">${certifications.slice(0, 3).map((c) => `<div style="margin-bottom:4px;"><div style="font-weight:600;">${esc(c.name)}</div><div style="font-size:9px;opacity:0.75;">${esc(c.issuer)}</div></div>`).join('')}</div></div>` : ''}
          ${languages.length ? `<div><h3 style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:${sideHeading};border-bottom:1px solid ${isDarkSide ? '#1e293b' : '#cbd5e1'};padding-bottom:3px;margin:0 0 6px 0;">Languages</h3><div style="font-size:10px;">${languages.map((l) => `<div><strong>${esc(l.name)}</strong> — ${esc(l.proficiency)}</div>`).join('')}</div></div>` : ''}
        </aside>
        <main style="flex:1;padding:24px 24px;min-width:0;">
          <div style="padding-bottom:10px;margin-bottom:12px;border-bottom:2px solid ${primary};">
            <h1 style="font-size:23px;font-weight:800;color:#020617;margin:0;line-height:1.15;">${esc(personalInfo.fullName)}</h1>
            <p style="font-size:12px;font-weight:700;color:${primary};margin:3px 0 0 0;">${esc(personalInfo.jobTitle)}</p>
          </div>
          ${personalInfo.summary ? `<div style="margin-bottom:12px;">${renderSectionHead('Profile Summary', primary, isDarkSide ? 'underline' : 'bar')}<p style="font-size:11px;color:#334155;margin:0;line-height:1.45;">${esc(personalInfo.summary)}</p></div>` : ''}
          ${experience.length ? `<div style="margin-bottom:12px;">${renderSectionHead('Experience', primary, isDarkSide ? 'underline' : 'bar')}${renderExpList(experience, primary)}</div>` : ''}
          ${projects.length ? `<div style="margin-bottom:12px;">${renderSectionHead('Key Projects', primary, isDarkSide ? 'underline' : 'bar')}${renderProjects(projects, primary, false)}</div>` : ''}
          ${education.length ? `<div>${renderSectionHead('Education', primary, isDarkSide ? 'underline' : 'bar')}${renderEduList(education, primary)}</div>` : ''}
        </main>
      </div>
    `;
  }

  // 3. Tech Matrix, Executive Brief & Editorial Studio & Swiss & ATS & Academic & Default Fresher Clean
  const isTechGrid = canonicalId === 'onepage-tech-grid';
  const isExecBrief = canonicalId === 'onepage-executive-brief';
  const isAcademic = canonicalId === 'onepage-academic-compact';
  const isEditorial = canonicalId === 'onepage-creative-editorial';
  const isATS = canonicalId === 'onepage-ats-strict';

  return `
    <div class="${pageClass}" style="padding:${isTechGrid || isEditorial ? '0' : '24px 28px'};background:#fff;color:#0f172a;font-family:'${fontFamily}',sans-serif;line-height:1.35;${isEditorial ? `border-left:8px solid ${primary};` : ''}">
      ${
        isTechGrid
          ? `<div style="background:#0f172a;color:#fff;padding:18px 28px;border-bottom:4px solid ${primary};display:flex;justify-content:space-between;align-items:center;gap:14px;">
              <div>
                <h1 style="font-size:22px;font-weight:800;margin:0;color:#fff;">${esc(personalInfo.fullName)}</h1>
                <p style="font-size:12px;color:#a5b4fc;margin:2px 0 0 0;font-family:monospace;">${esc(personalInfo.jobTitle)}</p>
                <p style="font-size:10px;color:#cbd5e1;margin:6px 0 0 0;font-family:monospace;">${contacts.map(esc).join(' • ')}</p>
              </div>
              ${renderPhoto(personalInfo, design, { shape: 'circle', borderColor: primary })}
            </div>`
          : isEditorial
          ? `<div style="background:${primary}12;padding:20px 28px;display:flex;justify-content:space-between;align-items:center;gap:16px;">
              <div>
                <span style="font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:${primary};display:block;">Portfolio Resume</span>
                <h1 style="font-size:24px;font-weight:800;margin:2px 0 0 0;color:#020617;">${esc(personalInfo.fullName)}</h1>
                <p style="font-size:12.5px;font-weight:600;color:#334155;margin:2px 0 0 0;">${esc(personalInfo.jobTitle)}</p>
                <p style="font-size:10.5px;color:#475569;margin:6px 0 0 0;">${contacts.map(esc).join(' • ')}</p>
              </div>
              ${renderPhoto(personalInfo, design, { shape: 'rounded', borderColor: accent })}
            </div>`
          : isATS
          ? `<header style="text-align:center;padding-bottom:10px;margin-bottom:12px;border-bottom:2px solid #0f172a;">
              <h1 style="font-size:22px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin:0;">${esc(personalInfo.fullName)}</h1>
              <p style="font-size:12px;font-weight:600;color:#334155;margin:3px 0 0 0;">${esc(personalInfo.jobTitle)}</p>
              <p style="font-size:10.5px;color:#334155;margin:5px 0 0 0;">${contacts.map(esc).join('  |  ')}</p>
            </header>`
          : isExecBrief
          ? `<header style="padding:14px 18px;border:2px solid ${primary};border-radius:8px;background:#f8fafc;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;gap:14px;">
              <div>
                <span style="font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;color:#64748b;">Executive Brief</span>
                <h1 style="font-size:22px;font-weight:700;margin:2px 0 0 0;color:#020617;">${esc(personalInfo.fullName)}</h1>
                <p style="font-size:12px;font-weight:700;color:${primary};margin:2px 0 0 0;">${esc(personalInfo.jobTitle)}</p>
                <p style="font-size:10px;color:#475569;margin:6px 0 0 0;">${contacts.map(esc).join(' • ')}</p>
              </div>
              ${renderPhoto(personalInfo, design, { shape: 'portrait', borderColor: primary })}
            </header>`
          : `<header style="display:flex;align-items:center;gap:16px;padding-bottom:12px;margin-bottom:12px;border-bottom:2px solid ${primary};">
              ${!isAcademic ? renderPhoto(personalInfo, design, { shape: 'circle', borderColor: `${primary}40` }) : ''}
              <div style="flex:1;min-width:0;">
                <h1 style="font-size:22px;font-weight:800;margin:0;color:#020617;">${esc(personalInfo.fullName)}</h1>
                <p style="font-size:12.5px;font-weight:600;color:${primary};margin:2px 0 0 0;">${esc(personalInfo.jobTitle)}</p>
                <p style="font-size:10.5px;color:#475569;margin:6px 0 0 0;">${contacts.map(esc).join('  •  ')}</p>
              </div>
            </header>`
      }

      <div style="padding:${isTechGrid || isEditorial ? '16px 28px 20px' : '0'};">
        ${personalInfo.summary ? `<div style="margin-bottom:10px;">${renderSectionHead(isAcademic ? 'Research Statement' : isExecBrief ? 'Executive Profile' : 'Profile Summary', primary, isATS ? 'plain' : 'underline')}<p style="font-size:11px;color:#334155;margin:0;line-height:1.45;">${esc(personalInfo.summary)}</p></div>` : ''}

        ${isAcademic && education.length ? `<div style="margin-bottom:10px;">${renderSectionHead('Education & Academic Standing', primary)}${renderEduList(education, primary)}</div>` : ''}

        ${!isAcademic && education.length && canonicalId === 'onepage-fresher-clean' ? `<div style="margin-bottom:10px;">${renderSectionHead('Education', primary)}${renderEduList(education, primary)}</div>` : ''}

        ${experience.length ? `<div style="margin-bottom:10px;">${renderSectionHead('Experience', primary, isATS ? 'plain' : 'underline')}${renderExpList(experience, primary)}</div>` : ''}

        ${projects.length ? `<div style="margin-bottom:10px;">${renderSectionHead(isAcademic ? 'Research & Publications' : 'Key Projects', primary, isATS ? 'plain' : 'underline')}${renderProjects(projects, primary, !isATS)}</div>` : ''}

        ${!(canonicalId === 'onepage-fresher-clean' || isAcademic) && education.length ? `<div style="margin-bottom:10px;">${renderSectionHead('Education', primary, isATS ? 'plain' : 'underline')}${renderEduList(education, primary)}</div>` : ''}

        ${skills.length ? `<div style="margin-bottom:10px;">${renderSectionHead('Core Skills', primary, isATS ? 'plain' : 'underline')}<div style="display:flex;flex-wrap:wrap;gap:5px;">${skills.map((s) => `<span style="font-size:10.5px;padding:2px 8px;border:1px solid #cbd5e1;border-radius:4px;background:#f8fafc;">${esc(s.name)}</span>`).join('')}</div></div>` : ''}

        ${(certifications.length || languages.length) ? `<div style="font-size:10.5px;color:#334155;margin-bottom:8px;">${certifications.length ? `<div><strong>Certifications:</strong> ${esc(certifications.map((c) => c.name).join(' • '))}</div>` : ''}${languages.length ? `<div style="margin-top:3px;"><strong>Languages:</strong> ${esc(languages.map((l) => `${l.name} (${l.proficiency})`).join(', '))}</div>` : ''}</div>` : ''}

        ${isAcademic && references.length ? `<div>${renderSectionHead('Academic Referees', primary)}<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:10.5px;">${references.slice(0, 2).map((r) => `<div style="padding:6px;border:1px solid #e2e8f0;border-radius:6px;"><strong>${esc(r.name)}</strong><div>${esc(r.designation)}${r.company ? `, ${esc(r.company)}` : ''}</div><div style="color:#64748b;">${esc([r.email, r.phone].filter(Boolean).join(' • '))}</div></div>`).join('')}</div></div>` : ''}
      </div>
    </div>
  `;
};

