# 🌙 GinanRM - Ghost Theme

A modern dark Ghost theme inspired by gothic and cyberpunk aesthetics. Designed to teach AI in an engaging and mysterious way.

![GinanRM Preview](https://raw.githubusercontent.com/RegiaJG/ginanrm-theme/main/assets/images/GinanRM.png)

## ✨ Features

- 🎨 **Dark & Gothic Design** - Dark colors, purples and neon effects
- 📱 **Mobile First** - Fully responsive and optimized for mobile devices
- 🤖 **Charlotte Helper** - Interactive mascot that guides users
- 🎠 **Featured Slider** - Automatic carousel for featured posts
- 🔍 **Integrated Search** - Search modal with shortcut (Ctrl+K) and custom code injection
- 🌙 **Smooth Animations** - Elegant transitions and visual effects
- 🎯 **SEO Optimized** - Semantic structure and meta tags
- 🌐 **Multilingual** - Support for pt-BR and en

## 🚀 Installation

### Option 1: Upload via Ghost Admin

1. Compress the theme folder into a `.zip` file
2. Go to Ghost Admin → Settings → Theme
3. Click "Upload a theme"
4. Select the `.zip` file
5. Activate the theme

### Option 2: Manual Installation

1. Clone or copy the theme folder to `content/themes/`
2. Restart Ghost
3. Activate the theme in Ghost Admin

## 📁 Theme Structure

```
ginanrm/
├── assets/
│   ├── css/
│   │   └── main.css          # Main styles
│   ├── js/
│   │   └── main.js           # Theme JavaScript
│   └── images/
│       ├── Charlotte.png     # Mascot (ADD!)
│       ├── hero-city.jpg     # Hero background (ADD!)
│       ├── logo.svg          # Site logo
│       └── placeholder.jpg   # Placeholder for posts
│
├── partials/                 # Reusable components
│   ├── header.hbs
│   ├── footer.hbs
│   ├── post-card.hbs
│   ├── sidebar.hbs
│   └── ...
│
├── custom/                   # Custom page templates
│   ├── page-ferramentas.hbs
│   ├── page-downloads.hbs
│   ├── page-sobre.hbs
│   └── page-lab.hbs
│
├── locales/                  # Translations
│   ├── pt-BR.json
│   └── en.json
│
├── default.hbs               # Base layout
├── index.hbs                 # Home page
├── post.hbs                  # Individual post
├── page.hbs                  # Generic page
├── tag.hbs                   # Tag listing
├── author.hbs                # Author page
├── error.hbs                 # Error page
├── search.hbs                # Custom search page
├── search-injection-code.js  # Search feature injection
└── package.json              # Theme settings
```

## 🎨 Customization

### Theme Colors

Go to Ghost Admin → Settings → Design → Site-wide to customize:

- **Primary Color** - Main color (default: neon cyan `#00f5d4`)
- **Accent Color** - Highlight color (default: purple `#8338ec`)

### Theme Options

The theme offers several configurable options:

| Option | Description |
|--------|-------------|
| `navigation_layout` | Logo position (left/center) |
| `header_style` | Header style (transparent/solid/gradient) |
| `hero_style` | Hero style (full/minimal/with Charlotte) |
| `show_featured_slider` | Show featured posts slider |
| `show_sidebar` | Show sidebar on home |
| `enable_animations` | Enable animations |
| `show_charlotte_helper` | Show Charlotte mascot |
| `footer_text` | Footer text |

## 🖼️ Required Images

Add the following images to the `assets/images/` folder:

1. **`Charlotte.png`** - Charlotte mascot image (PNG with transparency, ~500x500px)
2. **`hero-city.jpg`** - City background for the hero section (1920x1080px or larger)
3. **`logo.svg`** - Site logo in SVG format
4. **`placeholder.jpg`** - Placeholder image for posts without a featured image

## 📝 Page Templates

The theme includes custom templates for specific pages:

- **Tools** (`page-ferramentas.hbs`) - For listing AI tools
- **Downloads** (`page-downloads.hbs`) - For download area
- **About** (`page-sobre.hbs`) - Institutional page
- **The Lab** (`page-lab.hbs`) - For experimental projects

To use, create a page in Ghost and select the template in the editor.

## ⌨️ Keyboard Shortcuts

- `Ctrl/Cmd + K` - Open search
- `ESC` - Close modals

## 🎯 Recommended Navigation

Configure in Ghost Admin → Settings → Navigation:

**Primary:**
- Home → /
- Engineering → /tag/engenharia/
- The Lab → /lab/
- Donate → /donate/

**Secondary:**
- Tools → /ferramentas/
- Downloads → /downloads/
- About → /sobre/

## 🔧 Development

For local development:

```bash
# Install dependencies
npm install

# Development with watch
npm run dev

# Production build
npm run build

# Create zip file for Ghost upload
npm run zip
```

## 📄 License

MIT License - Feel free to use and modify!

---

Developed by **[Lucas Costa Nogueira](https://github.com/RegiaJG)**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Lucas%20Costa%20Nogueira-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/lucas-nogueira-017b12191)
[![GitHub](https://img.shields.io/badge/GitHub-RegiaJG-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/RegiaJG)
