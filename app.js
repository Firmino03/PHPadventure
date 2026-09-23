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
  topicId: null,
  order: [],       // shuffled question indices for the current topic
  index: 0,         // position within order
  selected: null,   // selected option index for current question
  answered: false,
  correctCount: 0,
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
      startQuiz(t.id);
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

function renderHome() {
  setActiveNav(null);
  app.innerHTML = `
    <section class="panel hero">
      <div class="hero-text">
        <span class="eyebrow">Guia de estudos interativo</span>
        <h1>Bem-vindo à fazenda do PHP 🌾</h1>
        <p>
          Este é o <strong>PHPadventure</strong>: um jeito de revisar Laravel, PHP e MySQL
          antes da prova, respondendo às perguntas que o professor passou — trilha por trilha,
          no seu ritmo. Escolha um assunto no cabeçalho e comece a colher conhecimento!
        </p>
      </div>
      <div class="hero-elephant">
        <img src="assets/elephant-happy.png" alt="Elefante do PHP feliz, mascote do site" />
      </div>
    </section>

    <section class="panel story" style="margin-top:18px;">
      <h2 style="margin-top:0;color:var(--wood-dark);">Antes de plantar, vamos conhecer o terreno</h2>

      <div class="story-card">
        <h3>🐘 Você sabe o que é PHP?</h3>
        <p>
          PHP é a linguagem que roda por trás da página: é ela quem lê o pedido do navegador,
          conversa com o banco de dados e decide o que vai aparecer na tela. Pense nela como
          o fazendeiro que cuida de tudo nos bastidores antes de entregar a colheita pronta
          para quem está do outro lado da cerca.
        </p>
      </div>

      <div class="story-card">
        <h3>🧰 E o Laravel?</h3>
        <p>
          Laravel é um <em>framework</em> feito em PHP — ou seja, uma fazenda já organizada,
          com celeiro, cercas e trilhas prontas, para você não precisar erguer tudo do zero.
          Ele te dá convenções e ferramentas (rotas, Models, Migrations, Blade...) para organizar
          o código em vez de espalhar tudo pelo campo.
        </p>
      </div>

      <div class="story-card">
        <h3>🪣 E o MySQL?</h3>
        <p>
          MySQL é o banco de dados: o celeiro onde tudo fica guardado — livros, autores,
          categorias, pedidos. O Laravel (através do Eloquent) é quem vai até esse celeiro
          buscar e organizar o que for preciso, sem você precisar escrever SQL na mão o tempo
          todo.
        </p>
      </div>
    </section>

    <section class="panel" style="margin-top:18px;">
      <h2 style="margin-top:0;color:var(--wood-dark);">Escolha uma trilha para estudar</h2>
      <div class="topics-grid">
        ${TOPICS.map(
          (t) => `
          <button class="topic-card" data-topic="${t.id}">
            <div class="tc-icon">${t.icon}</div>
            <div class="tc-label">${t.label}</div>
            <div class="tc-count">${QUESTIONS[t.id].length} perguntas</div>
          </button>`
        ).join("")}
      </div>
    </section>
  `;

  app.querySelectorAll(".topic-card").forEach((card) => {
    card.addEventListener("click", () => startQuiz(card.dataset.topic));
  });
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

function startQuiz(topicId) {
  const questions = QUESTIONS[topicId];
  if (!questions) return renderHome();

  state = {
    topicId,
    order: shuffle(questions.length),
    index: 0,
    selected: null,
    answered: false,
    correctCount: 0,
  };
  setActiveNav(topicId);
  renderQuestion();
}

function currentTopic() {
  return TOPICS.find((t) => t.id === state.topicId);
}

function currentQuestion() {
  const qi = state.order[state.index];
  return QUESTIONS[state.topicId][qi];
}

function renderQuestion() {
  const topic = currentTopic();
  const q = currentQuestion();
  const total = state.order.length;
  const pct = Math.round((state.index / total) * 100);
  const letters = ["A", "B", "C", "D"];

  app.innerHTML = `
    <section class="panel">
      <div class="quiz-head">
        <h2>${topic.icon} ${topic.label}</h2>
        <span class="quiz-progress">Pergunta ${state.index + 1} de ${total} · Acertos: ${state.correctCount}</span>
      </div>
      <div class="progress-bar"><div style="width:${pct}%"></div></div>

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
  if (state.index >= state.order.length) {
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
  const topic = currentTopic();
  const total = state.order.length;
  const good = state.correctCount / total >= 0.7;

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
