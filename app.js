const CATEGORIA_DEFINICAO = "Definições";

const CATEGORIAS = [
  CATEGORIA_DEFINICAO,
  "Produto",
  "Dados (SIH)",
  "Regras e cálculos",
  "Números 2025",
  "Limites",
  "Metodologia e código",
  "Perguntas de cliente",
  "Perguntas de banca",
  "Dicionário de dados"
];

const IDS_POPULARES = [5, 56, 101];

const TOLERANCIA = 0.35;
const CORTE_RELATIVO = 0.45;
const MAX_RESULTADOS = 12;

const PALAVRAS_VAZIAS = new Set([
  "a", "o", "as", "os", "de", "da", "do", "das", "dos", "e", "em", "no", "na",
  "nos", "nas", "um", "uma", "que", "qual", "quais", "como", "para", "por",
  "com", "se", "eu", "voce", "vc", "ao", "aos", "ou", "tem", "ter", "sao", "eh",
  "quanto", "quantos", "quanta", "quantas", "onde", "quem", "quando", "porque",
  "pq", "isso", "esse", "essa", "este", "esta", "me", "meu", "minha", "sobre",
  "significa", "significado", "quer", "dizer", "definicao", "conceito"
]);

let perguntas = [];
let fuse = null;
let listaLimpa = [];
let vocabulario = new Set();
const blocos = [];

function normalizar(texto) {
  return String(texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function separarPalavras(texto) {
  return texto.split(/[^a-z0-9_]+/).filter(p => p && p !== "_");
}

function singular(palavra) {
  if (palavra.length > 4 && palavra.endsWith("s")) return palavra.slice(0, -1);
  return palavra;
}

function juntarNomesDeColuna(palavras) {
  const resultado = [];
  for (let i = 0; i < palavras.length; i++) {
    const junto = palavras[i] + "_" + palavras[i + 1];
    if (i + 1 < palavras.length && vocabulario.has(junto)) {
      resultado.push(junto);
      i++;
    } else {
      resultado.push(palavras[i]);
    }
  }
  return resultado;
}

function palavrasDaBusca(texto) {
  const palavras = separarPalavras(normalizar(texto))
    .filter(p => p.length >= 2 && !PALAVRAS_VAZIAS.has(p));
  return juntarNomesDeColuna(palavras)
    .map(singular)
    .map(corrigir);
}

function distancia(a, b) {
  const linha = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let anterior = linha[0];
    linha[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const guardado = linha[j];
      const custo = a[i - 1] === b[j - 1] ? 0 : 1;
      linha[j] = Math.min(linha[j] + 1, linha[j - 1] + 1, anterior + custo);
      anterior = guardado;
    }
  }
  return linha[b.length];
}

function corrigir(palavra) {
  if (palavra.length < 4 || vocabulario.size === 0 || vocabulario.has(palavra)) return palavra;
  for (const v of vocabulario) if (v.startsWith(palavra)) return palavra;

  const limite = palavra.length >= 5 ? 2 : 1;
  let melhor = palavra;
  let menorDistancia = limite + 1;
  for (const v of vocabulario) {
    if (Math.abs(v.length - palavra.length) > limite) continue;
    const d = distancia(palavra, v);
    if (d < menorDistancia) {
      menorDistancia = d;
      melhor = v;
    }
  }
  return melhor;
}

function escaparHtml(texto) {
  return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function combina(palavraDoTexto, palavrasBuscadas) {
  const p = normalizar(palavraDoTexto);
  return palavrasBuscadas.some(q => {
    if (q.length <= 3) return p === q || (q.length === 3 && p.startsWith(q));
    if (p.startsWith(q.slice(0, 5))) return true;
    const limite = q.length >= 5 ? 2 : 1;
    return p.length >= 4 && distancia(p, q) <= limite;
  });
}

function destacar(texto, palavrasBuscadas) {
  const pedacos = String(texto).split(/([\p{L}\p{N}_]+)/u);
  return pedacos.map((pedaco, i) => {
    const ehPalavra = i % 2 === 1;
    if (ehPalavra && palavrasBuscadas.length && combina(pedaco, palavrasBuscadas)) {
      return "<mark>" + escaparHtml(pedaco) + "</mark>";
    }
    return escaparHtml(pedaco);
  }).join("");
}

function ehDefinicao(item) {
  return item.categoria === CATEGORIA_DEFINICAO;
}

function prepararBusca() {
  listaLimpa = perguntas.map(item => ({
    id: item.id,
    definicao: ehDefinicao(item),
    pergunta: normalizar(item.pergunta),
    resposta: normalizar(item.resposta),
    chaves: normalizar((item.palavras_chave || []).join(" "))
  }));

  vocabulario = new Set();
  listaLimpa.forEach(item => {
    separarPalavras(item.pergunta + " " + item.resposta + " " + item.chaves)
      .forEach(p => { if (p.length >= 4) vocabulario.add(p); });
  });

  if (typeof Fuse === "undefined") {
    console.warn("Fuse.js não carregou. Usando busca simples.");
    fuse = {
      search: palavra => listaLimpa
        .filter(i => (i.pergunta + " " + i.resposta + " " + i.chaves).includes(palavra))
        .map(i => ({ item: i, score: 0.5 }))
    };
    return;
  }

  fuse = new Fuse(listaLimpa, {
    keys: [
      { name: "pergunta", weight: 3 },
      { name: "chaves", weight: 2 },
      { name: "resposta", weight: 1 }
    ],
    threshold: TOLERANCIA,
    ignoreLocation: true,
    includeScore: true,
    minMatchCharLength: 2
  });
}

function somar(pontos, id, valor) {
  pontos.set(id, (pontos.get(id) || 0) + valor);
}

function bateAlgumaPalavra(texto, palavra, aceitaComeco) {
  return separarPalavras(texto)
    .some(p => p === palavra || (aceitaComeco && p.startsWith(palavra)));
}

function buscar(palavras) {
  const pontos = new Map();

  palavras.forEach(palavra => {
    fuse.search(palavra).forEach(r => somar(pontos, r.item.id, 1 - r.score));

    if (palavra.length < 4) return;
    listaLimpa.forEach(item => {
      if (bateAlgumaPalavra(item.pergunta, palavra, palavra.length >= 5)) somar(pontos, item.id, 1);
      if (bateAlgumaPalavra(item.chaves, palavra, palavra.length >= 5)) somar(pontos, item.id, 0.5);
    });
  });

  listaLimpa.filter(item => item.definicao).forEach(item => {
    const texto = item.pergunta + " " + item.chaves;
    const acertos = palavras.filter(p => bateAlgumaPalavra(texto, p, p.length >= 4)).length;
    if (acertos / palavras.length > 0.5) somar(pontos, item.id, 3 * acertos / palavras.length);
  });

  const ordenadas = perguntas
    .filter(item => pontos.has(item.id))
    .sort((a, b) => pontos.get(b.id) - pontos.get(a.id));
  if (ordenadas.length === 0) return [];

  const notaDoPrimeiro = pontos.get(ordenadas[0].id);
  return ordenadas
    .filter(item => pontos.get(item.id) >= notaDoPrimeiro * CORTE_RELATIVO)
    .slice(0, MAX_RESULTADOS);
}

function htmlDoCartao(item, palavras) {
  const definicao = ehDefinicao(item);
  return `
    <article class="cartao${definicao ? " definicao" : ""}">
      ${definicao ? '<span class="selo-definicao">Definição · o básico</span>' : ""}
      <p class="pergunta">${destacar(item.pergunta, palavras)}</p>
      <p class="resposta">${destacar(item.resposta, palavras)}</p>
      <div class="rodape-cartao">
        <span class="etiqueta">${escaparHtml(item.categoria)}</span>
        <button class="copiar" type="button" data-id="${item.id}">Copiar resposta</button>
      </div>
    </article>`;
}

function htmlDoVazio() {
  const sugestoes = IDS_POPULARES
    .map(id => perguntas.find(p => p.id === id))
    .filter(Boolean)
    .map(p => `<button class="sugestao" type="button">${escaparHtml(p.pergunta)}</button>`)
    .join("");
  return `
    <div class="vazio">
      <strong>Não encontrei. Tente outra palavra</strong>
      ${sugestoes ? "Talvez você queira:" + sugestoes : ""}
    </div>`;
}

function montarBusca(raiz) {
  const campo = raiz.querySelector(".campo-busca");
  const areaChips = raiz.querySelector(".chips");
  const contador = raiz.querySelector(".contador");
  const resultados = raiz.querySelector(".resultados");
  let categoriaAtiva = "Todas";

  ["Todas", ...CATEGORIAS].forEach(nome => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip" + (nome === "Todas" ? " ativo" : "") + (nome === CATEGORIA_DEFINICAO ? " chip-definicao" : "");
    chip.textContent = nome;
    chip.setAttribute("aria-pressed", nome === "Todas");
    chip.addEventListener("click", () => {
      categoriaAtiva = nome;
      areaChips.querySelectorAll(".chip").forEach(c => {
        const ligado = c === chip;
        c.classList.toggle("ativo", ligado);
        c.setAttribute("aria-pressed", ligado);
      });
      atualizar();
    });
    areaChips.appendChild(chip);
  });

  function atualizar() {
    if (!fuse) return;

    const palavras = palavrasDaBusca(campo.value);
    let lista = palavras.length ? buscar(palavras) : perguntas;

    if (categoriaAtiva !== "Todas") {
      lista = lista.filter(item => item.categoria === categoriaAtiva);
    }

    if (lista.length === 0) {
      contador.textContent = "";
      resultados.innerHTML = palavras.length
        ? htmlDoVazio()
        : `<div class="vazio">Ainda não tem pergunta em "${escaparHtml(categoriaAtiva)}".</div>`;
      return;
    }

    contador.textContent = lista.length === 1 ? "1 resposta" : `${lista.length} respostas`;
    resultados.innerHTML = lista.map(item => htmlDoCartao(item, palavras)).join("");
  }

  campo.addEventListener("input", atualizar);

  resultados.addEventListener("click", evento => {
    const botaoCopiar = evento.target.closest(".copiar");
    if (botaoCopiar) {
      const item = perguntas.find(p => p.id === Number(botaoCopiar.dataset.id));
      if (item) copiar(item.resposta);
      return;
    }
    const sugestao = evento.target.closest(".sugestao");
    if (sugestao) {
      campo.value = sugestao.textContent;
      atualizar();
      campo.focus();
    }
  });

  blocos.push({ nome: raiz.dataset.busca, campo, atualizar, resultados });
}

function copiar(texto) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(texto)
      .then(() => mostrarAviso("Resposta copiada!"))
      .catch(() => copiarJeitoAntigo(texto));
  } else {
    copiarJeitoAntigo(texto);
  }
}

function copiarJeitoAntigo(texto) {
  const area = document.createElement("textarea");
  area.value = texto;
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  try {
    document.execCommand("copy");
    mostrarAviso("Resposta copiada!");
  } catch (e) {
    mostrarAviso("Não consegui copiar :(");
  }
  area.remove();
}

function mostrarAviso(mensagem) {
  const aviso = document.querySelector(".aviso");
  aviso.textContent = mensagem;
  aviso.hidden = false;
  clearTimeout(mostrarAviso.timer);
  mostrarAviso.timer = setTimeout(() => (aviso.hidden = true), 2000);
}

const botaoFlutuante = document.querySelector(".botao-flutuante");
const painel = document.querySelector(".painel-chat");

function painelAberto() {
  return !painel.hidden;
}

function abrirPainel() {
  painel.hidden = false;
  botaoFlutuante.setAttribute("aria-expanded", "true");
  painel.querySelector(".campo-busca").focus();
}

function fecharPainel() {
  painel.hidden = true;
  botaoFlutuante.setAttribute("aria-expanded", "false");
  botaoFlutuante.focus();
}

botaoFlutuante.addEventListener("click", () => {
  painelAberto() ? fecharPainel() : abrirPainel();
});
painel.querySelector(".fechar").addEventListener("click", fecharPainel);

document.addEventListener("keydown", evento => {
  const alvo = document.activeElement;
  const digitandoEmCampo = alvo && (alvo.tagName === "INPUT" || alvo.tagName === "TEXTAREA");
  const bloco = blocos.find(b => b.nome === (painelAberto() ? "painel" : "inicio"));
  if (!bloco) return;

  if (evento.key === "/" && !digitandoEmCampo) {
    evento.preventDefault();
    bloco.campo.focus();
    bloco.campo.select();
  }

  if (evento.key === "Escape") {
    evento.preventDefault();
    if (bloco.campo.value) {
      bloco.campo.value = "";
      bloco.atualizar();
      bloco.campo.focus();
    } else if (painelAberto()) {
      fecharPainel();
    }
  }
});

document.querySelectorAll("[data-busca]").forEach(montarBusca);

fetch("./perguntas.json", { cache: "no-cache" })
  .then(resposta => {
    if (!resposta.ok) throw new Error("Arquivo não encontrado (erro " + resposta.status + ")");
    return resposta.json();
  })
  .then(dados => {
    perguntas = dados.map(item => ({
      ...item,
      pergunta: String(item.pergunta).normalize("NFC"),
      resposta: String(item.resposta).normalize("NFC")
    }));
    prepararBusca();
    blocos.forEach(b => b.atualizar());
  })
  .catch(erro => {
    console.error(erro);
    const mensagem = `
      <div class="vazio">
        <strong>Não consegui carregar as perguntas.</strong>
        ${escaparHtml(erro.message)}<br><br>
        Se abriu o index.html direto do computador, use um servidor local.
        Se mexeu no perguntas.json, confira vírgulas e aspas.
      </div>`;
    blocos.forEach(b => (b.resultados.innerHTML = mensagem));
  });
