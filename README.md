# 🌙 GinanRM - Ghost Theme

Um tema Ghost moderno e dark inspirado em estética gótica e cyberpunk. Projetado para ensinar IA de forma envolvente e misteriosa.

![GinanRM Preview](https://raw.githubusercontent.com/RegiaJG/ginanrm-theme/main/assets/images/GinanRM.png)

## ✨ Características

- 🎨 **Design Dark e Gótico** - Cores escuras, roxos e efeitos neon
- 📱 **Mobile First** - Totalmente responsivo e otimizado para dispositivos móveis
- 🤖 **Charlotte Helper** - Mascote interativo que guia os usuários
- 🎠 **Slider de Destaques** - Carousel automático para posts em destaque
- 🔍 **Busca Integrada** - Modal de busca com atalho (Ctrl+K) e injeção de código customizada
- 🌙 **Animações Suaves** - Transições e efeitos visuais elegantes
- 🎯 **SEO Otimizado** - Estrutura semântica e meta tags
- 🌐 **Multilíngue** - Suporte a pt-BR e en

## 🚀 Instalação

### Opção 1: Upload via Ghost Admin

1. Compacte a pasta do tema em um arquivo `.zip`
2. Acesse o Ghost Admin → Settings → Theme
3. Clique em "Upload a theme"
4. Selecione o arquivo `.zip`
5. Ative o tema

### Opção 2: Instalação Manual

1. Clone ou copie a pasta do tema para `content/themes/`
2. Reinicie o Ghost
3. Ative o tema no Ghost Admin

## 📁 Estrutura do Tema

```
ginanrm/
├── assets/
│   ├── css/
│   │   └── main.css          # Estilos principais
│   ├── js/
│   │   └── main.js           # JavaScript do tema
│   └── images/
│       ├── Charlotte.png     # Mascote (ADICIONE!)
│       ├── hero-city.jpg     # Background hero (ADICIONE!)
│       ├── logo.svg          # Logo do site
│       └── placeholder.jpg   # Placeholder para posts
│
├── partials/                 # Componentes reutilizáveis
│   ├── header.hbs
│   ├── footer.hbs
│   ├── post-card.hbs
│   ├── sidebar.hbs
│   └── ...
│
├── custom/                   # Templates de página customizados
│   ├── page-ferramentas.hbs
│   ├── page-downloads.hbs
│   ├── page-sobre.hbs
│   └── page-lab.hbs
│
├── locales/                  # Traduções
│   ├── pt-BR.json
│   └── en.json
│
├── default.hbs               # Layout base
├── index.hbs                 # Página inicial
├── post.hbs                  # Post individual
├── page.hbs                  # Página genérica
├── tag.hbs                   # Listagem por tag
├── author.hbs                # Página de autor
├── error.hbs                 # Página de erro
├── search.hbs                # Página de busca customizada
├── search-injection-code.js  # Injeção de funcionalidade de busca
└── package.json              # Configurações do tema
```

## 🎨 Personalização

### Cores do Tema

Acesse Ghost Admin → Settings → Design → Site-wide para customizar:

- **Primary Color** - Cor principal (padrão: cyan neon `#00f5d4`)
- **Accent Color** - Cor de destaque (padrão: roxo `#8338ec`)

### Opções do Tema

O tema oferece várias opções configuráveis:

| Opção | Descrição |
|-------|-----------|
| `navigation_layout` | Posição do logo (esquerda/centro) |
| `header_style` | Estilo do header (transparente/sólido/gradiente) |
| `hero_style` | Estilo do hero (completo/minimal/com Charlotte) |
| `show_featured_slider` | Exibir slider de posts em destaque |
| `show_sidebar` | Exibir sidebar na home |
| `enable_animations` | Habilitar animações |
| `show_charlotte_helper` | Exibir mascote Charlotte |
| `footer_text` | Texto do rodapé |

## 🖼️ Imagens Necessárias

Adicione as seguintes imagens na pasta `assets/images/`:

1. **`Charlotte.png`** - Imagem do mascote Charlotte (PNG com transparência, ~500x500px)
2. **`hero-city.jpg`** - Background da cidade para o hero (1920x1080px ou maior)
3. **`logo.svg`** - Logo do site em SVG
4. **`placeholder.jpg`** - Imagem placeholder para posts sem imagem

## 📝 Templates de Página

O tema inclui templates customizados para páginas específicas:

- **Ferramentas** (`page-ferramentas.hbs`) - Para listar ferramentas de IA
- **Downloads** (`page-downloads.hbs`) - Para área de downloads
- **Sobre** (`page-sobre.hbs`) - Página institucional
- **The Lab** (`page-lab.hbs`) - Para projetos experimentais

Para usar, crie uma página no Ghost e selecione o template no editor.

## ⌨️ Atalhos de Teclado

- `Ctrl/Cmd + K` - Abrir busca
- `ESC` - Fechar modais

## 🎯 Navegação Recomendada

Configure no Ghost Admin → Settings → Navigation:

**Primária:**
- Home → /
- Engineering → /tag/engenharia/
- The Lab → /lab/
- Donate → /donate/

**Secundária:**
- Ferramentas → /ferramentas/
- Downloads → /downloads/
- Sobre → /sobre/

## 🔧 Desenvolvimento

Para desenvolvimento local:

```bash
# Instalar dependências
npm install

# Desenvolvimento com watch
npm run dev

# Build para produção
npm run build

# Criar arquivo zip para upload no Ghost
npm run zip
```

## 📄 Licença

MIT License - Sinta-se livre para usar e modificar!

---

Desenvolvido por **[Lucas Costa Nogueira](https://github.com/RegiaJG)**
