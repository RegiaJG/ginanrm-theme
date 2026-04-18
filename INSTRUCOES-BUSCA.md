# Instruções para Configurar a Busca no Ghost

## Método: Code Injection no Header da Página Search

### Passo 1: Criar/Editar a Página Search no Ghost Admin

1. Acesse o **Ghost Admin**
2. Vá em **Pages** (Páginas)
3. Procure por uma página chamada "Search" ou "Busca"
   - Se não existir, clique em **New Page** (Nova Página)
   - Se existir, clique para editar
4. Configure a página:
   - **Title**: "Busca" ou "Search"
   - **Slug**: `search` (IMPORTANTE: deve ser exatamente "search")
   - **Content**: Deixe vazio ou adicione algum texto explicativo

### Passo 2: Adicionar Code Injection

1. Na página Search, clique no ícone de **engrenagem** (Settings) no canto superior direito
2. Role até a seção **Code injection**
3. No campo **Site Header**, cole o código abaixo
4. Clique em **Save** (Salvar)

### Código para Code Injection (Site Header):

```javascript
<script>
(function() {
    'use strict';
    
    // Aguardar o DOM estar pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSearch);
    } else {
        initSearch();
    }
    
    function initSearch() {
        // Verificar se estamos na página de busca
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('q');
        
        if (!searchQuery || searchQuery.trim() === '') {
            return;
        }
        
        console.log('[Ghost Search] Buscando por:', searchQuery);
        
        // Encontrar o container de resultados
        const container = document.querySelector('.gh-content, .post-content, main .container, main') || document.body;
        
        // Criar container de resultados se não existir
        let resultsContainer = document.getElementById('search-results-container');
        if (!resultsContainer) {
            resultsContainer = document.createElement('div');
            resultsContainer.id = 'search-results-container';
            resultsContainer.style.cssText = 'padding: 2rem 0; max-width: 1200px; margin: 0 auto;';
            container.appendChild(resultsContainer);
        }
        
        // Mostrar loading
        resultsContainer.innerHTML = '<div style="text-align: center; padding: 3rem;"><p>Buscando por: <strong>' + escapeHtml(searchQuery) + '</strong></p><p>Carregando resultados...</p></div>';
        
        // Obter URL do site
        const siteUrl = window.location.origin;
        const searchTerm = encodeURIComponent(searchQuery.trim());
        const apiKey = 'a0f485ef2ae52807a2d4cf212f'; // Content API Key
        
        // Tentar buscar via Content API com chave
        const apiUrl = siteUrl + '/ghost/api/content/posts/?key=' + apiKey + '&limit=20&fields=id,title,slug,feature_image,excerpt,published_at,reading_time,primary_author,primary_tag,url&filter=title:~' + searchTerm;
        
        fetch(apiUrl)
            .then(function(response) {
                if (!response.ok) {
                    // Se falhar, tentar sem filtro e filtrar no cliente
                    const apiKey = 'a0f485ef2ae52807a2d4cf212f'; // Content API Key
                    return fetch(siteUrl + '/ghost/api/content/posts/?key=' + apiKey + '&limit=50&fields=id,title,slug,feature_image,excerpt,published_at,reading_time,primary_author,primary_tag,url')
                        .then(function(r) {
                            if (!r.ok) throw new Error('API não acessível: ' + r.status);
                            return r.json();
                        })
                        .then(function(data) {
                            const filtered = filterPosts(data.posts || [], searchQuery);
                            return { posts: filtered };
                        });
                }
                return response.json();
            })
            .then(function(data) {
                renderResults(data.posts || [], searchQuery, resultsContainer, siteUrl);
            })
            .catch(function(error) {
                console.error('[Ghost Search] Erro:', error);
                resultsContainer.innerHTML = '<div style="text-align: center; padding: 3rem;"><h2>Erro na Busca</h2><p>Não foi possível realizar a busca.</p><p style="font-size: 0.9em; color: #666;">Certifique-se de que a Content API do Ghost está habilitada.</p><p><a href="' + siteUrl + '" style="display: inline-block; margin-top: 1rem; padding: 0.5rem 1.5rem; background: #8338ec; color: white; text-decoration: none; border-radius: 4px;">Voltar para Home</a></p></div>';
            });
    }
    
    function filterPosts(posts, query) {
        if (!posts || !query) return [];
        const lowerQuery = query.toLowerCase();
        return posts.filter(function(post) {
            const titleMatch = post.title && post.title.toLowerCase().includes(lowerQuery);
            const excerptMatch = post.excerpt && post.excerpt.toLowerCase().includes(lowerQuery);
            const tagMatch = post.primary_tag && post.primary_tag.name && post.primary_tag.name.toLowerCase().includes(lowerQuery);
            const authorMatch = post.primary_author && post.primary_author.name && post.primary_author.name.toLowerCase().includes(lowerQuery);
            return titleMatch || excerptMatch || tagMatch || authorMatch;
        });
    }
    
    function renderResults(posts, query, container, siteUrl) {
        if (!posts || posts.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 3rem;"><h2>Nenhum resultado encontrado</h2><p>Não encontramos resultados para: <strong>' + escapeHtml(query) + '</strong></p><p style="font-size: 0.9em; color: #666;">Tente usar termos diferentes.</p><p><a href="' + siteUrl + '" style="display: inline-block; margin-top: 1rem; padding: 0.5rem 1.5rem; background: #8338ec; color: white; text-decoration: none; border-radius: 4px;">Voltar para Home</a></p></div>';
            return;
        }
        
        let html = '<div><h2 style="margin-bottom: 2rem;">Resultados: <strong>' + escapeHtml(query) + '</strong> (' + posts.length + ' resultado' + (posts.length > 1 ? 's' : '') + ')</h2><div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem;">';
        
        posts.forEach(function(post) {
            html += '<article style="background: rgba(255,255,255,0.05); border-radius: 8px; overflow: hidden;"><a href="' + (post.url || '#') + '" style="display: block; text-decoration: none;"><div style="position: relative; padding-top: 56.25%; background: #1a1a2e; overflow: hidden;">';
            if (post.feature_image) {
                html += '<img src="' + post.feature_image + '" alt="' + escapeHtml(post.title || '') + '" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;">';
            }
            if (post.primary_tag && post.primary_tag.name) {
                html += '<span style="position: absolute; top: 1rem; left: 1rem; background: rgba(131, 56, 236, 0.9); color: white; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem;">' + escapeHtml(post.primary_tag.name) + '</span>';
            }
            html += '</div></a><div style="padding: 1.5rem;"><a href="' + (post.url || '#') + '" style="text-decoration: none; color: inherit;"><h3 style="margin: 0 0 0.75rem 0; font-size: 1.25rem;">' + escapeHtml(post.title || 'Sem título') + '</h3></a>';
            if (post.excerpt) {
                html += '<p style="margin: 0 0 1rem 0; color: rgba(255,255,255,0.7); font-size: 0.9rem;">' + escapeHtml(post.excerpt.substring(0, 150)) + (post.excerpt.length > 150 ? '...' : '') + '</p>';
            }
            html += '<div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: rgba(255,255,255,0.6);">';
            if (post.primary_author) {
                if (post.primary_author.profile_image) {
                    html += '<img src="' + post.primary_author.profile_image + '" alt="" style="width: 24px; height: 24px; border-radius: 50%;">';
                }
                html += '<span>' + escapeHtml(post.primary_author.name || '') + '</span>';
            }
            html += '<span>•</span>';
            if (post.published_at) {
                const date = new Date(post.published_at);
                html += '<time>' + date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) + '</time>';
            }
            if (post.reading_time) {
                html += '<span>•</span><span>' + post.reading_time + ' min</span>';
            }
            html += '</div></div></article>';
        });
        
        html += '</div></div>';
        container.innerHTML = html;
    }
    
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
})();
</script>
```

### Passo 3: Testar

1. Acesse: `http://seu-site.com/search/?q=teste`
2. Ou use o formulário de busca do site
3. Verifique se os resultados aparecem

### Troubleshooting

- **Se não funcionar**: Abra o console do navegador (F12) e verifique se há erros
- **Se a API não estiver acessível**: Vá em Settings → Integrations no Ghost Admin e crie uma Integration para obter uma Content API Key
- **Se a página não existir**: Certifique-se de que o slug da página é exatamente "search"

