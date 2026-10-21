// Matheus Trombaco — orçamento ao vivo, índice de lugares e entradas.

const email = 'trombaco.almeida01@gmail.com';

/* ---------- O orçamento: o nome que você escreve vira a primeira tela ---------- */
const tipos = {
  padaria: {
    rotulo: 'padaria', padrao: 'Padaria da Rosa', esquema: 0,
    links: 'Cardápio', tag: 'Pão francês saindo às 6h, bolo de fubá às 15h.',
    itens: [['Pão francês', 'R$ 0,90'], ['Bolo de fubá', 'R$ 18,00'], ['Café coado', 'R$ 5,00']],
    horario: 'Seg a sáb, 6h às 19h', cta: 'Encomendar no WhatsApp',
    pacote: 'Página única com cardápio, horários, mapa e WhatsApp', preco: 'R$ 450'
  },
  oficina: {
    rotulo: 'oficina', padrao: 'Oficina do Zé', esquema: 1,
    links: 'Serviços', tag: 'Revisão, freios e suspensão, com orçamento pelo WhatsApp.',
    itens: [['Troca de óleo', 'R$ 180'], ['Alinhamento', 'R$ 120'], ['Revisão completa', 'R$ 450']],
    horario: 'Seg a sex, 8h às 18h', cta: 'Agendar horário',
    pacote: 'Página com serviços, preços e agenda de horários', preco: 'R$ 600'
  },
  salao: {
    rotulo: 'salão', padrao: 'Salão Bela Flor', esquema: 2,
    links: 'Serviços', tag: 'Corte, escova e unhas com hora marcada.',
    itens: [['Corte feminino', 'R$ 70'], ['Escova', 'R$ 45'], ['Manicure', 'R$ 35']],
    horario: 'Ter a sáb, 9h às 20h', cta: 'Marcar horário',
    pacote: 'Página com serviços, preços, fotos e agenda', preco: 'R$ 600'
  },
  restaurante: {
    rotulo: 'restaurante', padrao: 'Sabor da Terra', esquema: 3,
    links: 'Cardápio', tag: 'Marmita de segunda a sexta, feijoada no sábado.',
    itens: [['Marmita média', 'R$ 22'], ['Prato executivo', 'R$ 28'], ['Feijoada', 'R$ 35']],
    horario: 'Seg a sáb, 11h às 15h', cta: 'Pedir no WhatsApp',
    pacote: 'Cardápio online que você mesmo atualiza', preco: 'R$ 600'
  }
};

const mock = document.getElementById('mock');
const nome = document.getElementById('nome-negocio');
const bairro = document.getElementById('bairro');
const marca = document.getElementById('mock-brand');
const titulo = document.getElementById('mock-name');
const pedir = document.getElementById('pedir');
const linhaPreco = document.getElementById('quote-line');
let tipoAtual = 'padaria';
let esquema = 0;

function texto() { return nome.value.trim() || 'Seu negócio'; }

function desenhar(animar) {
  const t = tipos[tipoAtual];
  marca.textContent = texto();
  titulo.textContent = texto();
  document.getElementById('mock-tag').textContent = t.tag;
  document.getElementById('mock-list').innerHTML = t.itens
    .map(([a, b]) => `<li><span>${a}</span><span>${b}</span></li>`).join('');
  document.getElementById('mock-where').textContent = `${bairro.value}, Londrina · ${t.horario}`;
  mock.querySelector('.mock-cta').textContent = t.cta;
  mock.querySelector('.mock-links').innerHTML = `${t.links} <span>Horários</span> <span>Onde fica</span>`;
  mock.dataset.scheme = String(esquema);
  linhaPreco.innerHTML = `${t.pacote}: <strong>${t.preco}</strong>, no ar em cerca de duas semanas.`;
  atualizarPedido();
  if (animar) {
    mock.classList.remove('swap');
    void mock.offsetWidth;
    mock.classList.add('swap');
  }
}

function atualizarPedido() {
  const t = tipos[tipoAtual];
  const assunto = `Orçamento de site: ${texto()}`;
  const corpo = `Olá, Matheus!\n\nTenho um negócio do tipo ${t.rotulo}, chamado ${texto()}, no bairro ${bairro.value}, em Londrina. ` +
    `Quero um site como o que vi no seu orçamento.\n\nEstimativa mostrada: ${t.pacote}, ${t.preco}.\n\nMeu WhatsApp: `;
  pedir.href = `mailto:${email}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
}

document.querySelectorAll('.kinds button').forEach((botao) => {
  botao.addEventListener('click', () => {
    const anterior = tipos[tipoAtual];
    tipoAtual = botao.dataset.kind;
    document.querySelectorAll('.kinds button').forEach((b) => b.setAttribute('aria-checked', String(b === botao)));
    // keep a name the visitor typed; swap only the sample name
    if (!nome.value.trim() || nome.value.trim() === anterior.padrao) nome.value = tipos[tipoAtual].padrao;
    esquema = tipos[tipoAtual].esquema;
    desenhar(true);
  });
});

// arrow keys move between the kinds, as in a radio group
document.querySelector('.kinds').addEventListener('keydown', (e) => {
  if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
  const botoes = [...document.querySelectorAll('.kinds button')];
  const i = botoes.findIndex((b) => b.getAttribute('aria-checked') === 'true');
  const prox = botoes[(i + (e.key === 'ArrowRight' ? 1 : botoes.length - 1)) % botoes.length];
  prox.focus(); prox.click();
});

nome.addEventListener('input', () => desenhar(false));
bairro.addEventListener('change', () => desenhar(false));
document.getElementById('trocar').addEventListener('click', () => {
  esquema = (esquema + 1) % 4;
  desenhar(true);
});
desenhar(false);

/* ---------- O cupom: abre o e-mail com tudo escrito ---------- */
const cupom = document.getElementById('coupon');
cupom.addEventListener('submit', (e) => {
  e.preventDefault();
  const v = (id) => document.getElementById(id).value.trim();
  const assunto = `Orçamento de site${v('c-negocio') ? `: ${v('c-negocio')}` : ''}`;
  const corpo = `Olá, Matheus!\n\nMeu nome é ${v('c-nome')}.` +
    (v('c-negocio') ? `\nNegócio: ${v('c-negocio')}` : '') +
    (v('c-zap') ? `\nWhatsApp: ${v('c-zap')}` : '') +
    (v('c-msg') ? `\n\nO que preciso: ${v('c-msg')}` : '');
  window.location.href = `mailto:${email}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
});
// on a phone the perforation runs across; the notches follow it
function posicionarNotch() {
  cupom.style.setProperty('--notch-y', `${cupom.querySelector('.coupon-left').offsetHeight}px`);
}
posicionarNotch();
window.addEventListener('resize', posicionarNotch);

/* ---------- Índice com prévia ---------- */
const indice = document.getElementById('index');
const previa = document.getElementById('preview-img');
const ponteiroFino = window.matchMedia('(hover: hover) and (pointer: fine)');
let troca;
function mostrar(link) {
  indice.classList.add('dim');
  indice.querySelectorAll('a').forEach((a) => a.classList.toggle('on', a === link));
  if (previa.getAttribute('src') === link.dataset.src) return;
  clearTimeout(troca);
  previa.classList.add('out');
  troca = setTimeout(() => {
    previa.src = link.dataset.src;
    previa.alt = link.dataset.alt;
    previa.classList.remove('out');
  }, 120);
}
indice.querySelectorAll('a').forEach((link) => {
  link.addEventListener('pointerenter', () => { if (ponteiroFino.matches) mostrar(link); });
  link.addEventListener('focus', () => mostrar(link));
});
indice.addEventListener('pointerleave', () => {
  indice.classList.remove('dim');
  indice.querySelectorAll('a').forEach((a) => a.classList.remove('on'));
});

/* ---------- Entradas: cada parte sobe quando a seção aparece ---------- */
const partes = document.querySelectorAll('[data-rise]');
const contagem = new Map();
partes.forEach((el) => {
  const secao = el.closest('section, footer') || document.body;
  const n = contagem.get(secao) || 0;
  contagem.set(secao, n + 1);
  el.style.setProperty('--d', `${Math.min(n, 4) * 80}ms`);
});
if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -5% 0px', threshold: 0 });
  partes.forEach((el) => obs.observe(el));
  // a fast scroll can skip past a part; anything already above the fold's bottom is shown
  let agendado = false;
  const conferir = () => {
    agendado = false;
    partes.forEach((el) => { if (!el.classList.contains('in') && el.getBoundingClientRect().top < innerHeight) el.classList.add('in'); });
  };
  addEventListener('scroll', () => { if (!agendado) { agendado = true; requestAnimationFrame(conferir); } }, { passive: true });
} else {
  partes.forEach((el) => el.classList.add('in'));
}
