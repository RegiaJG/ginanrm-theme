/**
 * Ghost Search Page - Code Injection Script
 * 
 * INSTRUÇÕES:
 * 1. No Ghost Admin, vá em Pages
 * 2. Edite a página "Search" (ou crie uma nova com slug "search")
 * 3. Vá em Settings (ícone de engrenagem)
 * 4. Em "Code injection", cole este código no campo "Site Header"
 * 5. Salve a página
 */

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
            return; // Não é uma busca válida
        }
        
        console.log('[Ghost Search] Iniciando busca para:', searchQuery);
        
        // Encontrar o container de resultados (pode variar dependendo do template)
        const container = document.querySelector('.gh-content, .post-content, main, .container') || document.body;
        
        // Criar container de resultados se não existir
        let resultsContainer = document.getElementById('search-results-container');
        if (!resultsContainer) {
            resultsContainer = document.createElement('div');
            resultsContainer.id = 'search-results-container';
            resultsContainer.style.cssText = 'padding: 2rem 0;';
            container.appendChild(resultsContainer);
        }
        
        // Mostrar loading
        resultsContainer.innerHTML = '<div style="text-align: center; padding: 3rem;"><p>Buscando por: <strong>' + escapeHtml(searchQuery) + '</strong></p><p>Carregando resultados...</p></div>';
        
        // Obter URL do site
        const siteUrl = window.location.origin;
        const apiKey = 'a0f485ef2ae52807a2d4cf212f'; // Content API Key
        
        // Buscar todos os posts com campos disponíveis
        // Vamos buscar sem especificar campos primeiro, depois filtrar no cliente
        const apiUrl = siteUrl + '/ghost/api/content/posts/?key=' + apiKey + '&limit=100';
        
        console.log('[Ghost Search] API URL:', apiUrl);
        
        fetch(apiUrl)
            .then(function(response) {
                console.log('[Ghost Search] Response status:', response.status);
                if (!response.ok) {
                    throw new Error('API não acessível: ' + response.status);
                }
                return response.json();
            })
            .then(function(data) {
                console.log('[Ghost Search] Total de posts recebidos:', data.posts ? data.posts.length : 0);
                const posts = data.posts || [];
                
                if (posts.length === 0) {
                    renderResults([], searchQuery, resultsContainer, siteUrl);
                    return;
                }
                
                // Buscar HTML completo de cada post individualmente para incluir Code Injection
                console.log('[Ghost Search] Buscando HTML completo de cada post...');
                const htmlPromises = posts.map(function(post) {
                    // Buscar post individual com formato HTML
                    return fetch(siteUrl + '/ghost/api/content/posts/' + post.id + '/?key=' + apiKey + '&formats=html,plaintext')
                        .then(function(r) {
                            if (r.ok) {
                                return r.json().then(function(postData) {
                                    // Adicionar HTML completo ao post se disponível
                                    if (postData.posts && postData.posts[0]) {
                                        post.html = postData.posts[0].html || post.html;
                                        post.plaintext = postData.posts[0].plaintext || post.plaintext;
                                    }
                                    return post;
                                });
                            }
                            return post;
                        })
                        .catch(function(err) {
                            console.warn('[Ghost Search] Erro ao buscar HTML do post:', post.id, err);
                            return post;
                        });
                });
                
                // Aguardar todas as requisições e então filtrar
                Promise.all(htmlPromises).then(function(postsWithHtml) {
                    console.log('[Ghost Search] Posts com HTML completo carregados:', postsWithHtml.length);
                    const filtered = filterPosts(postsWithHtml, searchQuery);
                    console.log('[Ghost Search] Posts encontrados após filtro:', filtered.length);
                    renderResults(filtered, searchQuery, resultsContainer, siteUrl);
                });
            })
            .catch(function(error) {
                console.error('[Ghost Search] Erro:', error);
                resultsContainer.innerHTML = '<div style="text-align: center; padding: 3rem;">' +
                    '<h2>Erro na Busca</h2>' +
                    '<p>Não foi possível realizar a busca. Erro: ' + escapeHtml(error.message) + '</p>' +
                    '<p style="font-size: 0.9em; color: #666;">Certifique-se de que a Content API do Ghost está habilitada.</p>' +
                    '<p><a href="' + siteUrl + '" style="display: inline-block; margin-top: 1rem; padding: 0.5rem 1.5rem; background: #8338ec; color: white; text-decoration: none; border-radius: 4px;">Voltar para Home</a></p>' +
                    '</div>';
            });
    }
    
    function filterPosts(posts, query) {
        if (!posts || !query) return [];
        const lowerQuery = query.toLowerCase();
        
        return posts.filter(function(post) {
            // Buscar no título
            const titleMatch = post.title && post.title.toLowerCase().includes(lowerQuery);
            
            // Buscar no excerpt
            const excerptMatch = post.excerpt && post.excerpt.toLowerCase().includes(lowerQuery);
            
            // Buscar no conteúdo HTML (inclui Code Injection) - se disponível
            let htmlMatch = false;
            if (post.html) {
                try {
                    // Remover tags HTML, scripts e estilos, mas manter o texto
                    let htmlText = post.html
                        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
                        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
                        .replace(/<!--[\s\S]*?-->/g, ' ') // Remover comentários HTML
                        .replace(/<[^>]*>/g, ' ') // Remover todas as tags HTML
                        .replace(/&nbsp;/g, ' ')
                        .replace(/&amp;/g, '&')
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .replace(/&quot;/g, '"')
                        .replace(/&#39;/g, "'")
                        .replace(/&#x27;/g, "'")
                        .replace(/&#x2F;/g, '/')
                        .replace(/\s+/g, ' ')
                        .trim()
                        .toLowerCase();
                    htmlMatch = htmlText.includes(lowerQuery);
                    if (htmlMatch) {
                        console.log('[Ghost Search] Match encontrado no HTML do post:', post.title);
                    }
                } catch (e) {
                    console.warn('[Ghost Search] Erro ao processar HTML do post:', post.title, e);
                }
            }
            
            // Buscar no plaintext (texto sem HTML) - se disponível
            let plaintextMatch = false;
            if (post.plaintext) {
                plaintextMatch = post.plaintext.toLowerCase().includes(lowerQuery);
            }
            
            // Buscar em tags
            const tagMatch = post.primary_tag && post.primary_tag.name && post.primary_tag.name.toLowerCase().includes(lowerQuery);
            
            // Buscar em autores
            const authorMatch = post.primary_author && post.primary_author.name && post.primary_author.name.toLowerCase().includes(lowerQuery);
            
            // Buscar em múltiplas tags se disponível
            let allTagsMatch = false;
            if (post.tags && Array.isArray(post.tags)) {
                allTagsMatch = post.tags.some(function(tag) {
                    return tag.name && tag.name.toLowerCase().includes(lowerQuery);
                });
            }
            
            // Retornar true se qualquer campo corresponder
            return titleMatch || excerptMatch || htmlMatch || plaintextMatch || tagMatch || authorMatch || allTagsMatch;
        });
    }
    
    function renderResults(posts, query, container, siteUrl) {
        if (!posts || posts.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 3rem;">' +
                '<h2>Nenhum resultado encontrado</h2>' +
                '<p>Não encontramos resultados para: <strong>' + escapeHtml(query) + '</strong></p>' +
                '<p style="font-size: 0.9em; color: #666;">Tente usar termos diferentes ou verifique a ortografia.</p>' +
                '<p><a href="' + siteUrl + '" style="display: inline-block; margin-top: 1rem; padding: 0.5rem 1.5rem; background: #8338ec; color: white; text-decoration: none; border-radius: 4px;">Voltar para Home</a></p>' +
                '</div>';
            return;
        }
        
        let html = '<div style="max-width: 1200px; margin: 0 auto;">';
        html += '<h2 style="margin-bottom: 2rem;">Resultados da busca: <strong>' + escapeHtml(query) + '</strong> (' + posts.length + ' resultado' + (posts.length > 1 ? 's' : '') + ')</h2>';
        html += '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem;">';
        
        posts.forEach(function(post) {
            html += '<article style="background: rgba(255,255,255,0.05); border-radius: 8px; overflow: hidden; transition: transform 0.2s;">';
            
            // Imagem
            html += '<a href="' + (post.url || '#') + '" style="display: block; text-decoration: none;">';
            html += '<div style="position: relative; padding-top: 56.25%; background: #1a1a2e; overflow: hidden;">';
            if (post.feature_image) {
                html += '<img src="' + post.feature_image + '" alt="' + escapeHtml(post.title || '') + '" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;">';
            }
            if (post.primary_tag && post.primary_tag.name) {
                html += '<span style="position: absolute; top: 1rem; left: 1rem; background: rgba(131, 56, 236, 0.9); color: white; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">' + escapeHtml(post.primary_tag.name) + '</span>';
            }
            html += '</div>';
            html += '</a>';
            
            // Conteúdo
            html += '<div style="padding: 1.5rem;">';
            html += '<a href="' + (post.url || '#') + '" style="text-decoration: none; color: inherit;">';
            html += '<h3 style="margin: 0 0 0.75rem 0; font-size: 1.25rem; line-height: 1.4;">' + escapeHtml(post.title || 'Sem título') + '</h3>';
            html += '</a>';
            
            if (post.excerpt) {
                html += '<p style="margin: 0 0 1rem 0; color: rgba(255,255,255,0.7); font-size: 0.9rem; line-height: 1.6;">' + escapeHtml(post.excerpt.substring(0, 150)) + (post.excerpt.length > 150 ? '...' : '') + '</p>';
            }
            
            // Meta
            html += '<div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: rgba(255,255,255,0.6);">';
            if (post.primary_author) {
                if (post.primary_author.profile_image) {
                    html += '<img src="' + post.primary_author.profile_image + '" alt="' + escapeHtml(post.primary_author.name || '') + '" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover;">';
                }
                html += '<span>' + escapeHtml(post.primary_author.name || '') + '</span>';
            }
            html += '<span>•</span>';
            if (post.published_at) {
                const date = new Date(post.published_at);
                html += '<time datetime="' + date.toISOString().split('T')[0] + '">' + date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) + '</time>';
            }
            if (post.reading_time) {
                html += '<span>•</span><span>' + post.reading_time + ' min</span>';
            }
            html += '</div>';
            
            html += '</div>';
            html += '</article>';
        });
        
        html += '</div>';
        html += '</div>';
        
        container.innerHTML = html;
    }
    
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
})();

