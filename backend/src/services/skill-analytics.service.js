const User = require('../models/User');
const Skill = require('../models/Skill');
const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Deterministic fallback analysis if AI is unavailable or offline
 */
const generateHeuristicAnalysis = (skills, user) => {
  const total = skills.reduce((acc, s) => acc + (s.proficiency || 0), 0);
  const avg = Math.round(total / (skills.length || 1));

  // Categorize skills
  const categories = {
    Frontend: ['react', 'vue', 'angular', 'html', 'css', 'tailwind', 'javascript', 'typescript', 'frontend', 'redux', 'next.js', 'sass'],
    Backend: ['node', 'express', 'backend', 'django', 'flask', 'spring', 'fastapi', 'nest', 'ruby', 'php', 'golang', 'api', 'graphql', 'rest'],
    Languages: ['javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'ruby', 'kotlin', 'swift'],
    DevOps: ['docker', 'kubernetes', 'aws', 'gcp', 'azure', 'ci/cd', 'git', 'linux', 'terraform', 'nginx'],
    Database: ['mongodb', 'sql', 'postgresql', 'mysql', 'redis', 'prisma', 'mongoose', 'dynamodb']
  };

  const domainScores = {
    'Frontend Architecture': 0,
    'Backend & APIs': 0,
    'Algorithms & Logic': 0,
    'Language Breadth': 0,
    'DevOps & Cloud': 0,
    'System Design': 0
  };

  const domainCounts = {
    'Frontend Architecture': 0,
    'Backend & APIs': 0,
    'Algorithms & Logic': 0,
    'Language Breadth': 0,
    'DevOps & Cloud': 0,
    'System Design': 0
  };

  skills.forEach(skill => {
    const sName = skill.name.toLowerCase();
    const prof = skill.proficiency;

    if (categories.Frontend.some(k => sName.includes(k))) {
      domainScores['Frontend Architecture'] += prof;
      domainCounts['Frontend Architecture']++;
    }
    if (categories.Backend.some(k => sName.includes(k))) {
      domainScores['Backend & APIs'] += prof;
      domainCounts['Backend & APIs']++;
    }
    if (categories.Languages.some(k => sName.includes(k))) {
      domainScores['Language Breadth'] += prof;
      domainCounts['Language Breadth']++;
    }
    if (categories.DevOps.some(k => sName.includes(k))) {
      domainScores['DevOps & Cloud'] += prof;
      domainCounts['DevOps & Cloud']++;
    }
    if (categories.Database.some(k => sName.includes(k))) {
      domainScores['System Design'] += prof;
      domainCounts['System Design']++;
    }
  });

  const radarMetrics = Object.keys(domainScores).map(domain => {
    const count = domainCounts[domain];
    const score = count > 0 ? Math.round(domainScores[domain] / count) : Math.max(25, Math.round(avg * 0.45));
    const benchmarks = {
      'Frontend Architecture': 70,
      'Backend & APIs': 65,
      'Algorithms & Logic': 60,
      'Language Breadth': 65,
      'DevOps & Cloud': 60,
      'System Design': 65
    };
    return {
      domain,
      score: Math.min(100, Math.max(15, score)),
      benchmark: benchmarks[domain] || 60
    };
  });

  const categoryBreakdown = [
    {
      category: 'Frontend Engineering',
      score: Math.round(radarMetrics[0].score),
      skillsCount: domainCounts['Frontend Architecture'],
      status: radarMetrics[0].score >= 60 ? 'Strong' : 'Developing'
    },
    {
      category: 'Backend & Services',
      score: Math.round(radarMetrics[1].score),
      skillsCount: domainCounts['Backend & APIs'],
      status: radarMetrics[1].score >= 60 ? 'Strong' : 'Developing'
    },
    {
      category: 'Programming Languages',
      score: Math.round(radarMetrics[3].score),
      skillsCount: domainCounts['Language Breadth'],
      status: radarMetrics[3].score >= 60 ? 'Strong' : 'Developing'
    },
    {
      category: 'Infrastructure & Tools',
      score: Math.round(radarMetrics[4].score),
      skillsCount: domainCounts['DevOps & Cloud'],
      status: radarMetrics[4].score >= 50 ? 'Balanced' : 'High Opportunity'
    }
  ];

  const marketReadinessScore = Math.min(95, Math.max(40, Math.round((avg * 0.7) + (skills.length * 3))));

  return {
    hasSkills: true,
    skillsCount: skills.length,
    analyzedAt: new Date(),
    archetype: skills.some(s => s.name.toLowerCase().includes('react') || s.name.toLowerCase().includes('typescript')) 
      ? 'Modern Full-Stack Web Developer' 
      : 'Generalist Software Engineer',
    summary: `${user.name || 'Developer'} exhibits solid competence across ${skills.length} tracked technical proficiencies with a primary emphasis on web technologies and application development.`,
    marketReadinessScore,
    marketTier: marketReadinessScore >= 80 ? 'Production Ready / Mid-Level' : marketReadinessScore >= 60 ? 'High-Potential Developer' : 'Foundation Level',
    radarMetrics,
    categoryBreakdown,
    strengths: [
      {
        title: 'Core Application Development',
        description: `Strong proficiency established in primary languages and frameworks (${skills.slice(0, 2).map(s => s.name).join(', ')}).`
      },
      {
        title: 'Multi-Language Foundation',
        description: 'Demonstrates polyglot capabilities with exposure to both interpreted and typed programming languages.'
      }
    ],
    skillGaps: [
      {
        area: 'DevOps & Containerization',
        gap: 'Lack of container runtime (Docker) or continuous integration tooling in current profile.',
        recommendation: 'Containerize a local project and integrate GitHub Actions for automated linting and tests.'
      },
      {
        area: 'Persistent Storage Deep Dive',
        gap: 'Explicit database management skills (PostgreSQL / MongoDB aggregation) can be highlighted further.',
        recommendation: 'Add schema design or query optimization experience to your project portfolio.'
      }
    ],
    nextHighImpactSkills: [
      {
        name: 'Docker & Containers',
        category: 'DevOps',
        impact: '+18% Market Appeal',
        reason: 'Essential standard for deploying modern full-stack web microservices.',
        difficulty: 'Moderate'
      },
      {
        name: 'PostgreSQL / Prisma',
        category: 'Database',
        impact: '+15% Market Appeal',
        reason: 'Pairs directly with TypeScript for enterprise relational database architectures.',
        difficulty: 'Moderate'
      },
      {
        name: 'Next.js 14 (App Router)',
        category: 'Full-Stack Framework',
        impact: '+14% Market Appeal',
        reason: 'Natural evolution from React that drastically enhances SEO and full-stack velocity.',
        difficulty: 'Easy'
      }
    ],
    practicalAdvice: 'Continue building portfolio projects that connect your frontend proficiencies with automated testing, database migrations, and clean containerized deployment pipelines.'
  };
};

/**
 * Main AI Skills Analysis Engine
 */
const analyzeSkillsWithAI = async (userId, forceRefresh = false) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const skills = await Skill.find({ user: userId }).sort({ proficiency: -1 });

  if (!skills || skills.length === 0) {
    return {
      hasSkills: false,
      message: 'No skills found. Add your technical skills above to unlock AI competency charts and practical market analysis.'
    };
  }

  // Check cached analysis if not forced refresh and skills count matches
  if (!forceRefresh && user.skillAnalysis && user.skillAnalysis.skillsCount === skills.length) {
    return user.skillAnalysis;
  }

  // Attempt Gemini AI Analysis
  if (process.env.GEMINI_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

      const skillListStr = skills.map(s => `- ${s.name} (${s.proficiency}%, Category: ${s.category || 'General'})`).join('\n');

      const prompt = `You are a Principal Staff Engineer and Technical Hiring Director at a premier software company.
Analyze this developer's technical skills profile thoroughly and practically.

Developer: ${user.name}
Bio: ${user.bio || 'Software Developer'}
Current Skills Profile:
${skillListStr}

Provide a deep, realistic, highly practical skills analysis.
Respond ONLY with a valid JSON object matching this EXACT structure, without markdown code fences, comments, or extra text:

{
  "archetype": "Descriptive Developer Archetype (e.g. Modern TypeScript & Full-Stack Specialist)",
  "summary": "2-3 sentences summarizing their real-world capabilities, stack balance, and primary strengths.",
  "marketReadinessScore": 82,
  "marketTier": "Production Ready / Mid-to-Senior Full-Stack Ready",
  "radarMetrics": [
    {"domain": "Frontend Architecture", "score": 75, "benchmark": 70},
    {"domain": "Backend & APIs", "score": 65, "benchmark": 65},
    {"domain": "Algorithms & Logic", "score": 58, "benchmark": 60},
    {"domain": "Language Breadth", "score": 72, "benchmark": 65},
    {"domain": "DevOps & Cloud", "score": 45, "benchmark": 60},
    {"domain": "System Design", "score": 55, "benchmark": 65}
  ],
  "categoryBreakdown": [
    {"category": "Frontend Engineering", "score": 72, "skillsCount": 3, "status": "Strong"},
    {"category": "Backend & Services", "score": 60, "skillsCount": 1, "status": "Developing"},
    {"category": "Programming Languages", "score": 65, "skillsCount": 4, "status": "Strong"},
    {"category": "DevOps & Infrastructure", "score": 40, "skillsCount": 0, "status": "High Opportunity"}
  ],
  "strengths": [
    {
      "title": "Strong Modern Web Core",
      "description": "Specific analytical feedback on why their top skills make them effective."
    },
    {
      "title": "Polyglot Versatility",
      "description": "Insight into their programming language breadth."
    }
  ],
  "skillGaps": [
    {
      "area": "Identified Domain Gap",
      "gap": "Specific missing tool or architecture layer from their stack.",
      "recommendation": "Actionable way to close this gap."
    },
    {
      "area": "Production Readiness",
      "gap": "Another key missing synergy piece.",
      "recommendation": "Concrete project to build."
    }
  ],
  "nextHighImpactSkills": [
    {
      "name": "Skill Name",
      "category": "Domain",
      "impact": "+18% Market Value",
      "reason": "Why this specific skill creates maximum career leverage given their current stack.",
      "difficulty": "Easy | Moderate | Advanced"
    },
    {
      "name": "Skill Name 2",
      "category": "Domain",
      "impact": "+15% Market Value",
      "reason": "Why this skill elevates their overall developer readiness.",
      "difficulty": "Easy | Moderate | Advanced"
    },
    {
      "name": "Skill Name 3",
      "category": "Domain",
      "impact": "+12% Market Value",
      "reason": "Why this skill complements their existing strengths.",
      "difficulty": "Easy | Moderate | Advanced"
    }
  ],
  "practicalAdvice": "A clear, actionable closing recommendation for this developer over the next 30 days."
}`;

      let result;
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });
        result = await model.generateContent(prompt);
      } catch (flashErr) {
        console.warn(`gemini-3.5-flash failed (${flashErr.message}), trying gemini-3.5-flash-lite...`);
        const modelLite = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });
        result = await modelLite.generateContent(prompt);
      }

      let responseText = result.response.text().trim();
      if (responseText.startsWith('```json')) responseText = responseText.slice(7);
      if (responseText.startsWith('```')) responseText = responseText.slice(3);
      if (responseText.endsWith('```')) responseText = responseText.slice(0, -3);

      const parsed = JSON.parse(responseText.trim());
      parsed.hasSkills = true;
      parsed.skillsCount = skills.length;
      parsed.analyzedAt = new Date();

      // Save to user model for quick retrieval
      user.skillAnalysis = parsed;
      await user.save();
      console.log(`🤖 Gemini AI Skills Analysis generated successfully for user: ${user._id}`);
      return parsed;
    } catch (err) {
      console.error('Gemini AI Skills Analysis Error, falling back to heuristic engine:', err.message);
    }
  }

  // Fallback to heuristic analysis
  const fallback = generateHeuristicAnalysis(skills, user);
  user.skillAnalysis = fallback;
  await user.save();
  return fallback;
};

module.exports = {
  analyzeSkillsWithAI,
  generateHeuristicAnalysis
};
