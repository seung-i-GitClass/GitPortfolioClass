const themeToggle = document.getElementById("themeToggle");
const themeStorageKey = "siportfolio-theme";
let savedTheme = "light";

try {
  const storedTheme = localStorage.getItem(themeStorageKey);
  if (storedTheme === "dark" || storedTheme === "light") savedTheme = storedTheme;
} catch (error) {
  console.error("테마 설정을 localStorage에서 불러오지 못했습니다.", error);
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"
  );
  themeToggle.firstElementChild.textContent = theme === "dark" ? "☀" : "☾";

  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch (error) {
    console.error("테마 설정을 localStorage에 저장하지 못했습니다.", error);
  }
}

setTheme(savedTheme);
themeToggle.addEventListener("click", () => {
  setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
});

const revealItems = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach((item) => observer.observe(item));

document.getElementById("year").textContent = new Date().getFullYear();

const projectDetails = {
  mori: {
    name: "MORI — 일상의 속도를 조금 늦추는 브랜드",
    description: "느린 일상의 가치를 소개하고, 취향에 맞는 라이프스타일 콘텐츠를 발견하도록 돕는 플랫폼입니다.",
    role: "브랜드 방향성 정리, 웹 화면 구성 및 사용자 경험 설계",
    tech: "HTML, CSS, JavaScript",
    results: "콘텐츠 탐색 경로를 단순화해 주요 콘텐츠 도달률이 25% 높아졌다는 예시 성과입니다."
  },
  goodspace: {
    name: "GOODSPACE — 몰입을 돕는 집중 관리 도구",
    description: "집중 시간을 기록하고 작은 목표를 관리해 사용자가 자신에게 맞는 몰입 습관을 찾도록 돕는 서비스입니다.",
    role: "사용자 흐름 설계, 대시보드 UI 디자인 및 프로토타입 제작",
    tech: "HTML, CSS, JavaScript, Figma",
    results: "집중 세션 완료율이 18% 높아졌다는 예시 성과입니다."
  },
  taste: {
    name: "오늘의 취향 — 새로운 문화를 발견하는 방법",
    description: "사용자가 놓치기 쉬운 전시와 문화 콘텐츠를 가볍게 둘러보고 새로운 취향을 발견하도록 제안하는 캠페인입니다.",
    role: "캠페인 콘셉트 기획, 디지털 콘텐츠 구성 및 랜딩 페이지 제작",
    tech: "HTML, CSS, JavaScript",
    results: "캠페인 페이지의 콘텐츠 공유 수가 30% 증가했다는 예시 성과입니다."
  }
};

const projectModal = document.getElementById("projectModal");
const projectModalClose = projectModal.querySelector(".project-modal-close");
let activeProjectTrigger = null;

// 선택한 프로젝트 정보를 모달의 각 항목에 표시합니다.
function renderProjectDetails(project) {
  document.getElementById("projectModalTitle").textContent = project.name;
  document.getElementById("projectModalDescription").textContent = project.description;
  document.getElementById("projectModalRole").textContent = project.role;
  document.getElementById("projectModalTech").textContent = project.tech;
  document.getElementById("projectModalResults").textContent = project.results;
}

// 상세 모달을 열고 닫기 버튼으로 포커스를 옮깁니다.
function openProjectModal(projectKey, trigger) {
  const project = projectDetails[projectKey];
  if (!project) {
    console.error(`프로젝트 상세 정보를 찾을 수 없습니다: ${projectKey}`);
    return;
  }

  activeProjectTrigger = trigger;
  renderProjectDetails(project);
  projectModal.hidden = false;
  document.body.classList.add("modal-open");
  projectModalClose.focus();
}

// 모달을 닫고 열기 전 프로젝트 카드로 포커스를 돌려보냅니다.
function closeProjectModal() {
  if (projectModal.hidden) return;

  projectModal.hidden = true;
  document.body.classList.remove("modal-open");
  if (activeProjectTrigger) activeProjectTrigger.focus();
  activeProjectTrigger = null;
}

// ESC로 닫고 Tab 포커스가 모달 밖으로 나가지 않게 합니다.
function handleProjectModalKeydown(event) {
  if (projectModal.hidden) return;

  if (event.key === "Escape") {
    event.preventDefault();
    closeProjectModal();
    return;
  }

  if (event.key !== "Tab") return;
  const focusableElements = projectModal.querySelectorAll(
    'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && (document.activeElement === firstElement || !projectModal.contains(document.activeElement))) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && (document.activeElement === lastElement || !projectModal.contains(document.activeElement))) {
    event.preventDefault();
    firstElement.focus();
  }
}

document.querySelectorAll(".project-card-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    openProjectModal(trigger.dataset.project, trigger);
  });
});

projectModalClose.addEventListener("click", closeProjectModal);
projectModal.addEventListener("click", (event) => {
  if (event.target === projectModal) closeProjectModal();
});
document.addEventListener("keydown", handleProjectModalKeydown);

const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");
const contactFields = [
  {
    input: contactForm.elements.name,
    error: document.getElementById("nameError"),
    validate() {
      return this.input.value.trim() ? "" : "이름을 입력해 주세요.";
    }
  },
  {
    input: contactForm.elements.email,
    error: document.getElementById("emailError"),
    validate() {
      if (!this.input.value.trim()) return "이메일 주소를 입력해 주세요.";
      return this.input.validity.typeMismatch || this.input.validity.patternMismatch
        ? "올바른 이메일 주소를 입력해 주세요."
        : "";
    }
  },
  {
    input: contactForm.elements.message,
    error: document.getElementById("messageError"),
    validate() {
      return this.input.value.trim() ? "" : "메시지를 입력해 주세요.";
    }
  }
];

function validateContactField(field) {
  const errorMessage = field.validate();
  field.error.textContent = errorMessage;
  field.input.setAttribute("aria-invalid", String(Boolean(errorMessage)));
  return errorMessage;
}

contactFields.forEach((field) => {
  field.input.addEventListener("input", () => {
    if (field.input.getAttribute("aria-invalid") === "true") validateContactField(field);
    formNote.textContent = "";
  });
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const invalidFields = contactFields.filter((field) => validateContactField(field));

  if (invalidFields.length) {
    formNote.textContent = "입력 내용을 확인해 주세요.";
    invalidFields[0].input.focus();
    return;
  }

  formNote.textContent = "입력한 정보가 모두 확인되었습니다. 데모 양식으로 실제 이메일은 전송되지 않습니다.";
});
