const quizQuestions = [
  {
    id: "q1",
    text: "Что тебе интереснее?",
    options: [
      { label: "Код, сайты, технологии", category: "it" },
      { label: "Люди, обучение, помощь", category: "education" },
      { label: "Законы, споры, защита", category: "law" },
      { label: "Бизнес, деньги, рынок", category: "business" }
    ]
  },
  {
    id: "q2",
    text: "Какие предметы тебе ближе?",
    options: [
      { label: "Математика и информатика", category: "it" },
      { label: "Биология и химия", category: "medicine" },
      { label: "Математика и физика", category: "engineering" },
      { label: "История и право", category: "law" }
    ]
  },
  {
    id: "q3",
    text: "Какой формат работы нравится?",
    options: [
      { label: "Создавать цифровые продукты", category: "it" },
      { label: "Общаться с клиентами и управлять", category: "business" },
      { label: "Помогать людям напрямую", category: "medicine" },
      { label: "Проектировать объекты и пространства", category: "creative" }
    ]
  },
  {
    id: "q4",
    text: "Что важнее в профессии?",
    options: [
      { label: "Высокий доход", category: "it" },
      { label: "Стабильность", category: "education" },
      { label: "Престиж и влияние", category: "law" },
      { label: "Практическая польза", category: "engineering" }
    ]
  },
  {
    id: "q5",
    text: "Какой результат хочется видеть от своей работы?",
    options: [
      { label: "Работающий сервис или приложение", category: "it" },
      { label: "Развитие людей", category: "education" },
      { label: "Вылеченный пациент", category: "medicine" },
      { label: "Рост компании и дохода", category: "business" }
    ]
  },
  {
    id: "q6",
    text: "Что тебе ближе по стилю задач?",
    options: [
      { label: "Логика, алгоритмы, точность", category: "it" },
      { label: "Общение, влияние, переговоры", category: "law" },
      { label: "Расчёты, схемы, конструкции", category: "engineering" },
      { label: "Идеи, визуал, творчество", category: "creative" }
    ]
  },
  {
    id: "q7",
    text: "Где тебе было бы комфортнее работать?",
    options: [
      { label: "В компании с цифровыми продуктами", category: "it" },
      { label: "В школе, колледже или центре обучения", category: "education" },
      { label: "В клинике, лаборатории или больнице", category: "medicine" },
      { label: "В офисе, банке или бизнес-структуре", category: "business" }
    ]
  },
  {
    id: "q8",
    text: "Что тебе интереснее создавать?",
    options: [
      { label: "Приложения, сайты, сервисы", category: "it" },
      { label: "Проекты зданий и объектов", category: "engineering" },
      { label: "Визуал, дизайн, медиа", category: "creative" },
      { label: "Правовые решения и документы", category: "law" }
    ]
  },
  {
    id: "q9",
    text: "Что тебе важнее в будущем?",
    options: [
      { label: "Гибкость и рост в цифровой сфере", category: "it" },
      { label: "Влияние и статус", category: "law" },
      { label: "Польза людям и обществу", category: "medicine" },
      { label: "Финансовая стабильность и карьерный рост", category: "business" }
    ]
  },
  {
    id: "q10",
    text: "Какой тип задач тебе даётся легче?",
    options: [
      { label: "Анализировать данные и искать закономерности", category: "it" },
      { label: "Объяснять и обучать других", category: "education" },
      { label: "Организовывать процессы и ресурсы", category: "business" },
      { label: "Рисовать, придумывать, оформлять", category: "creative" }
    ]
  }
];

const state = {
  professions: [],
  score: null,
  selectedProfession: null,
  filteredProfessions: [],
  quizTopCategory: null,
  hasSearched: false
};

const elements = {
  entScoreInput: document.getElementById("entScoreInput"),
  entRangeInput: document.getElementById("entRangeInput"),
  rangeValue: document.getElementById("rangeValue"),
  startBtn: document.getElementById("startBtn"),
  loadTopBtn: document.getElementById("loadTopBtn"),

  heroScore: document.getElementById("heroScore"),
  heroCount: document.getElementById("heroCount"),
  heroTier: document.getElementById("heroTier"),

  searchInput: document.getElementById("searchInput"),
  categoryFilter: document.getElementById("categoryFilter"),
  subjectFilter: document.getElementById("subjectFilter"),
  sortFilter: document.getElementById("sortFilter"),

  bestProfessionLabel: document.getElementById("bestProfessionLabel"),
  avgStartSalary: document.getElementById("avgStartSalary"),
  lowestScoreLabel: document.getElementById("lowestScoreLabel"),

  results: document.getElementById("results"),
  detailPanel: document.getElementById("detailPanel"),

  quizQuestions: document.getElementById("quizQuestions"),
  quizBtn: document.getElementById("quizBtn"),
  quizResetBtn: document.getElementById("quizResetBtn"),
  quizResult: document.getElementById("quizResult"),

  analysisBtn: document.getElementById("analysisBtn"),
  analysisOutput: document.getElementById("analysisOutput"),
  analysisType: document.getElementById("analysisType")
};

const AI_ENDPOINT = "https://mvpjolguide.onrender.com/api/analyze";

function exists(element) {
  return Boolean(element);
}

function formatCurrency(value) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₸`;
}

function getCategoryLabel(category) {
  const labels = {
    it: "IT",
    business: "Бизнес",
    education: "Образование",
    law: "Право",
    medicine: "Медицина",
    engineering: "Инженерия",
    creative: "Творчество"
  };

  return labels[category] || category;
}

function getTier(score) {
  if (score === null || Number.isNaN(score)) return "—";
  if (score < 50) return "Ниже порога";
  if (score <= 69) return "Базовый";
  if (score <= 89) return "Средний";
  return "Высокий";
}

function validateScore(value) {
  const score = Number(value);

  if (Number.isNaN(score)) {
    return { ok: false, message: "Введите число." };
  }

  if (score < 0 || score > 140) {
    return { ok: false, message: "Балл должен быть от 0 до 140." };
  }

  return { ok: true, score };
}

async function loadProfessions() {
  const response = await fetch("./data/professions.json");

  if (!response.ok) {
    throw new Error("Не удалось загрузить файл data/professions.json");
  }

  state.professions = await response.json();
  state.filteredProfessions = [...state.professions];
}

function syncRangeAndInput(fromRange = true) {
  if (!exists(elements.entScoreInput) || !exists(elements.entRangeInput) || !exists(elements.rangeValue)) return;

  if (fromRange) {
    elements.entScoreInput.value = elements.entRangeInput.value;
    elements.rangeValue.textContent = elements.entRangeInput.value;
  } else {
    const value = elements.entScoreInput.value || 0;
    elements.entRangeInput.value = Math.min(140, Math.max(0, Number(value)));
    elements.rangeValue.textContent = elements.entRangeInput.value;
  }
}

function buildSubjectFilter() {
  if (!exists(elements.subjectFilter)) return;

  const subjects = new Set();

  state.professions.forEach((profession) => {
    profession.subjects.forEach((subject) => subjects.add(subject));
  });

  const sorted = [...subjects].sort((a, b) => a.localeCompare(b, "ru"));

  elements.subjectFilter.innerHTML = `
    <option value="all">Все предметы</option>
    ${sorted.map((subject) => `<option value="${subject}">${subject}</option>`).join("")}
  `;
}

function getFilteredProfessions() {
  let list = [...state.professions];

  if (state.score !== null) {
    list = list.filter((item) => state.score >= item.min_score);
  }

  const query = exists(elements.searchInput) ? elements.searchInput.value.trim().toLowerCase() : "";
  if (query) {
    list = list.filter((item) => {
      return (
        item.profession.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.subjects.join(" ").toLowerCase().includes(query)
      );
    });
  }

  const category = exists(elements.categoryFilter) ? elements.categoryFilter.value : "all";
  if (category !== "all") {
    list = list.filter((item) => item.category === category);
  }

  const subject = exists(elements.subjectFilter) ? elements.subjectFilter.value : "all";
  if (subject !== "all") {
    list = list.filter((item) => item.subjects.includes(subject));
  }

  const sort = exists(elements.sortFilter) ? elements.sortFilter.value : "score-asc";
  if (sort === "score-asc") {
    list.sort((a, b) => a.min_score - b.min_score);
  } else if (sort === "score-desc") {
    list.sort((a, b) => b.min_score - a.min_score);
  } else if (sort === "salary-top-desc") {
    list.sort((a, b) => b.salary.top - a.salary.top);
  } else if (sort === "salary-mid-desc") {
    list.sort((a, b) => b.salary.mid - a.salary.mid);
  }

  return list;
}

function updateHero() {
  if (exists(elements.heroScore)) {
    elements.heroScore.textContent = state.score === null ? "—" : state.score;
  }
  if (exists(elements.heroCount)) {
    elements.heroCount.textContent = state.hasSearched ? state.filteredProfessions.length : 0;
  }
  if (exists(elements.heroTier)) {
    elements.heroTier.textContent = state.score === null ? "—" : getTier(state.score);
  }
}

function updateSummaryCards() {
  if (!exists(elements.bestProfessionLabel) || !exists(elements.avgStartSalary) || !exists(elements.lowestScoreLabel)) return;

  if (!state.hasSearched || !state.filteredProfessions.length) {
    elements.bestProfessionLabel.textContent = "—";
    elements.avgStartSalary.textContent = "—";
    elements.lowestScoreLabel.textContent = "—";
    return;
  }

  const bestByTopSalary = [...state.filteredProfessions].sort((a, b) => b.salary.top - a.salary.top)[0];
  const avgStart = Math.round(
    state.filteredProfessions.reduce((sum, item) => sum + item.salary.start, 0) / state.filteredProfessions.length
  );
  const lowestScore = [...state.filteredProfessions].sort((a, b) => a.min_score - b.min_score)[0];

  elements.bestProfessionLabel.textContent = `${bestByTopSalary.profession} · ${formatCurrency(bestByTopSalary.salary.top)}`;
  elements.avgStartSalary.textContent = formatCurrency(avgStart);
  elements.lowestScoreLabel.textContent = `${lowestScore.profession} · от ${lowestScore.min_score}`;
}

function renderResults() {
  state.filteredProfessions = getFilteredProfessions();
  updateHero();
  updateSummaryCards();

  if (!exists(elements.results)) return;

  if (!state.hasSearched) {
    elements.results.innerHTML = `
      <div class="panel" style="padding: 20px;">
        <div class="empty-state">
          Введи балл ЕНТ и нажми «Показать варианты», чтобы увидеть подходящие профессии.
        </div>
      </div>
    `;
    return;
  }

  if (!state.filteredProfessions.length) {
    elements.results.innerHTML = `
      <div class="panel" style="padding: 20px;">
        <div class="empty-state">
          По текущим фильтрам профессии не найдены.
          Попробуй изменить балл, предмет или категорию.
        </div>
      </div>
    `;
    return;
  }

  elements.results.innerHTML = state.filteredProfessions
    .map((item) => {
      return `
        <article class="card" data-card-id="${item.id}">
          <div class="card-top">
            <div>
              <div class="card-title">${item.profession}</div>
              <div class="meta-muted">${getCategoryLabel(item.category)}</div>
            </div>
            <div class="badge">от ${item.min_score}</div>
          </div>

          <div class="card-description">${item.description}</div>

          <div class="meta-list">
            <div><strong>Предметы:</strong> ${item.subjects.join(", ")}</div>
            <div><strong>Вузы:</strong> ${item.universities.slice(0, 3).join(", ")}</div>
          </div>

          <div class="salary-grid">
            <div class="salary-box">
              <span>Старт</span>
              <strong>${formatCurrency(item.salary.start)}</strong>
            </div>
            <div class="salary-box">
              <span>Средняя</span>
              <strong>${formatCurrency(item.salary.mid)}</strong>
            </div>
            <div class="salary-box">
              <span>Высокая</span>
              <strong>${formatCurrency(item.salary.top)}</strong>
            </div>
          </div>

          <div class="card-actions">
            <button class="btn btn-primary" data-action="details" data-id="${item.id}">Подробнее</button>
            <button class="btn btn-secondary" data-action="analysis" data-id="${item.id}">AI-анализ</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderProfessionDetail(profession) {
  if (!exists(elements.detailPanel)) return;

  if (!profession) {
    elements.detailPanel.innerHTML = `<div class="empty-state">Пока профессия не выбрана.</div>`;
    return;
  }

  const scoreStatus =
    state.score === null
      ? "Сначала введи свой балл ЕНТ, чтобы увидеть точное совпадение."
      : state.score >= profession.min_score
      ? `Ты уже проходишь по внутреннему порогу: ${state.score} ≥ ${profession.min_score}.`
      : `Пока не хватает ${profession.min_score - state.score} балл(ов) до порога ${profession.min_score}.`;

  elements.detailPanel.innerHTML = `
    <div class="detail-grid">
      <div class="detail-box">
        <h3>${profession.profession}</h3>
        <p class="meta-muted">${profession.description}</p>

        <div class="meta-list">
          <div><strong>Категория:</strong> ${getCategoryLabel(profession.category)}</div>
          <div><strong>Минимальный балл:</strong> ${profession.min_score}</div>
          <div><strong>ЕНТ предметы:</strong> ${profession.subjects.join(", ")}</div>
        </div>
      </div>

      <div class="detail-box">
        <h3>Зарплатная перспектива</h3>
        <div class="salary-grid">
          <div class="salary-box">
            <span>Стартовая</span>
            <strong>${formatCurrency(profession.salary.start)}</strong>
          </div>
          <div class="salary-box">
            <span>Средняя</span>
            <strong>${formatCurrency(profession.salary.mid)}</strong>
          </div>
          <div class="salary-box">
            <span>Высокая</span>
            <strong>${formatCurrency(profession.salary.top)}</strong>
          </div>
        </div>
      </div>

      <div class="detail-box">
        <h3>Подходящие вузы</h3>
        <ul class="detail-list">
          ${profession.universities.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </div>

      <div class="detail-box">
        <h3>Практический вывод</h3>
        <ul class="detail-list">
          <li>${scoreStatus}</li>
          <li>Проверь, подходят ли тебе предметы: ${profession.subjects.join(" + ")}.</li>
          <li>Сравни эту профессию по шансу поступления и зарплатной перспективе.</li>
        </ul>
      </div>
    </div>
  `;
}

function selectProfession(id, scroll = true) {
  const profession = state.professions.find((item) => item.id === id);
  if (!profession) return;

  state.selectedProfession = profession;
  renderProfessionDetail(profession);

  if (scroll && document.getElementById("detail")) {
    document.getElementById("detail").scrollIntoView({ behavior: "smooth" });
  }
}

function buildQuiz() {
  if (!exists(elements.quizQuestions)) return;

  elements.quizQuestions.innerHTML = quizQuestions
    .map((question, index) => {
      return `
        <div class="question">
          <h4>${index + 1}. ${question.text}</h4>
          <div class="options">
            ${question.options
              .map((option) => {
                return `
                  <label class="option">
                    <input type="radio" name="${question.id}" value="${option.category}" />
                    <span>${option.label}</span>
                  </label>
                `;
              })
              .join("")}
          </div>
        </div>
      `;
    })
    .join("");
}

function runQuiz() {
  if (!exists(elements.quizResult)) return;

  const answers = {};

  for (const question of quizQuestions) {
    const checked = document.querySelector(`input[name="${question.id}"]:checked`);

    if (!checked) {
      elements.quizResult.innerHTML = `
        <div class="detail-box">
          <strong>Ответь на все вопросы теста.</strong>
        </div>
      `;
      return;
    }

    answers[question.id] = checked.value;
  }

  const scoreMap = {};

  Object.values(answers).forEach((category) => {
    scoreMap[category] = (scoreMap[category] || 0) + 1;
  });

  const sortedCategories = Object.entries(scoreMap).sort((a, b) => b[1] - a[1]);
  const topCategory = sortedCategories[0][0];
  state.quizTopCategory = topCategory;

  const allByCategory = state.professions.filter((item) => item.category === topCategory);

  let reachable = allByCategory;
  if (state.score !== null) {
    const filtered = allByCategory.filter((item) => state.score >= item.min_score);
    if (filtered.length) {
      reachable = filtered;
    }
  }

  const topSix = reachable.slice(0, 6);

  elements.quizResult.innerHTML = `
    <div class="detail-box">
      <h3>Результат теста</h3>
      <p class="meta-muted">Твоё ведущее направление: <strong>${getCategoryLabel(topCategory)}</strong></p>
      ${
        topSix.length
          ? `
            <ul class="detail-list">
              ${topSix.map((item) => `<li><strong>${item.profession}</strong> — от ${item.min_score} баллов</li>`).join("")}
            </ul>
          `
          : `<p class="meta-muted">Под текущий балл профессий в этой категории пока мало. Есть смысл поднять результат ЕНТ или посмотреть соседние направления.</p>`
      }
    </div>
  `;

  if (topSix[0]) {
    selectProfession(topSix[0].id, false);
  }
}

function resetQuiz() {
  document.querySelectorAll('input[type="radio"]').forEach((input) => {
    input.checked = false;
  });

  state.quizTopCategory = null;

  if (exists(elements.quizResult)) {
    elements.quizResult.innerHTML = "";
  }
}

function getTopReachableProfession() {
  if (!state.filteredProfessions.length) return null;
  return [...state.filteredProfessions].sort((a, b) => b.salary.top - a.salary.top)[0];
}

async function runRecommendation() {
  if (!exists(elements.analysisOutput)) return;

  const profession = state.selectedProfession || getTopReachableProfession();
  const analysisType = exists(elements.analysisType) ? elements.analysisType.value : "career";

  if (!profession && state.score === null) {
    elements.analysisOutput.textContent = "Сначала введи балл ЕНТ или выбери профессию.";
    return;
  }

  elements.analysisOutput.textContent = "Формируем персональный разбор...";

  try {
    const response = await fetch(AI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        analysisType,
        score: state.score,
        quizCategory: state.quizTopCategory,
        profession
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Ошибка AI-анализа");
    }

    elements.analysisOutput.textContent = data.text || "Ответ не получен.";
  } catch (error) {
    console.error(error);
    elements.analysisOutput.textContent =
      "Сейчас AI-анализ недоступен. Проверь сервер или ключ Gemini.";
  }
}

function handleScoreSubmit() {
  if (!exists(elements.entScoreInput)) return;

  const result = validateScore(elements.entScoreInput.value);

  if (!result.ok) {
    alert(result.message);
    return;
  }

  state.score = result.score;
  state.hasSearched = true;
  renderResults();

  if (state.filteredProfessions[0]) {
    selectProfession(state.filteredProfessions[0].id, false);
  }

  if (document.getElementById("finder")) {
    document.getElementById("finder").scrollIntoView({ behavior: "smooth" });
  }
}

function handleResultsClick(event) {
  const button = event.target.closest("button[data-action]");
  const card = event.target.closest("[data-card-id]");

  if (!button && card && !event.target.closest("button")) {
    selectProfession(card.dataset.cardId);
    return;
  }

  if (!button) return;

  const action = button.dataset.action;
  const id = button.dataset.id;

  if (action === "details") {
    selectProfession(id);
  }

  if (action === "analysis") {
    selectProfession(id, false);
    runRecommendation();
  }
}

function bindEvents() {
  if (exists(elements.entRangeInput)) {
    elements.entRangeInput.addEventListener("input", () => syncRangeAndInput(true));
  }

  if (exists(elements.entScoreInput)) {
    elements.entScoreInput.addEventListener("input", () => syncRangeAndInput(false));
    elements.entScoreInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        handleScoreSubmit();
      }
    });
  }

  if (exists(elements.startBtn)) {
    elements.startBtn.addEventListener("click", handleScoreSubmit);
  }

  if (exists(elements.searchInput)) {
    elements.searchInput.addEventListener("input", renderResults);
  }

  if (exists(elements.categoryFilter)) {
    elements.categoryFilter.addEventListener("change", renderResults);
  }

  if (exists(elements.subjectFilter)) {
    elements.subjectFilter.addEventListener("change", renderResults);
  }

  if (exists(elements.sortFilter)) {
    elements.sortFilter.addEventListener("change", renderResults);
  }

  if (exists(elements.results)) {
    elements.results.addEventListener("click", handleResultsClick);
  }

  if (exists(elements.loadTopBtn)) {
    elements.loadTopBtn.addEventListener("click", () => {
      const profession = getTopReachableProfession();

      if (!profession) {
        alert("Сначала введи балл ЕНТ.");
        return;
      }

      selectProfession(profession.id);
    });
  }

  if (exists(elements.quizBtn)) {
    elements.quizBtn.addEventListener("click", runQuiz);
  }

  if (exists(elements.quizResetBtn)) {
    elements.quizResetBtn.addEventListener("click", resetQuiz);
  }

  if (exists(elements.analysisBtn)) {
    elements.analysisBtn.addEventListener("click", runRecommendation);
  }
}

async function init() {
  try {
    await loadProfessions();
    buildSubjectFilter();
    buildQuiz();

    if (exists(elements.entScoreInput) && exists(elements.entRangeInput)) {
      elements.entScoreInput.value = "85";
      elements.entRangeInput.value = "85";
      syncRangeAndInput(true);
    }

    renderResults();
    bindEvents();
  } catch (error) {
    console.error(error);

    document.body.innerHTML = `
      <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:#08111f;color:#fff;font-family:Inter,sans-serif;">
        <div style="max-width:720px;background:rgba(15,24,44,.95);border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:28px;box-shadow:0 20px 50px rgba(0,0,0,.35);">
          <h2 style="margin-top:0;">Не удалось загрузить данные</h2>
          <p style="color:#b8c4df;line-height:1.7;">
            Проверь файл <strong>data/professions.json</strong> и повтори загрузку сайта.
          </p>
        </div>
      </div>
    `;
  }
}

init();
