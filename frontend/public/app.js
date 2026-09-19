/* ==========================================================================
   SkillForge — Student Projects Showcase Application Logic
   ========================================================================== */

// Initial Student Projects Dataset
const initialProjects = [
  {
    id: "proj-1",
    title: "NeuroVision: Real-Time Brain MRI Segmentation",
    description: "Deep learning pipeline using PyTorch & UNet architecture for automated brain lesion detection with high accuracy and real-time slice rendering.",
    category: "AI/ML",
    image: "assets/images/neuro_vision_project_1789480796416.jpg",
    author: {
      name: "Elena Rostova",
      role: "Stanford University • M.S. AI",
      avatar: "ER"
    },
    techTags: ["Python", "PyTorch", "FastAPI", "React", "Docker"],
    aiScore: 94,
    skillsEvaluated: [
      { name: "Python", score: 95 },
      { name: "Machine Learning & PyTorch", score: 92 },
      { name: "FastAPI Backend", score: 88 },
      { name: "Docker Deployment", score: 85 }
    ],
    likes: 142,
    views: 1890,
    github: "https://github.com/skillforge/neurovision-mri",
    demo: "https://neurovision.skillforge.dev",
    createdAt: "2026-08-20"
  },
  {
    id: "proj-2",
    title: "PulsePay: Decentralized Micropayments Engine",
    description: "High-throughput smart contract micropayment gateway built with Solidity & Node.js, delivering sub-second settlement for web monetization.",
    category: "Full Stack",
    image: "assets/images/pulse_pay_project_1789480811086.jpg",
    author: {
      name: "Marcus Vance",
      role: "MIT • B.S. Computer Science",
      avatar: "MV"
    },
    techTags: ["Solidity", "Node.js", "React", "TypeScript", "Tailwind"],
    aiScore: 89,
    skillsEvaluated: [
      { name: "React & Web UI", score: 91 },
      { name: "Node.js & Async Logic", score: 88 },
      { name: "Solidity Smart Contracts", score: 86 },
      { name: "TypeScript", score: 90 }
    ],
    likes: 98,
    views: 1240,
    github: "https://github.com/skillforge/pulsepay-gateway",
    demo: "https://pulsepay.skillforge.dev",
    createdAt: "2026-09-02"
  },
  {
    id: "proj-3",
    title: "EcoTrack: Autonomous Swarm Telemetry Control",
    description: "Real-time telemetry and 3D terrain flight optimization dashboard for environmental monitoring drone swarms using Python & WebSockets.",
    category: "Systems",
    image: "assets/images/ecotrack_drone_project_1789480828008.jpg",
    author: {
      name: "Aria Chen",
      role: "UC Berkeley • Robotics & Systems",
      avatar: "AC"
    },
    techTags: ["Python", "C++", "React", "WebSockets", "Docker"],
    aiScore: 96,
    skillsEvaluated: [
      { name: "Python Systems", score: 96 },
      { name: "C++ Optimization", score: 94 },
      { name: "React 3D Canvas", score: 89 },
      { name: "Distributed Telemetry", score: 92 }
    ],
    likes: 215,
    views: 3100,
    github: "https://github.com/skillforge/ecotrack-swarm",
    demo: "https://ecotrack.skillforge.dev",
    createdAt: "2026-08-14"
  },
  {
    id: "proj-4",
    title: "CodePulse: ML-Driven Static Code Analysis Engine",
    description: "Automated code complexity and anti-pattern evaluator for Java & Python codebases that predicts maintenance debt before pull requests are merged.",
    category: "AI/ML",
    image: "assets/images/codepulse_ml_project_1789480845944.jpg",
    author: {
      name: "David Kim",
      role: "CMU • Ph.D. Software Engineering",
      avatar: "DK"
    },
    techTags: ["Python", "Java", "AST Parser", "FastAPI", "React"],
    aiScore: 91,
    skillsEvaluated: [
      { name: "Python", score: 91 },
      { name: "Java AST Parsing", score: 93 },
      { name: "Static Analysis Algorithms", score: 88 },
      { name: "REST APIs", score: 85 }
    ],
    likes: 176,
    views: 2450,
    github: "https://github.com/skillforge/codepulse-analyzer",
    demo: "https://codepulse.skillforge.dev",
    createdAt: "2026-09-08"
  },
  {
    id: "proj-5",
    title: "OmniChat: Multi-Agent Collaborative Workflow",
    description: "Orchestration platform for autonomous LLM subagents executing parallel coding and testing pipelines with human-in-the-loop validation.",
    category: "AI/ML",
    image: "assets/images/codepulse_ml_project_1789480845944.jpg",
    author: {
      name: "Sophia Taylor",
      role: "Georgia Tech • Computer Science",
      avatar: "ST"
    },
    techTags: ["Python", "LangChain", "FastAPI", "React", "Docker"],
    aiScore: 88,
    skillsEvaluated: [
      { name: "Python Orchestration", score: 90 },
      { name: "React Frontend", score: 86 },
      { name: "Prompt Engineering", score: 92 },
      { name: "API Middleware", score: 84 }
    ],
    likes: 130,
    views: 1620,
    github: "https://github.com/skillforge/omnichat-agents",
    demo: "https://omnichat.skillforge.dev",
    createdAt: "2026-09-10"
  },
  {
    id: "proj-6",
    title: "QuantumFlow: Real-Time Algorithmic Trading Desk",
    description: "High-frequency backtesting and order execution engine supporting Java latency optimizations and WebSocket telemetry streaming.",
    category: "Full Stack",
    image: "assets/images/pulse_pay_project_1789480811086.jpg",
    author: {
      name: "Liam O'Connor",
      role: "Columbia University • Financial Tech",
      avatar: "LO"
    },
    techTags: ["Java", "Spring Boot", "React", "WebSockets", "Docker"],
    aiScore: 93,
    skillsEvaluated: [
      { name: "Java Low Latency", score: 95 },
      { name: "Spring Boot APIs", score: 90 },
      { name: "React Realtime UI", score: 87 },
      { name: "Docker Containerization", score: 88 }
    ],
    likes: 165,
    views: 2050,
    github: "https://github.com/skillforge/quantumflow-desk",
    demo: "https://quantumflow.skillforge.dev",
    createdAt: "2026-08-28"
  }
];

// App State
let state = {
  projects: [...initialProjects],
  bookmarkedIds: new Set(),
  searchQuery: "",
  activeCategory: "All",
  activeTechTag: "All",
  sortBy: "newest"
};

// DOM Elements
document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  renderProjects();
  setupEventListeners();
  updateMetricsDisplay();
}

function setupEventListeners() {
  // Search input listener
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value.toLowerCase().trim();
      renderProjects();
    });
  }

  // Keyboard shortcut for search
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      document.getElementById("searchInput")?.focus();
    }
  });

  // Sort select listener
  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      state.sortBy = e.target.value;
      renderProjects();
    });
  }

  // Category Filter Pills
  const categoryPills = document.querySelectorAll(".category-pill");
  categoryPills.forEach(pill => {
    pill.addEventListener("click", () => {
      categoryPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      state.activeCategory = pill.dataset.category;
      renderProjects();
    });
  });

  // New Project Form Submit
  const newProjectForm = document.getElementById("newProjectForm");
  if (newProjectForm) {
    newProjectForm.addEventListener("submit", handleCreateProject);
  }

  // Modal backdrop click close
  window.closeModal = closeModal;
}

function filterAndSortProjects() {
  return state.projects.filter(project => {
    // Category match
    if (state.activeCategory !== "All" && project.category !== state.activeCategory) {
      return false;
    }

    // Search query match (title, snippet, tech tags, author name)
    if (state.searchQuery) {
      const q = state.searchQuery;
      const titleMatch = project.title.toLowerCase().includes(q);
      const descMatch = project.description.toLowerCase().includes(q);
      const authorMatch = project.author.name.toLowerCase().includes(q);
      const tagMatch = project.techTags.some(tag => tag.toLowerCase().includes(q));
      if (!titleMatch && !descMatch && !authorMatch && !tagMatch) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    if (state.sortBy === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (state.sortBy === "popular") {
      return b.likes - a.likes;
    } else if (state.sortBy === "aiScore") {
      return b.aiScore - a.aiScore;
    }
    return 0;
  });
}

function renderProjects() {
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;

  const filtered = filterAndSortProjects();

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon"><i class="fa-solid fa-folder-open"></i></div>
        <div class="empty-title">No projects found</div>
        <div class="empty-desc">Try tweaking your search keywords or switching category filters.</div>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(project => `
    <article class="project-card" data-id="${project.id}">
      <div class="card-media">
        <img src="${project.image}" alt="${project.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'">
        <div class="media-overlay">
          <div class="ai-verified-badge">
            <span class="pulse-dot"></span>
            ⚡ AI Verified • ${project.aiScore}% Score
          </div>
          <button class="bookmark-btn ${state.bookmarkedIds.has(project.id) ? 'active' : ''}" 
                  onclick="toggleBookmark(event, '${project.id}')"
                  title="${state.bookmarkedIds.has(project.id) ? 'Remove bookmark' : 'Bookmark project'}">
            <i class="${state.bookmarkedIds.has(project.id) ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i>
          </button>
        </div>
      </div>

      <div class="card-body">
        <h3 class="project-title">${escapeHTML(project.title)}</h3>
        <p class="project-snippet">${escapeHTML(project.description)}</p>

        <div class="author-box">
          <div class="author-avatar">${project.author.avatar}</div>
          <div class="author-details">
            <span class="author-name">${escapeHTML(project.author.name)}</span>
            <span class="author-meta">${escapeHTML(project.author.role)}</span>
          </div>
        </div>

        <div class="tech-tags">
          ${project.techTags.map(tag => `<span class="tech-tag" data-tech="${tag}">${escapeHTML(tag)}</span>`).join('')}
        </div>

        <div class="card-footer">
          <div class="stats-group">
            <span class="stat-item"><i class="fa-regular fa-heart"></i> ${project.likes}</span>
            <span class="stat-item"><i class="fa-regular fa-eye"></i> ${project.views}</span>
          </div>
          <button class="btn-card-action" onclick="openProjectModal('${project.id}')">
            View Details <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </article>
  `).join('');
}

function updateMetricsDisplay() {
  const totalProjEl = document.getElementById("totalProjectsCount");
  if (totalProjEl) {
    totalProjEl.textContent = `${state.projects.length}+`;
  }
}

// Toggle Bookmark
window.toggleBookmark = function(e, id) {
  e.stopPropagation();
  if (state.bookmarkedIds.has(id)) {
    state.bookmarkedIds.delete(id);
    showToast("Project removed from bookmarks");
  } else {
    state.bookmarkedIds.add(id);
    showToast("Project saved to bookmarks! 🔖");
  }
  renderProjects();
};

// Open Project Detail Modal
window.openProjectModal = function(id) {
  const project = state.projects.find(p => p.id === id);
  if (!project) return;

  // Increase views count visually
  project.views += 1;
  renderProjects();

  const modalOverlay = document.getElementById("detailModal");
  const modalContent = document.getElementById("detailModalContent");

  if (!modalOverlay || !modalContent) return;

  modalContent.innerHTML = `
    <div class="modal-header">
      <h2 class="modal-title">${escapeHTML(project.title)}</h2>
      <button class="btn-close-modal" onclick="closeModal('detailModal')">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <div class="modal-body">
      <img src="${project.image}" alt="${project.title}" class="detail-cover-img">

      <div class="author-box" style="margin-bottom: 20px;">
        <div class="author-avatar" style="width: 44px; height: 44px; font-size: 1.1rem;">${project.author.avatar}</div>
        <div class="author-details">
          <span class="author-name" style="font-size: 1rem;">${escapeHTML(project.author.name)}</span>
          <span class="author-meta">${escapeHTML(project.author.role)}</span>
        </div>
        <div style="margin-left: auto;">
          <span class="ai-verified-badge" style="font-size: 0.85rem; padding: 6px 14px;">
            ⚡ SkillForge Verified Score: ${project.aiScore}%
          </span>
        </div>
      </div>

      <h4 style="color: #FFF; font-family: var(--font-heading); margin-bottom: 8px;">Project Overview</h4>
      <p style="color: var(--text-muted); margin-bottom: 20px; line-height: 1.7;">${escapeHTML(project.description)}</p>

      <h4 style="color: #FFF; font-family: var(--font-heading); margin-bottom: 12px;">Tech Stack & Frameworks</h4>
      <div class="tech-tags" style="margin-bottom: 24px;">
        ${project.techTags.map(tag => `<span class="tech-tag" data-tech="${tag}" style="font-size: 0.88rem; padding: 6px 12px;">${escapeHTML(tag)}</span>`).join('')}
      </div>

      <!-- AI Skill Evaluation Section -->
      <div class="ai-evaluation-box">
        <div class="eval-header">
          <div class="eval-title">
            <i class="fa-solid fa-brain" style="color: var(--accent-indigo);"></i>
            AI Skill Analyzer Proficiency Breakdown
          </div>
          <span style="font-size: 0.8rem; color: var(--accent-emerald); font-weight: 600;">Codebase & Assessment Verified</span>
        </div>

        <div class="skill-bar-list">
          ${project.skillsEvaluated.map(skill => `
            <div class="skill-item">
              <div class="skill-info">
                <span class="skill-name">${escapeHTML(skill.name)}</span>
                <span class="skill-pct">${skill.score}%</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill" style="width: ${skill.score}%;"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="display: flex; gap: 14px; margin-top: 24px; flex-wrap: wrap;">
        <a href="${project.github}" target="_blank" class="btn-secondary" style="flex: 1; justify-content: center;">
          <i class="fa-brands fa-github"></i> View Repository
        </a>
        <a href="${project.demo}" target="_blank" class="btn-primary" style="flex: 1; justify-content: center;">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo Preview
        </a>
      </div>
    </div>
  `;

  modalOverlay.classList.add("active");
};

// Open Add Project Modal
window.openAddProjectModal = function() {
  const modalOverlay = document.getElementById("addProjectModal");
  if (modalOverlay) {
    modalOverlay.classList.add("active");
  }
};

// Close Modal
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
  }
}

// Handle Form Submission for new project
function handleCreateProject(e) {
  e.preventDefault();
  const title = document.getElementById("projTitle").value;
  const description = document.getElementById("projDesc").value;
  const authorName = document.getElementById("projAuthor").value;
  const category = document.getElementById("projCategory").value;
  const techString = document.getElementById("projTech").value;

  const techTags = techString.split(',').map(t => t.trim()).filter(Boolean);

  const newProject = {
    id: `proj-${Date.now()}`,
    title,
    description,
    category,
    image: "assets/images/codepulse_ml_project_1789480845944.jpg",
    author: {
      name: authorName,
      role: "Student Contributor • SkillForge Community",
      avatar: authorName.substring(0, 2).toUpperCase()
    },
    techTags: techTags.length ? techTags : ["Python", "React"],
    aiScore: Math.floor(Math.random() * 15) + 85,
    skillsEvaluated: techTags.map(t => ({ name: t, score: Math.floor(Math.random() * 15) + 82 })),
    likes: 1,
    views: 12,
    github: "https://github.com",
    demo: "https://skillforge.dev",
    createdAt: new Date().toISOString().split('T')[0]
  };

  state.projects.unshift(newProject);
  renderProjects();
  updateMetricsDisplay();
  closeModal("addProjectModal");
  e.target.reset();
  showToast("Project successfully published to SkillForge! 🚀");
}

// Toast Notification
function showToast(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--accent-emerald);"></i> ${msg}`;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

// Helper: Escape HTML string to prevent XSS
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
