const modelo = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ erro: "Metodo nao permitido." });
  }

  try {
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ erro: "Configure GROQ_API_KEY nas variaveis de ambiente." });
    }

    const configuracao = normalizarConfiguracao(req.body);
    const perguntas = await gerarPerguntas(configuracao);
    return res.status(200).json({ perguntas });
  } catch (erro) {
    return res.status(400).json({ erro: erro.message || "Nao foi possivel gerar perguntas." });
  }
};

function normalizarConfiguracao(corpo) {
  const categoria = String(corpo?.categoria || "").trim();
  const dificuldade = String(corpo?.dificuldade || "").trim();
  const quantidade = Number(corpo?.quantidade);

  if (categoria.length < 3) throw new Error("Escolha uma categoria valida.");
  if (!["facil", "medio", "dificil"].includes(dificuldade)) throw new Error("Dificuldade invalida.");
  if (![5, 10, 15].includes(quantidade)) throw new Error("Quantidade invalida.");

  return { categoria, dificuldade, quantidade };
}

async function gerarPerguntas(configuracao) {
  const resposta = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: modelo,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: "Voce gera quizzes em portugues do Brasil. Responda apenas JSON valido, sem markdown."
        },
        {
          role: "user",
          content: criarPrompt(configuracao)
        }
      ]
    })
  });

  const dados = await resposta.json();
  if (!resposta.ok) throw new Error(dados.error?.message || "Erro ao chamar a Groq.");

  const texto = dados.choices?.[0]?.message?.content;
  if (!texto) throw new Error("A resposta da Groq veio vazia.");

  const conteudo = extrairJson(texto);
  return validarPerguntasGeradas(conteudo.perguntas, configuracao);
}

function criarPrompt(configuracao) {
  return [
    `Gere ${configuracao.quantidade} perguntas de quiz sobre "${configuracao.categoria}" na dificuldade "${configuracao.dificuldade}".`,
    "Retorne exatamente este formato JSON:",
    '{"perguntas":[{"pergunta":"texto","alternativas":["opcao 1","opcao 2","opcao 3","opcao 4"],"respostaCorreta":"opcao correta","explicacao":"texto curto"}]}',
    "Regras: cada pergunta deve ter 4 alternativas, a respostaCorreta deve existir nas alternativas, varie a posicao da alternativa correta, nao repita perguntas e nao inclua texto fora do JSON."
  ].join("\n");
}

function extrairJson(texto) {
  const inicio = texto.indexOf("{");
  const fim = texto.lastIndexOf("}");
  if (inicio === -1 || fim === -1) throw new Error("A Groq nao retornou JSON valido.");
  return JSON.parse(texto.slice(inicio, fim + 1));
}

function validarPerguntasGeradas(perguntas, configuracao) {
  if (!Array.isArray(perguntas) || perguntas.length !== configuracao.quantidade) {
    throw new Error("A Groq retornou uma quantidade inesperada de perguntas.");
  }

  return perguntas.map((pergunta, indice) => {
    const alternativas = Array.isArray(pergunta.alternativas) ? pergunta.alternativas.map(String) : [];
    if (alternativas.length !== 4) throw new Error("Cada pergunta precisa ter 4 alternativas.");
    if (!alternativas.includes(pergunta.respostaCorreta)) {
      throw new Error("A resposta correta precisa existir entre as alternativas.");
    }

    return {
      id: `groq-${Date.now()}-${indice}`,
      categoria: configuracao.categoria,
      dificuldade: configuracao.dificuldade,
      pergunta: String(pergunta.pergunta),
      alternativas,
      respostaCorreta: String(pergunta.respostaCorreta),
      explicacao: String(pergunta.explicacao || "Pergunta gerada.")
    };
  });
}
