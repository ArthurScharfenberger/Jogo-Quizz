const estadoQuiz = {
  modoSelecionado: "solo",
  jogadorUm: { apelido: "", pontuacao: 0, acertos: 0 },
  jogadorDois: { apelido: "", pontuacao: 0, acertos: 0 },
  categoriaSelecionada: "",
  dificuldadeSelecionada: "",
  quantidadePerguntas: 0,
  tempoPorPergunta: 15,
  perguntasSelecionadas: [],
  perguntasGeradas: [],
  indicePerguntaAtual: 0,
  pontuacaoAtual: 0,
  acertos: 0,
  erros: 0,
  naoRespondidas: 0,
  sequenciaAtual: 0,
  maiorSequencia: 0,
  tempoRestante: 15,
  tempoTotal: 0,
  temporizador: null,
  vezDoJogador: 1,
  respostasRodada: {}
};

function selecionarModo(modoSelecionado) {
  estadoQuiz.modoSelecionado = modoSelecionado;
  document.querySelector("#campo-jogador-dois").classList.toggle("oculto", modoSelecionado !== "duelo");
  document.querySelector("#label-jogador-um").textContent = modoSelecionado === "duelo" ? "Apelido do Jogador 1" : "Apelido do jogador";
  document.querySelector("#apelido-jogador-um").value = buscarUltimoApelido();
  mostrarTela("tela-jogadores");
}

function prepararPartida() {
  const perguntasSelecionadas = estadoQuiz.perguntasGeradas.length
    ? estadoQuiz.perguntasGeradas
    : selecionarPerguntas(
      estadoQuiz.categoriaSelecionada,
      estadoQuiz.dificuldadeSelecionada,
      estadoQuiz.quantidadePerguntas
    );
  if (!perguntasSelecionadas.length) {
    exibirMensagemErro("#erro-configuracao", "Não encontramos perguntas suficientes para essa configuração.");
    return;
  }
  estadoQuiz.perguntasSelecionadas = perguntasSelecionadas;
  estadoQuiz.indicePerguntaAtual = 0;
  estadoQuiz.pontuacaoAtual = 0;
  estadoQuiz.acertos = 0;
  estadoQuiz.erros = 0;
  estadoQuiz.naoRespondidas = 0;
  estadoQuiz.sequenciaAtual = 0;
  estadoQuiz.maiorSequencia = 0;
  estadoQuiz.tempoTotal = 0;

  if (estadoQuiz.modoSelecionado === "duelo") iniciarDueloLocal();
  else iniciarPartidaSolo();
}

function iniciarPartidaSolo() {
  iniciarRodada();
}

function iniciarRodada() {
  estadoQuiz.respostasRodada = {};
  mostrarPerguntaAtual();
  mostrarTela("tela-pergunta");
}

function mostrarPerguntaAtual() {
  const perguntaAtual = estadoQuiz.perguntasSelecionadas[estadoQuiz.indicePerguntaAtual];
  renderizarPergunta(perguntaAtual, estadoQuiz.indicePerguntaAtual, estadoQuiz.perguntasSelecionadas.length, estadoQuiz);
  atualizarPlacarDuelo(estadoQuiz);
  configurarAlternativas();
  iniciarCronometro();
}

function configurarAlternativas() {
  document.querySelectorAll(".alternativa").forEach((botao) => {
    botao.addEventListener("click", () => verificarResposta(botao.dataset.resposta));
  });
}

function bloquearAlternativas() {
  document.querySelectorAll(".alternativa").forEach((botao) => {
    botao.disabled = true;
  });
}

function iniciarCronometro() {
  pararCronometro();
  estadoQuiz.tempoRestante = estadoQuiz.tempoPorPergunta;
  atualizarCronometro(estadoQuiz.tempoRestante);
  estadoQuiz.temporizador = setInterval(() => {
    estadoQuiz.tempoRestante -= 1;
    estadoQuiz.tempoTotal += 1;
    atualizarCronometro(estadoQuiz.tempoRestante);
    if (estadoQuiz.tempoRestante <= 0) verificarResposta("", "tempo");
  }, 1000);
}

function pararCronometro() {
  if (estadoQuiz.temporizador) clearInterval(estadoQuiz.temporizador);
  estadoQuiz.temporizador = null;
}

function verificarResposta(respostaEscolhida, motivo = "resposta") {
  bloquearAlternativas();
  if (estadoQuiz.modoSelecionado === "duelo") {
    registrarRespostaDuelo(respostaEscolhida, motivo);
    return;
  }

  pararCronometro();
  const perguntaAtual = estadoQuiz.perguntasSelecionadas[estadoQuiz.indicePerguntaAtual];
  const resultado = calcularPontuacao(perguntaAtual, respostaEscolhida, motivo);
  estadoQuiz.pontuacaoAtual += resultado.pontosGanhos;
  if (resultado.correta) {
    estadoQuiz.acertos += 1;
    estadoQuiz.sequenciaAtual += 1;
    estadoQuiz.maiorSequencia = Math.max(estadoQuiz.maiorSequencia, estadoQuiz.sequenciaAtual);
  } else {
    estadoQuiz.sequenciaAtual = 0;
    if (motivo === "pular" || motivo === "tempo") estadoQuiz.naoRespondidas += 1;
    else estadoQuiz.erros += 1;
  }
  renderizarFeedbackSolo(resultado, perguntaAtual);
  mostrarTela("tela-feedback");
}

function calcularPontuacao(perguntaAtual, respostaEscolhida, motivo = "resposta") {
  const correta = respostaEscolhida === perguntaAtual.respostaCorreta;
  if (!correta || motivo === "pular" || motivo === "tempo") {
    return { correta: false, respostaEscolhida, pontosGanhos: 0, bonusVelocidade: 0, bonusSequencia: 0 };
  }
  const bonusVelocidade = Math.max(0, Math.round((estadoQuiz.tempoRestante / estadoQuiz.tempoPorPergunta) * 10));
  const proximaSequencia = estadoQuiz.sequenciaAtual + 1;
  const bonusSequencia = proximaSequencia % 3 === 0 ? 5 : 0;
  return {
    correta: true,
    respostaEscolhida,
    pontosGanhos: 20 + bonusVelocidade + bonusSequencia,
    bonusVelocidade,
    bonusSequencia
  };
}

function avancarPergunta() {
  estadoQuiz.indicePerguntaAtual += 1;
  if (estadoQuiz.indicePerguntaAtual >= estadoQuiz.perguntasSelecionadas.length) {
    if (estadoQuiz.modoSelecionado === "duelo") finalizarDuelo();
    else finalizarPartida();
    return;
  }
  if (estadoQuiz.modoSelecionado === "duelo") {
    estadoQuiz.vezDoJogador = 1;
  }
  iniciarRodada();
}

function finalizarPartida() {
  salvarResultado(estadoQuiz.jogadorUm.apelido, estadoQuiz.pontuacaoAtual, "Solo");
  const estatisticas = buscarEstatisticas();
  estatisticas.partidasJogadas += 1;
  estatisticas.totalAcertos += estadoQuiz.acertos;
  estatisticas.maiorSequencia = Math.max(estatisticas.maiorSequencia, estadoQuiz.maiorSequencia);
  estatisticas.rankAtual = calcularRank(estadoQuiz.pontuacaoAtual);
  salvarEstatisticas(estatisticas);
  renderizarResultadoSolo(estadoQuiz);
  renderizarRanking();
  atualizarTextosIniciais();
  mostrarTela("tela-resultado");
}
