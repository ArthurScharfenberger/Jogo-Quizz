function validarApelido(apelido) {
  const texto = apelido.trim();
  if (!texto) return "Digite o apelido para continuar.";
  if (texto.length < 3) return "O apelido precisa ter pelo menos 3 caracteres.";
  if (texto.length > 16) return "O apelido deve ter no máximo 16 caracteres.";
  if (/^\d+$/.test(texto)) return "O apelido não pode conter apenas números.";
  if (!/^[A-Za-zÀ-ÿ0-9 ]+$/.test(texto)) return "Use apenas letras, números e espaços.";
  return "";
}

function validarJogadores(jogadorUm, jogadorDois, modoSelecionado) {
  const erroJogadorUm = validarApelido(jogadorUm);
  if (erroJogadorUm) return { valido: false, campo: "um", mensagem: erroJogadorUm };
  if (modoSelecionado === "duelo") {
    const erroJogadorDois = validarApelido(jogadorDois);
    if (erroJogadorDois) return { valido: false, campo: "dois", mensagem: erroJogadorDois };
    if (jogadorUm.trim().toLowerCase() === jogadorDois.trim().toLowerCase()) {
      return { valido: false, campo: "geral", mensagem: "Os jogadores precisam ter apelidos diferentes." };
    }
  }
  return { valido: true, mensagem: "" };
}

function validarCategoria(categoriaSelecionada) {
  return categoriaSelecionada ? "" : "Escolha uma categoria para continuar.";
}

function validarDificuldade(dificuldadeSelecionada) {
  return dificuldadeSelecionada ? "" : "Escolha uma dificuldade.";
}

function validarQuantidadePerguntas(quantidadePerguntas) {
  return quantidadePerguntas ? "" : "Escolha a quantidade de perguntas.";
}

function validarTempoPorPergunta(tempoPorPergunta) {
  return tempoPorPergunta ? "" : "Escolha o tempo por pergunta.";
}

function validarConfiguracao(configuracao) {
  return validarCategoria(configuracao.categoriaSelecionada)
    || validarDificuldade(configuracao.dificuldadeSelecionada)
    || validarQuantidadePerguntas(configuracao.quantidadePerguntas)
    || validarTempoPorPergunta(configuracao.tempoPorPergunta);
}
