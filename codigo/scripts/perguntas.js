let perguntasDisponiveis = [];
const servidorLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);
const urlApiGroq = servidorLocal && window.location.port !== "3000"
  ? "http://localhost:3000/api/perguntas"
  : "/api/perguntas";

const perguntasReserva = [
  { id: 901, categoria: "Games", dificuldade: "facil", pergunta: "Qual item costuma restaurar vida em muitos jogos de aventura?", alternativas: ["Mapa", "Poção", "Chave", "Moeda"], respostaCorreta: "Poção", explicacao: "Poções são usadas em muitos jogos para recuperar vida ou energia." },
  { id: 902, categoria: "Tecnologia", dificuldade: "facil", pergunta: "Qual componente é conhecido como o cérebro do computador?", alternativas: ["CPU", "Monitor", "Mouse", "Fonte"], respostaCorreta: "CPU", explicacao: "A CPU executa instruções e coordena o processamento principal." },
  { id: 903, categoria: "Esports", dificuldade: "medio", pergunta: "O que significa uma partida MD3?", alternativas: ["Melhor de 3", "Modo de 3", "Mapa duplo 3", "Meta diária 3"], respostaCorreta: "Melhor de 3", explicacao: "MD3 indica que vence quem ganhar duas partidas em uma série de até três." },
  { id: 904, categoria: "Cultura Geek", dificuldade: "facil", pergunta: "Pixel art é formada principalmente por qual elemento visual?", alternativas: ["Linhas curvas", "Pontos quadrados", "Fotografias", "Sombras reais"], respostaCorreta: "Pontos quadrados", explicacao: "A pixel art usa pixels visíveis como unidade estética principal." },
  { id: 905, categoria: "Filmes e Séries", dificuldade: "medio", pergunta: "Qual termo descreve uma sequência lançada antes da história original?", alternativas: ["Prequel", "Spin-off", "Remake", "Trailer"], respostaCorreta: "Prequel", explicacao: "Prequel conta eventos anteriores à obra já conhecida." }
];

async function carregarPerguntas() {
  try {
    const resposta = await fetch("dados/perguntas.json");
    if (!resposta.ok) throw new Error("Falha ao carregar JSON");
    perguntasDisponiveis = await resposta.json();
  } catch {
    perguntasDisponiveis = perguntasReserva;
  }
  return perguntasDisponiveis;
}

function filtrarPerguntas(categoriaSelecionada, dificuldadeSelecionada) {
  return perguntasDisponiveis.filter((pergunta) =>
    pergunta.categoria === categoriaSelecionada && pergunta.dificuldade === dificuldadeSelecionada
  );
}

function embaralharLista(lista) {
  return [...lista].sort(() => Math.random() - 0.5);
}

function selecionarPerguntas(categoriaSelecionada, dificuldadeSelecionada, quantidadePerguntas) {
  const filtradas = filtrarPerguntas(categoriaSelecionada, dificuldadeSelecionada);
  const mesmaCategoria = perguntasDisponiveis.filter((pergunta) => pergunta.categoria === categoriaSelecionada);
  const base = filtradas.length >= quantidadePerguntas ? filtradas : mesmaCategoria;
  if (base.length < quantidadePerguntas) return [];
  return embaralharLista(base).slice(0, quantidadePerguntas);
}

async function gerarPerguntasComGroq(configuracao) {
  const resposta = await fetch(urlApiGroq, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      categoria: configuracao.categoriaSelecionada,
      dificuldade: configuracao.dificuldadeSelecionada,
      quantidade: configuracao.quantidadePerguntas
    })
  });
  const dados = await resposta.json();
  if (!resposta.ok) throw new Error(dados.erro || "Nao foi possivel gerar perguntas com Groq.");
  if (!Array.isArray(dados.perguntas) || !dados.perguntas.length) throw new Error("A Groq nao retornou perguntas.");
  return dados.perguntas;
}
