const CHAVES_ARMAZENAMENTO = {
  ranking: "arenaQuiz_ranking",
  melhorPontuacao: "arenaQuiz_melhorPontuacao",
  partidasJogadas: "arenaQuiz_partidasJogadas",
  vitorias: "arenaQuiz_vitorias",
  derrotas: "arenaQuiz_derrotas",
  totalAcertos: "arenaQuiz_totalAcertos",
  maiorSequencia: "arenaQuiz_maiorSequencia",
  tema: "arenaQuiz_tema",
  ultimoApelido: "arenaQuiz_ultimoApelido",
  rankAtual: "arenaQuiz_rankAtual"
};

const rankingInicialFicticio = [
  { apelido: "Lucas", pontuacao: 2450, modo: "Solo", rank: "Mestre" },
  { apelido: "Mariana", pontuacao: 2300, modo: "Solo", rank: "Mestre" },
  { apelido: "Rafael", pontuacao: 2150, modo: "Duelo Local", rank: "Mestre" },
  { apelido: "GeekMaster", pontuacao: 1900, modo: "Solo", rank: "Mestre" },
  { apelido: "PlayerXP", pontuacao: 1700, modo: "Duelo Local", rank: "Mestre" }
];

function salvarNoArmazenamento(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor));
}

function buscarNoArmazenamento(chave, valorPadrao = null) {
  const valor = localStorage.getItem(chave);
  if (valor === null) return valorPadrao;
  try {
    return JSON.parse(valor);
  } catch {
    return valor;
  }
}

function removerDoArmazenamento(chave) {
  localStorage.removeItem(chave);
}

function salvarRanking(rankingLocal) {
  salvarNoArmazenamento(CHAVES_ARMAZENAMENTO.ranking, rankingLocal);
}

function buscarRanking() {
  const rankingLocal = buscarNoArmazenamento(CHAVES_ARMAZENAMENTO.ranking, null);
  if (Array.isArray(rankingLocal)) return rankingLocal;
  salvarRanking(rankingInicialFicticio);
  return [...rankingInicialFicticio];
}

function salvarMelhorPontuacao(pontuacao) {
  salvarNoArmazenamento(CHAVES_ARMAZENAMENTO.melhorPontuacao, Number(pontuacao) || 0);
}

function buscarMelhorPontuacao() {
  return Number(buscarNoArmazenamento(CHAVES_ARMAZENAMENTO.melhorPontuacao, 0)) || 0;
}

function salvarTema(temaAtual) {
  salvarNoArmazenamento(CHAVES_ARMAZENAMENTO.tema, temaAtual);
}

function buscarTema() {
  return buscarNoArmazenamento(CHAVES_ARMAZENAMENTO.tema, "escuro");
}

function salvarUltimoApelido(apelido) {
  salvarNoArmazenamento(CHAVES_ARMAZENAMENTO.ultimoApelido, apelido);
}

function buscarUltimoApelido() {
  return buscarNoArmazenamento(CHAVES_ARMAZENAMENTO.ultimoApelido, "");
}

function salvarEstatisticas(estatisticas) {
  salvarNoArmazenamento(CHAVES_ARMAZENAMENTO.partidasJogadas, estatisticas.partidasJogadas || 0);
  salvarNoArmazenamento(CHAVES_ARMAZENAMENTO.vitorias, estatisticas.vitorias || 0);
  salvarNoArmazenamento(CHAVES_ARMAZENAMENTO.derrotas, estatisticas.derrotas || 0);
  salvarNoArmazenamento(CHAVES_ARMAZENAMENTO.totalAcertos, estatisticas.totalAcertos || 0);
  salvarNoArmazenamento(CHAVES_ARMAZENAMENTO.maiorSequencia, estatisticas.maiorSequencia || 0);
  salvarNoArmazenamento(CHAVES_ARMAZENAMENTO.rankAtual, estatisticas.rankAtual || "Bronze");
}

function buscarEstatisticas() {
  return {
    partidasJogadas: Number(buscarNoArmazenamento(CHAVES_ARMAZENAMENTO.partidasJogadas, 0)) || 0,
    vitorias: Number(buscarNoArmazenamento(CHAVES_ARMAZENAMENTO.vitorias, 0)) || 0,
    derrotas: Number(buscarNoArmazenamento(CHAVES_ARMAZENAMENTO.derrotas, 0)) || 0,
    totalAcertos: Number(buscarNoArmazenamento(CHAVES_ARMAZENAMENTO.totalAcertos, 0)) || 0,
    maiorSequencia: Number(buscarNoArmazenamento(CHAVES_ARMAZENAMENTO.maiorSequencia, 0)) || 0,
    rankAtual: buscarNoArmazenamento(CHAVES_ARMAZENAMENTO.rankAtual, "Bronze")
  };
}

function limparDadosDeTeste() {
  Object.values(CHAVES_ARMAZENAMENTO).forEach(removerDoArmazenamento);
  salvarRanking(rankingInicialFicticio);
}
