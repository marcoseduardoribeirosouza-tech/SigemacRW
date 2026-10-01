window.sidebarStorage = (function () {
    var key = 'sigemac_sidebar_collapsed';

    function readCollapsed() {
        try {
            return localStorage.getItem(key) === 'true';
        } catch (e) {
            return false;
        }
    }

    function writeCollapsed(value) {
        try {
            localStorage.setItem(key, value ? 'true' : 'false');
        } catch (e) { }
    }

    function applyCollapsed(collapsed) {
        var sidebar = document.querySelector('.sidebar');
        var appLayout = document.querySelector('.app-layout');
        if (!sidebar || !appLayout) return;

        if (collapsed) {
            sidebar.classList.add('collapsed');
            appLayout.classList.add('sidebar-contraida');
        } else {
            sidebar.classList.remove('collapsed');
            appLayout.classList.remove('sidebar-contraida');
        }
        // update collapse icon
        var chevron = sidebar.querySelector('.sidebar-center-toggle i');
        if (chevron) {
            chevron.classList.remove('bi-chevron-left', 'bi-chevron-right');
            chevron.classList.add(collapsed ? 'bi-chevron-right' : 'bi-chevron-left');
        }
    }

    function openSidebar() {
        var sidebar = document.getElementById('siteSidebar');
        var overlay = document.getElementById('sidebarOverlay');
        if (!sidebar) return;
        sidebar.classList.add('open');
        if (overlay) overlay.classList.add('visible');
        // atualizar ícone do header (para X)
        try {
            var hi = document.querySelector('.header-menu-btn i');
            if (hi) { hi.classList.remove('bi-list'); hi.classList.add('bi-x-lg'); }
        } catch (e) { }
    }

    function closeSidebar() {
        var sidebar = document.getElementById('siteSidebar');
        var overlay = document.getElementById('sidebarOverlay');
        if (!sidebar) return;
        sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('visible');
        // atualizar ícone do header (para lista)
        try {
            var hi = document.querySelector('.header-menu-btn i');
            if (hi) { hi.classList.remove('bi-x-lg'); hi.classList.add('bi-list'); }
        } catch (e) { }
    }

    function toggleCollapsed() {
        var collapsed = readCollapsed();
        collapsed = !collapsed;
        writeCollapsed(collapsed);
        applyCollapsed(collapsed);
    }

    function init() {
        document.addEventListener('DOMContentLoaded', function () {
            var sidebar = document.getElementById('siteSidebar');
            var overlay = document.getElementById('sidebarOverlay');
            var collapseBtn = document.querySelector('.sidebar-center-toggle');
            var closeBtn = document.querySelector('.sidebar-close');
            var headerBtn = document.querySelector('.header-menu-btn');

            // apply saved state
            applyCollapsed(readCollapsed());

            if (collapseBtn) collapseBtn.addEventListener('click', function (e) { e.preventDefault(); toggleCollapsed(); });
            if (headerBtn) headerBtn.addEventListener('click', function (e) { e.preventDefault();
                // toggle open/close
                if (sidebar && sidebar.classList.contains('open')) {
                    closeSidebar();
                } else {
                    openSidebar();
                }
            });
            if (closeBtn) closeBtn.addEventListener('click', function (e) { e.preventDefault(); closeSidebar(); });
            if (overlay) overlay.addEventListener('click', function () { closeSidebar(); });
            // Close sidebar on Escape key
            document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSidebar(); });
        });
    }

    init();

    return {
        getCollapsed: readCollapsed,
        setCollapsed: function (v) { writeCollapsed(!!v); applyCollapsed(!!v); },
        open: openSidebar,
        close: closeSidebar,
        toggle: function () { toggleCollapsed(); }
    };
})();
