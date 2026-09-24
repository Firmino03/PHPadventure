# 🐘 PHPadventure

Plataforma interativa para revisar **PHP, Laravel e MySQL** — feita para estudar os conteúdos passados em sala antes da prova, trilha por trilha e no seu próprio ritmo.

> Esse projeto não é uma extensão oficial da disciplina, apenas uma forma leve e interativa de revisar o conteúdo.

🔗 **Acesse:** [php-adventure.vercel.app](https://php-adventure.vercel.app)

## ✨ Funcionalidades

- **8 trilhas de estudo**, cada uma focada em um assunto: MVC, Frameworks, Migrations, Models, ORM Eloquent, Seeders & Factories, Controllers e Views & Blade.
- **72 perguntas** no total, de múltipla escolha, com feedback imediato e uma curiosidade explicando a resposta certa a cada questão.
- **Desafio Relâmpago ⚡** — um modo alternativo de prática que mistura perguntas de todas as trilhas, dando mais peso aos assuntos mais extensos do site (ORM Eloquent, Views & Blade, Models e Seeders & Factories). Ao final, mostra quais trilhas valem revisão com base no seu desempenho.
- Barra de progresso, contagem de acertos e tela de resultado ao final de cada trilha ou do desafio.
- Layout responsivo em estilo *bento grid*, com navegação por trilhas fixa no topo (menu retrátil no mobile).

## 🛠️ Tecnologias

Projeto **100% front-end**, sem frameworks nem build step:

- HTML5
- CSS3 (variáveis CSS, Grid e Flexbox)
- JavaScript puro (vanilla JS)
- Fontes: [Fredoka](https://fonts.google.com/specimen/Fredoka) e [Nunito](https://fonts.google.com/specimen/Nunito) via Google Fonts

## 📁 Estrutura do projeto

```
PHPadventure/
├── index.html      # estrutura da página (header, área de conteúdo, footer, modal)
├── style.css       # estilos: paleta lilás/rosa/lima, layout bento, quiz e modal
├── app.js          # lógica da aplicação: navegação, trilhas, quiz e Desafio Relâmpago
├── data.js         # banco de perguntas, organizado por trilha
└── assets/         # ilustrações do mascote (elefante)
```

## ▶️ Como rodar localmente

Não há dependências nem build. Basta abrir o `index.html` no navegador, ou servir a pasta com qualquer servidor estático:

```bash
npx serve .
```

## 📝 Banco de perguntas

As perguntas ficam em `data.js`, organizadas por trilha (`TOPICS`) e por id (`QUESTIONS`). Cada pergunta segue o formato:

```js
{
  question: "...",
  options: ["...", "...", "...", "..."],
  correct: 0,        // índice da opção correta
  curiosity: "...",  // explicação mostrada após responder
}
```

Para adicionar uma nova trilha ou pergunta, basta editar esse arquivo — o restante da aplicação (navegação, contadores e o Desafio Relâmpago) se ajusta automaticamente.

## 💜 Autoria

Desenvolvido por **[@Karolayne_Firmino](https://github.com/Firmino03)**.
Sugestões e melhorias são muito bem-vindas — use o botão "Sugestões" no rodapé do site ou abra uma issue por aqui.
