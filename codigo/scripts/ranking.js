function calcularRank(pontuacao) {
  if (pontuacao >= 400) return "Mestre";
  if (pontuacao >= 300) return "Diamante";
  if (pontuacao >= 200) return "Ouro";
  if (pontuacao >= 100) return "Prata";
  return "Bronze";
}

function ordenarRanking(rankingLocal) {
  return [...rankingLocal].sort((a, b) => b.pontuacao - a.pontuacao).slice(0, 10);
}

function atualizarRanking(resultado) {
  const rankingLocal = buscarRanking();
  const proximoRanking = ordenarRanking([...rankingLocal, resultado]);
  salvarRanking(proximoRanking);
  return proximoRanking;
}

function salvarResultado(apelido, pontuacao, modo) {
  const rank = calcularRank(pontuacao);
  const resultado = { apelido, pontuacao, modo, rank };
  atualizarRanking(resultado);
  if (pontuacao > buscarMelhorPontuacao()) salvarMelhorPontuacao(pontuacao);
  return resultado;
}

function renderizarRanking() {
  const listaRanking = document.querySelector("#lista-ranking");
  if (!listaRanking) return;
  const rankingLocal = ordenarRanking(buscarRanking());
  listaRanking.innerHTML = rankingLocal.map((item, indice) => `
    <div class="item-ranking">
      <span class="posicao-ranking">${indice + 1}</span>
      <div>
        <strong>${item.apelido}</strong>
        <p class="texto-suave">${item.modo} • ${item.rank}</p>
      </div>
      <strong>${item.pontuacao} pts</strong>
    </div>
  `).join("");
}
