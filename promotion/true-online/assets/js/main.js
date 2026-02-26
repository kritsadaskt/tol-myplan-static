/* ──────────────────────────────────────────── *
 *  TRUE ONLINE — MY Plan  ·  Alpine.js Store  *
 * ──────────────────────────────────────────── */

const API_ENDPOINT = 'https://api.example.com/leads';

/* ── Plans ── */
const PLANS = [
    { id: 'plan_1', speed: '1000/500 Mbps', contract: 12, price: 699 },
    { id: 'plan_2', speed: '1000/500 Mbps', contract: 24, price: 599 },
    { id: 'plan_3', speed: '500/500 Mbps', contract: 12, price: 599 },
    { id: 'plan_4', speed: '500/500 Mbps', contract: 24, price: 499 },
];

/* ── Add-on prices ── */
const ADDON_PRICES = {
    mobilePack: { label: 'ซิมเน็ตเต็มสปีด 20GB', price: 120 },
    meshWifi: { label: 'MESH WiFi 1 จุด', price: 100 },
    cctv_premium: { label: 'CCTV 1 ตัว + ประกันอัคคีภัย', price: 179 },
    cctv_basic: { label: 'CCTV 1 ตัว', price: 99 },
    asian_combo_plus: { label: 'Asian Combo + กล่อง TrueID TV', price: 240 },
    asian_combo: { label: 'Asian Combo', price: 139 },
    now_ent_plus: { label: 'TrueVisions NOW ENT + กล่อง TrueID TV', price: 180 },
    now_ent: { label: 'TrueVisions NOW ENT', price: 99 },
};

/* ── Image assets (Figma-exported, replace with local paths for prod) ── */
const ASSETS = {};

/* ── Alpine Store: plan ── */
document.addEventListener('alpine:init', () => {

    Alpine.store('plan', {
        /* ── State ── */
        selectedPlanId: null,
        addOns: {
            mobilePack: false,
            meshWifi: false,
            cctv: null,
            tvPack: null,
        },
        detailOpen: false,
        planError: false,

        /* ── Getters ── */
        get selectedPlan() {
            return PLANS.find(p => p.id === this.selectedPlanId) || null;
        },

        get activeAddons() {
            const list = [];
            if (this.addOns.mobilePack) {
                list.push(ADDON_PRICES.mobilePack);
            }
            if (this.addOns.meshWifi) {
                list.push(ADDON_PRICES.meshWifi);
            }
            if (this.addOns.cctv && ADDON_PRICES[this.addOns.cctv]) {
                list.push(ADDON_PRICES[this.addOns.cctv]);
            }
            if (this.addOns.tvPack && ADDON_PRICES[this.addOns.tvPack]) {
                list.push(ADDON_PRICES[this.addOns.tvPack]);
            }
            return list;
        },

        get addonTotal() {
            return this.activeAddons.reduce((sum, a) => sum + a.price, 0);
        },

        get total() {
            const plan = this.selectedPlan;
            return plan ? plan.price + this.addonTotal : 0;
        },

        get hasSelection() {
            return this.selectedPlanId !== null;
        },

        /* ── Actions ── */
        toggleDetail() {
            this.detailOpen = !this.detailOpen;
        },

        /**
         * Guard: require a plan before allowing add-on selection.
         * If no plan is selected → revert the add-on, show error, scroll to Step 1.
         * @param {Function} revertFn – callback to undo the add-on toggle
         * @returns {boolean} true if plan exists, false if blocked
         */
        requirePlan(revertFn) {
            if (this.selectedPlanId) return true;
            // Revert the add-on selection
            if (typeof revertFn === 'function') revertFn();
            this.planError = true;
            // Smooth-scroll to Step 1
            const el = document.getElementById('contract_period_group');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return false;
        },

        /** Serialize current selection → sessionStorage (called before navigating to summary) */
        persistToSession() {
            const snapshot = {
                selectedPlanId: this.selectedPlanId,
                addOns: JSON.parse(JSON.stringify(this.addOns)),
                plan: this.selectedPlan,
                activeAddons: this.activeAddons,
                addonTotal: this.addonTotal,
                total: this.total,
            };
            sessionStorage.setItem('myplan_selection', JSON.stringify(snapshot));
        },
    });

    /* ── Watcher: clear planError when a plan is selected ── */
    Alpine.effect(() => {
        if (Alpine.store('plan').selectedPlanId) {
            Alpine.store('plan').planError = false;
        }
    });
});

/**
 * Load persisted plan selection from sessionStorage.
 * Used by the summary page (no Alpine store needed there).
 * @returns {object|null}
 */
function loadFromSession() {
    try {
        const raw = sessionStorage.getItem('myplan_selection');
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
}
