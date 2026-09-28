# GiroSUS · Perguntas e respostas

Uma página simples pra tirar dúvida sobre o **GiroSUS** na hora, sem enrolação. Alguém pergunta numa reunião, você digita uma palavra e a resposta aparece. Funciona no computador e no celular, não tem backend, não tem banco de dados e não precisa de chave de API.

> Esta página é uma **extensão do projeto [leitos-sus](https://github.com/Data-Intelligence-Solutions/leitos-sus#bases-de-dados-e-fontes)**. O leitos-sus faz o trabalho pesado (baixa, limpa e testa os dados do SUS). O GiroSUS é o produto que nasceu dele, e esta página é o "tira-dúvidas" do produto.

## Sumário

1. [Quem fez](#quem-fez)
2. [O que é o GiroSUS, em 30 segundos](#o-que-é-o-girosus-em-30-segundos)
3. [O básico: as palavras que você precisa conhecer](#o-básico-as-palavras-que-você-precisa-conhecer)
4. [Como usar a página](#como-usar-a-página)
5. [O que tem em cada arquivo](#o-que-tem-em-cada-arquivo)
6. [Como o código funciona, parte por parte](#como-o-código-funciona-parte-por-parte)
7. [Como a busca pensa](#como-a-busca-pensa)
8. [O arquivo perguntas.json](#o-arquivo-perguntasjson)
9. [Como acrescentar perguntas sem quebrar nada](#como-acrescentar-perguntas-sem-quebrar-nada)
10. [Como testar no seu computador](#como-testar-no-seu-computador)
11. [Como publicar (GitHub Pages ou Vercel)](#como-publicar-github-pages-ou-vercel)
12. [Como trocar as cores](#como-trocar-as-cores)
13. [Deu problema? Olha aqui](#deu-problema-olha-aqui)

## Quem fez

Trabalho em grupo de **Ana, Renata, João, Felipe e Lucas**, feito no **Programa de Trainees em Dados e Inteligência Artificial da White Cube (WhiteCube TRAINEE)**.

O programa é pra quem quer construir carreira em IA, Machine Learning, Analytics e Dados, aprendendo com especialistas e fazendo projetos reais. Sobre a turma:

- 100% online
- Inscrições de 06/07 a 05/08
- Início do programa em 10/08
- 8 semanas de formação prática

## O que é o GiroSUS, em 30 segundos

O GiroSUS é um **painel no Power BI** que mostra **quem ocupa os leitos do SUS em Goiás, por quanto tempo e quanto isso custa**. Tudo é medido em **leito-dia**.

- **Base de dados usada:** só o SIH/SUS (internações), que é pública e gratuita.
- **Safra usada:** 2025, ou seja, as contas que os hospitais apresentaram ao SUS de janeiro a dezembro de 2025.
- **Para quem:** diretores de hospital e secretarias de saúde (estadual e municipais).
- **Números principais de 2025:** 457.403 internações, 1.835.227 leitos-dia, R$ 726,1 milhões pagos, média de 4,0 dias e R$ 396 por leito-dia.

O painel serve pra **planejar**, não pra achar vaga de hoje. Os dados chegam com 1 a 2 meses de atraso.

## O básico: as palavras que você precisa conhecer

Na página, essas definições aparecem em **cartões amarelos**. Amarelo = o básico. Aqui vai a versão resumida:

| Palavra | O que é, sem complicar |
|---|---|
| **SUS** | Sistema Único de Saúde, o sistema público de saúde do Brasil. |
| **DATASUS** | O setor de informática do Ministério da Saúde. Publica os dados do SUS de graça, todo mês. |
| **SIH/SUS** | Sistema de Informações Hospitalares. É onde o hospital registra cada internação pra receber do SUS. É **a** base de dados do GiroSUS. |
| **AIH** | Autorização de Internação Hospitalar. É o **documento** que o hospital preenche pra cada internação e manda pro SUS pra ser pago. Uma AIH regular = uma internação. |
| **AIH regular x continuação** | Regular (IDENT = 1) é a conta normal. Continuação (IDENT = 5) é a mesma internação cobrada em partes. Só as regulares entram. |
| **Base de dados** | Um conjunto organizado de informações, guardado em tabelas. |
| **Tabela, linha e coluna** | Tabela é tipo uma planilha. Cada linha é uma internação. Cada coluna é uma informação dela, como `DIAS_PERM` (dias internado). |
| **Competência** | O mês em que o hospital apresentou a conta ao SUS. |
| **Safra** | O ano da competência. O GiroSUS usa a **safra 2025**. |
| **Leito** | A cama de internação do hospital. |
| **Leito-dia** | Um paciente num leito por um dia. Internação de 5 dias = 5 leitos-dia. |
| **Permanência** | Quantos dias o paciente ficou internado. |
| **Tempo típico** | A mediana de dias do mesmo procedimento. Metade fica menos, metade fica mais. |
| **Procedimento / SIGTAP** | O que o hospital fez no paciente. A tabela SIGTAP diz o código e quanto o SUS paga. |
| **CID-10** | O código internacional do diagnóstico (ex.: J189 = pneumonia). |
| **CNES** | O cadastro de todos os hospitais do Brasil. Cada hospital tem um código CNES de 7 dígitos. |
| **IBGE** | O instituto que faz o Censo. No GiroSUS, só serve pra dar nome às cidades. |
| **Valor pago** | Quanto o SUS pagou. Não é o custo real do hospital. |

Tem mais de 30 definições na página. É só digitar a palavra.

## Como usar a página

- **Busca:** digite qualquer coisa. A lista filtra enquanto você digita, sem apertar Enter. Aceita erro de digitação, falta de acento e plural (`lieto`, `goiania`, `internacoes` funcionam).
- **Cartão amarelo:** é uma **definição**, o básico sobre o produto. Quando a palavra que você buscou é um termo do produto (AIH, SIH, safra, leito-dia...), a definição aparece primeiro.
- **Palavras marcadas em azul:** são as palavras da resposta que bateram com a sua busca.
- **Chips (os botõezinhos):** filtram por categoria. O chip amarelo **Definições** mostra só o básico.
- **Copiar resposta:** copia o texto pra você colar no WhatsApp, e-mail etc.
- **Botão redondo no canto:** abre a mesma busca numa janelinha, tipo chat.
- **Atalhos:** `/` leva o cursor pra busca. `Esc` limpa. Se já estiver limpo, `Esc` fecha a janelinha.
- **Nomes de coluna:** pode digitar `dias_perm` ou `dias perm`, os dois funcionam.

## O que tem em cada arquivo

```
chatbot-leitosus/
├── index.html       a estrutura da página (o "esqueleto")
├── style.css        o visual: cores, tamanhos, modo escuro, celular
├── app.js           o cérebro: carrega as perguntas, busca e desenha os cartões
├── perguntas.json   a base de perguntas e respostas (é aqui que você mais mexe)
└── README.md        este guia
```

Uma regra de ouro: **pra mudar conteúdo, mexa só no `perguntas.json`**. Os outros arquivos só precisam ser mexidos se você quiser mudar o comportamento ou o visual.

O código não tem comentários de propósito, pra ficar limpo. Toda a explicação está aqui no README.

## Como o código funciona, parte por parte

### index.html

É o esqueleto. Tem quatro pedaços importantes:

1. **Cabeçalho** com o título.
2. **`<main data-busca="inicio">`**: a busca grande, no meio da tela.
3. **`<section data-busca="painel">`**: a janelinha que abre pelo botão redondo.
4. **Os scripts** no final: primeiro a biblioteca **Fuse.js** (vem da internet, pelo CDN jsDelivr) e depois o nosso `app.js`.

O atributo `data-busca` é o truque: o `app.js` procura todo elemento que tem esse atributo e "liga" uma busca nele. Por isso as duas buscas usam exatamente o mesmo código.

Os caminhos começam com `./` (ex.: `./style.css`). Isso quer dizer "procure nesta mesma pasta", e é o que faz a página funcionar igualzinho no seu computador, no GitHub Pages e na Vercel.

### style.css

Lá em cima ficam as **cores**, com nomes como `--azul` ou `--definicao-fundo` (os dois hifens na frente são a regra do CSS pra criar uma variável). Tem um bloco pro modo claro e outro pro modo escuro, que o navegador escolhe sozinho conforme o celular ou computador.

No fim tem o bloco `@media (max-width: 600px)`, que só vale pra telas pequenas: a janelinha ocupa a tela quase toda e os chips viram uma linha que desliza pro lado.

### app.js

Pensa nele em 6 blocos, na ordem em que aparecem:

**1. Configurações (as constantes lá no topo).** São os "botões de ajuste" da página:

| Nome | O que é | Exemplo |
|---|---|---|
| `CATEGORIA_DEFINICAO` | O nome da categoria que fica amarela. | `"Definições"` |
| `CATEGORIAS` | A lista de chips, na ordem em que aparecem. | Definições, Produto... |
| `IDS_POPULARES` | Os números (`id`) das 3 perguntas sugeridas quando a busca não acha nada. | `[5, 56, 101]` |
| `TOLERANCIA` | O quanto a busca aceita erro. 0 = só igualzinho, 1 = aceita tudo. | `0.35` |
| `CORTE_RELATIVO` | Esconde resultado fraco: só mostra quem tem pelo menos essa fração da nota do 1º lugar. | `0.45` (45%) |
| `MAX_RESULTADOS` | O máximo de cartões numa busca. | `12` |
| `PALAVRAS_VAZIAS` | Palavras que a busca ignora, porque não ajudam (o, de, que, quanto...). | |

> **Sobre o `IDS_POPULARES`:** ele **não é uma coluna nem uma tabela**. É só uma lista com 3 números, que são os `id` de perguntas do `perguntas.json`. Hoje aponta pra "O que é AIH?" (id 5), "Quais são os números gerais de 2025?" (id 56) e "Dá para ver a vaga de leito de hoje?" (id 101). Quer trocar as sugestões? Troca os números.

**2. Funções de texto.** Preparam as palavras pra comparar:

- `normalizar`: deixa tudo minúsculo e sem acento ("Internações" vira "internacoes").
- `separarPalavras`: corta o texto em palavras (mantém o `_` pra não quebrar nomes de coluna como `dias_perm`).
- `singular`: tira o "s" do fim ("leitos" vira "leito").
- `juntarNomesDeColuna`: se você digitou `dias perm`, ele percebe que existe `dias_perm` e junta.
- `corrigir`: se a palavra não existe na base, troca pela mais parecida ("lieto" vira "leito").
- `distancia`: conta quantas letras precisa mudar pra uma palavra virar outra. É o que o corretor usa.
- `destacar`: coloca a marcação azul nas palavras que bateram.

**3. A busca.** `prepararBusca` monta o "motor" do Fuse.js quando as perguntas chegam, e `buscar` dá uma nota pra cada pergunta (explico no próximo tópico).

**4. Desenho na tela.** `htmlDoCartao` monta cada cartão (e coloca a classe `definicao` quando é da categoria Definições, que é o que deixa o cartão amarelo). `htmlDoVazio` monta a mensagem "Não encontrei. Tente outra palavra" com as 3 sugestões.

**5. Liga as buscas.** `montarBusca` cria os chips, escuta o que você digita e redesenha os cartões. Também cuida dos botões "Copiar resposta" e das sugestões.

**6. O resto.** Copiar texto (`copiar`), avisinho "Resposta copiada!" (`mostrarAviso`), abrir e fechar a janelinha, os atalhos de teclado e, por último, o `fetch("./perguntas.json")`, que é quem busca o arquivo de perguntas e dá a largada em tudo.

## Como a busca pensa

Quando você digita, acontece isso:

1. O texto é limpo: sem acento, minúsculo, sem palavras vazias, no singular e corrigido.
2. Pra cada palavra, o **Fuse.js** procura na pergunta (peso 3), nas palavras-chave (peso 2) e na resposta (peso 1). Cada pergunta ganha pontos.
3. Tem um **bônus** quando a palavra aparece certinha na pergunta (+1) ou nas palavras-chave (+0,5).
4. Tem um **bônus de definição (+3)**: se mais da metade das palavras que você digitou bate com o título ou as palavras-chave de um cartão amarelo, ele sobe pro topo. É por isso que "aih" mostra a definição primeiro, mas "quanto o sus pagou" mostra os números.
5. As perguntas são ordenadas pela nota, os resultados fracos são cortados e aparecem no máximo 12.

Se a internet cair e o Fuse.js não carregar, a página continua funcionando com uma busca mais simples (sem tolerância a erro).

## O arquivo perguntas.json

É uma lista entre `[` e `]`. Cada pergunta é um bloco entre `{` e `}` com 5 campos:

```json
{
  "id": 5,
  "categoria": "Definições",
  "pergunta": "O que é AIH?",
  "resposta": "Autorização de Internação Hospitalar. É o documento que...",
  "palavras_chave": ["aih", "autorização de internação hospitalar", "documento"]
}
```

| Campo | Pra que serve |
|---|---|
| `id` | Um número único. É ele que o `IDS_POPULARES` usa. |
| `categoria` | Em qual chip a pergunta aparece. Tem que ser escrita **igualzinho** a um dos nomes da lista `CATEGORIAS`. |
| `pergunta` | O título do cartão, em negrito. |
| `resposta` | O texto que você vai ler na reunião. |
| `palavras_chave` | Outras palavras que devem achar essa pergunta (sinônimos, siglas, jeitos de perguntar). |

**Categorias que existem hoje:** Definições, Produto, Dados (SIH), Regras e cálculos, Números 2025, Limites, Metodologia e código, Perguntas de cliente, Perguntas de banca e Dicionário de dados. São 204 perguntas no total, sem repetição.

**Quer que uma pergunta vire cartão amarelo?** Coloque `"categoria": "Definições"`. Só use isso pra termos do produto (o básico), pra o amarelo continuar significando "definição".

## Como acrescentar perguntas sem quebrar nada

O JSON é chato com pontuação. As regras que mais pegam:

1. **Vírgula entre os blocos, mas nunca depois do último.**
2. **Todo texto vai entre aspas duplas** (`"assim"`). Aspas simples não funcionam.
3. **Precisa de aspas dentro do texto?** Use `\"`. Exemplo: `"o chamado \"giro\" do leito"`.
4. **O `id` é número sem aspas** e não pode repetir. Use o próximo depois do maior que existe.
5. **A categoria tem que bater letra por letra** com a lista, com acento e maiúscula.

O jeito mais seguro: vá até o final do arquivo, copie o último bloco inteiro, coloque uma vírgula depois do `}` dele e cole a cópia embaixo. Aí é só trocar os textos.

```json
    "palavras_chave": ["...", "..."]
  },
  {
    "id": 205,
    "categoria": "Limites",
    "pergunta": "O painel mostra dados de outros estados?",
    "resposta": "Hoje não. O GiroSUS mostra só Goiás.",
    "palavras_chave": ["outros estados", "brasil", "abrangência"]
  }
]
```

Antes de subir, cole o arquivo inteiro em [jsonlint.com](https://jsonlint.com) e clique em **Validate JSON**. Se tiver erro, ele mostra a linha. E se o arquivo quebrar mesmo assim, a própria página avisa "Não consegui carregar as perguntas" e diz o motivo.

**Criou uma categoria nova?** Acrescente o nome dela na lista `CATEGORIAS`, lá no topo do `app.js`, senão ela não ganha chip.

## Como testar no seu computador

Se você der dois cliques no `index.html`, as perguntas **não** carregam. O navegador bloqueia a leitura do `perguntas.json` quando a página é aberta direto do disco. Precisa de um "servidorzinho" local. Dois jeitos fáceis:

**Com Python** (abre o terminal dentro da pasta):

```bash
python -m http.server 8000
```

Depois abra `http://localhost:8000` no navegador.

**Com VS Code:** instale a extensão **Live Server**, clique com o botão direito no `index.html` e escolha **Open with Live Server**.

A Fuse.js vem da internet, então teste conectado.

## Como publicar (GitHub Pages ou Vercel)

A página é 100% estática (só HTML, CSS, JS e um JSON). Por isso funciona em qualquer hospedagem estática, sem configurar nada especial. Os caminhos são relativos (`./`), então não importa se o endereço final é a raiz do site ou uma subpasta.

### GitHub Pages

1. Em [github.com](https://github.com), clique em **New repository**, dê um nome (ex.: `girosus-perguntas`), deixe **Public** e clique em **Create repository**.
2. Clique em **uploading an existing file**, arraste os 5 arquivos e clique em **Commit changes**.
3. Vá em **Settings > Pages**. Em **Source**, escolha **Deploy from a branch**, a branch **main** e a pasta **/ (root)**. Clique em **Save**.
4. Em 1 ou 2 minutos aparece o endereço, algo como `https://seu-usuario.github.io/girosus-perguntas/`.

### Vercel

1. Suba os arquivos num repositório do GitHub (passos 1 e 2 acima).
2. Entre em [vercel.com](https://vercel.com), faça login com o GitHub e clique em **Add New > Project**.
3. Escolha o repositório e clique em **Import**.
4. Na configuração:
   - **Framework Preset:** `Other`
   - **Build Command:** deixe vazio
   - **Output Directory:** deixe vazio (ou `.`)
   - **Root Directory:** a pasta onde está o `index.html` (se estiver na raiz do repositório, deixe como está)
5. Clique em **Deploy**. Em poucos segundos sai um endereço tipo `https://girosus-perguntas.vercel.app`.

Pra atualizar, é só mandar o arquivo novo pro GitHub (**Add file > Upload files**). A Vercel e o GitHub Pages publicam sozinhos.

**Por que continua funcionando na Vercel:** não tem etapa de build, não tem servidor, e o `perguntas.json` é lido com `fetch("./perguntas.json", { cache: "no-cache" })`. O `no-cache` faz o navegador sempre conferir se tem versão nova, então quando você atualiza o JSON, a página pega a mudança.

## Como trocar as cores

Abra o `style.css`. As cores estão no topo:

- `--azul`: título, botões e chip selecionado.
- `--destaque`: a marcação azul das palavras encontradas.
- `--definicao-fundo` e `--definicao-borda`: o amarelo dos cartões de definição.

Tem uma versão de cada cor no bloco `@media (prefers-color-scheme: dark)`, que é a do modo escuro. Se trocar uma, lembra de trocar a outra.

## Deu problema? Olha aqui

| O que aconteceu | O que fazer |
|---|---|
| "Não consegui carregar as perguntas" | Se abriu direto do disco, use um servidor local. Se mexeu no JSON, valide no jsonlint.com (quase sempre é vírgula ou aspas). |
| A pergunta nova não aparece no chip | A `categoria` não está escrita igual à lista `CATEGORIAS`. |
| A pergunta nova não é achada pela palavra que eu queria | Coloque essa palavra em `palavras_chave`. |
| Atualizei o JSON e o site não mudou | Espere 1 minuto e recarregue com Ctrl+F5. |
| A busca não aceita erro de digitação | A Fuse.js não carregou (sem internet ou CDN bloqueado). A página usa a busca simples nesse caso. |
| As sugestões de "Não encontrei" sumiram | Algum número do `IDS_POPULARES` aponta pra um `id` que não existe mais. |

Projeto original: [Data-Intelligence-Solutions/leitos-sus](https://github.com/Data-Intelligence-Solutions/leitos-sus#bases-de-dados-e-fontes). Dados: SIH/SUS (DATASUS), públicos e gratuitos.
