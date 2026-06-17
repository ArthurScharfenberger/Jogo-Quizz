function iniciarDueloLocal() {
  estadoQuiz.jogadorUm.pontuacao = 0;
  estadoQuiz.jogadorUm.acertos = 0;
  estadoQuiz.jogadorDois.pontuacao = 0;
  estadoQuiz.jogadorDois.acertos = 0;
  estadoQuiz.vezDoJogador = 1;
  estadoQuiz.respostasRodada = {};
  iniciarRodada();
}

function registrarRespostaDuelo(respostaEscolhida, motivo = "resposta") {
  pararCronometro();
  const perguntaAtual = estadoQuiz.perguntasSelecionadas[estadoQuiz.indicePerguntaAtual];
  const resultado = calcularPontuacao(perguntaAtual, respostaEscolhida, motivo);
  const chave = estadoQuiz.vezDoJogador === 1 ? "jogadorUm" : "jogadorDois";
  const jogador = estadoQuiz[chave];

  jogador.pontuacao += resultado.pontosGanhos;
  if (resultado.correta) jogador.acertos += 1;
  estadoQuiz.respostasRodada[chave] = resultado;

  if (estadoQuiz.vezDoJogador === 1) {
    alternarVezDoJogador();
    document.querySelector("#texto-pergunta").textContent = `Resposta registrada. Agora é a vez de ${estadoQuiz.jogadorDois.apelido}.`;
    setTimeout(() => mostrarPerguntaAtual(), 850);
    return;
  }

  renderizarFeedbackDuelo(estadoQuiz, perguntaAtual);
  mostrarTela("tela-feedback");
}

function alternarVezDoJogador() {
  estadoQuiz.vezDoJogador = estadoQuiz.vezDoJogador === 1 ? 2 : 1;
}

function finalizarDuelo() {
  salvarResultado(estadoQuiz.jogadorUm.apelido, estadoQuiz.jogadorUm.pontuacao, "Duelo Local");
  salvarResultado(estadoQuiz.jogadorDois.apelido, estadoQuiz.jogadorDois.pontuacao, "Duelo Local");

  const estatisticas = buscarEstatisticas();
  estatisticas.partidasJogadas += 1;
  estatisticas.totalAcertos += estadoQuiz.jogadorUm.acertos + estadoQuiz.jogadorDois.acertos;
  if (estadoQuiz.jogadorUm.pontuacao !== estadoQuiz.jogadorDois.pontuacao) estatisticas.vitorias += 1;
  salvarEstatisticas(estatisticas);

  renderizarResultadoDuelo(estadoQuiz);
  renderizarRanking();
  atualizarTextosIniciais();
  mostrarTela("tela-resultado");
}
