const categoriasDoQuiz = [
  { nome: "Games", total: 125, icone: "icone-controle.svg" },
  { nome: "Personagens", total: 98, icone: "icone-personagem.svg" },
  { nome: "Esports", total: 112, icone: "icone-esports.svg" },
  { nome: "Cultura Geek", total: 87, icone: "icone-cultura-geek.svg" },
  { nome: "Tecnologia", total: 93, icone: "icone-tecnologia.svg" },
  { nome: "Filmes e Séries", total: 76, icone: "icone-filmes-series.svg" }
];

const dificuldadesDoQuiz = [
  { valor: "facil", titulo: "Fácil", texto: "Para iniciantes" },
  { valor: "medio", titulo: "Médio", texto: "Desafio na medida" },
  { valor: "dificil", titulo: "Difícil", texto: "Para experts" }
];

const quantidadesDoQuiz = [5, 10, 15];
const temposDoQuiz = [15, 18, 20];

function mostrarTela(idTela) {
  document.querySelectorAll(".tela").forEach((tela) => tela.classList.remove("tela-ativa"));
  document.querySelector(`#${idTela}`)?.classList.add("tela-ativa");
  document.querySelector(".conteudo")?.scrollTo({ top: 0, left: 0 });
  document.querySelectorAll(".botao-nav").forEach((botao) => {
    botao.classList.toggle("ativo", botao.dataset.navegar === idTela);
  });
}

function carregarIcone(nomeArquivo, classes = "icone") {
  return `<img class="${classes}" src="recursos/icones/${nomeArquivo}" alt="">`;
}

function renderizarCategorias(filtro = "") {
  const lista = document.querySelector("#lista-categorias");
  if (!lista) return;
  const termo = filtro.trim().toLowerCase();
  lista.innerHTML = categoriasDoQuiz
    .filter((categoria) => categoria.nome.toLowerCase().includes(termo))
    .map((categoria) => `
      <button class="card-categoria" type="button" data-categoria="${categoria.nome}">
        ${carregarIcone(categoria.icone, "icone icone-medio")}
        <span class="selo-check">${carregarIcone("icone-acerto.svg", "icone icone-pequeno icone-correto")}</span>
        <h3>${categoria.nome}</h3>
        <p class="texto-suave">${categoria.total} quizzes</p>
      </button>
    `).join("");
}

function renderizarOpcoes() {
  document.querySelector("#opcoes-dificuldade").innerHTML = dificuldadesDoQuiz.map((opcao) => `
    <button class="card-opcao" type="button" data-dificuldade="${opcao.valor}">
      <strong>${opcao.titulo}</strong>
      <p class="texto-suave">${opcao.texto}</p>
    </button>
  `).join("");

  document.querySelector("#opcoes-quantidade").innerHTML = quantidadesDoQuiz.map((quantidade) => `
    <button class="card-opcao" type="button" data-quantidade="${quantidade}">
      <strong>${quantidade} Perguntas</strong>
    </button>
  `).join("");

  document.querySelector("#opcoes-tempo").innerHTML = temposDoQuiz.map((tempo) => `
    <button class="card-opcao" type="button" data-tempo="${tempo}">
      <strong>${tempo} segundos</strong>
    </button>
  `).join("");
}

function marcarSelecionado(seletor, atributo, valor) {
  document.querySelectorAll(seletor).forEach((item) => {
    item.classList.toggle("selecionado", item.dataset[atributo] === String(valor));
  });
}

function atualizarTextosIniciais() {
  const estatisticas = buscarEstatisticas();
  document.querySelector("#melhor-pontuacao").textContent = `${buscarMelhorPontuacao()} pts`;
  document.querySelector("#estatistica-partidas").textContent = estatisticas.partidasJogadas;
  document.querySelector("#estatistica-vitorias").textContent = estatisticas.vitorias;
  document.querySelector("#estatistica-acertos").textContent = estatisticas.totalAcertos;
  document.querySelector("#estatistica-sequencia").textContent = estatisticas.maiorSequencia;
}

function renderizarPergunta(perguntaAtual, indicePerguntaAtual, totalPerguntas, estado) {
  document.querySelector("#contador-pergunta").textContent = `Pergunta ${indicePerguntaAtual + 1}/${totalPerguntas}`;
  document.querySelector("#categoria-pergunta").textContent = perguntaAtual.categoria;
  document.querySelector("#texto-pergunta").textContent = perguntaAtual.pergunta;
  document.querySelector("#pontuacao-atual").textContent = estado.modoSelecionado === "duelo"
    ? `${estado.jogadorUm.pontuacao} x ${estado.jogadorDois.pontuacao}`
    : `${estado.pontuacaoAtual} pts`;

  const letras = ["A", "B", "C", "D"];
  document.querySelector("#lista-alternativas").innerHTML = perguntaAtual.alternativas.map((alternativa, indice) => `
    <button class="botao alternativa" type="button" data-resposta="${alternativa}">
      <span class="letra">${letras[indice]}</span>
      <span>${alternativa}</span>
    </button>
  `).join("");

  const progresso = Math.round((indicePerguntaAtual / totalPerguntas) * 100);
  document.querySelector("#porcentagem-progresso").textContent = `${progresso}%`;
  document.querySelector("#barra-progresso").style.width = `${progresso}%`;
}

function atualizarCronometro(tempoRestante) {
  document.querySelector("#tempo-restante").textContent = tempoRestante;
}

function atualizarPlacarDuelo(estado) {
  const placar = document.querySelector("#placar-duelo");
  const vezJogador = document.querySelector("#vez-jogador");
  if (estado.modoSelecionado !== "duelo") {
    placar.classList.add("oculto");
    vezJogador.textContent = "";
    return;
  }
  placar.classList.remove("oculto");
  placar.innerHTML = `
    <div><strong>${estado.jogadorUm.apelido}</strong><p class="texto-suave">${estado.jogadorUm.pontuacao} pts</p></div>
    <strong>VS</strong>
    <div><strong>${estado.jogadorDois.apelido}</strong><p class="texto-suave">${estado.jogadorDois.pontuacao} pts</p></div>
  `;
  vezJogador.textContent = `Vez de ${estado.vezDoJogador === 1 ? estado.jogadorUm.apelido : estado.jogadorDois.apelido}`;
}

function renderizarFeedbackSolo(resultado, perguntaAtual) {
  const correto = resultado.correta;
  document.querySelector("#icone-feedback").innerHTML = carregarIcone(correto ? "icone-acerto.svg" : "icone-erro.svg", `icone icone-grande ${correto ? "icone-correto" : "icone-errado"}`);
  document.querySelector("#titulo-feedback").textContent = correto ? "Resposta correta!" : "Resposta errada!";
  document.querySelector("#titulo-feedback").className = correto ? "feedback-correto" : "feedback-errado";
  document.querySelector("#conteudo-feedback").innerHTML = `
    <p>Sua resposta: <strong>${resultado.respostaEscolhida || "Não respondida"}</strong></p>
    <p>Resposta correta: <strong>${perguntaAtual.respostaCorreta}</strong></p>
    <p>Pontos ganhos: <strong>${resultado.pontosGanhos}</strong></p>
    <p>Bônus de velocidade: <strong>${resultado.bonusVelocidade}</strong></p>
    <p>Bônus de sequência: <strong>${resultado.bonusSequencia}</strong></p>
    <p class="texto-suave">${perguntaAtual.explicacao}</p>
  `;
}

function renderizarFeedbackDuelo(estado, perguntaAtual) {
  document.querySelector("#icone-feedback").innerHTML = carregarIcone("icone-desafio.svg", "icone icone-grande");
  document.querySelector("#titulo-feedback").textContent = "Resultado da rodada";
  document.querySelector("#titulo-feedback").className = "";
  const r1 = estado.respostasRodada.jogadorUm;
  const r2 = estado.respostasRodada.jogadorDois;
  document.querySelector("#conteudo-feedback").innerHTML = `
    <p>${estado.jogadorUm.apelido}: <strong>${r1.respostaEscolhida || "Não respondida"}</strong> ${r1.correta ? "acertou" : "errou"} e ganhou <strong>+${r1.pontosGanhos} pts</strong>.</p>
    <p>${estado.jogadorDois.apelido}: <strong>${r2.respostaEscolhida || "Não respondida"}</strong> ${r2.correta ? "acertou" : "errou"} e ganhou <strong>+${r2.pontosGanhos} pts</strong>.</p>
    <p>Resposta correta: <strong>${perguntaAtual.respostaCorreta}</strong></p>
    <p>Placar atualizado: <strong>${estado.jogadorUm.pontuacao} x ${estado.jogadorDois.pontuacao}</strong></p>
    <p class="texto-suave">${perguntaAtual.explicacao}</p>
  `;
}

function renderizarResultadoSolo(estado) {
  const acuracia = Math.round((estado.acertos / estado.perguntasSelecionadas.length) * 100);
  const rank = calcularRank(estado.pontuacaoAtual);
  document.querySelector("#conteudo-resultado").innerHTML = `
    <h3>Parabéns, ${estado.jogadorUm.apelido}!</h3>
    <p>Pontuação total: <strong>${estado.pontuacaoAtual} pts</strong></p>
    <p>Acurácia: <strong>${acuracia}%</strong></p>
    <p>Acertos: <strong>${estado.acertos}</strong></p>
    <p>Erros: <strong>${estado.erros}</strong></p>
    <p>Não respondidas: <strong>${estado.naoRespondidas}</strong></p>
    <p>Tempo total: <strong>${estado.tempoTotal}s</strong></p>
    <p>Maior sequência: <strong>${estado.maiorSequencia}</strong></p>
    <p>Rank alcançado: <strong>${rank}</strong></p>
  `;
}

function renderizarResultadoDuelo(estado) {
  const vencedor = estado.jogadorUm.pontuacao === estado.jogadorDois.pontuacao
    ? null
    : estado.jogadorUm.pontuacao > estado.jogadorDois.pontuacao ? estado.jogadorUm : estado.jogadorDois;
  const mensagem = vencedor ? `${vencedor.apelido} venceu o duelo!` : "Empate na Arena!";
  document.querySelector("#conteudo-resultado").innerHTML = `
    <h3>${mensagem}</h3>
    <p>${estado.jogadorUm.apelido}: <strong>${estado.jogadorUm.pontuacao} pts</strong> • ${estado.jogadorUm.acertos} acertos</p>
    <p>${estado.jogadorDois.apelido}: <strong>${estado.jogadorDois.pontuacao} pts</strong> • ${estado.jogadorDois.acertos} acertos</p>
    <p>Categoria: <strong>${estado.categoriaSelecionada}</strong></p>
    <p>Dificuldade: <strong>${estado.dificuldadeSelecionada}</strong></p>
    <p>Quantidade de perguntas: <strong>${estado.perguntasSelecionadas.length}</strong></p>
    <p>Tempo total: <strong>${estado.tempoTotal}s</strong></p>
  `;
}

function exibirMensagemErro(seletor, mensagem) {
  document.querySelector(seletor).textContent = mensagem;
}
