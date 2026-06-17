function iniciarAplicacao() {
  aplicarTemaSalvo();
  renderizarCategorias();
  renderizarOpcoes();
  renderizarRanking();
  atualizarTextosIniciais();
  carregarPerguntas();
  configurarEventos();
}

function configurarEventos() {
  document.querySelector("#botao-tema").addEventListener("click", alternarTema);
  document.querySelector("#botao-comecar").addEventListener("click", () => mostrarTela("tela-modo"));
  document.querySelector("#atalho-categorias").addEventListener("click", () => mostrarTela("tela-categorias"));
  document.querySelector("#atalho-ranking").addEventListener("click", () => {
    renderizarRanking();
    mostrarTela("tela-ranking");
  });
  document.querySelector("#atalho-desafios").addEventListener("click", () => mostrarTela("tela-modo"));
  document.querySelector("#botao-solo").addEventListener("click", () => selecionarModo("solo"));
  document.querySelector("#botao-duelo").addEventListener("click", () => selecionarModo("duelo"));

  document.querySelectorAll("[data-voltar]").forEach((botao) => {
    botao.addEventListener("click", () => mostrarTela(botao.dataset.voltar));
  });

  document.querySelectorAll("[data-navegar]").forEach((botao) => {
    botao.addEventListener("click", () => {
      if (botao.dataset.navegar === "tela-ranking") renderizarRanking();
      mostrarTela(botao.dataset.navegar);
    });
  });

  document.querySelector("#formulario-jogadores").addEventListener("submit", aoEnviarJogadores);
  document.querySelector("#busca-categorias").addEventListener("input", (evento) => renderizarCategorias(evento.target.value));
  document.querySelector("#lista-categorias").addEventListener("click", aoSelecionarCategoria);
  document.querySelector("#opcoes-dificuldade").addEventListener("click", aoSelecionarDificuldade);
  document.querySelector("#opcoes-quantidade").addEventListener("click", aoSelecionarQuantidade);
  document.querySelector("#opcoes-tempo").addEventListener("click", aoSelecionarTempo);
  document.querySelector("#botao-iniciar-quiz").addEventListener("click", aoIniciarQuiz);
  document.querySelector("#botao-proxima-pergunta").addEventListener("click", avancarPergunta);
  document.querySelector("#botao-sair-quiz").addEventListener("click", () => {
    pararCronometro();
    mostrarTela("tela-inicial");
  });
  document.querySelector("#botao-pular").addEventListener("click", () => verificarResposta("", "pular"));
  document.querySelector("#botao-dica").addEventListener("click", mostrarDica);
  document.querySelector("#botao-som").addEventListener("click", () => exibirMensagemErro("#vez-jogador", "Som visual ativado para apresentação local."));
  document.querySelector("#botao-jogar-novamente").addEventListener("click", prepararPartida);
  document.querySelector("#botao-voltar-inicio").addEventListener("click", () => mostrarTela("tela-inicial"));
  document.querySelector("#botao-limpar-dados").addEventListener("click", aoLimparDados);
}

function aoEnviarJogadores(evento) {
  evento.preventDefault();
  const apelidoUm = document.querySelector("#apelido-jogador-um").value.trim();
  const apelidoDois = document.querySelector("#apelido-jogador-dois").value.trim();
  const resultado = validarJogadores(apelidoUm, apelidoDois, estadoQuiz.modoSelecionado);
  exibirMensagemErro("#erro-jogador-um", "");
  exibirMensagemErro("#erro-jogador-dois", "");
  exibirMensagemErro("#erro-jogadores", "");
  if (!resultado.valido) {
    const seletor = resultado.campo === "dois" ? "#erro-jogador-dois" : resultado.campo === "geral" ? "#erro-jogadores" : "#erro-jogador-um";
    exibirMensagemErro(seletor, resultado.mensagem);
    return;
  }
  estadoQuiz.jogadorUm.apelido = apelidoUm;
  estadoQuiz.jogadorDois.apelido = apelidoDois;
  salvarUltimoApelido(apelidoUm);
  mostrarTela("tela-categorias");
}

function aoSelecionarCategoria(evento) {
  const botao = evento.target.closest("[data-categoria]");
  if (!botao) return;
  estadoQuiz.categoriaSelecionada = botao.dataset.categoria;
  marcarSelecionado(".card-categoria", "categoria", estadoQuiz.categoriaSelecionada);
}

function aoSelecionarDificuldade(evento) {
  const botao = evento.target.closest("[data-dificuldade]");
  if (!botao) return;
  estadoQuiz.dificuldadeSelecionada = botao.dataset.dificuldade;
  marcarSelecionado(".card-opcao[data-dificuldade]", "dificuldade", estadoQuiz.dificuldadeSelecionada);
}

function aoSelecionarQuantidade(evento) {
  const botao = evento.target.closest("[data-quantidade]");
  if (!botao) return;
  estadoQuiz.quantidadePerguntas = Number(botao.dataset.quantidade);
  marcarSelecionado(".card-opcao[data-quantidade]", "quantidade", estadoQuiz.quantidadePerguntas);
}

function aoSelecionarTempo(evento) {
  const botao = evento.target.closest("[data-tempo]");
  if (!botao) return;
  estadoQuiz.tempoPorPergunta = Number(botao.dataset.tempo);
  marcarSelecionado(".card-opcao[data-tempo]", "tempo", estadoQuiz.tempoPorPergunta);
}

async function aoIniciarQuiz() {
  exibirMensagemErro("#erro-configuracao", "Carregando perguntas...");
  if (!perguntasDisponiveis.length) await carregarPerguntas();
  const erro = validarConfiguracao(estadoQuiz);
  if (erro) {
    exibirMensagemErro("#erro-configuracao", erro);
    return;
  }
  exibirMensagemErro("#erro-configuracao", "");
  prepararPartida();
}

function mostrarDica() {
  const perguntaAtual = estadoQuiz.perguntasSelecionadas[estadoQuiz.indicePerguntaAtual];
  const primeiraLetra = perguntaAtual.respostaCorreta.charAt(0);
  exibirMensagemErro("#vez-jogador", `Dica: a resposta correta começa com "${primeiraLetra}".`);
}

function aoLimparDados() {
  if (!confirm("Deseja limpar os dados locais e restaurar o ranking inicial?")) return;
  limparDadosDeTeste();
  renderizarRanking();
  atualizarTextosIniciais();
}

document.addEventListener("DOMContentLoaded", iniciarAplicacao);
