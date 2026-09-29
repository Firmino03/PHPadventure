// PHPadventure — lógica da aplicação (vanilla JS, sem build step)

const app = document.getElementById("app");
const topicNav = document.getElementById("topicNav");
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

const pad = (n) => String(n).padStart(2, "0");

function show(html) {
  app.innerHTML = html;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ---------- Navegação ----------

function buildNav() {
  topicNav.innerHTML = "";
  TOPICS.forEach((t) => {
    const btn = document.createElement("button");
    btn.className = "nav-link";
    btn.dataset.topic = t.id;
    btn.textContent = t.label;
    btn.addEventListener("click", () => renderTopicGuide(t.id));
    topicNav.appendChild(btn);
  });
}

function setActiveNav(topicId) {
  document.querySelectorAll(".nav-link").forEach((b) => {
    b.classList.toggle("ativo", b.dataset.topic === topicId);
  });
}

document.querySelector('[data-nav="home"]').addEventListener("click", renderHome);

// ---------- Modal de vídeo ----------

const videoModal = document.getElementById("modal-video");
const videoIframe = document.getElementById("modal-iframe");
const videoTitle = document.getElementById("modal-titulo-texto");

function openVideo(id, title) {
  videoIframe.src = `https://www.youtube.com/embed/${id}?autoplay=1`;
  videoTitle.textContent = title;
  videoModal.classList.add("aberto");
  document.body.style.overflow = "hidden";
}

function closeVideo() {
  videoIframe.src = "";
  videoModal.classList.remove("aberto");
  document.body.style.overflow = "";
}

document.getElementById("modal-fechar").addEventListener("click", closeVideo);
videoModal.addEventListener("click", (e) => { if (e.target === videoModal) closeVideo(); });
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  closeVideo();
  closeModal();
});

// ---------- Home ----------

function challengeSize() {
  return TOPICS.reduce((sum, t) => sum + Math.max(1, Math.round(QUESTIONS[t.id].length / 4)), 0);
}

function renderHome() {
  setActiveNav(null);
  const totalQuestions = Object.values(QUESTIONS).reduce((sum, arr) => sum + arr.length, 0);
  const videoTopics = TOPICS.filter((t) => t.video);

  show(`
    <section class="home-hero animar">
      <img class="hero-mascote" src="assets/elephant-happy.png" alt="Elefante do PHP feliz, mascote do site" />
      <div class="hero-badge">// Guia de estudos interativo</div>
      <h1 class="hero-titulo">PHPadventure</h1>
      <p class="hero-descricao">
        Um jeito de revisar <strong>Laravel, PHP e MySQL</strong> antes da prova, respondendo às
        perguntas que o professor passou — trilha por trilha, no seu ritmo.
      </p>
      <p class="hero-sub">${TOPICS.length} trilhas · ${totalQuestions} perguntas</p>
      <div class="hero-cta-grid">
        <button class="btn-primario" id="startBtn">▶ Começar agora</button>
        <button class="btn-secundario" id="videosBtn">🎬 Ver videoaulas</button>
      </div>
    </section>

    <section class="home-beneficios">
      <div class="home-secao-label">// Antes de plantar</div>
      <h2 class="home-secao-titulo">Vamos conhecer o terreno</h2>
      <p class="home-secao-sub">Três peças que aparecem em todas as trilhas. Entender o papel de cada uma já facilita o resto do estudo.</p>
      <div class="beneficios-grid">
        <div class="beneficio-card">
          <div class="beneficio-icone">🐘</div>
          <div class="beneficio-titulo">Você sabe o que é PHP?</div>
          <p class="beneficio-texto">
            PHP é a linguagem que roda por trás da página: é ela quem lê o pedido do navegador,
            conversa com o banco de dados e decide o que vai aparecer na tela.
          </p>
        </div>
        <div class="beneficio-card">
          <div class="beneficio-icone">🧰</div>
          <div class="beneficio-titulo">E o Laravel?</div>
          <p class="beneficio-texto">
            Laravel é um <em>framework</em> feito em PHP: convenções e ferramentas prontas
            (rotas, Models, Migrations, Blade...) para organizar o código em vez de espalhar
            tudo pelo projeto.
          </p>
        </div>
        <div class="beneficio-card">
          <div class="beneficio-icone">🪣</div>
          <div class="beneficio-titulo">E o MySQL?</div>
          <p class="beneficio-texto">
            MySQL é o banco de dados onde tudo fica guardado. O Laravel, através do Eloquent,
            busca e organiza o que for preciso sem você escrever SQL na mão o tempo todo.
          </p>
        </div>
      </div>
    </section>

    <section class="home-topicos">
      <div class="home-secao-label">// Conteúdo do guia</div>
      <h2 class="home-secao-titulo">Escolha uma trilha</h2>
      <p class="home-secao-sub">Clique em qualquer trilha para ver o resumo, a videoaula e as perguntas.</p>
      <div class="topicos-grid">
        ${TOPICS.map(
          (t, i) => `
          <button class="topico-card" data-topic="${t.id}">
            <span class="topico-num">${pad(i + 1)}</span>
            <div>
              <div class="topico-nome">${t.label}</div>
              <div class="topico-desc">${QUESTIONS[t.id].length} perguntas</div>
            </div>
          </button>`
        ).join("")}
      </div>
    </section>

    <section class="home-desafio">
      <div class="home-secao-label">// Prática alternativa</div>
      <h2 class="home-secao-titulo">Desafio Relâmpago</h2>
      <div class="desafio-card">
        <div class="desafio-info">
          <h3>⚡ ${challengeSize()} perguntas misturadas</h3>
          <p>
            Puxa mais dos assuntos com maior peso — ORM Eloquent, Views &amp; Blade, Models e
            Seeders &amp; Factories — fora da ordem das trilhas, pra testar o que ficou de tudo.
          </p>
        </div>
        <button class="btn-primario" id="startChallengeBtn">⚡ Começar desafio</button>
      </div>
    </section>

    <section class="home-videos" id="videos-section">
      <div class="home-secao-label">// Videoaulas</div>
      <h2 class="home-secao-titulo">Vídeos por trilha</h2>
      <p class="home-secao-sub">Clique para assistir sem sair da página.</p>
      <div class="carousel-wrapper">
        <button class="carousel-btn carousel-btn-prev" id="carousel-prev" aria-label="Anterior">‹</button>
        <div class="carousel-trilho" id="carousel-trilho">
          ${videoTopics
            .map(
              (t, i) => `
            <button class="video-card" data-video-id="${t.video}" data-video-titulo="${t.label}">
              <div class="video-thumb">
                <img src="https://img.youtube.com/vi/${t.video}/mqdefault.jpg" alt="Vídeo sobre ${t.label}" loading="lazy" />
                <div class="video-thumb-overlay"><div class="play-icon">▶</div></div>
              </div>
              <div class="video-info">
                <div class="video-numero">Aula ${pad(i + 1)}</div>
                <div class="video-titulo">${t.label}</div>
              </div>
            </button>`
            )
            .join("")}
        </div>
        <button class="carousel-btn carousel-btn-next" id="carousel-next" aria-label="Próximo">›</button>
      </div>
    </section>
  `);

  app.querySelectorAll(".topico-card").forEach((card) => {
    card.addEventListener("click", () => renderTopicGuide(card.dataset.topic));
  });

  app.querySelectorAll(".video-card").forEach((card) => {
    card.addEventListener("click", () => openVideo(card.dataset.videoId, card.dataset.videoTitulo));
  });

  const trilho = document.getElementById("carousel-trilho");
  document.getElementById("carousel-prev").addEventListener("click", () => trilho.scrollBy({ left: -320, behavior: "smooth" }));
  document.getElementById("carousel-next").addEventListener("click", () => trilho.scrollBy({ left: 320, behavior: "smooth" }));

  document.getElementById("startBtn").addEventListener("click", () => renderTopicGuide(TOPICS[0].id));
  document.getElementById("videosBtn").addEventListener("click", () => {
    document.getElementById("videos-section").scrollIntoView({ behavior: "smooth" });
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

// ---------- Bloco de código (com destaque simples de sintaxe) ----------

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const CODE_TOKENS = new RegExp(
  [
    "(\\{\\{--[\\s\\S]*?--\\}\\})",                   // 1 comentário Blade
    "(\\/\\/[^\\n]*|#[^\\n]*)",                        // 2 comentário // ou #
    "('(?:[^'\\\\]|\\\\.)*')",                         // 3 string
    "(\\$[A-Za-z_]\\w*)",                              // 4 variável PHP
    "(@[A-Za-z]+)",                                    // 5 diretiva Blade
    "\\b(public|function|return|class|extends|use|foreach|as|fn|new|static|null|true|false|php|artisan)\\b", // 6
  ].join("|"),
  "g"
);

function highlight(code) {
  return escapeHtml(code).replace(CODE_TOKENS, (m, blade, comment, str, variable, directive, keyword) => {
    if (blade || comment) return `<span class="comentario">${m}</span>`;
    if (str) return `<span class="texto-string">${m}</span>`;
    if (variable) return `<span class="tipo">${m}</span>`;
    if (directive) return `<span class="funcao">${m}</span>`;
    if (keyword) return `<span class="palavra-chave">${m}</span>`;
    return m;
  });
}

function codeBlock(file, code) {
  return `
    <div class="bloco-codigo">
      <div class="bloco-codigo-cabecalho">
        <div class="dots"><div class="dot dot-vermelho"></div><div class="dot dot-amarelo"></div><div class="dot dot-verde"></div></div>
        <span class="bloco-codigo-titulo">${escapeHtml(file)}</span>
      </div>
      <pre>${highlight(code)}</pre>
    </div>`;
}

// ---------- Guia da trilha (resumo + vídeo, antes do quiz) ----------

function renderTopicGuide(topicId) {
  const topic = TOPICS.find((t) => t.id === topicId);
  const guide = GUIDES[topicId];
  if (!topic || !guide) return startQuiz(topicId);

  setActiveNav(topicId);
  const num = pad(TOPICS.indexOf(topic) + 1);

  const videoBlock = topic.video
    ? `
      <div class="bloco-codigo">
        <div class="bloco-codigo-cabecalho">
          <div class="dots"><div class="dot dot-vermelho"></div><div class="dot dot-amarelo"></div><div class="dot dot-verde"></div></div>
          <span class="bloco-codigo-titulo">videoaula-${topic.id}</span>
        </div>
        <div class="video-embed">
          <iframe
            src="https://www.youtube.com/embed/${topic.video}"
            title="Vídeo sobre ${topic.label}"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>`
    : `
      <div class="bloco-codigo">
        <div class="bloco-codigo-cabecalho">
          <div class="dots"><div class="dot dot-vermelho"></div><div class="dot dot-amarelo"></div><div class="dot dot-verde"></div></div>
          <span class="bloco-codigo-titulo">videoaula-${topic.id}</span>
        </div>
        <p class="video-vazio">// Ainda sem vídeo pra essa trilha — em breve!</p>
      </div>`;

  show(`
    <div class="secao-hero secao-hero-guia animar">
      <div class="secao-hero-texto">
        <div class="secao-breadcrumb">
          <a id="crumbHome">Início</a>
          <span>/</span>
          <span>${topic.label}</span>
        </div>
        <div class="secao-num">${num}</div>
        <h1 class="secao-titulo"><span class="titulo-icone">${topic.icon}</span> ${topic.label}</h1>
      </div>
      <div class="secao-hero-acao">
        <button class="btn-primario btn-quiz" id="startQuizBtn">Ir pro quiz →</button>
      </div>
    </div>

    <div class="secao-conteudo animar">
      <div class="nivel-bloco">
        <div class="nivel-cabecalho">
          <span class="nivel-badge simples">● Resumo</span>
          <span class="nivel-titulo">O que é</span>
        </div>
        <p>${guide.intro}</p>
        ${guide.analogy ? `<div class="caixa-info"><div class="icone">💡</div><p><strong>Pensando no dia a dia:</strong> ${guide.analogy}</p></div>` : ""}
      </div>

      ${guide.concepts ? `
      <div class="nivel-bloco">
        <div class="nivel-cabecalho">
          <span class="nivel-badge lilas">● Conceitos</span>
          <span class="nivel-titulo">Termos-chave para a prova</span>
        </div>
        <div class="grade-cards">
          ${guide.concepts.map((c) => `<div class="card"><h3>${c.t}</h3><p>${c.d}</p></div>`).join("")}
        </div>
      </div>` : ""}

      <div class="nivel-bloco">
        <div class="nivel-cabecalho">
          <span class="nivel-badge medio">● Exemplo</span>
          <span class="nivel-titulo">Na prática</span>
        </div>
        <div class="caixa-info"><div class="icone">📌</div><p>${guide.example}</p></div>
        ${(guide.snippets || []).map((sn) => codeBlock(sn.file, sn.code)).join("")}
      </div>

      ${guide.pitfalls ? `
      <div class="nivel-bloco">
        <div class="nivel-cabecalho">
          <span class="nivel-badge alerta">● Atenção</span>
          <span class="nivel-titulo">Pegadinhas comuns</span>
        </div>
        <ul class="lista-itens lista-aviso">
          ${guide.pitfalls.map((p) => `<li>${p}</li>`).join("")}
        </ul>
      </div>` : ""}

      <div class="nivel-bloco">
        <div class="nivel-cabecalho">
          <span class="nivel-badge lilas">● Benefícios</span>
          <span class="nivel-titulo">Por que isso importa</span>
        </div>
        <ul class="lista-itens">
          ${guide.benefits.map((b) => `<li>${b}</li>`).join("")}
        </ul>
      </div>

      <div class="nivel-bloco">
        <div class="nivel-cabecalho">
          <span class="nivel-badge lilas">● Videoaula</span>
          <span class="nivel-titulo">Assista antes do quiz</span>
        </div>
        ${videoBlock}
      </div>
    </div>

    <div class="secao-footer">
      <span class="secao-footer-texto">// ${num} · ${topic.label}</span>
      <div class="secao-footer-acoes">
        <button class="btn-voltar" id="backHomeBtn">← Voltar ao início</button>
      </div>
    </div>
  `);

  document.getElementById("crumbHome").addEventListener("click", renderHome);
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
  const isMixed = state.mode === "mixed";
  const headTitle = isMixed ? `<span class="titulo-icone">⚡</span> Desafio Relâmpago` : `<span class="titulo-icone">${topic.icon}</span> ${topic.label}`;

  show(`
    <div class="secao-hero animar">
      <div class="secao-breadcrumb">
        <a id="crumbHome">Início</a>
        <span>/</span>
        <span>${isMixed ? "Desafio Relâmpago" : topic.label}</span>
      </div>
      <div class="secao-num">Pergunta ${pad(state.index + 1)} de ${pad(total)}</div>
      <h1 class="secao-titulo">${headTitle}</h1>
    </div>

    <div class="secao-conteudo animar">
      <div class="nivel-cabecalho">
        <span class="nivel-badge simples">● Acertos: ${state.correctCount}</span>
        <span class="quiz-progresso">${pct}% concluído</span>
      </div>
      <div class="progress-bar"><div style="width:${pct}%"></div></div>

      ${isMixed ? `<span class="mixed-topic-tag">${topic.icon} ${topic.label}</span>` : ""}

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
        <button class="btn-voltar" id="backHomeBtn">← Voltar ao início</button>
        <button class="btn-primario" id="submitBtn" disabled>Enviar resposta</button>
      </div>
    </div>
  `);

  document.getElementById("crumbHome").addEventListener("click", renderHome);
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
    reactionTitle.className = "reacao-titulo correct";
    reactionText.textContent = "Você acertou essa. Segue a curiosidade da questão:";
  } else {
    reactionImg.src = "assets/elephant-sad.png";
    reactionImg.alt = "Elefante do PHP triste, pois a resposta estava errada";
    reactionTitle.textContent = "Quase lá...";
    reactionTitle.className = "reacao-titulo wrong";
    reactionText.textContent = `Essa não foi. A resposta certa era: "${q.options[q.correct]}"`;
  }
  curiosityText.textContent = q.curiosity;
  modal.classList.add("aberto");
}

function closeModal() {
  modal.classList.remove("aberto");
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
  const mixed = state.mode === "mixed";
  const topic = mixed ? null : TOPICS.find((t) => t.id === state.topicId);

  let weakHtml = "";
  if (mixed) {
    const weakTopics = Object.entries(state.topicStats)
      .map(([id, s]) => ({ id, ...s, pct: s.correct / s.total }))
      .filter((s) => s.pct < 0.7)
      .sort((a, b) => a.pct - b.pct);

    if (weakTopics.length) {
      const items = weakTopics
        .map((s) => {
          const t = TOPICS.find((tt) => tt.id === s.id);
          return `<li>${t.icon} ${t.label} — ${s.correct}/${s.total}</li>`;
        })
        .join("");
      weakHtml = `<div class="weak-topics"><p class="weak-topics-label">// Vale revisar</p><ul>${items}</ul></div>`;
    }
  }

  const title = mixed ? "Desafio Relâmpago concluído!" : `Trilha de ${topic.label} concluída!`;
  const message = mixed
    ? good ? "Ótimo mix! Sua base nos principais assuntos está sólida." : "Deu pra ver onde apertar mais antes da prova."
    : good ? "Colheita boa! Você mandou bem nessa trilha." : "Vale a pena revisar esse assunto de novo antes da prova.";

  show(`
    <div class="secao-conteudo result-screen animar">
      <img src="assets/elephant-${good ? "happy" : "sad"}.png" alt="Elefante do PHP" />
      <h2>${title}</h2>
      <p class="score-line">${state.correctCount} de ${total} certas</p>
      <p>${message}</p>
      ${weakHtml}
      <div class="result-actions">
        <button class="btn-primario" id="retryBtn">🔁 ${mixed ? "Refazer desafio" : "Refazer trilha"}</button>
        <button class="btn-secundario" id="homeBtn">🏡 Ver todas as trilhas</button>
      </div>
    </div>
  `);

  document.getElementById("retryBtn").addEventListener("click", () => (mixed ? startMixedChallenge() : startQuiz(state.topicId)));
  document.getElementById("homeBtn").addEventListener("click", renderHome);
}

// ---------- Init ----------

buildNav();
renderHome();
