# CP3 — Portfólio pessoal publicado · Alan Silva

Site pessoal desenvolvido para o Checkpoint 2 da disciplina de Desenvolvimento
Front-end, evoluindo o CP1 com **Flexbox, Grid e media queries (mobile-first)**, usando **HTML5 semântico**, **CSS3** e **JavaScript puro** (sem frameworks).

## Estrutura de pastas

```
CP2_Alan_Silva_Turma/
├── index.html          → Página inicial (quem sou, avatar, interesses)
├── curriculo.html       → Formação, projetos e tabela de habilidades
├── formulario.html       → Formulário de contato (8 tipos de campo)
├── multimidia.html      → Vídeo de apresentação (<video>) e mapa (<iframe>)
├── graficos.html         → Gráfico em <canvas> (JS) e gráfico em SVG (CSS)
├── css/
│   └── estilos.css      → Folha de estilos única, usada por todas as páginas
├── js/
│   └── scripts.js       → Script único: tema, formulário, localStorage e gráfico canvas
├── img/
│   ├── avatar.jpg       → Monograma "AS" gerado como avatar
│   └── intro.mp4        → Vídeo curto de abertura do portfólio
└── README.md
```

## CP3 — o que foi adicionado

- **Repositório GitHub** com histórico de commits, `.gitignore` e a tag `cp3-entrega`.
- **Site publicado** com HTTPS (GitHub Pages) — as 5 páginas interligadas.
- **Feature interativa com persistência em `localStorage`** (`js/scripts.js`):
  - **Mensagens salvas**: ao enviar o formulário, a mensagem é gravada no navegador e listada
    abaixo dele, com botão para excluir uma mensagem ou apagar todas.
  - **Rascunho automático**: o que o usuário digita é salvo enquanto escreve e restaurado ao voltar.
  - **Tema claro/escuro**: botão no cabeçalho de todas as páginas; a escolha é lembrada.
- **Formulário com validação e feedback visível**: validação em JavaScript com mensagem de erro
  abaixo de cada campo, destaque em vermelho, foco no primeiro campo inválido e aviso de sucesso
  (regiões `aria-live` para leitores de tela).
- O script do gráfico (canvas) saiu do HTML e foi para `js/scripts.js`; o gráfico respeita o tema.

### Chaves usadas no localStorage

| Chave | Conteúdo |
|---|---|
| `cp3:tema` | `"claro"` ou `"escuro"` |
| `cp3:mensagens` | lista de mensagens enviadas (JSON) |
| `cp3:rascunho` | rascunho atual do formulário (JSON) |

## Como visualizar

Online: veja a URL do site publicado na entrega da atividade.

Localmente:

1. Extraia o `.zip` em qualquer pasta.
2. Abra `index.html` diretamente no navegador (duplo clique) — não é
   necessário servidor local, pois todos os caminhos são relativos.
3. Navegue pelo menu no topo, presente e idêntico em todas as páginas.

## Requisitos atendidos

- **Estrutura semântica**: `header`, `nav`, `main`, `section`, `article` e
  `footer` usados de acordo com o papel de cada bloco.
- **Menu**: idêntico nas 5 páginas, com links relativos (`index.html`,
  `curriculo.html` etc.) e indicação da página atual via `aria-current="page"`.
- **Formulário** (`formulario.html`): campos `text`, `email`, `tel`, `date`,
  `select`, `radio`, `textarea` e `checkbox`, todos com `<label>` associada e
  validação nativa (`required`, `type="email"`, `pattern`, `minlength`).
- **Multimídia** (`multimidia.html`): `<video controls>` com um vídeo próprio
  (`img/intro.mp4`) e um `<iframe>` funcional com mapa do OpenStreetMap.
- **Gráficos** (`graficos.html`): `<canvas>` desenhado via JavaScript (gráfico
  de barras de habilidades) e um SVG de rosca (interesses) estilizado
  inteiramente via `css/estilos.css`, sem `style` inline.
- **CSS externo**: único arquivo `css/estilos.css`, vinculado com `<link>` em
  todas as páginas — nenhum `style="..."` ou `<style>` embutido no HTML.
- **Validação**: as 5 páginas foram testadas no validador Nu Html Checker
  (mesmo motor do W3C Markup Validator) sem erros.

## Responsividade (CP2)

- **Viewport**: `<meta name="viewport" content="width=device-width, initial-scale=1.0">` nas 5 páginas.
- **Flexbox**: cabeçalho/menu (coluna no celular, linha a partir de 640px, com quebra de linha
  dos links), hero da página inicial, lista de tags, botões do formulário e rodapé.
- **Grid**:
  - `index.html`: cartões de interesses em 1 → 2 → 4 colunas;
  - `curriculo.html`: projetos em 1 → 2 → 3 colunas;
  - `formulario.html`: campos em 1 → 2 colunas;
  - `multimidia.html` e `graficos.html`: duas seções lado a lado a partir de 900px.
- **Media queries mobile-first** (`min-width: 640px` e `min-width: 900px`), em `css/estilos.css`,
  com efeito em todas as páginas.
- **Mídias responsivas**: `img, video, iframe, canvas, svg { max-width: 100%; height: auto; }`;
  o iframe do YouTube mantém proporção 16:9 e a tabela rola na horizontal em telas estreitas.

## Paleta e tipografia

- Cores: verde-azulado `#2f6f5e` (principal), dourado `#b98a2e` (destaque),
  fundo `#f3f6f2` e tinta `#1c2521`, remetendo a placas de circuito e cadernos
  técnicos — alinhado ao interesse do autor por hardware e automação.
- Tipografia: `Trebuchet MS` para títulos (geométrica) e `Georgia` para o
  corpo do texto (serifada, boa legibilidade).

## Autor

Alan Silva — Centro Universitário Braz Cubas.
GitHub: [github.com/AqyyA](https://github.com/AqyyA)
