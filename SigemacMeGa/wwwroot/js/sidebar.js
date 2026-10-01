/**
 * GERENCIADOR DE SIDEBAR - SigemacMeGa
 * ====================================
 * Controla abertura, fechamento e contração da sidebar com responsividade
 * 
 * FUNCIONALIDADES:
 * - Desktop: clique nos 3 traços do header = contrai/expande a sidebar
 * - Mobile: clique nos 3 traços do header = abre/fecha a sidebar como overlay
 * - Ícone do header muda: "☰" (abrir) <-> "✕" (fechar em mobile)
 * - Estado é salvo em localStorage
 */

(function () {
    // ==================== 1. SELETORES DE ELEMENTOS DOM ====================
    // Referência à sidebar (seletor por ID para melhor performance)
    const sidebar = document.getElementById('siteSidebar');

    // Botão de menu do header (três traços - controla AMBAS as funções)
    const headerMenuBtn = document.querySelector('.header-menu-btn');

    // Overlay escuro que aparece ao abrir sidebar em mobile
    const overlay = document.getElementById('sidebarOverlay');

    // ==================== 2. CONFIGURAÇÕES ====================
    // Chave para armazenar estado em localStorage
    // Permite recuperar o estado da sidebar ao recarregar a página
    const STORAGE_KEY = 'sigemac_sidebar_collapsed';

    /**
     * Verifica se a sidebar está contraída
     * @returns {boolean} true se contraída (armazenado como 'true' em localStorage)
     */
    function isCollapsed() {
        return localStorage.getItem(STORAGE_KEY) === 'true';
    }

    /**
     * Salva o estado de contração no localStorage
     * @param {boolean} collapsed - true para contraída, false para expandida
     */
    function saveCollapsedState(collapsed) {
        localStorage.setItem(STORAGE_KEY, collapsed ? 'true' : 'false');
    }

    /**
     * Atualiza o ícone do botão do header
     * - Mostra "☰" (bi-list) quando sidebar está fechada (mobile) ou expandida (desktop)
     * - Mostra "✕" (bi-x-lg) quando sidebar está aberta (mobile)
     * - Usa window.innerWidth para detectar se é desktop ou mobile
     */
    function updateHeaderIcon() {
        if (!headerMenuBtn) return;

        const icon = headerMenuBtn.querySelector('i');
        if (!icon) return;

        // Remove todas as classes de ícone antes de adicionar a nova
        icon.className = '';

        // MOBILE (max-width: 768px) - verifica se sidebar está visível (aberta)
        if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
            // Sidebar aberta em mobile: mostra X (para fechar)
            icon.classList.add('bi', 'bi-x-lg');
        }
        // Padrão: mostra três traços (para abrir ou expandir)
        else {
            icon.classList.add('bi', 'bi-list');
        }
    }

    /**
     * Contraia ou expande a sidebar no desktop
     * 
     * EFEITO CSS:
     * - Adiciona classe .collapsed à sidebar (desktop)
     * - CSS .sidebar.collapsed { width: 75px; } reduz largura
     * - CSS .app-layout.sidebar-contraida { ... } oculta textos dos itens
     * - Textos dos links e marca ficam escondidos
     * 
     * NOTA: APENAS desktop pode usar essa função
     * Em mobile, usar openSidebar() / closeSidebar() para o overlay
     */
    function toggleCollapse() {
        // Verifica se estamos em desktop (>768px)
        if (window.innerWidth <= 768) {
            // Em mobile, não fazer contração, apenas abrir/fechar overlay
            return;
        }

        // Lê estado atual do localStorage
        const collapsed = isCollapsed();
        // Inverte o estado (true ↔ false)
        const newState = !collapsed;

        if (newState) {
            // CONTRAÇÃO: reduz sidebar de 250px para 75px
            // Adiciona classe que ativa CSS de contração
            sidebar.classList.add('collapsed');

            // Adiciona classe ao container principal para ajustar o layout
            // Isso afeta .app-layout.sidebar-contraida { ... } regras em CSS
            document.querySelector('.app-layout')?.classList.add('sidebar-contraida');
        } else {
            // EXPANSÃO: volta sidebar para 250px
            // Remove classes de contração
            sidebar.classList.remove('collapsed');
            document.querySelector('.app-layout')?.classList.remove('sidebar-contraida');
        }

        // Salva o novo estado no localStorage para recuperar ao recarregar
        saveCollapsedState(newState);
    }

    /**
     * Abre a sidebar em modo mobile (overlay)
     * 
     * EFEITO CSS:
     * - Adiciona classe .open à sidebar
     * - CSS @media (max-width: 768px) .sidebar.open { transform: translateX(0); } 
     *   Move a sidebar de -100% (fora da tela) para 0% (visível)
     * - Mostra overlay escuro (#sidebarOverlay)
     */
    function openSidebar() {
        // Adiciona classe que move a sidebar para dentro da tela (mobile)
        sidebar.classList.add('open');

        // Mostra overlay escuro (cria fundo escuro semi-transparente)
        if (overlay) {
            overlay.classList.add('visible');
        }

        // Atualiza ícone do header para X
        updateHeaderIcon();
    }

    /**
     * Fecha a sidebar em modo mobile
     * 
     * EFEITO CSS:
     * - Remove classe .open da sidebar
     * - CSS move sidebar de volta para translateX(-100%) (fora da tela)
     * - Esconde overlay
     */
    function closeSidebar() {
        // Remove classe que exibe a sidebar (volta para fora da tela)
        sidebar.classList.remove('open');

        // Esconde overlay escuro
        if (overlay) {
            overlay.classList.remove('visible');
        }

        // Atualiza ícone do header para menu (três traços)
        updateHeaderIcon();
    }

    /**
     * Função SMART: controla AMBAS as ações
     * - DESKTOP (>768px): clique = contrai/expande a sidebar
     * - MOBILE (<=768px): clique = abre/fecha a sidebar como overlay
     * 
     * Esta é a função central que conecta o botão do header com as duas funcionalidades
     */
    function handleHeaderClick() {
        // Detecta o tamanho da tela
        if (window.innerWidth > 768) {
            // DESKTOP: togla contração
            toggleCollapse();
        } else {
            // MOBILE: togla abertura/fechamento
            if (sidebar.classList.contains('open')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        }
    }

    /**
     * Inicializa quando o DOM estiver pronto
     * Aguarda o carregamento completo da página antes de configurar eventos
     */
    function init() {
        // Verifica se o DOM ainda está carregando
        if (document.readyState === 'loading') {
            // Aguarda o evento DOMContentLoaded
            document.addEventListener('DOMContentLoaded', setupEventListeners);
        } else {
            // DOM já está pronto, configura imediatamente
            setupEventListeners();
        }
    }

    /**
     * Configura todos os event listeners (cliques, teclas, etc.)
     * Chamado após o DOM estar pronto
     */
    function setupEventListeners() {
        // ==================== BOTÃO DE MENU DO HEADER ====================
        // Clique nos 3 traços = 
        //   - Desktop: contrai/expande sidebar
        //   - Mobile: abre/fecha sidebar
        if (headerMenuBtn) {
            headerMenuBtn.addEventListener('click', function (e) {
                e.preventDefault();
                // Função inteligente que detecta o contexto
                handleHeaderClick();
            });
        }

        // ==================== OVERLAY ====================
        // Clique fora da sidebar = fecha (mobile)
        // Oferece UX melhor - usuário pode clicar para fechar
        if (overlay) {
            overlay.addEventListener('click', closeSidebar);
        }

        // ==================== TECLA ESC ====================
        // Pressionar ESC fecha a sidebar (mobile)
        // Padrão de UX comum em modais e overlays
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                closeSidebar();
            }
        });

        // ==================== RESIZE EVENT ====================
        // Quando a janela é redimensionada (ex: girar celular)
        // Sem para de chamar continuamente (usa throttle simples)
        let resizeTimeout;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function () {
                // Se mudar de mobile para desktop ou vice-versa, atualiza
                updateHeaderIcon();

                // Se estava aberta em mobile e foi redimensionada para desktop
                if (window.innerWidth > 768 && sidebar.classList.contains('open')) {
                    // Fecha o overlay ao virar para desktop
                    closeSidebar();
                }
            }, 250);
        });

        // ==================== APLICAR ESTADO SALVO ====================
        // Recupera estado do localStorage e aplica à sidebar
        // Isso garante que se o usuário contraiu a sidebar,
        // ela permanecerá contraída após recarregar a página
        // MAS: apenas em desktop (mobile sempre começa fechada)
        if (window.innerWidth > 768 && isCollapsed()) {
            // Estado salvo = contraída (desktop)
            sidebar.classList.add('collapsed');
            document.querySelector('.app-layout')?.classList.add('sidebar-contraida');
        }

        // Atualiza ícone com valor inicial
        updateHeaderIcon();
    }

    // ==================== INICIALIZAÇÃO ====================
    // Inicia o gerenciador quando o script é carregado
    init();

    // ==================== API GLOBAL (CONSOLE) ====================
    // Expõe funções para testar via console do navegador
    // Uso: window.sidebarAPI.open(), window.sidebarAPI.close(), etc
    window.sidebarAPI = {
        // Abre a sidebar (mobile)
        open: openSidebar,
        // Fecha a sidebar (mobile)
        close: closeSidebar,
        // Contraia a sidebar (desktop)
        collapse: function () {
            if (!isCollapsed()) toggleCollapse();
        },
        // Expande a sidebar (desktop)
        expand: function () {
            if (isCollapsed()) toggleCollapse();
        }
    };
})();
