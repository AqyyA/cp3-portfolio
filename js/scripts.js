/* =========================================================
   CP3 — Portfólio de Alan Silva
   scripts.js — usado por todas as páginas (data-page no <body>)
   Recursos: tema claro/escuro, formulário com validação,
   histórico de mensagens e rascunho (localStorage), gráfico canvas.
   ========================================================= */
(function () {
  'use strict';

  var CHAVES = {
    tema: 'cp3:tema',
    mensagens: 'cp3:mensagens',
    rascunho: 'cp3:rascunho'
  };

  /* ---------- localStorage seguro ---------- */
  function ler(chave, padrao) {
    try {
      var bruto = localStorage.getItem(chave);
      return bruto === null ? padrao : JSON.parse(bruto);
    } catch (e) {
      return padrao;
    }
  }

  function gravar(chave, valor) {
    try {
      localStorage.setItem(chave, JSON.stringify(valor));
      return true;
    } catch (e) {
      return false;
    }
  }

  function remover(chave) {
    try { localStorage.removeItem(chave); } catch (e) { /* ignora */ }
  }

  /* ---------- Tema claro/escuro (todas as páginas) ---------- */
  function iniciarTema() {
    var botao = document.getElementById('theme-toggle');
    if (!botao) return;

    function aplicar(tema) {
      document.documentElement.setAttribute('data-theme', tema);
      var escuro = tema === 'escuro';
      botao.setAttribute('aria-pressed', String(escuro));
      botao.textContent = escuro ? 'Modo claro' : 'Modo escuro';
    }

    var salvo = ler(CHAVES.tema, null);
    if (!salvo && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      salvo = 'escuro';
    }
    aplicar(salvo || 'claro');

    botao.addEventListener('click', function () {
      var novo = document.documentElement.getAttribute('data-theme') === 'escuro' ? 'claro' : 'escuro';
      aplicar(novo);
      gravar(CHAVES.tema, novo);
      if (document.body.dataset.page === 'graficos') desenharGrafico();
    });
  }

  /* ---------- Formulário de contato ---------- */
  var ROTULOS = { email: 'E-mail', telefone: 'Telefone', whatsapp: 'WhatsApp' };
  var ASSUNTOS = {
    projeto: 'Proposta de projeto',
    estagio: 'Oportunidade de estágio',
    duvida: 'Dúvida sobre um trabalho',
    outro: 'Outro assunto'
  };

  function iniciarFormulario() {
    var form = document.getElementById('form-contato');
    if (!form) return;

    var feedback = document.getElementById('form-feedback');
    var lista = document.getElementById('lista-mensagens');
    var vazia = document.getElementById('msg-vazia');
    var btnLimpar = document.getElementById('limpar-historico');
    var contador = document.getElementById('contador');
    var campos = ['nome', 'email', 'telefone', 'data', 'assunto', 'mensagem'];

    function el(id) { return document.getElementById(id); }

    function mostrarErro(id, texto) {
      var campo = el(id);
      var erro = el('erro-' + id);
      campo.setAttribute('aria-invalid', 'true');
      campo.setAttribute('aria-describedby', 'erro-' + id);
      erro.textContent = texto;
      erro.hidden = false;
    }

    function limparErro(id) {
      var campo = el(id);
      var erro = el('erro-' + id);
      campo.removeAttribute('aria-invalid');
      campo.removeAttribute('aria-describedby');
      erro.textContent = '';
      erro.hidden = true;
    }

    function validarCampo(id) {
      var valor = el(id).value.trim();
      limparErro(id);

      if (id === 'nome') {
        if (!valor) return mostrarErro(id, 'Informe seu nome completo.'), false;
        if (valor.length < 3) return mostrarErro(id, 'O nome precisa ter pelo menos 3 caracteres.'), false;
      }
      if (id === 'email') {
        if (!valor) return mostrarErro(id, 'Informe seu e-mail.'), false;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor)) {
          return mostrarErro(id, 'E-mail inválido. Exemplo: voce@exemplo.com'), false;
        }
      }
      if (id === 'telefone' && valor) {
        if (!/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(valor)) {
          return mostrarErro(id, 'Telefone inválido. Use o formato (11) 91234-5678.'), false;
        }
      }
      if (id === 'data' && valor) {
        var hoje = new Date();
        var iso = hoje.getFullYear() + '-' +
          String(hoje.getMonth() + 1).padStart(2, '0') + '-' +
          String(hoje.getDate()).padStart(2, '0');
        if (valor < iso) return mostrarErro(id, 'Escolha uma data de hoje em diante.'), false;
      }
      if (id === 'assunto' && !valor) {
        return mostrarErro(id, 'Selecione um assunto.'), false;
      }
      if (id === 'mensagem') {
        if (!valor) return mostrarErro(id, 'Escreva sua mensagem.'), false;
        if (valor.length < 10) return mostrarErro(id, 'A mensagem precisa ter pelo menos 10 caracteres.'), false;
      }
      return true;
    }

    function mostrarFeedback(tipo, texto) {
      feedback.className = 'feedback feedback-' + tipo;
      feedback.textContent = texto;
      feedback.hidden = false;
    }

    function atualizarContador() {
      contador.textContent = el('mensagem').value.length;
    }

    /* rascunho automático */
    function salvarRascunho() {
      var dados = {};
      campos.forEach(function (id) { dados[id] = el(id).value; });
      dados.preferencia = (form.querySelector('input[name="preferencia"]:checked') || {}).value || 'email';
      dados.newsletter = el('newsletter').checked;
      gravar(CHAVES.rascunho, dados);
    }

    function restaurarRascunho() {
      var d = ler(CHAVES.rascunho, null);
      if (!d) return;
      campos.forEach(function (id) { if (d[id] !== undefined) el(id).value = d[id]; });
      var radio = form.querySelector('input[name="preferencia"][value="' + d.preferencia + '"]');
      if (radio) radio.checked = true;
      el('newsletter').checked = !!d.newsletter;
      atualizarContador();
      if (campos.some(function (id) { return d[id]; })) {
        mostrarFeedback('info', 'Rascunho anterior restaurado automaticamente.');
      }
    }

    /* histórico de mensagens */
    function criarItem(msg) {
      var li = document.createElement('li');
      li.className = 'msg-item';

      var topo = document.createElement('div');
      topo.className = 'msg-topo';
      var titulo = document.createElement('strong');
      titulo.textContent = msg.nome + ' — ' + (ASSUNTOS[msg.assunto] || msg.assunto);
      var remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'btn-link';
      remove.textContent = 'Excluir';
      remove.setAttribute('aria-label', 'Excluir mensagem de ' + msg.nome);
      remove.addEventListener('click', function () { excluirMensagem(msg.id); });
      topo.appendChild(titulo);
      topo.appendChild(remove);

      var meta = document.createElement('p');
      meta.className = 'msg-meta';
      meta.textContent = new Date(msg.criadaEm).toLocaleString('pt-BR') +
        ' · ' + msg.email + ' · preferência: ' + (ROTULOS[msg.preferencia] || msg.preferencia);

      var texto = document.createElement('p');
      texto.className = 'msg-texto';
      texto.textContent = msg.mensagem;

      li.appendChild(topo);
      li.appendChild(meta);
      li.appendChild(texto);
      return li;
    }

    function renderizarLista() {
      var mensagens = ler(CHAVES.mensagens, []);
      lista.innerHTML = '';
      mensagens.forEach(function (m) { lista.appendChild(criarItem(m)); });
      vazia.hidden = mensagens.length > 0;
      btnLimpar.hidden = mensagens.length === 0;
    }

    function excluirMensagem(id) {
      var mensagens = ler(CHAVES.mensagens, []).filter(function (m) { return m.id !== id; });
      gravar(CHAVES.mensagens, mensagens);
      renderizarLista();
      mostrarFeedback('info', 'Mensagem excluída.');
    }

    /* eventos */
    campos.forEach(function (id) {
      var campo = el(id);
      campo.addEventListener('blur', function () { validarCampo(id); });
      campo.addEventListener('input', function () {
        if (campo.getAttribute('aria-invalid')) validarCampo(id);
        if (id === 'mensagem') atualizarContador();
        salvarRascunho();
      });
      campo.addEventListener('change', salvarRascunho);
    });
    form.addEventListener('change', salvarRascunho);

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var validos = campos.map(validarCampo);
      var primeiroInvalido = campos.filter(function (_, i) { return !validos[i]; })[0];

      if (primeiroInvalido) {
        mostrarFeedback('erro', 'Corrija os campos destacados e envie novamente.');
        el(primeiroInvalido).focus();
        return;
      }

      var mensagens = ler(CHAVES.mensagens, []);
      mensagens.unshift({
        id: Date.now(),
        criadaEm: new Date().toISOString(),
        nome: el('nome').value.trim(),
        email: el('email').value.trim(),
        telefone: el('telefone').value.trim(),
        data: el('data').value,
        assunto: el('assunto').value,
        preferencia: form.querySelector('input[name="preferencia"]:checked').value,
        newsletter: el('newsletter').checked,
        mensagem: el('mensagem').value.trim()
      });

      if (!gravar(CHAVES.mensagens, mensagens)) {
        mostrarFeedback('erro', 'Não foi possível salvar: o armazenamento do navegador está indisponível.');
        return;
      }

      remover(CHAVES.rascunho);
      form.reset();
      campos.forEach(limparErro);
      atualizarContador();
      renderizarLista();
      mostrarFeedback('sucesso', 'Mensagem enviada com sucesso! Ela foi salva na lista abaixo.');
      feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    form.addEventListener('reset', function () {
      remover(CHAVES.rascunho);
      campos.forEach(limparErro);
      feedback.hidden = true;
      setTimeout(atualizarContador, 0);
    });

    btnLimpar.addEventListener('click', function () {
      if (window.confirm('Apagar todas as mensagens salvas neste navegador?')) {
        remover(CHAVES.mensagens);
        renderizarLista();
        mostrarFeedback('info', 'Todas as mensagens foram apagadas.');
      }
    });

    restaurarRascunho();
    renderizarLista();
  }

  /* ---------- Gráfico de barras em canvas ---------- */
  function desenharGrafico() {
    var canvas = document.getElementById('grafico-habilidades');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var estilo = getComputedStyle(document.documentElement);
    var cor = function (v) { return estilo.getPropertyValue(v).trim(); };

    var dados = [
      { nome: 'HTML/CSS', valor: 90 },
      { nome: 'Excel', valor: 85 },
      { nome: 'Python', valor: 70 },
      { nome: 'Git/GitHub', valor: 65 },
      { nome: 'Azure AI', valor: 55 }
    ];

    var largura = canvas.width;
    var altura = canvas.height;
    var mE = 50, mB = 50, mT = 20, mD = 20;
    var areaLargura = largura - mE - mD;
    var areaAltura = altura - mT - mB;
    var maxValor = 100;

    ctx.clearRect(0, 0, largura, altura);

    ctx.strokeStyle = cor('--ink-soft');
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(mE, mT);
    ctx.lineTo(mE, altura - mB);
    ctx.lineTo(largura - mD, altura - mB);
    ctx.stroke();

    ctx.strokeStyle = cor('--line');
    ctx.fillStyle = cor('--ink-soft');
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'right';
    for (var g = 0; g <= 100; g += 20) {
      var y = altura - mB - (g / maxValor) * areaAltura;
      ctx.beginPath();
      ctx.moveTo(mE, y);
      ctx.lineTo(largura - mD, y);
      ctx.stroke();
      ctx.fillText(g + '%', mE - 8, y + 4);
    }

    var espacamento = areaLargura / dados.length;
    var larguraBarra = espacamento * 0.55;

    dados.forEach(function (item, i) {
      var h = (item.valor / maxValor) * areaAltura;
      var x = mE + i * espacamento + (espacamento - larguraBarra) / 2;
      var yb = altura - mB - h;

      var grad = ctx.createLinearGradient(0, yb, 0, altura - mB);
      grad.addColorStop(0, cor('--accent-teal'));
      grad.addColorStop(1, cor('--accent-teal-dark'));
      ctx.fillStyle = grad;
      ctx.fillRect(x, yb, larguraBarra, h);

      ctx.fillStyle = cor('--ink');
      ctx.textAlign = 'center';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(item.valor + '%', x + larguraBarra / 2, yb - 8);

      ctx.fillStyle = cor('--ink-soft');
      ctx.font = '12px sans-serif';
      ctx.fillText(item.nome, x + larguraBarra / 2, altura - mB + 18);
    });
  }

  /* ---------- Inicialização ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    iniciarTema();
    iniciarFormulario();
    desenharGrafico();
  });
})();
