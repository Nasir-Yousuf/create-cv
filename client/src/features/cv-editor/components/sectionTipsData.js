/**
 * Contextual Micro-Tips, Recruiter Advice, and Realistic Copy Examples
 * for Mode A Simple CV Builder.
 */

export const SECTION_TIPS = {
  personalInfo: {
    title: 'Personal Info & Contact',
    tip: 'Your contact header is your first impression. Use a clean, professional email (avoid nicknames) and include links to your LinkedIn, GitHub, or online portfolio.',
    studentTip: 'If you are a student living in a campus dorm or rented accommodation, listing your current city (e.g. "Dhaka, Bangladesh") is sufficient.',
    examples: [
      { label: 'Professional Email', text: 'first.lastname@example.com' },
      { label: 'Location', text: 'Dhaka, Bangladesh (or San Francisco, CA)' },
      { label: 'Portfolio Link', text: 'https://alexmorgan.dev or https://github.com/username' },
    ],
  },
  personalDetails: {
    title: 'Personal Details (BD Recruiter Standard)',
    tip: 'Essential for Bangladesh Civil Service (BCS), government circulars, commercial banks, and large corporate groups. Ensure your NID, Date of Birth, and Father/Mother names match your official National ID card.',
    studentTip: 'Freshers applying for MTO (Management Trainee) or Bank PO exams must include complete permanent and present addresses for verification clearance.',
    examples: [
      { label: 'Father Name', text: 'Md. Abdur Rahman' },
      { label: 'National ID (NID)', text: '19982692518000123 (10 or 17 digit smart NID)' },
      { label: 'Blood Group', text: 'B+ (Positive) or O+' },
      { label: 'Permanent Address', text: 'Vill: Shantinagar, P.O: Mirpur, Upazila: Mirpur, Dist: Kushtia' },
    ],
  },
  summary: {
    title: 'Professional Summary',
    tip: 'A high-impact 3–4 sentence executive pitch. State your current role, years of experience (or core focus), your top 2–3 strengths, and a standout measurable accomplishment.',
    studentTip: 'Students: If you do not have 3+ years of experience, consider toggling to "Career Objective" instead, or highlight your academic CGPA, capstone project, and eagerness to contribute.',
    examples: [
      {
        label: 'Experienced Professional',
        text: 'Results-driven Full Stack Engineer with 5+ years of experience architecting high-throughput microservices and responsive web applications. Proven track record of reducing system latency by 35% and increasing test coverage to 90% across distributed agile teams.',
      },
      {
        label: 'Fresh Graduate / Student',
        text: 'High-achieving Computer Science graduate (CGPA 3.84/4.00) with solid hands-on experience building full-stack applications in React, Node.js, and PostgreSQL. Passionate about clean code, rapid continuous learning, and contributing reliable software solutions to a collaborative product team.',
      },
    ],
  },
  careerObjective: {
    title: 'Career Objective',
    tip: 'Ideal for entry-level applicants, students, and career switchers. Clearly explain what degree or skills you bring to the table and how you plan to generate value for the employer.',
    studentTip: 'Avoid generic clichés like "seeking a challenging position". Specify your field (e.g. Software Engineering, Banking, Marketing) and your specific technical/analytical skills.',
    examples: [
      {
        label: 'Tech / CS Fresher',
        text: 'Dedicated Software Engineering graduate seeking an entry-level Junior Developer role to apply strong algorithm design, React/Node.js web development, and database management skills to deliver high-quality digital products.',
      },
      {
        label: 'Business / Banking Fresher',
        text: 'Ambitious BBA graduate with major in Finance seeking a Management Trainee / Probationary Officer position to leverage quantitative financial modeling, risk analysis, and strong interpersonal communication skills in a reputable financial institution.',
      },
    ],
  },
  education: {
    title: 'Education & Academics',
    tip: 'List your degrees in reverse chronological order (most recent first). Include degree title, university/board, graduation year, and GPA/CGPA if strong.',
    studentTip: 'Students & freshers: Place Education near the top of your CV! Include Dean’s Honor List mentions, academic scholarships, and relevant major coursework.',
    examples: [
      {
        label: 'University Degree',
        text: 'B.Sc. in Computer Science & Engineering — North South University (CGPA 3.82 / 4.00, Dean’s Merit Award 4 consecutive semesters)',
      },
      {
        label: 'College / HSC (BD Standard)',
        text: 'Higher Secondary Certificate (HSC), Science — Notre Dame College, Dhaka (GPA 5.00 / 5.00, Dhaka Board)',
      },
    ],
  },
  experience: {
    title: 'Work Experience',
    tip: 'Use the Google XYZ Formula: "Accomplished [X], as measured by [Y], by doing [Z]". Start every bullet point with an impactful action verb.',
    studentTip: 'Count part-time jobs, freelance contracts, tutoring, and university department TA (Teaching Assistant) roles as genuine professional experience.',
    examples: [
      {
        label: 'Quantified Bullet Point',
        text: 'Spearheaded redesign of the customer onboarding flow using React and TypeScript, increasing mobile sign-up conversions by 28% and reducing drop-offs by 15%.',
      },
      {
        label: 'Engineering Example',
        text: 'Architected automated CI/CD pipeline using GitHub Actions and Docker, reducing average deployment time from 45 minutes to 8 minutes across 4 microservices.',
      },
    ],
  },
  internships: {
    title: 'Internships & Traineeships',
    tip: 'Internships bridge the gap between academic theory and real-world delivery. Describe the specific department, mentors, tools utilized, and deliverables produced.',
    studentTip: 'Even a 2-month summer internship gives you a massive advantage over other candidates. Detail what you learned and any presentations you gave to leadership.',
    examples: [
      {
        label: 'Corporate Trainee',
        text: 'Business Strategy Intern at Unilever Bangladesh: Conducted retail market surveys across 14 distribution points and modeled FMCG sales data using MS Excel pivots to present insights to regional brand leads.',
      },
      {
        label: 'Tech Intern',
        text: 'Software Engineering Intern: Collaborated with a senior engineer to build REST endpoints for user authentication and integrated Jest unit tests achieving 80%+ code coverage.',
      },
    ],
  },
  projects: {
    title: 'Projects (Academic & Personal)',
    tip: 'For students, junior developers, and career changers, projects ARE proof of capability. Include project title, your specific role, technologies used, and clickable GitHub / live links.',
    studentTip: 'Highlight your university senior capstone project, hackathon submissions, or self-directed applications you built outside class.',
    examples: [
      {
        label: 'Full-Stack Web App',
        text: 'MediConnect Telehealth Portal: Built a HIPAA-compliant telemedicine video consultation platform using React, Node.js, WebRTC, and MongoDB with real-time appointment scheduling.',
      },
      {
        label: 'Machine Learning Project',
        text: 'Automated Chest X-Ray Pneumonia Classifier: Trained a Convolutional Neural Network (ResNet-50) using PyTorch, achieving 94.2% test accuracy on 5,000 Kaggle medical images.',
      },
    ],
  },
  skills: {
    title: 'Skills & Competencies',
    tip: 'Recruiters and ATS scanners match your skills directly against job descriptions. Group into Technical Skills, Frameworks, Tools, and Methodologies.',
    studentTip: 'Avoid generic fluff like "Hardworking" or "Punctual". Instead list concrete tools you actually know how to use: Excel, Python, Figma, Git, SQL, Canva, SPSS.',
    examples: [
      { label: 'Technical Languages', text: 'JavaScript, TypeScript, Python, SQL, C++, Java' },
      { label: 'Frameworks & Tools', text: 'React, Node.js, Next.js, Express, Tailwind CSS, Docker, Git, Linux' },
      { label: 'Business & Office', text: 'Financial Modeling, MS Excel (VLOOKUP, Macros), PowerPoint, Jira, Trello' },
    ],
  },
  certifications: {
    title: 'Certifications & Credentials',
    tip: 'Certifications validate specialized training. Include certificate name, issuing authority (Google, AWS, Microsoft, Coursera), date completed, and credential ID or URL.',
    studentTip: 'Completing online certifications (e.g. AWS Cloud Practitioner, Google Data Analytics, Meta Frontend Developer) shows self-driven initiative to recruiters.',
    examples: [
      { label: 'Cloud / IT', text: 'AWS Certified Solutions Architect – Associate (Amazon Web Services, 2024)' },
      { label: 'Data & Analytics', text: 'Google Data Analytics Professional Certificate (Coursera / Google, 2023)' },
      { label: 'Professional License', text: 'BMDC Full Registration (Bangladesh Medical & Dental Council, Reg No: A-84291)' },
    ],
  },
  languages: {
    title: 'Languages',
    tip: 'List all languages you can speak or write professionally. Specify your proficiency level (Native, Fluent, Professional Working, Conversational, Basic).',
    studentTip: 'If you have an official standardized test score like IELTS (e.g. Band 7.5 or 8.0) or TOEFL, mention it right next to English.',
    examples: [
      { label: 'English', text: 'Fluent / Full Professional Proficiency (IELTS 8.0)' },
      { label: 'Bengali', text: 'Native / Bilingual Proficiency' },
      { label: 'German / French', text: 'Conversational (B1 / Intermediate)' },
    ],
  },
  achievements: {
    title: 'Key Achievements & Honors',
    tip: 'Set yourself apart with competitive milestones: hackathon placements, dean’s merit awards, business competition finalist ranks, or employee of the quarter awards.',
    studentTip: 'Highlight inter-university competitions (e.g. Battle of Minds, Hult Prize, ICPC programming contests, debate championships).',
    examples: [
      { label: 'Hackathon Win', text: 'Champion (1st Place) — National FinTech Hackathon 2023 out of 140 competing teams across Bangladesh.' },
      { label: 'Academic Distinction', text: 'Dean’s Honor List Award — Faculty of Science & Engineering (2021, 2022, 2023).' },
    ],
  },
  volunteer: {
    title: 'Volunteer Experience & Leadership',
    tip: 'Volunteering reveals leadership, social empathy, and organizational skills. Include non-profit organizations, university clubs, student government, or disaster relief.',
    studentTip: 'Holding executive committee positions in campus clubs (e.g. President of Computer Club, General Secretary of Debating Society) demonstrates high managerial maturity.',
    examples: [
      {
        label: 'Campus Club Leadership',
        text: 'Vice President, NSU Computer Club: Organized tech symposiums for 1,200 attendees, managed corporate sponsorships, and led a 35-member student executive board.',
      },
      {
        label: 'Community Service',
        text: 'Volunteer Coordinator, Flood Relief Bangladesh: Spearheaded logistics distribution of clean water and emergency food packs to 450 families in Sylhet.',
      },
    ],
  },
  publications: {
    title: 'Publications & Research',
    tip: 'Essential for professors, lecturers, researchers, and physicians. Cite in IEEE, APA, or standard academic style with journal/conference name, year, and DOI link.',
    studentTip: 'If your undergraduate senior thesis was accepted at an IEEE or Springer conference, highlight it prominently!',
    examples: [
      {
        label: 'Conference Paper',
        text: 'A Comparative Study of Deep Learning Models for Bengali Speech Recognition. In Proceedings of the 2024 IEEE International Conference on Signal Processing (ICSP). DOI: 10.1109/ICSP.2024.104231.',
      },
    ],
  },
  references: {
    title: 'References',
    tip: 'Provide 2 reliable professional or academic contacts who can vouch for your integrity and work ethic. Always ask their consent before listing their contact details.',
    studentTip: 'For fresh graduates, list your undergraduate thesis supervisor, department chairman, or an internship project lead.',
    examples: [
      {
        label: 'Academic Reference',
        text: 'Prof. Dr. Mohammad Ali — Department Chairman, Dept. of CSE, University of Dhaka. Phone: +880 1711-000000 | Email: mali@du.ac.bd',
      },
      {
        label: 'Corporate Reference',
        text: 'Sarah Jenkins — Senior Engineering Manager, TechCorp. Email: sjenkins@techcorp.com',
      },
    ],
  },
  declaration: {
    title: 'Declaration & Signature',
    tip: 'Formal statement verifying the truthfulness of submitted information. Standard requirement for Bangladesh government jobs, banks, and formal corporate recruitment.',
    studentTip: 'Keep the declaration statement concise and professional. The signed name will appear on the bottom of BD standard templates.',
    examples: [
      {
        label: 'Standard Statement',
        text: 'I solemnly declare that all information provided in this curriculum vitae is accurate and complete to the best of my knowledge and belief.',
      },
    ],
  },
  additionalInfo: {
    title: 'Additional Information',
    tip: 'Use for hobbies, driver’s licenses, extracurricular interests, or specialized clearances that add personality or relevance to the application.',
    studentTip: 'Listing hobbies like chess, competitive gaming, photography, or marathon running can serve as great conversational icebreakers in interviews.',
    examples: [
      { label: 'Interests & Sports', text: 'Competitive Chess (FIDE Rated 1650), Marathon Running, Open Source Contributions' },
      { label: 'Licenses', text: 'Professional Driving License (Light Vehicle, BRTA Verified)' },
    ],
  },
  customSections: {
    title: 'Custom Sections',
    tip: 'Create your own section for unique highlights like "Patents", "Exhibitions & Shows", "Speaking Engagements", or "Major Case Studies".',
    studentTip: 'You can create custom sections like "Workshops Attended" or "Co-Curricular Activities" to stand out.',
    examples: [
      { label: 'Speaking', text: 'Keynote Speaker at Dhaka Tech Summit 2024: "Scaling Serverless Architectures"' },
      { label: 'Workshops', text: 'Advanced Machine Learning Bootcamp (Google Developers Group, 40 hours)' },
    ],
  },
};
