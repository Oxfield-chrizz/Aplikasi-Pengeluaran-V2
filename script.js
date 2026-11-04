/* =========================================
   DOMPETKU v2.0 - Complete Finance App
   ========================================= */

class FinanceApp {
    constructor() {
        this.STORAGE = {
            TRANSACTIONS: 'dompetku_transactions',
            SAVINGS: 'dompetku_savings',
            BUDGETS: 'dompetku_budgets',
            SETTINGS: 'dompetku_settings',
            PROFILE: 'dompetku_profile',
            CATEGORIES: 'dompetku_categories'
        };

        // Default categories
        this.defaultCategories = {
            expense: [
                { id: 'food', name: 'Makanan', icon: 'fa-utensils', color: '#f59e0b', isCustom: false },
                { id: 'transport', name: 'Transport', icon: 'fa-car', color: '#3b82f6', isCustom: false },
                { id: 'shopping', name: 'Belanja', icon: 'fa-shopping-bag', color: '#ec4899', isCustom: false },
                { id: 'entertainment', name: 'Hiburan', icon: 'fa-film', color: '#8b5cf6', isCustom: false },
                { id: 'bills', name: 'Tagihan', icon: 'fa-file-invoice', color: '#ef4444', isCustom: false },
                { id: 'health', name: 'Kesehatan', icon: 'fa-heartbeat', color: '#10b981', isCustom: false },
                { id: 'education', name: 'Pendidikan', icon: 'fa-graduation-cap', color: '#eab308', isCustom: false },
                { id: 'other', name: 'Lainnya', icon: 'fa-ellipsis-h', color: '#6b7280', isCustom: false }
            ],
            income: [
                { id: 'salary', name: 'Gaji', icon: 'fa-money-bill-wave', color: '#10b981', isCustom: false },
                { id: 'business', name: 'Bisnis', icon: 'fa-briefcase', color: '#6366f1', isCustom: false },
                { id: 'investment', name: 'Investasi', icon: 'fa-chart-line', color: '#f59e0b', isCustom: false },
                { id: 'gift', name: 'Hadiah', icon: 'fa-gift', color: '#ec4899', isCustom: false },
                { id: 'other', name: 'Lainnya', icon: 'fa-ellipsis-h', color: '#6b7280', isCustom: false }
            ]
        };

        // Load data
        this.transactions = this.load(this.STORAGE.TRANSACTIONS, []);
        this.savingsGoals = this.load(this.STORAGE.SAVINGS, []);
        this.budgets = this.load(this.STORAGE.BUDGETS, []);
        this.settings = this.load(this.STORAGE.SETTINGS, {
            currency: 'IDR',
            darkMode: false,
            separator: '.'
        });
        this.profile = this.load(this.STORAGE.PROFILE, {
            name: 'Pengguna DompetKu',
            avatar: null,
            headerBg: null
        });
        this.categories = this.load(this.STORAGE.CATEGORIES, JSON.parse(JSON.stringify(this.defaultCategories)));

        // Runtime
        this.currentPage = 'transactions';
        this.currentFilter = 'all';
        this.currentPeriod = 'week';
        this.chart = null;
        this.pendingConfirmAction = null;
        this.currentCatType = 'expense';
        this.calculator = { current: '0', previous: null, operator: null, expression: '' };
        this.calcFromModal = false;

        this.currencySymbols = {
            IDR: 'Rp',
            USD: '$',
            EUR: '€',
            MYR: 'RM',
            SGD: 'S$',
            JPY: '¥'
        };

        this.iconOptions = [
            'fa-utensils', 'fa-car', 'fa-shopping-bag', 'fa-film', 'fa-file-invoice',
            'fa-heartbeat', 'fa-graduation-cap', 'fa-money-bill-wave', 'fa-briefcase',
            'fa-chart-line', 'fa-gift', 'fa-ellipsis-h', 'fa-coffee', 'fa-pizza-slice',
            'fa-bus', 'fa-motorcycle', 'fa-plane', 'fa-home', 'fa-gamepad', 'fa-book',
            'fa-tshirt', 'fa-cut', 'fa-spa', 'fa-dumbbell', 'fa-baby', 'fa-dog',
            'fa-cat', 'fa-music', 'fa-paint-brush', 'fa-tools', 'fa-phone', 'fa-wifi',
            'fa-bolt', 'fa-tint', 'fa-fire', 'fa-star', 'fa-heart', 'fa-smile',
            'fa-user', 'fa-users', 'fa-briefcase-medical', 'fa-pills', 'fa-bicycle',
            'fa-futbol', 'fa-basketball-ball', 'fa-running', 'fa-swimmer', 'fa-mountain'
        ];

        this.colorOptions = [
            '#ef4444', '#f59e0b', '#eab308', '#84cc16',
            '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
            '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
            '#d946ef', '#ec4899', '#f43f5e', '#6b7280'
        ];

        this.presetBgs = [
            { name: 'Ungu Default', value: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)' },
            { name: 'Sunset', value: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)' },
            { name: 'Ocean', value: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)' },
            { name: 'Emerald', value: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
            { name: 'Rose', value: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)' },
            { name: 'Royal', value: 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)' },
            { name: 'Peach', value: 'linear-gradient(135deg, #fb7185 0%, #fdba74 100%)' },
            { name: 'Midnight', value: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' },
            { name: 'Gold', value: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' },
            { name: 'Forest', value: 'linear-gradient(135deg, #166534 0%, #15803d 100%)' },
            { name: 'Candy', value: 'linear-gradient(135deg, #f472b6 0%, #a78bfa 100%)' },
            { name: 'Sky', value: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)' }
        ];

        this.init();
    }

    /* ============ INIT ============ */
    init() {
        this.applyTheme();
        this.applyProfile();
        this.applyHeaderBackground();
        this.setGreeting();
        this.setTodayDate();
        this.bindEvents();
        this.render();
    }

    /* ============ STORAGE ============ */
    load(key, fallback) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : fallback;
        } catch { return fallback; }
    }

    save() {
        localStorage.setItem(this.STORAGE.TRANSACTIONS, JSON.stringify(this.transactions));
        localStorage.setItem(this.STORAGE.SAVINGS, JSON.stringify(this.savingsGoals));
        localStorage.setItem(this.STORAGE.BUDGETS, JSON.stringify(this.budgets));
        localStorage.setItem(this.STORAGE.SETTINGS, JSON.stringify(this.settings));
        localStorage.setItem(this.STORAGE.PROFILE, JSON.stringify(this.profile));
        localStorage.setItem(this.STORAGE.CATEGORIES, JSON.stringify(this.categories));
    }

    /* ============ UTILITIES ============ */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
    }

    formatNumber(num) {
        const n = Math.abs(Number(num) || 0);
        const str = Math.round(n).toString();
        const sep = this.settings.separator || '.';
        return str.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
    }

    parseNumber(str) {
        if (typeof str === 'number') return str;
        return parseFloat(String(str).replace(/[^\d]/g, '')) || 0;
    }

    getCurrencySymbol() {
        return this.currencySymbols[this.settings.currency] || 'Rp';
    }

    formatDate(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const d = new Date(date);
        d.setHours(0, 0, 0, 0);

        if (d.getTime() === today.getTime()) return 'Hari Ini';
        if (d.getTime() === yesterday.getTime()) return 'Kemarin';

        return date.toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    }

    formatDateShort(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    }

    getGreeting() {
        const hour = new Date().getHours();
        if (hour < 11) return 'Selamat Pagi 👋';
        if (hour < 15) return 'Selamat Siang ☀️';
        if (hour < 18) return 'Selamat Sore 🌤️';
        return 'Selamat Malam 🌙';
    }

    setGreeting() {
        document.getElementById('greetingText').textContent = this.getGreeting();
    }

    setTodayDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
    }

    getCategoryInfo(type, id) {
        return (this.categories[type] || []).find(c => c.id === id)
            || { id, name: 'Lainnya', icon: 'fa-circle', color: '#6b7280' };
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /* ============ THEME ============ */
    applyTheme() {
        if (this.settings.darkMode) {
            document.body.classList.add('dark');
            document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i>';
            document.getElementById('darkModeToggle').checked = true;
        } else {
            document.body.classList.remove('dark');
            document.getElementById('themeToggle').innerHTML = '<i class="fas fa-moon"></i>';
            document.getElementById('darkModeToggle').checked = false;
        }
    }

    toggleTheme() {
        this.settings.darkMode = !this.settings.darkMode;
        this.applyTheme();
        this.save();
        if (this.currentPage === 'reports') setTimeout(() => this.renderChart(), 100);
    }

    /* ============ PROFILE & BACKGROUND ============ */
    applyProfile() {
        document.getElementById('userDisplayName').textContent = this.profile.name;
        document.getElementById('profileNameDisplay').textContent = this.profile.name;

        const avatarEls = [
            document.getElementById('headerAvatar'),
            document.getElementById('profileAvatar')
        ];

        avatarEls.forEach(el => {
            if (this.profile.avatar) {
                el.style.backgroundImage = `url(${this.profile.avatar})`;
                el.innerHTML = '';
            } else {
                el.style.backgroundImage = '';
                el.innerHTML = '<i class="fas fa-user"></i>';
            }
        });
    }

    applyHeaderBackground() {
        const headerBg = document.getElementById('headerBg');
        const header = document.getElementById('appHeader');
        const overlay = header.querySelector('.header-overlay');

        if (!this.profile.headerBg) {
            header.style.background = 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)';
            headerBg.classList.remove('has-image');
            headerBg.style.backgroundImage = '';
            overlay.style.opacity = '0';
            return;
        }

        // If it's a preset gradient (contains 'gradient')
        if (this.profile.headerBg.includes('gradient')) {
            header.style.background = this.profile.headerBg;
            headerBg.classList.remove('has-image');
            headerBg.style.backgroundImage = '';
            overlay.style.opacity = '0';
        } else {
            // It's an image
            header.style.background = '#6366f1';
            headerBg.style.backgroundImage = `url(${this.profile.headerBg})`;
            headerBg.classList.add('has-image');
            overlay.style.opacity = '1';
        }
    }

    async handleAvatarUpload(file) {
        if (file.size > 2 * 1024 * 1024) {
            this.showToast('Foto terlalu besar (max 2MB)', true);
            return;
        }
        try {
            const dataUrl = await this.fileToDataURL(file, 400, 400);
            this.profile.avatar = dataUrl;
            this.save();
            this.applyProfile();
            this.showToast('Foto profil diperbarui');
        } catch {
            this.showToast('Gagal mengupload foto', true);
        }
    }

    async handleBackgroundUpload(file) {
        if (file.size > 3 * 1024 * 1024) {
            this.showToast('Foto terlalu besar (max 3MB)', true);
            return;
        }
        try {
            const dataUrl = await this.fileToDataURL(file, 1200, 600, 0.85);
            this.profile.headerBg = dataUrl;
            this.save();
            this.applyHeaderBackground();
            this.closeAllModals();
            this.showToast('Background diperbarui');
        } catch {
            this.showToast('Gagal mengupload foto', true);
        }
    }

    fileToDataURL(file, maxW, maxH, quality = 0.9) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    let { width, height } = img;
                    const ratio = Math.min(maxW / width, maxH / height, 1);
                    width *= ratio;
                    height *= ratio;

                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', quality));
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    /* ============ BIND EVENTS ============ */
    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.addEventListener('click', () => this.switchPage(btn.dataset.page));
        });

        // Theme toggles
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        document.getElementById('darkModeToggle').addEventListener('change', () => this.toggleTheme());

        // FAB
        const fab = document.getElementById('fabAdd');
        const fabMenu = document.getElementById('fabMenu');
        fab.addEventListener('click', () => {
            fab.classList.toggle('active');
            fabMenu.classList.toggle('active');
        });
        fabMenu.querySelector('.fab-menu-backdrop').addEventListener('click', () => {
            fab.classList.remove('active');
            fabMenu.classList.remove('active');
        });
        document.querySelectorAll('.fab-option').forEach(btn => {
            btn.addEventListener('click', () => {
                this.openTransactionModal(btn.dataset.type);
                fab.classList.remove('active');
                fabMenu.classList.remove('active');
            });
        });

        // Filter chips
        document.querySelectorAll('.chip').forEach(chip => {
            chip.addEventListener('click', () => {
                document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.currentFilter = chip.dataset.filter;
                this.renderTransactions();
            });
        });

        // Date filter
        document.getElementById('filterDate').addEventListener('change', (e) => {
            document.getElementById('clearDateBtn').classList.toggle('show', !!e.target.value);
            this.renderTransactions();
        });
        document.getElementById('clearDateBtn').addEventListener('click', () => {
            document.getElementById('filterDate').value = '';
            document.getElementById('clearDateBtn').classList.remove('show');
            this.renderTransactions();
        });

        // Modal close
        document.querySelectorAll('.modal-close, .modal-cancel').forEach(el => {
            el.addEventListener('click', () => this.closeAllModals());
        });
        document.querySelectorAll('.modal-overlay').forEach(el => {
            el.addEventListener('click', () => this.closeAllModals());
        });

        // Transaction form
        document.getElementById('transactionForm').addEventListener('submit', (e) => this.saveTransaction(e));
        this.setupAmountInput('amount');

        // Category quick add
        document.getElementById('addCategoryQuick').addEventListener('click', () => {
            const type = document.getElementById('transactionType').value;
            this.openCategoryEditor(null, type);
        });

        // Savings
        document.getElementById('savingsForm').addEventListener('submit', (e) => this.saveSavingsGoal(e));
        this.setupAmountInput('savingsTarget');
        this.setupAmountInput('savingsCurrent');
        document.getElementById('addSavingsGoalBtn').addEventListener('click', () => this.openSavingsModal());

        // Add amount to savings
        document.getElementById('addAmountForm').addEventListener('submit', (e) => this.saveAddAmount(e));
        this.setupAmountInput('addAmountValue');
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const input = document.getElementById('addAmountValue');
                input.value = this.formatNumber(btn.dataset.amount);
                input.dataset.raw = btn.dataset.amount;
            });
        });

        // Budget
        document.getElementById('addBudgetBtn').addEventListener('click', () => this.openBudgetModal());
        document.getElementById('budgetForm').addEventListener('submit', (e) => this.saveBudget(e));
        this.setupAmountInput('budgetAmount');

        // Reports
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentPeriod = btn.dataset.period;
                this.renderReports();
            });
        });

        // Profile & Settings
        document.getElementById('currencySelect').addEventListener('change', (e) => {
            this.settings.currency = e.target.value;
            this.save();
            this.render();
            this.showToast('Mata uang diubah');
        });

        document.getElementById('separatorSelect').addEventListener('change', (e) => {
            this.settings.separator = e.target.value;
            this.save();
            this.render();
            this.showToast('Pemisah diubah');
        });

        document.getElementById('editNameBtn').addEventListener('click', () => {
            document.getElementById('userNameInput').value = this.profile.name;
            this.openModal('nameEditModal');
        });

        document.getElementById('nameEditForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('userNameInput').value.trim();
            if (!name) return;
            this.profile.name = name;
            this.save();
            this.applyProfile();
            this.closeAllModals();
            this.showToast('Nama diperbarui');
        });

        document.getElementById('editAvatarBtn').addEventListener('click', () => {
            document.getElementById('avatarInput').click();
        });
        document.getElementById('avatarInput').addEventListener('change', (e) => {
            if (e.target.files[0]) this.handleAvatarUpload(e.target.files[0]);
            e.target.value = '';
        });

        // Background
        document.getElementById('backgroundBtn').addEventListener('click', () => this.openBackgroundModal());
        document.getElementById('bgUploadInput').addEventListener('change', (e) => {
            if (e.target.files[0]) this.handleBackgroundUpload(e.target.files[0]);
            e.target.value = '';
        });
        document.getElementById('removeBgBtn').addEventListener('click', () => {
            this.profile.headerBg = null;
            this.save();
            this.applyHeaderBackground();
            this.renderPresetGrid();
            this.showToast('Background direset');
        });

        // Category Manager
        document.getElementById('manageCategoriesBtn').addEventListener('click', () => this.openCategoryManager());
        document.getElementById('manageBudgetsBtn').addEventListener('click', () => {
            this.switchPage('budget');
        });

        document.querySelectorAll('.tab-mini').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-mini').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentCatType = btn.dataset.catType;
                this.renderCategoryManagerList();
            });
        });

        document.getElementById('addNewCategoryBtn').addEventListener('click', () => {
            this.openCategoryEditor(null, this.currentCatType);
        });

        // Category form
        document.getElementById('categoryForm').addEventListener('submit', (e) => this.saveCategory(e));

        // Calculator
        document.getElementById('calculatorBtn').addEventListener('click', () => this.openCalculator());
        document.querySelectorAll('.calc-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleCalcBtn(btn));
        });
        document.getElementById('useCalcResult').addEventListener('click', () => this.useCalcResult());

        // Export / Import
        document.getElementById('exportCsvBtn').addEventListener('click', () => this.exportCSV());
        document.getElementById('exportJsonBtn').addEventListener('click', () => this.exportJSON());
        document.getElementById('importBtn').addEventListener('click', () => document.getElementById('importFile').click());
        document.getElementById('importFile').addEventListener('change', (e) => this.importJSON(e));

        // About & Help
        document.getElementById('aboutBtn').addEventListener('click', () => this.openModal('aboutModal'));
        document.getElementById('helpBtn').addEventListener('click', () => this.openModal('helpModal'));

        // Reset
        document.getElementById('resetDataBtn').addEventListener('click', () => {
            this.confirm('Hapus Semua Data?',
                'Semua transaksi, tabungan, dan budget akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.',
                () => this.resetAllData());
        });

        // Confirm
        document.getElementById('confirmCancel').addEventListener('click', () => this.closeModal('confirmModal'));
        document.getElementById('confirmOk').addEventListener('click', () => {
            if (this.pendingConfirmAction) {
                this.pendingConfirmAction();
                this.pendingConfirmAction = null;
            }
            this.closeModal('confirmModal');
        });

        // Prompt
        document.getElementById('promptOk').addEventListener('click', () => {
            if (this.pendingPromptAction) {
                this.pendingPromptAction(document.getElementById('promptInput').value);
                this.pendingPromptAction = null;
            }
            this.closeModal('promptModal');
        });
    }

    /* ============ AMOUNT INPUT FORMATTER ============ */
    setupAmountInput(id) {
        const input = document.getElementById(id);
        if (!input) return;
        input.addEventListener('input', (e) => {
            const raw = this.parseNumber(e.target.value);
            e.target.dataset.raw = raw;
            e.target.value = raw === 0 ? '' : this.formatNumber(raw);
        });
    }

    getRawAmount(id) {
        const input = document.getElementById(id);
        return this.parseNumber(input.dataset.raw || input.value);
    }

    /* ============ NAVIGATION ============ */
    switchPage(page) {
        this.currentPage = page;
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.page === page);
        });
        document.querySelectorAll('.page').forEach(p => {
            p.classList.toggle('active', p.id === `page-${page}`);
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (page === 'reports') setTimeout(() => this.renderReports(), 50);
        if (page === 'savings') this.renderSavings();
        if (page === 'budget') this.renderBudgets();
        if (page === 'profile') this.renderProfile();
    }

    /* ============ MODAL ============ */
    openModal(id) {
        document.getElementById(id).classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal(id) {
        document.getElementById(id).classList.remove('active');
        if (!document.querySelector('.modal.active')) {
            document.body.style.overflow = '';
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
        document.body.style.overflow = '';
        document.getElementById('fabAdd').classList.remove('active');
        document.getElementById('fabMenu').classList.remove('active');
    }

    confirm(title, message, callback) {
        document.getElementById('confirmTitle').textContent = title;
        document.getElementById('confirmMessage').textContent = message;
        this.pendingConfirmAction = callback;
        this.openModal('confirmModal');
    }

    /* ============ RENDER ============ */
    render() {
        this.renderBalance();
        this.renderTransactions();
        this.renderSavings();
        this.renderBudgets();
        this.renderProfile();
        this.updateSettingsUI();
    }

    updateSettingsUI() {
        document.getElementById('currencySelect').value = this.settings.currency;
        document.getElementById('separatorSelect').value = this.settings.separator;
        document.getElementById('currencySymbol').textContent = this.getCurrencySymbol();
    }

    renderBalance() {
        const income = this.transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const expense = this.transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        const balance = income - expense;

        this.animateNumber('totalBalance', balance);
        this.animateNumber('totalIncome', income);
        this.animateNumber('totalExpense', expense);

        // Today stats
        const today = new Date().toISOString().split('T')[0];
        const todayExpense = this.transactions
            .filter(t => t.type === 'expense' && t.date === today)
            .reduce((s, t) => s + t.amount, 0);
        this.animateNumber('todaySpending', todayExpense);

        // Average daily expense (last 30 days)
        const now = new Date();
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 29);
        const recentExpenses = this.transactions.filter(t => {
            const d = new Date(t.date);
            return t.type === 'expense' && d >= thirtyDaysAgo && d <= now;
        });
        const avgDaily = recentExpenses.length > 0 
            ? recentExpenses.reduce((s, t) => s + t.amount, 0) / 30 
            : 0;
        this.animateNumber('avgDaily', Math.round(avgDaily));
    }

    animateNumber(id, value) {
        const el = document.getElementById(id);
        if (!el) return;
        el.textContent = this.formatNumber(value);
    }

    renderTransactions() {
        const list = document.getElementById('transactionsList');
        const dateFilter = document.getElementById('filterDate').value;

        let filtered = [...this.transactions];
        if (this.currentFilter !== 'all') filtered = filtered.filter(t => t.type === this.currentFilter);
        if (dateFilter) filtered = filtered.filter(t => t.date === dateFilter);

        const income = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const expense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        document.getElementById('filteredIncome').textContent = this.formatNumber(income);
        document.getElementById('filteredExpense').textContent = this.formatNumber(expense);

        if (filtered.length === 0) {
            list.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon"><i class="fas fa-receipt"></i></div>
                    <h3>Belum Ada Transaksi</h3>
                    <p>Tekan tombol + untuk menambahkan transaksi pertamamu</p>
                </div>`;
            return;
        }

        const groups = {};
        filtered.forEach(t => {
            if (!groups[t.date]) groups[t.date] = [];
            groups[t.date].push(t);
        });

        const sortedDates = Object.keys(groups).sort((a, b) => b.localeCompare(a));

        list.innerHTML = sortedDates.map(date => {
            const items = groups[date];
            const dayTotal = items.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);
            return `
                <div class="transaction-group">
                    <div class="transaction-group-date">
                        <span>${this.formatDate(date)}</span>
                        <span class="transaction-group-total">${dayTotal >= 0 ? '+' : ''}${this.formatNumber(dayTotal)}</span>
                    </div>
                    ${items.map(t => this.renderTransactionItem(t)).join('')}
                </div>`;
        }).join('');
    }

    renderTransactionItem(t) {
        const cat = this.getCategoryInfo(t.type, t.category);
        const sign = t.type === 'income' ? '+' : '-';
        return `
            <div class="transaction-item" onclick="app.openTransactionModal('${t.type}', '${t.id}')">
                <div class="transaction-icon" style="background: ${cat.color}">
                    <i class="fas ${cat.icon}"></i>
                </div>
                <div class="transaction-details">
                    <div class="transaction-category">${cat.name}</div>
                    <div class="transaction-description">${this.escapeHtml(t.description) || this.formatDateShort(t.date)}</div>
                </div>
                <div class="transaction-amount ${t.type}">${sign}${this.formatNumber(t.amount)}</div>
            </div>`;
    }

    renderSavings() {
        const container = document.getElementById('savingsGoalsList');
        const total = this.savingsGoals.reduce((s, g) => s + g.current, 0);
        document.getElementById('totalSavings').textContent = this.formatNumber(total);

        if (this.savingsGoals.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon"><i class="fas fa-piggy-bank"></i></div>
                    <h3>Belum Ada Target</h3>
                    <p>Buat target tabungan untuk mewujudkan impianmu</p>
                </div>`;
            return;
        }

        container.innerHTML = this.savingsGoals.map(goal => {
            const pct = Math.min((goal.current / goal.target) * 100, 100);
            const remaining = Math.max(goal.target - goal.current, 0);
            return `
                <div class="savings-goal-card">
                    <div class="savings-goal-header">
                        <div class="savings-goal-title">
                            <div class="savings-goal-icon"><i class="fas fa-bullseye"></i></div>
                            <div>
                                <h4>${this.escapeHtml(goal.name)}</h4>
                                ${goal.deadline ? `<span class="savings-goal-deadline"><i class="fas fa-calendar"></i> ${this.formatDateShort(goal.deadline)}</span>` : ''}
                            </div>
                        </div>
                        <button class="savings-menu-btn" onclick="app.openSavingsModal('${goal.id}')">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                    </div>
                    <div class="savings-amounts">
                        <span class="savings-current">${this.formatNumber(goal.current)}</span>
                        <span class="savings-target">/ ${this.formatNumber(goal.target)}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${pct}%"></div>
                    </div>
                    <div class="progress-info">
                        <span>${pct.toFixed(1)}% tercapai</span>
                        <span>Sisa ${this.formatNumber(remaining)}</span>
                    </div>
                    <div class="savings-actions">
                        <button class="btn-savings-add" onclick="app.openAddAmountModal('${goal.id}')">
                            <i class="fas fa-plus"></i> Tambah Tabungan
                        </button>
                    </div>
                </div>`;
        }).join('');
    }

    renderBudgets() {
        const overview = document.getElementById('budgetOverview');
        const listEl = document.getElementById('budgetList');

        if (this.budgets.length === 0) {
            overview.innerHTML = `
                <div class="budget-total-header">
                    <span>Total Budget Bulanan</span>
                    <strong>${this.getCurrencySymbol()} 0</strong>
                </div>
                <div class="budget-total-bar"><div class="budget-total-fill" style="width: 0%"></div></div>
                <p style="font-size: 0.75rem; color: var(--text-secondary); text-align: center;">Belum ada budget</p>`;
            listEl.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon"><i class="fas fa-wallet"></i></div>
                    <h3>Belum Ada Budget</h3>
                    <p>Tetapkan limit pengeluaran per kategori</p>
                </div>`;
            return;
        }

        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];

        const totalBudget = this.budgets.reduce((s, b) => s + b.amount, 0);
        let totalSpent = 0;

        const budgetData = this.budgets.map(b => {
            const spent = this.transactions
                .filter(t => t.type === 'expense' && t.category === b.category && t.date >= monthStart)
                .reduce((s, t) => s + t.amount, 0);
            totalSpent += spent;
            return { ...b, spent };
        });

        const totalPct = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
        const totalClass = totalPct >= 100 ? 'danger' : totalPct >= 80 ? 'warning' : '';

        overview.innerHTML = `
            <div class="budget-total-header">
                <span>Total Budget Bulanan</span>
                <strong>${this.getCurrencySymbol()} ${this.formatNumber(totalSpent)} / ${this.formatNumber(totalBudget)}</strong>
            </div>
            <div class="budget-total-bar">
                <div class="budget-total-fill ${totalClass}" style="width: ${Math.min(totalPct, 100)}%"></div>
            </div>
            <div class="budget-info">
                <span>${totalPct.toFixed(1)}% terpakai</span>
                <span class="${totalClass}">Sisa ${this.formatNumber(Math.max(totalBudget - totalSpent, 0))}</span>
            </div>`;

        listEl.innerHTML = budgetData.map(b => {
            const cat = this.getCategoryInfo('expense', b.category);
            const pct = b.amount > 0 ? (b.spent / b.amount) * 100 : 0;
            const cls = pct >= 100 ? 'danger' : pct >= 80 ? 'warning' : '';

            return `
                <div class="budget-item">
                    <div class="budget-header">
                        <div class="budget-cat">
                            <div class="budget-cat-icon" style="background: ${cat.color}">
                                <i class="fas ${cat.icon}"></i>
                            </div>
                            <div class="budget-cat-info">
                                <span class="budget-cat-name">${cat.name}</span>
                                <span class="budget-cat-amount">Limit ${this.getCurrencySymbol()} ${this.formatNumber(b.amount)}</span>
                            </div>
                        </div>
                        <button class="budget-actions-btn" onclick="app.openBudgetModal('${b.id}')">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                    </div>
                    <div class="budget-bar">
                        <div class="budget-bar-fill ${cls}" style="width: ${Math.min(pct, 100)}%"></div>
                    </div>
                    <div class="budget-info">
                        <span>${this.getCurrencySymbol()} ${this.formatNumber(b.spent)}</span>
                        <span class="${cls}">${pct.toFixed(0)}% ${pct >= 100 ? '(Over!)' : ''}</span>
                    </div>
                </div>`;
        }).join('');
    }

    renderReports() {
        const filtered = this.filterByPeriod(this.transactions, this.currentPeriod);
        const income = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const expense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

        document.getElementById('reportIncome').textContent = this.formatNumber(income);
        document.getElementById('reportExpense').textContent = this.formatNumber(expense);

        this.renderChart(filtered);
        this.renderCategoryBreakdown(filtered);
    }

    renderChart(transactions = null) {
        if (!transactions) transactions = this.filterByPeriod(this.transactions, this.currentPeriod);

        const expenses = transactions.filter(t => t.type === 'expense');
        const byCategory = {};
        expenses.forEach(t => {
            const cat = this.getCategoryInfo('expense', t.category);
            if (!byCategory[cat.name]) byCategory[cat.name] = { amount: 0, color: cat.color };
            byCategory[cat.name].amount += t.amount;
        });

        const ctx = document.getElementById('expenseChart').getContext('2d');
        const isDark = this.settings.darkMode;
        const textColor = isDark ? '#94a3b8' : '#64748b';

        if (this.chart) { this.chart.destroy(); this.chart = null; }

        if (Object.keys(byCategory).length === 0) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.font = '600 14px "Plus Jakarta Sans", sans-serif';
            ctx.fillStyle = textColor;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Belum ada data pengeluaran', ctx.canvas.width / 2, ctx.canvas.height / 2);
            return;
        }

        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(byCategory),
                datasets: [{
                    data: Object.values(byCategory).map(v => v.amount),
                    backgroundColor: Object.values(byCategory).map(v => v.color),
                    borderWidth: 0,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 12, usePointStyle: true, pointStyle: 'circle',
                            boxWidth: 8, boxHeight: 8, color: textColor,
                            font: { family: "'Plus Jakarta Sans', sans-serif", size: 11, weight: '600' }
                        }
                    },
                    tooltip: {
                        backgroundColor: isDark ? '#1e293b' : '#0f172a',
                        padding: 12, cornerRadius: 8,
                        titleFont: { family: "'Plus Jakarta Sans', sans-serif", size: 12, weight: '700' },
                        bodyFont: { family: "'Plus Jakarta Sans', sans-serif", size: 12 },
                        callbacks: {
                            label: (context) => {
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const pct = ((value / total) * 100).toFixed(1);
                                return ` ${this.formatNumber(value)} (${pct}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    renderCategoryBreakdown(transactions = null) {
        if (!transactions) transactions = this.filterByPeriod(this.transactions, this.currentPeriod);

        const container = document.getElementById('categoryBreakdown');
        const expenses = transactions.filter(t => t.type === 'expense');

        if (expenses.length === 0) { container.innerHTML = ''; return; }

        const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);
        const byCategory = {};
        expenses.forEach(t => {
            const cat = this.getCategoryInfo('expense', t.category);
            if (!byCategory[cat.name]) byCategory[cat.name] = { amount: 0, color: cat.color };
            byCategory[cat.name].amount += t.amount;
        });

        container.innerHTML = Object.entries(byCategory)
            .sort((a, b) => b[1].amount - a[1].amount)
            .map(([name, data]) => {
                const pct = (data.amount / totalExpense) * 100;
                return `
                    <div class="category-item">
                        <div class="category-header">
                            <div class="category-name-wrapper">
                                <span class="category-dot" style="background: ${data.color}"></span>
                                <span class="category-name">${name}</span>
                            </div>
                            <div style="text-align:right">
                                <div class="category-amount">${this.formatNumber(data.amount)}</div>
                                <div class="category-percentage">${pct.toFixed(1)}%</div>
                            </div>
                        </div>
                        <div class="category-bar">
                            <div class="category-bar-fill" style="width: ${pct}%; background: ${data.color}"></div>
                        </div>
                    </div>`;
            }).join('');
    }

    renderProfile() {
        const count = this.transactions.length;
        document.getElementById('profileStats').textContent = `${count} transaksi tercatat`;
    }

    /* ============ TRANSACTION CRUD ============ */
    openTransactionModal(type, editId = null) {
        document.getElementById('transactionType').value = type;
        document.getElementById('transactionId').value = editId || '';
        document.getElementById('transactionModalTitle').textContent = editId ? 'Edit Transaksi' : 'Tambah Transaksi';
        document.getElementById('modalCurrency').textContent = this.getCurrencySymbol();

        const form = document.getElementById('transactionForm');
        form.reset();
        const amountInput = document.getElementById('amount');
        amountInput.value = '';
        amountInput.dataset.raw = '';
        document.getElementById('date').value = new Date().toISOString().split('T')[0];

        this.renderCategoryGrid(type);

        if (editId) {
            const t = this.transactions.find(x => x.id === editId);
            if (t) {
                amountInput.value = this.formatNumber(t.amount);
                amountInput.dataset.raw = t.amount;
                document.getElementById('category').value = t.category;
                document.getElementById('description').value = t.description || '';
                document.getElementById('date').value = t.date;
                this.highlightSelectedCategory(t.category);
            }
        }

        this.openModal('transactionModal');
        setTimeout(() => amountInput.focus(), 300);
    }

    renderCategoryGrid(type) {
        const grid = document.getElementById('categoryGrid');
        const cats = this.categories[type] || [];

        grid.innerHTML = cats.map(cat => `
            <button type="button" class="category-option" data-cat-id="${cat.id}">
                <div class="category-option-icon" style="background: ${cat.color}">
                    <i class="fas ${cat.icon}"></i>
                </div>
                <span>${this.escapeHtml(cat.name)}</span>
            </button>`).join('');

        grid.querySelectorAll('.category-option').forEach(btn => {
            btn.addEventListener('click', () => {
                grid.querySelectorAll('.category-option').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                document.getElementById('category').value = btn.dataset.catId;
            });
        });

        document.getElementById('category').value = '';
    }

    highlightSelectedCategory(catId) {
        const grid = document.getElementById('categoryGrid');
        grid.querySelectorAll('.category-option').forEach(btn => {
            btn.classList.toggle('selected', btn.dataset.catId === catId);
        });
    }

    saveTransaction(e) {
        e.preventDefault();
        const type = document.getElementById('transactionType').value;
        const id = document.getElementById('transactionId').value;
        const amount = this.getRawAmount('amount');
        const category = document.getElementById('category').value;
        const description = document.getElementById('description').value.trim();
        const date = document.getElementById('date').value;

        if (!amount || amount <= 0) { this.showToast('Masukkan jumlah yang valid', true); return; }
        if (!category) { this.showToast('Pilih kategori terlebih dahulu', true); return; }
        if (!date) { this.showToast('Pilih tanggal transaksi', true); return; }

        if (id) {
            const index = this.transactions.findIndex(t => t.id === id);
            if (index !== -1) {
                this.transactions[index] = { ...this.transactions[index], type, amount, category, description, date };
            }
            this.showToast('Transaksi berhasil diupdate');
        } else {
            this.transactions.unshift({
                id: this.generateId(), type, amount, category, description, date,
                createdAt: new Date().toISOString()
            });
            this.showToast('Transaksi berhasil ditambahkan');
        }

        this.save();
        this.render();
        this.closeAllModals();
    }

    /* ============ SAVINGS CRUD ============ */
    openSavingsModal(editId = null) {
        const form = document.getElementById('savingsForm');
        form.reset();
        ['savingsTarget', 'savingsCurrent'].forEach(id => {
            const input = document.getElementById(id);
            input.value = '';
            input.dataset.raw = '';
        });

        document.getElementById('savingsId').value = editId || '';
        document.getElementById('savingsModalTitle').textContent = editId ? 'Edit Target Tabungan' : 'Tambah Target Tabungan';
        document.getElementById('savingsTargetPrefix').textContent = this.getCurrencySymbol();
        document.getElementById('savingsCurrentPrefix').textContent = this.getCurrencySymbol();

        if (editId) {
            const goal = this.savingsGoals.find(g => g.id === editId);
            if (goal) {
                document.getElementById('savingsName').value = goal.name;
                const t = document.getElementById('savingsTarget');
                t.value = this.formatNumber(goal.target);
                t.dataset.raw = goal.target;
                const c = document.getElementById('savingsCurrent');
                c.value = this.formatNumber(goal.current);
                c.dataset.raw = goal.current;
                document.getElementById('savingsDeadline').value = goal.deadline || '';
            }
        }

        this.openModal('savingsModal');
    }

    saveSavingsGoal(e) {
        e.preventDefault();
        const id = document.getElementById('savingsId').value;
        const name = document.getElementById('savingsName').value.trim();
        const target = this.getRawAmount('savingsTarget');
        const current = this.getRawAmount('savingsCurrent');
        const deadline = document.getElementById('savingsDeadline').value;

        if (!name) { this.showToast('Masukkan nama target', true); return; }
        if (!target || target <= 0) { this.showToast('Masukkan target jumlah yang valid', true); return; }

        if (id) {
            const index = this.savingsGoals.findIndex(g => g.id === id);
            if (index !== -1) {
                this.savingsGoals[index] = { ...this.savingsGoals[index], name, target, current, deadline };
            }
            this.showToast('Target tabungan diperbarui');
        } else {
            this.savingsGoals.push({
                id: this.generateId(), name, target, current, deadline,
                createdAt: new Date().toISOString()
            });
            this.showToast('Target tabungan dibuat');
        }

        this.save();
        this.render();
        this.closeAllModals();
    }

    openAddAmountModal(goalId) {
        document.getElementById('addAmountGoalId').value = goalId;
        document.getElementById('addAmountCurrency').textContent = this.getCurrencySymbol();
        const input = document.getElementById('addAmountValue');
        input.value = '';
        input.dataset.raw = '';
        this.openModal('addAmountModal');
        setTimeout(() => input.focus(), 300);
    }

    saveAddAmount(e) {
        e.preventDefault();
        const goalId = document.getElementById('addAmountGoalId').value;
        const amount = this.getRawAmount('addAmountValue');

        if (!amount || amount <= 0) { this.showToast('Masukkan jumlah yang valid', true); return; }

        const goal = this.savingsGoals.find(g => g.id === goalId);
        if (goal) {
            goal.current = Math.min(goal.current + amount, goal.target);
            this.save();
            this.renderSavings();
            this.renderBalance();
            this.showToast(`Berhasil menambah ${this.formatNumber(amount)}`);
        }
        this.closeAllModals();
    }

    /* ============ BUDGET CRUD ============ */
    openBudgetModal(editId = null) {
        const form = document.getElementById('budgetForm');
        form.reset();
        const amountInput = document.getElementById('budgetAmount');
        amountInput.value = '';
        amountInput.dataset.raw = '';

        document.getElementById('budgetId').value = editId || '';
        document.getElementById('budgetModalTitle').textContent = editId ? 'Edit Budget' : 'Atur Budget';
        document.getElementById('budgetPrefix').textContent = this.getCurrencySymbol();

        // Populate category select
        const select = document.getElementById('budgetCategory');
        select.innerHTML = '<option value="">Pilih Kategori</option>' +
            this.categories.expense.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

        if (editId) {
            const b = this.budgets.find(x => x.id === editId);
            if (b) {
                select.value = b.category;
                amountInput.value = this.formatNumber(b.amount);
                amountInput.dataset.raw = b.amount;
            }
        }

        this.openModal('budgetModal');
    }

    saveBudget(e) {
        e.preventDefault();
        const id = document.getElementById('budgetId').value;
        const category = document.getElementById('budgetCategory').value;
        const amount = this.getRawAmount('budgetAmount');

        if (!category) { this.showToast('Pilih kategori', true); return; }
        if (!amount || amount <= 0) { this.showToast('Masukkan jumlah yang valid', true); return; }

        if (id) {
            const index = this.budgets.findIndex(b => b.id === id);
            if (index !== -1) {
                this.budgets[index] = { ...this.budgets[index], category, amount };
            }
            this.showToast('Budget diperbarui');
        } else {
            // Check if category already has budget
            const existing = this.budgets.find(b => b.category === category);
            if (existing) {
                existing.amount = amount;
                this.showToast('Budget diperbarui');
            } else {
                this.budgets.push({
                    id: this.generateId(), category, amount,
                    createdAt: new Date().toISOString()
                });
                this.showToast('Budget dibuat');
            }
        }

        this.save();
        this.renderBudgets();
        this.closeAllModals();
    }

    deleteBudget(id) {
        this.confirm('Hapus Budget?', 'Budget ini akan dihapus.', () => {
            this.budgets = this.budgets.filter(b => b.id !== id);
            this.save();
            this.renderBudgets();
            this.showToast('Budget dihapus');
        });
    }

    /* ============ CATEGORY MANAGEMENT ============ */
    openCategoryManager() {
        this.currentCatType = 'expense';
        document.querySelectorAll('.tab-mini').forEach(b => {
            b.classList.toggle('active', b.dataset.catType === 'expense');
        });
        this.renderCategoryManagerList();
        this.openModal('categoryManagerModal');
    }

    renderCategoryManagerList() {
        const list = document.getElementById('categoryListManage');
        const cats = this.categories[this.currentCatType] || [];

        list.innerHTML = cats.map(cat => `
            <div class="manage-cat-item">
                <div class="cat-icon-wrapper" style="background: ${cat.color}">
                    <i class="fas ${cat.icon}"></i>
                </div>
                <span class="cat-name">${this.escapeHtml(cat.name)}</span>
                <div class="cat-actions">
                    <button onclick="app.openCategoryEditor('${cat.id}', '${this.currentCatType}')" title="Edit">
                        <i class="fas fa-pen"></i>
                    </button>
                    ${!cat.isCustom ? '' : `
                        <button class="del" onclick="app.deleteCategory('${cat.id}', '${this.currentCatType}')" title="Hapus">
                            <i class="fas fa-trash"></i>
                        </button>
                    `}
                </div>
            </div>`).join('');
    }

    openCategoryEditor(catId = null, type = 'expense') {
        document.getElementById('categoryForm').reset();
        document.getElementById('catEditId').value = catId || '';
        document.getElementById('catEditType').value = type;
        document.getElementById('categoryEditorTitle').textContent = catId ? 'Edit Kategori' : 'Kategori Baru';

        let currentIcon = 'fa-circle';
        let currentColor = '#6366f1';

        if (catId) {
            const cat = (this.categories[type] || []).find(c => c.id === catId);
            if (cat) {
                document.getElementById('catName').value = cat.name;
                currentIcon = cat.icon;
                currentColor = cat.color;
            }
        }

        document.getElementById('catIcon').value = currentIcon;
        document.getElementById('catColor').value = currentColor;

        // Icon picker
        const iconPicker = document.getElementById('iconPicker');
        iconPicker.innerHTML = this.iconOptions.map(icon => `
            <button type="button" class="icon-pick-item ${icon === currentIcon ? 'selected' : ''}" data-icon="${icon}">
                <i class="fas ${icon}"></i>
            </button>`).join('');

        iconPicker.querySelectorAll('.icon-pick-item').forEach(btn => {
            btn.addEventListener('click', () => {
                iconPicker.querySelectorAll('.icon-pick-item').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                document.getElementById('catIcon').value = btn.dataset.icon;
            });
        });

        // Color picker
        const colorPicker = document.getElementById('colorPicker');
        colorPicker.innerHTML = this.colorOptions.map(color => `
            <button type="button" class="color-pick-item ${color === currentColor ? 'selected' : ''}" 
                    style="background: ${color}" data-color="${color}"></button>`).join('');

        colorPicker.querySelectorAll('.color-pick-item').forEach(btn => {
            btn.addEventListener('click', () => {
                colorPicker.querySelectorAll('.color-pick-item').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                document.getElementById('catColor').value = btn.dataset.color;
            });
        });

        this.openModal('categoryEditorModal');
    }

    saveCategory(e) {
        e.preventDefault();
        const id = document.getElementById('catEditId').value;
        const type = document.getElementById('catEditType').value;
        const name = document.getElementById('catName').value.trim();
        const icon = document.getElementById('catIcon').value;
        const color = document.getElementById('catColor').value;

        if (!name) { this.showToast('Masukkan nama kategori', true); return; }

        if (id) {
            const cat = this.categories[type].find(c => c.id === id);
            if (cat) {
                cat.name = name;
                cat.icon = icon;
                cat.color = color;
            }
            this.showToast('Kategori diperbarui');
        } else {
            const newId = 'custom_' + this.generateId();
            this.categories[type].push({ id: newId, name, icon, color, isCustom: true });
            this.showToast('Kategori ditambahkan');
        }

        this.save();
        this.renderCategoryManagerList();
        this.closeModal('categoryEditorModal');

        // Refresh transaction grid if open
        const transModal = document.getElementById('transactionModal');
        if (transModal.classList.contains('active')) {
            const t = document.getElementById('transactionType').value;
            const selected = document.getElementById('category').value;
            this.renderCategoryGrid(t);
            if (selected) this.highlightSelectedCategory(selected);
        }
    }

    deleteCategory(catId, type) {
        this.confirm('Hapus Kategori?', 
            'Transaksi dengan kategori ini akan tetap ada tapi tidak bisa dikategorikan lagi.',
            () => {
                this.categories[type] = this.categories[type].filter(c => c.id !== catId);
                this.save();
                this.renderCategoryManagerList();
                this.showToast('Kategori dihapus');
            });
    }

    /* ============ BACKGROUND PICKER ============ */
    openBackgroundModal() {
        this.renderPresetGrid();
        this.openModal('backgroundModal');
    }

    renderPresetGrid() {
        const grid = document.getElementById('presetGrid');
        grid.innerHTML = this.presetBgs.map((bg, i) => `
            <div class="preset-item ${this.profile.headerBg === bg.value ? 'selected' : ''}" 
                 style="background: ${bg.value}" 
                 data-bg="${bg.value}"
                 title="${bg.name}"></div>`).join('');

        grid.querySelectorAll('.preset-item').forEach(item => {
            item.addEventListener('click', () => {
                this.profile.headerBg = item.dataset.bg;
                this.save();
                this.applyHeaderBackground();
                this.renderPresetGrid();
                this.showToast('Background diubah');
            });
        });
    }

        /* ============ CALCULATOR (FIXED) ============ */
    openCalculator() {
        this.calculator = { current: '0', previous: null, operator: null, expression: '' };
        this.updateCalcDisplay();
        this.openModal('calculatorModal');
    }

    handleCalcBtn(btn) {
        const num = btn.dataset.num;
        const op = btn.dataset.op;
        const action = btn.dataset.action;
        const calc = this.calculator;

        if (num !== undefined) {
            if (num === '.' && calc.current.includes('.')) return; 
            if (calc.current === '0' && num !== '.') {
                calc.current = num;
            } else {
                if (calc.current.replace(/[^0-9]/g, '').length < 12) {
                    calc.current += num;
                }
            }
        } else if (op) {
            if (calc.operator && calc.previous !== null && calc.current !== '') {
                const result = this.computeCalc();
                calc.previous = result;
                calc.current = '0';
            } else if (calc.current !== '') {
                calc.previous = parseFloat(calc.current);
                calc.current = '0';
            }
            calc.operator = op;
            calc.expression = ''; 
        } else if (action === 'clear') {
            calc.current = '0';
            calc.previous = null;
            calc.operator = null;
            calc.expression = '';
        } else if (action === 'backspace') {
            calc.current = calc.current.length > 1 ? calc.current.slice(0, -1) : '0';
        } else if (action === 'percent') {
            if (calc.current !== '0') {
                calc.current = String(parseFloat(calc.current) / 100);
            }
        } else if (action === 'equals') {
            if (calc.operator && calc.previous !== null) {
                const result = this.computeCalc();
                calc.expression = `${this.formatNumber(calc.previous)} ${this.getOpSymbol(calc.operator)} ${this.formatNumber(calc.current)} =`;
                calc.current = String(result);
                calc.previous = null;
                calc.operator = null;
            }
        }

        this.updateCalcDisplay();
    }

    computeCalc() {
        const calc = this.calculator;
        const a = calc.previous;
        const b = parseFloat(calc.current) || 0;
        let result = 0;
        switch (calc.operator) {
            case '+': result = a + b; break;
            case '-': result = a - b; break;
            case '*': result = a * b; break;
            case '/': result = b === 0 ? 0 : a / b; break;
        }
        return Math.round(result * 10000) / 10000; 
    }

    getOpSymbol(op) {
        return { '+': '+', '-': '−', '*': '×', '/': '÷' }[op] || op;
    }

    updateCalcDisplay() {
        const calc = this.calculator;
        let displayValue = calc.current;
        
        if (!displayValue.includes('.') && !isNaN(parseFloat(displayValue))) {
            const num = parseFloat(displayValue);
            if (Math.abs(num) >= 1000) {
                displayValue = this.formatNumber(num);
            }
        }
        
        document.getElementById('calcResult').textContent = displayValue;
        
        let exprText = '';
        if (calc.expression) {
            exprText = calc.expression;
        } else if (calc.previous !== null) {
            exprText = `${this.formatNumber(calc.previous)} ${this.getOpSymbol(calc.operator)}`;
        }
        document.getElementById('calcExpression').textContent = exprText;
    }

    useCalcResult() {
        const result = this.calculator.current;
        const num = Math.round(parseFloat(result)) || 0;

        const transModal = document.getElementById('transactionModal');
        if (transModal.classList.contains('active')) {
            const input = document.getElementById('amount');
            input.value = this.formatNumber(num);
            input.dataset.raw = num;
            this.closeAllModals();
            this.showToast('Hasil dimasukkan ke nominal');
            return;
        }

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(String(num)).then(() => {
                this.showToast('Hasil disalin ke clipboard');
                this.closeAllModals();
            }).catch(() => {
                this.showToast('Gagal menyalin', true);
            });
        } else {
            this.showToast('Hasil: ' + this.formatNumber(num));
        }
    }

    /* ============ FILTER ============ */
    filterByPeriod(transactions, period) {
        if (period === 'all') return transactions;
        const now = new Date();
        let startDate;
        switch (period) {
            case 'week':
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 6);
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
        }
        return transactions.filter(t => {
            const d = new Date(t.date + 'T00:00:00');
            return d >= startDate && d <= now;
        });
    }

    /* ============ EXPORT / IMPORT ============ */
    exportCSV() {
        if (this.transactions.length === 0) {
            this.showToast('Belum ada data untuk diexport', true);
            return;
        }
        const headers = ['Tanggal', 'Tipe', 'Kategori', 'Deskripsi', 'Jumlah'];
        const rows = this.transactions.map(t => {
            const cat = this.getCategoryInfo(t.type, t.category);
            return [
                t.date,
                t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
                cat.name,
                `"${(t.description || '').replace(/"/g, '""')}"`,
                t.type === 'income' ? t.amount : -t.amount
            ].join(',');
        });
        const csv = '\uFEFF' + [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        this.downloadBlob(blob, `dompetku-${new Date().toISOString().split('T')[0]}.csv`);
        this.showToast('Data berhasil diexport');
    }

    exportJSON() {
        const data = {
            version: '2.0',
            exportedAt: new Date().toISOString(),
            transactions: this.transactions,
            savingsGoals: this.savingsGoals,
            budgets: this.budgets,
            categories: this.categories,
            settings: this.settings,
            profile: this.profile
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        this.downloadBlob(blob, `dompetku-backup-${new Date().toISOString().split('T')[0]}.json`);
        this.showToast('Backup berhasil dibuat');
    }

    importJSON(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (!data.transactions || !Array.isArray(data.transactions)) {
                    throw new Error('Format file tidak valid');
                }
                this.confirm('Restore Data?',
                    `Akan mengimpor ${data.transactions.length} transaksi, ${data.savingsGoals?.length || 0} tabungan, dan ${data.budgets?.length || 0} budget. Data saat ini akan diganti.`,
                    () => {
                        this.transactions = data.transactions || [];
                        this.savingsGoals = data.savingsGoals || [];
                        this.budgets = data.budgets || [];
                        if (data.categories) this.categories = data.categories;
                        if (data.settings) this.settings = { ...this.settings, ...data.settings };
                        if (data.profile) this.profile = { ...this.profile, ...data.profile };
                        this.applyTheme();
                        this.applyProfile();
                        this.applyHeaderBackground();
                        this.save();
                        this.render();
                        this.showToast('Data berhasil direstore');
                    });
            } catch {
                this.showToast('File tidak valid', true);
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    }

    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    resetAllData() {
        this.transactions = [];
        this.savingsGoals = [];
        this.budgets = [];
        this.categories = JSON.parse(JSON.stringify(this.defaultCategories));
        this.save();
        this.render();
        this.showToast('Semua data dihapus');
    }

    /* ============ TOAST ============ */
    showToast(message, isError = false) {
        const toast = document.getElementById('toast');
        const icon = toast.querySelector('i');
        document.getElementById('toastMessage').textContent = message;
        if (isError) {
            icon.className = 'fas fa-exclamation-circle';
            toast.classList.add('error');
        } else {
            icon.className = 'fas fa-check-circle';
            toast.classList.remove('error');
        }
        toast.classList.add('show');
        clearTimeout(this._toastTimeout);
        this._toastTimeout = setTimeout(() => toast.classList.remove('show'), 2500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new FinanceApp();
});