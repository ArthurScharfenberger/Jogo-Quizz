# Arena Quiz Gamer

Arena Quiz Gamer é um mini jogo web acadêmico, responsivo e mobile-first, criado com HTML5, CSS3 e JavaScript puro. O objetivo é simular um aplicativo gamer local para responder quizzes, disputar um duelo 1v1 no mesmo navegador, acumular pontos e salvar resultados no ranking local.

## Público-alvo

O projeto foi pensado para adolescentes e jovens adultos que gostam de videogames, cultura geek, personagens famosos, esports, tecnologia, filmes e séries.

## Tecnologias usadas

- HTML5 semântico
- CSS3 com variáveis, responsividade, animações leves e tema claro/escuro
- JavaScript puro para DOM, eventos, cronômetro, pontuação e LocalStorage
- JSON local carregado com `fetch`, simulando uma API
- SVG próprio para a biblioteca visual de ícones

## Como rodar

1. Abra a pasta `arena-quiz-gamer` no VS Code.
2. Instale a extensão Live Server, caso ainda não tenha.
3. Clique com o botão direito em `index.html`.
4. Escolha `Open with Live Server`.

O projeto também pode ser hospedado como site estático, pois não usa backend, banco de dados real nem dependências externas.

## API Groq opcional

O jogo pode gerar perguntas com a Groq quando a opção `Gerar perguntas com Groq` estiver marcada na tela de categorias. A chave fica apenas no backend local, nunca no navegador.

1. Copie `.env.example` para `.env`.
2. Preencha `GROQ_API_KEY` no `.env`.
3. Instale Node.js 18 ou superior.
4. Rode `npm install`.
5. Rode `npm run api`.
6. Mantenha o Live Server aberto para o `index.html`.

O backend expõe `POST /api/perguntas` em `http://localhost:3000`. Se a opção da Groq não estiver marcada, o jogo usa apenas `dados/perguntas.json`.

## Modos de jogo

No Modo Solo, um jogador informa o apelido, escolhe categoria, dificuldade, quantidade de perguntas e tempo por pergunta. O sistema calcula pontos por resposta correta, bônus de velocidade e bônus de sequência. Ao final, o resultado é salvo no ranking local.

No Duelo Local, dois jogadores informam seus apelidos e jogam no mesmo navegador. Cada rodada usa a mesma pergunta para os dois participantes. O Jogador 1 responde primeiro, depois o Jogador 2 responde a mesma pergunta, e só então o sistema mostra o feedback da rodada e atualiza o placar. Esse modo simula uma batalha 1v1 sem multiplayer online real.

## Simulação de API

As perguntas ficam em `dados/perguntas.json` e são carregadas com `fetch`. Isso simula uma API local para fins acadêmicos. Caso o carregamento falhe, o arquivo `perguntas.js` possui perguntas reserva para manter o jogo funcional.

## LocalStorage

O navegador salva:

- ranking local;
- melhor pontuação;
- partidas jogadas;
- vitórias e derrotas;
- total de acertos;
- maior sequência;
- tema escolhido;
- último apelido usado;
- rank atual.

As principais chaves usam o prefixo `arenaQuiz_`, como `arenaQuiz_ranking`, `arenaQuiz_melhorPontuacao` e `arenaQuiz_tema`.

## Pontuação

- Resposta correta: +20 pontos
- Bônus de velocidade: de 0 a 10 pontos
- Bônus de sequência: +5 pontos a cada 3 acertos seguidos
- Resposta errada, pulada ou com tempo esgotado: 0 pontos

## Ranking local

O ranking mostra os 10 melhores resultados salvos no navegador. Existe um ranking inicial fictício com Lucas, Mariana, Rafael, GeekMaster e PlayerXP para a apresentação começar com dados visuais. O botão `Limpar dados de teste` restaura esses dados iniciais.

## Sistema de ranks

- Bronze: 0 a 99 pontos
- Prata: 100 a 199 pontos
- Ouro: 200 a 299 pontos
- Diamante: 300 a 399 pontos
- Mestre: 400+ pontos

## Tema claro e escuro

O tema escuro é o padrão. A tela inicial possui um botão para alternar entre tema escuro e claro. A escolha fica salva em LocalStorage e é reaplicada quando o projeto é aberto novamente.

## Ícones próprios

O projeto não usa emojis, Font Awesome, Bootstrap Icons nem imagens aleatórias da internet. Os ícones foram criados como SVG dentro de `recursos/icones/`, com traço roxo neon, bordas arredondadas e identidade visual futurista.

## Estrutura de pastas

```text
arena-quiz-gamer/
├── index.html
├── README.md
├── dados/
│   └── perguntas.json
├── recursos/
│   ├── icones/
│   ├── imagens/
│   └── sons/
└── codigo/
    ├── estilos/
    │   ├── reset.css
    │   ├── variaveis.css
    │   ├── global.css
    │   ├── layout.css
    │   ├── componentes.css
    │   ├── telas.css
    │   └── responsivo.css
    └── scripts/
        ├── principal.js
        ├── perguntas.js
        ├── jogo.js
        ├── duelo.js
        ├── armazenamento.js
        ├── ranking.js
        ├── tema.js
        ├── validacao.js
        └── interface.js
```

## Melhorias futuras

- Adicionar sons próprios na pasta `recursos/sons`.
- Criar conquistas locais.
- Adicionar mais categorias e perguntas.
- Melhorar transições entre turnos no duelo.
- Criar tela visual de perfil com histórico local.
