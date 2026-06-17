function aplicarTema(temaAtual) {
  document.documentElement.dataset.tema = temaAtual;
  const botaoTema = document.querySelector("#botao-tema");
  if (botaoTema) botaoTema.setAttribute("aria-label", temaAtual === "escuro" ? "Ativar tema claro" : "Ativar tema escuro");
}

function aplicarTemaSalvo() {
  aplicarTema(buscarTemaAtual());
}

function buscarTemaAtual() {
  return buscarTema();
}

function salvarTemaAtual(temaAtual) {
  salvarTema(temaAtual);
}

function alternarTema() {
  const temaAtual = document.documentElement.dataset.tema === "claro" ? "escuro" : "claro";
  aplicarTema(temaAtual);
  salvarTemaAtual(temaAtual);
}
