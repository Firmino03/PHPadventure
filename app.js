// PHPadventure — lógica da aplicação (vanilla JS, sem build step)

const app = document.getElementById("app");
const topicNav = document.getElementById("topicNav");
const menuToggle = document.getElementById("menuToggle");
const modal = document.getElementById("resultModal");
const closeModalBtn = document.getElementById("closeModal");
const nextBtn = document.getElementById("nextBtn");
const reactionImg = document.getElementById("reactionImg");
const reactionTitle = document.getElementById("reactionTitle");
const reactionText = document.getElementById("reactionText");
const curiosityText = document.getElementById("curiosityText");

let state = {
  mode: null,        // "topic" | "mixed"
  topicId: null,     // set in "topic" mode, used for nav highlight + result screen
  queue: [],         // [{ topicId, qIndex }] — the questions for this run, in play order
  index: 0,          // position within queue
  selected: null,    // selected option index for current question
  answered: false,
  correctCount: 0,
  topicStats: {},    // mixed mode only: topicId -> { correct, total }
};

// ---------- Navegação ----------

function buildNav() {
  topicNav.innerHTML = "";
  TOPICS.forEach((t) => {
    const btn = document.createElement("button");
    btn.className = "topic-btn";
    btn.dataset.topic = t.id;
    btn.innerHTML = `<span class="btn-icon">${t.icon}</span><span>${t.label}</span>`;
    btn.addEventListener("click", () => {
      renderTopicGuide(t.id);
      topicNav.classList.remove("open");
    });
    topicNav.appendChild(btn);
  });
}

function setActiveNav(topicId) {
  document.querySelectorAll(".topic-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.topic === topicId);
  });
}

document.querySelector('[data-nav="home"]').addEventListener("click", renderHome);
menuToggle.addEventListener("click", () => topicNav.classList.toggle("open"));

// ---------- Home ----------

function challengeSize() {
  return TOPICS.reduce((sum, t) => sum + Math.max(1, Math.round(QUESTIONS[t.id].length / 4)), 0);
}

function renderHome() {
  setActiveNav(null);
  const totalQuestions = Object.values(QUESTIONS).reduce((sum, arr) => sum + arr.length, 0);

  app.innerHTML = `
    <div class="bento-grid">

      <section class="bento-cell hero-cell">
        <span class="eyebrow">Guia de estudos interativo</span>
        <h1>Bem-vindo ao PHPadventure</h1>
        <p>
          Um jeito de revisar Laravel, PHP e MySQL antes da prova, respondendo às perguntas
          que o professor passou — trilha por trilha, no seu ritmo. Escolha um assunto abaixo
          e comece a estudar.
        </p>
      </section>

      <section class="bento-cell hero-image-cell">
        <img src="assets/elephant-happy.png" alt="Elefante do PHP feliz, mascote do site" />
      </section>

      <section class="bento-cell stat-cell">
        <span class="stat-number">${TOPICS.length}</span>
        <span class="stat-label">trilhas de estudo</span>
      </section>

      <section class="bento-cell stat-cell stat-cell-accent">
        <span class="stat-number">${totalQuestions}</span>
        <span class="stat-label">perguntas no total</span>
      </section>

      <section class="bento-cell challenge-cell">
        <div class="challenge-info">
          <span class="challenge-eyebrow">⚡ Prática alternativa</span>
          <h3>Desafio Relâmpago</h3>
          <p>
            Um mix de ${challengeSize()} perguntas puxando mais dos assuntos com maior peso —
            ORM Eloquent, Views &amp; Blade, Models e Seeders &amp; Factories — fora da ordem
            das trilhas, pra testar o que ficou de tudo.
          </p>
        </div>
        <button class="btn btn-primary" id="startChallengeBtn">⚡ Começar desafio</button>
      </section>

      <h2 class="bento-section-title">Antes de plantar, vamos conhecer o terreno</h2>

      <section class="bento-cell story-cell">
        <h3>🐘 Você sabe o que é PHP?</h3>
        <p>
          PHP é a linguagem que roda por trás da página: é ela quem lê o pedido do navegador,
          conversa com o banco de dados e decide o que vai aparecer na tela.
        </p>
      </section>

      <section class="bento-cell story-cell">
        <h3>🧰 E o Laravel?</h3>
        <p>
          Laravel é um <em>framework</em> feito em PHP: convenções e ferramentas prontas
          (rotas, Models, Migrations, Blade...) para organizar o código em vez de espalhar
          tudo pelo projeto.
        </p>
      </section>

      <section class="bento-cell story-cell">
        <h3>🪣 E o MySQL?</h3>
        <p>
          MySQL é o banco de dados onde tudo fica guardado. O Laravel, através do Eloquent,
          busca e organiza o que for preciso sem você escrever SQL na mão o tempo todo.
        </p>
      </section>

      <h2 class="bento-section-title">Escolha uma trilha para estudar</h2>

      ${TOPICS.map(
        (t) => `
        <button class="bento-cell topic-card" data-topic="${t.id}">
          <div class="tc-icon">${t.icon}</div>
          <div class="tc-label">${t.label}</div>
          <div class="tc-count">${QUESTIONS[t.id].length} perguntas</div>
        </button>`
      ).join("")}

      <h2 class="bento-section-title">🎥 Vídeos por trilha</h2>

      <section class="bento-cell video-carousel-cell">
        <div class="video-carousel-track">
          ${TOPICS.filter((t) => t.video)
            .map(
              (t) => `
            <button class="video-card" data-topic="${t.id}">
              <img src="https://img.youtube.com/vi/${t.video}/hqdefault.jpg" alt="Vídeo sobre ${t.label}" loading="lazy" />
              <span class="video-card-label">${t.icon} ${t.label}</span>
            </button>`
            )
            .join("")}
        </div>
      </section>

    </div>
  `;

  app.querySelectorAll(".topic-card").forEach((card) => {
    card.addEventListener("click", () => renderTopicGuide(card.dataset.topic));
  });

  app.querySelectorAll(".video-card").forEach((card) => {
    card.addEventListener("click", () => renderTopicGuide(card.dataset.topic));
  });

  document.getElementById("startChallengeBtn").addEventListener("click", startMixedChallenge);
}

// ---------- Quiz ----------

function shuffle(n) {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ---------- Guia da trilha (card + vídeo, antes do quiz) ----------

function renderTopicGuide(topicId) {
  const topic = TOPICS.find((t) => t.id === topicId);
  const guide = GUIDES[topicId];
  if (!topic || !guide) return startQuiz(topicId);

  setActiveNav(topicId);

  const videoBlock = topic.video
    ? `
      <section class="panel guide-video-panel">
        <h3 class="guide-video-title">🎥 Vídeoaula</h3>
        <div class="video-embed">
          <iframe
            src="https://www.youtube.com/embed/${topic.video}"
            title="Vídeo sobre ${topic.label}"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </section>`
    : `
      <section class="panel guide-video-panel guide-video-empty">
        <h3 class="guide-video-title">🎥 Vídeoaula</h3>
        <p>Ainda sem vídeo pra essa trilha — em breve!</p>
      </section>`;

  app.innerHTML = `
    <section class="panel guide-card">
      <div class="guide-head">
        <span class="guide-icon">${topic.icon}</span>
        <h2>${topic.label}</h2>
      </div>
      <p class="guide-intro">${guide.intro}</p>
      <div class="guide-example">
        <p class="guide-example-label">📌 Exemplo</p>
        <p>${guide.example}</p>
      </div>
      <div class="guide-benefits">
        <p class="guide-benefits-label">✅ Benefícios</p>
        <ul>
          ${guide.benefits.map((b) => `<li>${b}</li>`).join("")}
        </ul>
      </div>
    </section>

    ${videoBlock}

    <div class="guide-actions">
      <button class="btn btn-secondary" id="backHomeBtn">← Voltar ao início</button>
      <button class="btn btn-primary" id="startQuizBtn">Ir pro quiz →</button>
    </div>
  `;

  document.getElementById("backHomeBtn").addEventListener("click", renderHome);
  document.getElementById("startQuizBtn").addEventListener("click", () => startQuiz(topicId));
}

function startQuiz(topicId) {
  const questions = QUESTIONS[topicId];
  if (!questions) return renderHome();

  state = {
    mode: "topic",
    topicId,
    queue: shuffle(questions.length).map((qi) => ({ topicId, qIndex: qi })),
    index: 0,
    selected: null,
    answered: false,
    correctCount: 0,
    topicStats: {},
  };
  setActiveNav(topicId);
  renderQuestion();
}

// Monta uma fila misturando trilhas, puxando mais perguntas dos assuntos
// com mais peso (mais perguntas cadastradas) e pelo menos 1 de cada trilha.
function buildMixedQueue() {
  const picks = TOPICS.flatMap((t) => {
    const count = QUESTIONS[t.id].length;
    const size = Math.max(1, Math.round(count / 4));
    return shuffle(count)
      .slice(0, size)
      .map((qi) => ({ topicId: t.id, qIndex: qi }));
  });
  return shuffle(picks.length).map((i) => picks[i]);
}

function startMixedChallenge() {
  state = {
    mode: "mixed",
    topicId: null,
    queue: buildMixedQueue(),
    index: 0,
    selected: null,
    answered: false,
    correctCount: 0,
    topicStats: {},
  };
  setActiveNav(null);
  renderQuestion();
}

function currentTopic() {
  const entry = state.queue[state.index];
  return TOPICS.find((t) => t.id === entry.topicId);
}

function currentQuestion() {
  const entry = state.queue[state.index];
  return QUESTIONS[entry.topicId][entry.qIndex];
}

function renderQuestion() {
  const topic = currentTopic();
  const q = currentQuestion();
  const total = state.queue.length;
  const pct = Math.round((state.index / total) * 100);
  const letters = ["A", "B", "C", "D"];
  const headTitle = state.mode === "mixed" ? "⚡ Desafio Relâmpago" : `${topic.icon} ${topic.label}`;

  app.innerHTML = `
    <section class="panel">
      <div class="quiz-head">
        <h2>${headTitle}</h2>
        <span class="quiz-progress">Pergunta ${state.index + 1} de ${total} · Acertos: ${state.correctCount}</span>
      </div>
      <div class="progress-bar"><div style="width:${pct}%"></div></div>

      ${state.mode === "mixed" ? `<span class="mixed-topic-tag">${topic.icon} ${topic.label}</span>` : ""}

      <p class="question-text">${q.question}</p>

      <div class="options" id="optionsList">
        ${q.options
          .map(
            (opt, i) => `
          <button class="option-btn" data-index="${i}">
            <span class="letter">${letters[i]}</span>
            <span>${opt}</span>
          </button>`
          )
          .join("")}
      </div>

      <div class="quiz-actions">
        <button class="btn btn-secondary" id="backHomeBtn">← Voltar ao início</button>
        <button class="btn btn-primary" id="submitBtn" disabled>Enviar resposta</button>
      </div>
    </section>
  `;

  document.getElementById("backHomeBtn").addEventListener("click", renderHome);

  const optionButtons = app.querySelectorAll(".option-btn");
  const submitBtn = document.getElementById("submitBtn");

  optionButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      optionButtons.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      state.selected = Number(btn.dataset.index);
      submitBtn.disabled = false;
    });
  });

  submitBtn.addEventListener("click", submitAnswer);
}

function submitAnswer() {
  const q = currentQuestion();
  const isCorrect = state.selected === q.correct;
  if (isCorrect) state.correctCount += 1;

  if (state.mode === "mixed") {
    const topic = currentTopic();
    const stats = state.topicStats[topic.id] || { correct: 0, total: 0 };
    stats.total += 1;
    if (isCorrect) stats.correct += 1;
    state.topicStats[topic.id] = stats;
  }

  openResultModal(isCorrect, q);
}

function openResultModal(isCorrect, q) {
  if (isCorrect) {
    reactionImg.src = "assets/elephant-happy.png";
    reactionImg.alt = "Elefante do PHP feliz, comemorando a resposta certa";
    reactionTitle.textContent = "Certinho! 🎉";
    reactionTitle.className = "reaction-title correct";
    reactionText.textContent = "Você acertou essa. Segue a curiosidade da questão:";
  } else {
    reactionImg.src = "assets/elephant-sad.png";
    reactionImg.alt = "Elefante do PHP triste, pois a resposta estava errada";
    reactionTitle.textContent = "Quase lá...";
    reactionTitle.className = "reaction-title wrong";
    reactionText.textContent = `Essa não foi. A resposta certa era: "${q.options[q.correct]}"`;
  }
  curiosityText.textContent = q.curiosity;
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}

function goToNext() {
  closeModal();
  state.index += 1;
  if (state.index >= state.queue.length) {
    renderResultScreen();
  } else {
    state.selected = null;
    renderQuestion();
  }
}

closeModalBtn.addEventListener("click", closeModal);
nextBtn.addEventListener("click", goToNext);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

function renderResultScreen() {
  const total = state.queue.length;
  const good = state.correctCount / total >= 0.7;

  if (state.mode === "mixed") {
    const weakTopics = Object.entries(state.topicStats)
      .map(([id, s]) => ({ id, ...s, pct: s.correct / s.total }))
      .filter((s) => s.pct < 0.7)
      .sort((a, b) => a.pct - b.pct);

    const weakListHtml = weakTopics
      .map((s) => {
        const t = TOPICS.find((tt) => tt.id === s.id);
        return `<li>${t.icon} ${t.label} — ${s.correct}/${s.total}</li>`;
      })
      .join("");

    app.innerHTML = `
      <section class="panel result-screen">
        <img src="assets/elephant-${good ? "happy" : "sad"}.png" alt="Elefante do PHP" />
        <h2>Desafio Relâmpago concluído!</h2>
        <p class="score-line">${state.correctCount} de ${total} certas</p>
        <p>${good ? "Ótimo mix! Sua base nos principais assuntos está sólida." : "Deu pra ver onde apertar mais antes da prova."}</p>
        ${
          weakListHtml
            ? `<div class="weak-topics">
                <p class="weak-topics-label">Vale revisar:</p>
                <ul>${weakListHtml}</ul>
              </div>`
            : ""
        }
        <div class="result-actions">
          <button class="btn btn-primary" id="retryBtn">🔁 Refazer desafio</button>
          <button class="btn btn-secondary" id="homeBtn">🏡 Ver todas as trilhas</button>
        </div>
      </section>
    `;

    document.getElementById("retryBtn").addEventListener("click", startMixedChallenge);
    document.getElementById("homeBtn").addEventListener("click", renderHome);
    return;
  }

  const topic = TOPICS.find((t) => t.id === state.topicId);

  app.innerHTML = `
    <section class="panel result-screen">
      <img src="assets/elephant-${good ? "happy" : "sad"}.png" alt="Elefante do PHP" />
      <h2>Trilha de ${topic.label} concluída!</h2>
      <p class="score-line">${state.correctCount} de ${total} certas</p>
      <p>${good ? "Colheita boa! Você mandou bem nessa trilha." : "Vale a pena revisar esse assunto de novo antes da prova."}</p>
      <div class="result-actions">
        <button class="btn btn-primary" id="retryBtn">🔁 Refazer trilha</button>
        <button class="btn btn-secondary" id="homeBtn">🏡 Ver todas as trilhas</button>
      </div>
    </section>
  `;

  document.getElementById("retryBtn").addEventListener("click", () => startQuiz(state.topicId));
  document.getElementById("homeBtn").addEventListener("click", renderHome);
}

// ---------- Init ----------

buildNav();
renderHome();
