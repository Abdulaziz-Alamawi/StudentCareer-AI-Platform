"use client";

import * as React from "react";

export type Locale = "en" | "ar";

type Dict = Record<string, string>;

/** Flat dotted-key dictionaries. Arabic is a real translation, not machine output. */
const en: Dict = {
  // Common
  "common.appName": "StudentCareer AI",
  "common.signIn": "Sign in",
  "common.getStarted": "Get Started",
  "common.dashboard": "Dashboard",
  "common.startFree": "Start free",
  "common.loading": "Loading...",
  "common.save": "Save",
  "common.saveChanges": "Save changes",
  "common.new": "New",
  "common.back": "Back",
  "common.getStartedNow": "Get started",
  "common.tryItNow": "Try it now",
  "dash.quickStart": "Quick start",
  "dash.quickStartDesc": "New here? Pick a tool below to start building your career profile. The AI fills in your dashboard as you go.",
  "dash.qsResumeTitle": "Build your resume",
  "dash.qsResumeDesc": "Create a structured resume the AI can analyze.",
  "dash.qsAnalyzerTitle": "Analyze a resume",
  "dash.qsAnalyzerDesc": "Get an ATS score and concrete fixes in seconds.",
  "dash.qsSkillsTitle": "Find your skill gaps",
  "dash.qsSkillsDesc": "See which skills you're missing for your target role.",
  "dash.qsInterviewTitle": "Practice interviews",
  "dash.qsInterviewDesc": "Answer real questions and get AI feedback.",
  "dash.qsRoadmapTitle": "Generate a roadmap",
  "dash.qsRoadmapDesc": "Get a personalized, step-by-step learning plan.",
  "skills.emptyTitle": "See your skill gaps instantly",
  "skills.emptyDesc": "Pick a career track and list your current skills (comma-separated). The AI matches them with TF-IDF similarity and shows what's missing.",
  "analyzer.emptyTitle": "Analyze your first resume",
  "analyzer.emptyDesc": "Pick a resume and a target role, then run the analysis to get ATS, content, and formatting scores with concrete suggestions.",
  "interview.emptyTitle": "Start a practice interview",
  "interview.emptyDesc": "Choose a track and difficulty, then answer AI-generated questions to get scored feedback on your responses.",
  "roadmap.emptyTitle": "Build your personalized roadmap",
  "roadmap.emptyDesc": "Select your target track and current level. The AI generates a phased learning plan with skills, projects, and milestones.",

  // Enhancements
  "dash.greetMorning": "Good morning",
  "dash.greetAfternoon": "Good afternoon",
  "dash.greetEvening": "Good evening",
  "dash.welcomeSub": "Here's a snapshot of your career readiness today.",
  "dash.levelProgress": "Progress to next level",
  "dash.viewRoadmap": "View roadmap",
  "skills.coverageGauge": "Skill coverage",
  "skills.addSkill": "Add",
  "skills.suggestions": "Suggested skills",
  "skills.clickToAdd": "Click a chip to add it to your skills.",
  "skills.yourSkills": "Your skills",
  "skills.noSkillsYet": "No skills added yet.",
  "skills.summary": "You have {matched} of {total} core skills for this track.",
  "interview.progress": "Question {current} of {total}",
  "interview.answered": "Answered {n} questions",
  "interview.completion": "{done} / {total} answered",
  "roadmap.totalDuration": "Total duration",
  "roadmap.weeksShort": "weeks",
  "roadmap.phase": "Phase",
  "profile.completion": "Profile completion",
  "profile.completionHint": "Complete your profile to improve AI recommendations.",
  "resume.preview": "Live preview",
  "resume.previewEmpty": "Start filling the form to see your resume preview here.",
  "auth.backHome": "Back to home",
  "dash.aiBadge": "AI",
  "dash.poweredByAi": "AI-powered",
  "dash.aiBanner": "Every tool below runs on a real AI engine (scikit-learn). It analyzes your input and generates personalized results — no templates, no fake data.",
  "dash.aiHowTitle": "How the AI works",

  // Navbar
  "nav.features": "Features",
  "nav.impact": "Impact",
  "nav.testimonials": "Testimonials",
  "nav.faq": "FAQ",

  // Hero
  "hero.badge": "AI-powered career intelligence for students",
  "hero.titleA": "Become",
  "hero.titleHighlight": "job-ready",
  "hero.titleB": "before you graduate",
  "hero.subtitle":
    "Build powerful resumes, get AI-driven analysis, practice interviews, measure your career readiness, close skill gaps, and follow a personalized roadmap — all in one intelligent platform.",
  "hero.exploreFeatures": "Explore features",
  "hero.cardResume": "Resume Score",
  "hero.cardReadiness": "Career Readiness",
  "hero.cardCoverage": "Skill Coverage",
  "hero.jobReady": "Job Ready",
  "hero.trust": "Built for students · Trusted by career-focused learners worldwide",

  // Features
  "features.eyebrow": "Everything you need",
  "features.title": "One platform for complete career readiness",
  "features.subtitle":
    "Nine intelligent modules working together to maximize your employability.",
  "features.resume.title": "Smart Resume Builder",
  "features.resume.desc":
    "Create, edit, duplicate and export polished resumes with Modern, ATS-friendly, and Professional templates.",
  "features.analyzer.title": "AI Resume Analyzer",
  "features.analyzer.desc":
    "Get ATS, content, formatting and completeness scores with actionable improvement suggestions.",
  "features.interview.title": "AI Interview Simulator",
  "features.interview.desc":
    "Practice technical, behavioral and scenario questions across 6 career tracks with instant scoring.",
  "features.readiness.title": "Career Readiness Engine",
  "features.readiness.desc":
    "A single 0–100 readiness score combining resume, skills, certifications, projects and interviews.",
  "features.skills.title": "Skill Gap Analyzer",
  "features.skills.desc":
    "Discover exactly which skills, technologies and certifications you're missing for your dream role.",
  "features.roadmap.title": "Career Roadmap Generator",
  "features.roadmap.desc":
    "Personalized learning, certification, project and career roadmaps tailored to your goals.",
  "features.unified.title": "Unified Dashboard",
  "features.unified.desc":
    "Track all your analytics, scores and recommendations in one beautiful command center.",
  "features.secure.title": "Secure & Private",
  "features.secure.desc":
    "JWT authentication, hashed passwords and owner-scoped data keep your information safe.",

  // Stats
  "stats.modules": "Intelligent modules",
  "stats.tracks": "Career tracks",
  "stats.questions": "Interview questions",
  "stats.scoring": "Readiness scoring",

  // Benefits
  "benefits.eyebrow": "Why StudentCareer AI",
  "benefits.title": "Turn uncertainty into a clear plan",
  "benefits.subtitle":
    "Most students do not know if they are ready for the job market. We replace anxiety with measurable, actionable insight.",
  "benefits.1": "Know exactly where you stand with a single readiness score",
  "benefits.2": "Beat applicant tracking systems with ATS-optimized resumes",
  "benefits.3": "Walk into interviews confident and well-practiced",
  "benefits.4": "Stop guessing — follow a data-driven learning roadmap",
  "benefits.5": "Build a portfolio of the right projects and certifications",
  "benefits.6": "Explainable AI: every score comes with clear reasons",
  "benefits.cardTitle": "Career Readiness",

  // Testimonials
  "testimonials.eyebrow": "Loved by students",
  "testimonials.title": "Results that speak for themselves",
  "testimonials.1.quote":
    "The AI analyzer showed me exactly why my resume was getting rejected. After fixing the ATS issues, I landed three interviews in a week.",
  "testimonials.1.role": "CS Senior",
  "testimonials.2.quote":
    "The interview simulator is incredible. I practiced cloud computing scenarios and walked into my AWS interview fully prepared.",
  "testimonials.2.role": "Fresh Graduate",
  "testimonials.3.quote":
    "The readiness score gave me a clear goal. The roadmap told me exactly what to learn next. I went from 'Developing' to 'Job Ready' in two months.",
  "testimonials.3.role": "Data Science Student",

  // FAQ
  "faq.eyebrow": "FAQ",
  "faq.title": "Frequently asked questions",
  "faq.1.q": "Is StudentCareer AI free to use?",
  "faq.1.a":
    "Yes — the core modules (resume builder, analyzer, interview simulator, readiness engine and roadmaps) are available to every registered student.",
  "faq.2.q": "How does the AI scoring work?",
  "faq.2.a":
    "Our AI Engine uses explainable machine-learning techniques (TF-IDF, cosine similarity and weighted scoring) to evaluate resumes, skills and interview answers. Every score comes with the reasons behind it.",
  "faq.3.q": "Which career tracks are supported?",
  "faq.3.a":
    "Software Engineering, Artificial Intelligence, Cloud Computing, IT Infrastructure, Data Science and Business Analysis.",
  "faq.4.q": "Will it help me beat applicant tracking systems (ATS)?",
  "faq.4.a":
    "Absolutely. The analyzer checks for ATS-critical sections, contact info and keyword coverage, then tells you exactly what to fix.",
  "faq.5.q": "Is my data secure?",
  "faq.5.a":
    "Yes. We use JWT authentication, bcrypt-hashed passwords and owner-scoped access so only you can see your data.",

  // Contact
  "contact.title": "Ready to become job-ready?",
  "contact.subtitle":
    "Join StudentCareer AI today and turn your potential into a competitive edge.",
  "contact.createFree": "Create your free account",
  "contact.contactUs": "Contact us",

  // Footer
  "footer.tagline":
    "AI-powered career development and employability assessment for students and graduates.",
  "footer.product": "Product",
  "footer.account": "Account",
  "footer.connect": "Connect",
  "footer.getStarted": "Get started",
  "footer.rights": "All rights reserved.",
  "footer.builtBy": "Built by Abdulaziz AlAmawi",

  // Auth
  "auth.createTitle": "Create your account",
  "auth.createSubtitle": "Start building your career readiness today.",
  "auth.fullName": "Full name",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.passwordHint": "At least 8 characters",
  "auth.createAccount": "Create account",
  "auth.haveAccount": "Already have an account?",
  "auth.signInTitle": "Sign in",
  "auth.signInSubtitle": "Welcome back — continue your career journey.",
  "auth.noAccount": "Don't have an account?",
  "auth.createOne": "Create one",
  "auth.accountCreated": "Account created! Welcome aboard.",
  "auth.welcomeBack": "Welcome back!",
  "auth.registrationFailed": "Registration failed",
  "auth.loginFailed": "Login failed",
  "auth.passwordTooShort": "Password must be at least 8 characters.",

  // Sidebar / dashboard nav
  "side.overview": "Overview",
  "side.resume": "Resume Builder",
  "side.analyzer": "Resume Analyzer",
  "side.interview": "Interview Simulator",
  "side.skills": "Skill Gap",
  "side.roadmap": "Career Roadmap",
  "side.profile": "Profile",

  // Topbar
  "top.welcome": "Welcome back,",
  "top.student": "Student",
  "top.logout": "Logout",

  // Dashboard overview
  "dash.title": "Dashboard",
  "dash.desc": "Your complete career readiness at a glance.",
  "dash.careerReadiness": "Career Readiness",
  "dash.scoreBreakdown": "Score Breakdown",
  "dash.resumes": "Resumes",
  "dash.bestAts": "Best ATS",
  "dash.interviews": "Interviews",
  "dash.skillCoverage": "Skill Coverage",
  "dash.resume": "Resume",
  "dash.skills": "Skills",
  "dash.certifications": "Certifications",
  "dash.projects": "Projects",
  "dash.interview": "Interview",
  "dash.errorTitle": "Something went wrong",
  "dash.errorDesc": "Please try again in a moment.",
  "dash.recommendations": "Recommendations",
  "dash.recEmpty": "Run an analysis or skill-gap check to get personalized recommendations.",
  "dash.interviewPerformance": "Interview Performance",
  "dash.avgScore": "Average score",
  "dash.bestScore": "Best score",
  "dash.roadmapProgress": "Roadmap progress",

  // Profile
  "profile.title": "Profile",
  "profile.desc": "Manage your personal and career information.",
  "profile.headline": "Headline",
  "profile.careerTrack": "Career track",
  "profile.selectTrack": "Select track",
  "profile.major": "Major",
  "profile.university": "University",
  "profile.gradYear": "Graduation year",
  "profile.location": "Location",
  "profile.bio": "Bio",
  "profile.bioPlaceholder": "Tell us about yourself...",
  "profile.headlinePlaceholder": "CS Student | Aspiring Software Engineer",
  "profile.updated": "Profile updated!",

  // Resume builder
  "resume.title": "Smart Resume Builder",
  "resume.desc": "Create, edit, duplicate and export professional resumes.",
  "resume.yourResumes": "Your Resumes",
  "resume.none": "No resumes yet. Create one!",
  "resume.personalInfo": "Personal Information",
  "resume.summary": "Professional Summary",
  "resume.summaryPlaceholder": "2–3 sentences about your strengths and goals...",
  "resume.skills": "Skills",
  "resume.skillsPlaceholder": "python, react, sql, git (comma separated)",
  "resume.experience": "Experience",
  "resume.education": "Education",
  "resume.company": "Company",
  "resume.role": "Role",
  "resume.bullets": "Bullet points (one per line)",
  "resume.institution": "Institution",
  "resume.degree": "Degree",
  "resume.created": "Resume created!",
  "resume.saved": "Resume saved!",
  "resume.duplicated": "Resume duplicated!",
  "resume.deleted": "Resume deleted.",
  "resume.projects": "Projects",
  "resume.certifications": "Certifications",
  "resume.languages": "Languages",
  "resume.achievements": "Achievements",
  "resume.projectName": "Project name",
  "resume.projectDesc": "Description",
  "resume.techStack": "Tech stack (comma separated)",
  "resume.url": "URL",
  "resume.certName": "Certificate name",
  "resume.issuer": "Issuer",
  "resume.date": "Date",
  "resume.langName": "Language",
  "resume.proficiency": "Proficiency",
  "resume.achievementsPlaceholder": "One achievement per line...",
  "resume.field": "Field of study",
  "resume.startDate": "Start date",
  "resume.endDate": "End date",
  "resume.addEntry": "Add",
  "resume.remove": "Remove",
  "resume.analyzeScore": "Analyze & score",
  "resume.targetTrack": "Target role",
  "resume.scoreResult": "Resume score",
  "resume.scoreSaved": "Analyzed! Your dashboard score is updated.",
  "resume.scoreHint": "Save first, then analyze to update your dashboard readiness score.",
  "resume.selectFirst": "Select or create a resume first.",

  // Analyzer
  "analyzer.title": "AI Resume Analyzer",
  "analyzer.desc": "Get an instant ATS score and actionable improvements.",
  "analyzer.input": "Resume Input",
  "analyzer.targetTrack": "Target career track",
  "analyzer.contactEmail": "Contact email",
  "analyzer.summary": "Professional summary",
  "analyzer.summaryPlaceholder": "A software engineer who built and optimized...",
  "analyzer.skills": "Skills (comma separated)",
  "analyzer.expBullets": "Experience bullets (one per line)",
  "analyzer.includeEducation": "Include education section",
  "analyzer.analyze": "Analyze resume",
  "analyzer.suggestions": "Suggestions",
  "analyzer.complete": "Analysis complete!",
  "analyzer.failed": "Analysis failed",
  "analyzer.overall": "Overall",
  "analyzer.atsLabel": "ATS",
  "analyzer.content": "Content",
  "analyzer.formatting": "Formatting",
  "analyzer.completeness": "Completeness",
  "analyzer.skillsCoverage": "Skills Coverage",
  "analyzer.empty": "Fill in your resume details and run the analysis to see your scores.",
  "analyzer.noIssues": "Great — no major issues found!",
  "analyzer.missingSkills": "Missing Skills",

  // Interview
  "interview.title": "AI Interview Simulator",
  "interview.desc": "Practice real interview questions and get instant scored feedback.",
  "interview.careerTrack": "Career track",
  "interview.difficulty": "Difficulty",
  "interview.start": "Start",
  "interview.report": "Interview Report",
  "interview.answered": "You answered {n} questions.",
  "interview.answerPlaceholder": "Type your answer here...",
  "interview.score": "Score",
  "interview.submit": "Submit answers",
  "interview.answerAll": "Please answer all questions.",
  "interview.noQuestions": "No questions found for this combination.",
  "interview.scored": "Interview scored: {n}/100",

  // Skills
  "skills.title": "Skill Gap Analyzer",
  "skills.desc": "Discover what skills, technologies and certifications you're missing.",
  "skills.careerTrack": "Career track",
  "skills.current": "Your current skills (comma separated)",
  "skills.analyze": "Analyze skill gap",
  "skills.coverageFor": "Coverage for",
  "skills.coverage": "Skill coverage",
  "skills.matched": "Matched skills",
  "skills.missing": "Missing skills",
  "skills.recTech": "Recommended Technologies",
  "skills.recCerts": "Recommended Certifications",
  "skills.recProjects": "Recommended Projects",
  "skills.complete": "Skill gap analysis complete!",
  "skills.failed": "Analysis failed",

  // Roadmap
  "roadmap.title": "Career Roadmap Generator",
  "roadmap.desc": "Get a personalized learning, certification, project and career roadmap.",
  "roadmap.careerTrack": "Career track",
  "roadmap.major": "Major",
  "roadmap.currentSkills": "Current skills",
  "roadmap.interests": "Interests",
  "roadmap.generate": "Generate roadmap",
  "roadmap.personalizedFor": "Personalized roadmap for",
  "roadmap.weeks": "weeks",
  "roadmap.generated": "Roadmap generated!",
  "roadmap.failed": "Generation failed",

  // Language switch
  "lang.toggle": "العربية",
};

const ar: Dict = {
  "common.appName": "ستيودنت كارير AI",
  "common.signIn": "تسجيل الدخول",
  "common.getStarted": "ابدأ الآن",
  "common.dashboard": "لوحة التحكم",
  "common.startFree": "ابدأ مجاناً",
  "common.loading": "جارٍ التحميل...",
  "common.save": "حفظ",
  "common.saveChanges": "حفظ التغييرات",
  "common.new": "جديد",
  "common.back": "رجوع",
  "common.getStartedNow": "ابدأ الآن",
  "common.tryItNow": "جرّبها الآن",
  "dash.quickStart": "ابدأ بسرعة",
  "dash.quickStartDesc": "جديد هنا؟ اختر أداة من الأسفل لتبدأ ببناء ملفك المهني. الذكاء الاصطناعي يملأ لوحتك تلقائياً كلما تقدّمت.",
  "dash.qsResumeTitle": "أنشئ سيرتك الذاتية",
  "dash.qsResumeDesc": "كوّن سيرة منظّمة يستطيع الذكاء الاصطناعي تحليلها.",
  "dash.qsAnalyzerTitle": "حلّل سيرة ذاتية",
  "dash.qsAnalyzerDesc": "احصل على درجة ATS وإصلاحات عملية خلال ثوانٍ.",
  "dash.qsSkillsTitle": "اكتشف فجوة مهاراتك",
  "dash.qsSkillsDesc": "اعرف المهارات الناقصة للوظيفة المستهدفة.",
  "dash.qsInterviewTitle": "تدرّب على المقابلات",
  "dash.qsInterviewDesc": "أجب عن أسئلة حقيقية واحصل على تقييم ذكي.",
  "dash.qsRoadmapTitle": "أنشئ خارطة طريق",
  "dash.qsRoadmapDesc": "احصل على خطة تعلّم مخصّصة خطوة بخطوة.",
  "skills.emptyTitle": "اكتشف فجوة مهاراتك فوراً",
  "skills.emptyDesc": "اختر المسار المهني واكتب مهاراتك الحالية (مفصولة بفواصل). يطابقها الذكاء الاصطناعي عبر تشابه TF-IDF ويظهر لك الناقص.",
  "analyzer.emptyTitle": "حلّل سيرتك الأولى",
  "analyzer.emptyDesc": "اختر سيرة ذاتية ووظيفة مستهدفة، ثم شغّل التحليل لتحصل على درجات ATS والمحتوى والتنسيق مع اقتراحات عملية.",
  "interview.emptyTitle": "ابدأ مقابلة تدريبية",
  "interview.emptyDesc": "اختر المسار ومستوى الصعوبة، ثم أجب عن أسئلة يولّدها الذكاء الاصطناعي لتحصل على تقييم لإجاباتك.",
  "roadmap.emptyTitle": "ابنِ خارطة طريقك المخصّصة",
  "roadmap.emptyDesc": "اختر مسارك المستهدف ومستواك الحالي. يولّد الذكاء الاصطناعي خطة تعلّم مرحلية بالمهارات والمشاريع والمحطّات.",

  // Enhancements
  "dash.greetMorning": "صباح الخير",
  "dash.greetAfternoon": "مساء الخير",
  "dash.greetEvening": "مساء الخير",
  "dash.welcomeSub": "إليك لمحة عن جاهزيتك المهنية اليوم.",
  "dash.levelProgress": "التقدّم للمستوى التالي",
  "dash.viewRoadmap": "عرض خارطة الطريق",
  "skills.coverageGauge": "تغطية المهارات",
  "skills.addSkill": "إضافة",
  "skills.suggestions": "مهارات مقترحة",
  "skills.clickToAdd": "اضغط على أي مهارة لإضافتها إلى قائمتك.",
  "skills.yourSkills": "مهاراتك",
  "skills.noSkillsYet": "لم تُضف أي مهارة بعد.",
  "skills.summary": "لديك {matched} من {total} مهارة أساسية لهذا المسار.",
  "interview.progress": "السؤال {current} من {total}",
  "interview.answered": "أجبت عن {n} أسئلة",
  "interview.completion": "{done} / {total} مُجاب",
  "roadmap.totalDuration": "المدة الإجمالية",
  "roadmap.weeksShort": "أسبوع",
  "roadmap.phase": "مرحلة",
  "profile.completion": "اكتمال الملف",
  "profile.completionHint": "أكمل ملفك لتحسين توصيات الذكاء الاصطناعي.",
  "resume.preview": "معاينة حيّة",
  "resume.previewEmpty": "ابدأ بتعبئة النموذج لتظهر معاينة سيرتك هنا.",
  "auth.backHome": "العودة للرئيسية",
  "dash.aiBadge": "ذكاء اصطناعي",
  "dash.poweredByAi": "مدعوم بالذكاء الاصطناعي",
  "dash.aiBanner": "كل أداة في الأسفل تعمل بمحرّك ذكاء اصطناعي حقيقي (scikit-learn). يحلّل مدخلاتك ويولّد نتائج مخصّصة — بلا قوالب جاهزة ولا بيانات وهمية.",
  "dash.aiHowTitle": "كيف يعمل الذكاء الاصطناعي",

  "nav.features": "المزايا",
  "nav.impact": "الأثر",
  "nav.testimonials": "آراء الطلاب",
  "nav.faq": "الأسئلة الشائعة",

  "hero.badge": "ذكاء مهني مدعوم بالذكاء الاصطناعي للطلاب",
  "hero.titleA": "كن",
  "hero.titleHighlight": "جاهزاً للعمل",
  "hero.titleB": "قبل أن تتخرّج",
  "hero.subtitle":
    "أنشئ سيراً ذاتية قوية، واحصل على تحليل بالذكاء الاصطناعي، وتدرّب على المقابلات، وقِس جاهزيتك المهنية، وأغلق فجوات المهارات، واتبع خارطة طريق مخصّصة — كل ذلك في منصة ذكية واحدة.",
  "hero.exploreFeatures": "استكشف المزايا",
  "hero.cardResume": "درجة السيرة الذاتية",
  "hero.cardReadiness": "الجاهزية المهنية",
  "hero.cardCoverage": "تغطية المهارات",
  "hero.jobReady": "جاهز للعمل",
  "hero.trust": "صُمّم للطلاب · موثوق من متعلّمين طموحين حول العالم",

  "features.eyebrow": "كل ما تحتاجه",
  "features.title": "منصة واحدة لجاهزية مهنية متكاملة",
  "features.subtitle": "تسع وحدات ذكية تعمل معاً لرفع قابليتك للتوظيف إلى أقصى حد.",
  "features.resume.title": "منشئ السيرة الذكي",
  "features.resume.desc":
    "أنشئ وحرّر وانسخ وصدّر سيراً ذاتية أنيقة بقوالب عصرية ومتوافقة مع أنظمة التتبّع واحترافية.",
  "features.analyzer.title": "محلّل السيرة بالذكاء الاصطناعي",
  "features.analyzer.desc":
    "احصل على درجات ATS والمحتوى والتنسيق والاكتمال مع اقتراحات تحسين قابلة للتنفيذ.",
  "features.interview.title": "محاكي المقابلات بالذكاء الاصطناعي",
  "features.interview.desc":
    "تدرّب على أسئلة تقنية وسلوكية وسيناريوهات عبر 6 مسارات مهنية مع تقييم فوري.",
  "features.readiness.title": "محرّك الجاهزية المهنية",
  "features.readiness.desc":
    "درجة جاهزية واحدة من 0 إلى 100 تجمع السيرة والمهارات والشهادات والمشاريع والمقابلات.",
  "features.skills.title": "محلّل فجوة المهارات",
  "features.skills.desc":
    "اكتشف بدقّة المهارات والتقنيات والشهادات التي تنقصك للوظيفة التي تحلم بها.",
  "features.roadmap.title": "مولّد خارطة الطريق المهنية",
  "features.roadmap.desc":
    "خرائط تعلّم وشهادات ومشاريع ومسارات مهنية مخصّصة وفق أهدافك.",
  "features.unified.title": "لوحة تحكم موحّدة",
  "features.unified.desc":
    "تابع كل تحليلاتك ودرجاتك وتوصياتك في مركز تحكّم أنيق واحد.",
  "features.secure.title": "آمن وخاص",
  "features.secure.desc":
    "مصادقة JWT وكلمات مرور مشفّرة وبيانات مقصورة على مالكها تحفظ معلوماتك.",

  "stats.modules": "وحدات ذكية",
  "stats.tracks": "مسارات مهنية",
  "stats.questions": "أسئلة مقابلات",
  "stats.scoring": "تقييم الجاهزية",

  "benefits.eyebrow": "لماذا ستيودنت كارير AI",
  "benefits.title": "حوّل عدم اليقين إلى خطة واضحة",
  "benefits.subtitle":
    "معظم الطلاب لا يعرفون إن كانوا جاهزين لسوق العمل. نحن نستبدل القلق برؤية قابلة للقياس والتنفيذ.",
  "benefits.1": "اعرف موقعك بدقّة عبر درجة جاهزية واحدة",
  "benefits.2": "تغلّب على أنظمة تتبّع المتقدّمين بسير محسّنة لـ ATS",
  "benefits.3": "ادخل المقابلات بثقة وتدرّب جيد",
  "benefits.4": "توقّف عن التخمين — اتبع خارطة تعلّم مبنية على البيانات",
  "benefits.5": "ابنِ حافظة من المشاريع والشهادات الصحيحة",
  "benefits.6": "ذكاء اصطناعي قابل للتفسير: كل درجة مصحوبة بأسبابها",
  "benefits.cardTitle": "الجاهزية المهنية",

  "testimonials.eyebrow": "محبوب من الطلاب",
  "testimonials.title": "نتائج تتحدّث عن نفسها",
  "testimonials.1.quote":
    "أراني المحلّل بالذكاء الاصطناعي بالضبط سبب رفض سيرتي. بعد إصلاح مشاكل ATS حصلت على ثلاث مقابلات في أسبوع.",
  "testimonials.1.role": "طالب علوم حاسب متقدّم",
  "testimonials.2.quote":
    "محاكي المقابلات رائع. تدرّبت على سيناريوهات الحوسبة السحابية ودخلت مقابلة AWS مستعداً تماماً.",
  "testimonials.2.role": "خريج جديد",
  "testimonials.3.quote":
    "أعطتني درجة الجاهزية هدفاً واضحاً. وأخبرتني خارطة الطريق بما أتعلّمه تالياً. انتقلت من «قيد التطوير» إلى «جاهز للعمل» في شهرين.",
  "testimonials.3.role": "طالبة علم بيانات",

  "faq.eyebrow": "الأسئلة الشائعة",
  "faq.title": "الأسئلة المتكرّرة",
  "faq.1.q": "هل استخدام ستيودنت كارير AI مجاني؟",
  "faq.1.a":
    "نعم — الوحدات الأساسية (منشئ السيرة، المحلّل، محاكي المقابلات، محرّك الجاهزية وخرائط الطريق) متاحة لكل طالب مسجّل.",
  "faq.2.q": "كيف يعمل التقييم بالذكاء الاصطناعي؟",
  "faq.2.a":
    "يستخدم محرّكنا تقنيات تعلّم آلي قابلة للتفسير (TF-IDF وتشابه جيب التمام والتقييم المرجّح) لتقييم السير والمهارات وإجابات المقابلات. كل درجة مصحوبة بأسبابها.",
  "faq.3.q": "ما المسارات المهنية المدعومة؟",
  "faq.3.a":
    "هندسة البرمجيات، الذكاء الاصطناعي، الحوسبة السحابية، البنية التحتية لتقنية المعلومات، علم البيانات، وتحليل الأعمال.",
  "faq.4.q": "هل يساعدني على تجاوز أنظمة تتبّع المتقدّمين (ATS)؟",
  "faq.4.a":
    "بالتأكيد. يتحقّق المحلّل من الأقسام الحرجة لـ ATS ومعلومات الاتصال وتغطية الكلمات المفتاحية، ثم يخبرك بما يجب إصلاحه بالضبط.",
  "faq.5.q": "هل بياناتي آمنة؟",
  "faq.5.a":
    "نعم. نستخدم مصادقة JWT وكلمات مرور مشفّرة بـ bcrypt ووصولاً مقصوراً على المالك بحيث لا يرى بياناتك سواك.",

  "contact.title": "مستعدّ لتصبح جاهزاً للعمل؟",
  "contact.subtitle": "انضم إلى ستيودنت كارير AI اليوم وحوّل إمكاناتك إلى ميزة تنافسية.",
  "contact.createFree": "أنشئ حسابك المجاني",
  "contact.contactUs": "تواصل معنا",

  "footer.tagline": "تطوير مهني وتقييم لقابلية التوظيف مدعوم بالذكاء الاصطناعي للطلاب والخريجين.",
  "footer.product": "المنتج",
  "footer.account": "الحساب",
  "footer.connect": "تواصل",
  "footer.getStarted": "ابدأ الآن",
  "footer.rights": "جميع الحقوق محفوظة.",
  "footer.builtBy": "تطوير عبدالعزيز العمّاوي",

  "auth.createTitle": "أنشئ حسابك",
  "auth.createSubtitle": "ابدأ ببناء جاهزيتك المهنية اليوم.",
  "auth.fullName": "الاسم الكامل",
  "auth.email": "البريد الإلكتروني",
  "auth.password": "كلمة المرور",
  "auth.passwordHint": "٨ أحرف على الأقل",
  "auth.createAccount": "إنشاء حساب",
  "auth.haveAccount": "لديك حساب بالفعل؟",
  "auth.signInTitle": "تسجيل الدخول",
  "auth.signInSubtitle": "مرحباً بعودتك — تابع رحلتك المهنية.",
  "auth.noAccount": "ليس لديك حساب؟",
  "auth.createOne": "أنشئ حساباً",
  "auth.accountCreated": "تم إنشاء الحساب! أهلاً بك.",
  "auth.welcomeBack": "مرحباً بعودتك!",
  "auth.registrationFailed": "فشل إنشاء الحساب",
  "auth.loginFailed": "فشل تسجيل الدخول",
  "auth.passwordTooShort": "يجب أن تكون كلمة المرور ٨ أحرف على الأقل.",

  "side.overview": "نظرة عامة",
  "side.resume": "منشئ السيرة",
  "side.analyzer": "محلّل السيرة",
  "side.interview": "محاكي المقابلات",
  "side.skills": "فجوة المهارات",
  "side.roadmap": "خارطة الطريق",
  "side.profile": "الملف الشخصي",

  "top.welcome": "مرحباً بعودتك،",
  "top.student": "طالب",
  "top.logout": "تسجيل الخروج",

  "dash.title": "لوحة التحكم",
  "dash.desc": "جاهزيتك المهنية الكاملة في لمحة.",
  "dash.careerReadiness": "الجاهزية المهنية",
  "dash.scoreBreakdown": "تفصيل الدرجات",
  "dash.resumes": "السير الذاتية",
  "dash.bestAts": "أفضل ATS",
  "dash.interviews": "المقابلات",
  "dash.skillCoverage": "تغطية المهارات",
  "dash.resume": "السيرة",
  "dash.skills": "المهارات",
  "dash.certifications": "الشهادات",
  "dash.projects": "المشاريع",
  "dash.interview": "المقابلة",
  "dash.errorTitle": "حدث خطأ ما",
  "dash.errorDesc": "يرجى المحاولة مرة أخرى بعد قليل.",
  "dash.recommendations": "التوصيات",
  "dash.recEmpty": "شغّل تحليلاً أو فحص فجوة مهارات للحصول على توصيات مخصّصة.",
  "dash.interviewPerformance": "أداء المقابلات",
  "dash.avgScore": "متوسّط الدرجة",
  "dash.bestScore": "أفضل درجة",
  "dash.roadmapProgress": "تقدّم خارطة الطريق",

  "profile.title": "الملف الشخصي",
  "profile.desc": "أدر معلوماتك الشخصية والمهنية.",
  "profile.headline": "العنوان التعريفي",
  "profile.careerTrack": "المسار المهني",
  "profile.selectTrack": "اختر مساراً",
  "profile.major": "التخصّص",
  "profile.university": "الجامعة",
  "profile.gradYear": "سنة التخرّج",
  "profile.location": "الموقع",
  "profile.bio": "نبذة",
  "profile.bioPlaceholder": "أخبرنا عن نفسك...",
  "profile.headlinePlaceholder": "طالب علوم حاسب | مهندس برمجيات طموح",
  "profile.updated": "تم تحديث الملف الشخصي!",

  "resume.title": "منشئ السيرة الذكي",
  "resume.desc": "أنشئ وحرّر وانسخ وصدّر سيراً ذاتية احترافية.",
  "resume.yourResumes": "سيرك الذاتية",
  "resume.none": "لا توجد سير بعد. أنشئ واحدة!",
  "resume.personalInfo": "المعلومات الشخصية",
  "resume.summary": "الملخّص المهني",
  "resume.summaryPlaceholder": "جملتان أو ثلاث عن نقاط قوتك وأهدافك...",
  "resume.skills": "المهارات",
  "resume.skillsPlaceholder": "python, react, sql, git (مفصولة بفواصل)",
  "resume.experience": "الخبرة",
  "resume.education": "التعليم",
  "resume.company": "الشركة",
  "resume.role": "المسمّى الوظيفي",
  "resume.bullets": "نقاط (واحدة في كل سطر)",
  "resume.institution": "المؤسسة التعليمية",
  "resume.degree": "الدرجة العلمية",
  "resume.created": "تم إنشاء السيرة!",
  "resume.saved": "تم حفظ السيرة!",
  "resume.duplicated": "تم نسخ السيرة!",
  "resume.deleted": "تم حذف السيرة.",
  "resume.projects": "المشاريع",
  "resume.certifications": "الشهادات",
  "resume.languages": "اللغات",
  "resume.achievements": "الإنجازات",
  "resume.projectName": "اسم المشروع",
  "resume.projectDesc": "الوصف",
  "resume.techStack": "التقنيات (مفصولة بفواصل)",
  "resume.url": "الرابط",
  "resume.certName": "اسم الشهادة",
  "resume.issuer": "الجهة المانحة",
  "resume.date": "التاريخ",
  "resume.langName": "اللغة",
  "resume.proficiency": "المستوى",
  "resume.achievementsPlaceholder": "إنجاز واحد في كل سطر...",
  "resume.field": "التخصّص",
  "resume.startDate": "تاريخ البداية",
  "resume.endDate": "تاريخ النهاية",
  "resume.addEntry": "إضافة",
  "resume.remove": "حذف",
  "resume.analyzeScore": "تحليل ومنح درجة",
  "resume.targetTrack": "الوظيفة المستهدفة",
  "resume.scoreResult": "درجة السيرة",
  "resume.scoreSaved": "تم التحليل! تحدّثت درجتك في لوحة التحكم.",
  "resume.scoreHint": "احفظ أولاً ثم حلّل لتحديث درجة جاهزيتك في لوحة التحكم.",
  "resume.selectFirst": "اختر أو أنشئ سيرة أولاً.",

  "analyzer.title": "محلّل السيرة بالذكاء الاصطناعي",
  "analyzer.desc": "احصل على درجة ATS فورية وتحسينات قابلة للتنفيذ.",
  "analyzer.input": "مدخلات السيرة",
  "analyzer.targetTrack": "المسار المهني المستهدف",
  "analyzer.contactEmail": "بريد التواصل",
  "analyzer.summary": "الملخّص المهني",
  "analyzer.summaryPlaceholder": "مهندس برمجيات بنى وحسّن...",
  "analyzer.skills": "المهارات (مفصولة بفواصل)",
  "analyzer.expBullets": "نقاط الخبرة (واحدة في كل سطر)",
  "analyzer.includeEducation": "تضمين قسم التعليم",
  "analyzer.analyze": "حلّل السيرة",
  "analyzer.suggestions": "الاقتراحات",
  "analyzer.complete": "اكتمل التحليل!",
  "analyzer.failed": "فشل التحليل",
  "analyzer.overall": "الإجمالي",
  "analyzer.atsLabel": "ATS",
  "analyzer.content": "المحتوى",
  "analyzer.formatting": "التنسيق",
  "analyzer.completeness": "الاكتمال",
  "analyzer.skillsCoverage": "تغطية المهارات",
  "analyzer.empty": "أدخل تفاصيل سيرتك وشغّل التحليل لرؤية درجاتك.",
  "analyzer.noIssues": "رائع — لا توجد مشكلات كبيرة!",
  "analyzer.missingSkills": "المهارات الناقصة",

  "interview.title": "محاكي المقابلات بالذكاء الاصطناعي",
  "interview.desc": "تدرّب على أسئلة مقابلات حقيقية واحصل على تقييم فوري.",
  "interview.careerTrack": "المسار المهني",
  "interview.difficulty": "الصعوبة",
  "interview.start": "ابدأ",
  "interview.report": "تقرير المقابلة",
  "interview.answered": "أجبت على {n} أسئلة.",
  "interview.answerPlaceholder": "اكتب إجابتك هنا...",
  "interview.score": "الدرجة",
  "interview.submit": "إرسال الإجابات",
  "interview.answerAll": "يرجى الإجابة على جميع الأسئلة.",
  "interview.noQuestions": "لا توجد أسئلة لهذا المزيج.",
  "interview.scored": "درجة المقابلة: {n}/100",

  "skills.title": "محلّل فجوة المهارات",
  "skills.desc": "اكتشف المهارات والتقنيات والشهادات التي تنقصك.",
  "skills.careerTrack": "المسار المهني",
  "skills.current": "مهاراتك الحالية (مفصولة بفواصل)",
  "skills.analyze": "حلّل فجوة المهارات",
  "skills.coverageFor": "التغطية لمسار",
  "skills.coverage": "تغطية المهارات",
  "skills.matched": "المهارات المتطابقة",
  "skills.missing": "المهارات الناقصة",
  "skills.recTech": "تقنيات موصى بها",
  "skills.recCerts": "شهادات موصى بها",
  "skills.recProjects": "مشاريع موصى بها",
  "skills.complete": "اكتمل تحليل فجوة المهارات!",
  "skills.failed": "فشل التحليل",

  "roadmap.title": "مولّد خارطة الطريق المهنية",
  "roadmap.desc": "احصل على خارطة طريق مخصّصة للتعلّم والشهادات والمشاريع والمسار المهني.",
  "roadmap.careerTrack": "المسار المهني",
  "roadmap.major": "التخصّص",
  "roadmap.currentSkills": "المهارات الحالية",
  "roadmap.interests": "الاهتمامات",
  "roadmap.generate": "أنشئ خارطة الطريق",
  "roadmap.personalizedFor": "خارطة طريق مخصّصة لمسار",
  "roadmap.weeks": "أسابيع",
  "roadmap.generated": "تم إنشاء خارطة الطريق!",
  "roadmap.failed": "فشل الإنشاء",

  "lang.toggle": "English",
};

const dicts: Record<Locale, Dict> = { en, ar };

interface I18nValue {
  locale: Locale;
  dir: "ltr" | "rtl";
  setLocale: (l: Locale) => void;
  toggle: () => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const I18nContext = React.createContext<I18nValue | undefined>(undefined);

const STORAGE_KEY = "sc-locale";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Start with "en" to match SSR output, then hydrate from storage on mount.
  const [locale, setLocaleState] = React.useState<Locale>("en");

  React.useEffect(() => {
    const stored = (typeof window !== "undefined" &&
      window.localStorage.getItem(STORAGE_KEY)) as Locale | null;
    if (stored === "ar" || stored === "en") setLocaleState(stored);
  }, []);

  const dir: "ltr" | "rtl" = locale === "ar" ? "rtl" : "ltr";

  React.useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = dir;
  }, [locale, dir]);

  const setLocale = React.useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = React.useCallback(() => {
    setLocale(locale === "ar" ? "en" : "ar");
  }, [locale, setLocale]);

  const t = React.useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      let str = dicts[locale][key] ?? dicts.en[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replace(`{${k}}`, String(v));
        }
      }
      return str;
    },
    [locale]
  );

  const value = React.useMemo(
    () => ({ locale, dir, setLocale, toggle, t }),
    [locale, dir, setLocale, toggle, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = React.useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
