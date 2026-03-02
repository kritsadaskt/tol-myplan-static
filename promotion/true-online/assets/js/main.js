/* ──────────────────────────────────────────── *
 *  TRUE ONLINE — MY Plan  ·  Alpine.js Store  *
 * ──────────────────────────────────────────── */

const API_ENDPOINT = (() => {
    const host = window.location.hostname;
    const isLocal = host === 'localhost' || host === '127.0.0.1';
    return isLocal
        ? '../api.php'
        : 'https://tol.otters.dev/promotion/true-online/api.php';
})();

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
    asian_combo_plus: { label: 'Asian Combo + กล่อง TrueID TV', price: 200 },
    asian_combo: { label: 'Asian Combo', price: 139 },
    now_ent_plus: { label: 'TrueVisions NOW ENT + กล่อง TrueID TV', price: 180 },
    now_ent: { label: 'TrueVisions NOW ENT', price: 99 },
};

/* ── CRM: Package codes (plan_id → PDS Package field) ── */
const PACKAGE_CODES = {
    plan_1: '1000/500_12M_699',
    plan_2: '1000/500_24M_599',
    plan_3: '500/500_12M_599',
    plan_4: '500/500_24M_499',
};

/* ── CRM: Add-on → CRM field codes ── */
const ADDON_CRM_CODES = {
    mobilePack: { field: 'OfferSGM', code: 'SIM20GB_120' },
    meshWifi: { field: 'TelcoOffer', code: 'Mesh_100' },
    cctv_premium: { field: 'TelcoOffer', code: 'CCTV_INS_179' },
    cctv_basic: { field: 'TelcoOffer', code: 'CCTV_99' },
    asian_combo_plus: { field: 'NonTelcoOffer', code: 'Asian Combo_OTT_200' },
    asian_combo: { field: 'NonTelcoOffer', code: 'Aisan Combo_139' },
    now_ent_plus: { field: 'NonTelcoOffer', code: 'NOWENT_OTT_180' },
    now_ent: { field: 'NonTelcoOffer', code: 'NOWENT_99' },
};

/* ── CRM: Default BU code for self-custom plans ── */
const BU_CODE_SELF_CUSTOM = 'BU-18269';

/* ── MKT Code lookup map ── */
/* Key = "speed|contract|SIM20GB|CCTV|CCTVIns|AsianComboBox|NowEntBox|AsianCombo|NowEnt" */
/* All YES/NO flags; meshWifi is excluded (not in CSV). */
const MKT_CODE_MAP = {
    // ── 300/300, 12 months ──
    '300/300|12|NO|NO|NO|NO|NO|NO|NO': 'FTA19-300',
    '300/300|12|NO|YES|NO|NO|NO|NO|NO': 'FTA120-300',
    '300/300|12|NO|NO|YES|NO|NO|NO|NO': 'FTA121-300',
    '300/300|12|NO|NO|NO|NO|NO|NO|YES': 'FTA122-300',
    '300/300|12|NO|NO|NO|NO|NO|YES|NO': 'FTA123-300',
    '300/300|12|NO|YES|NO|NO|NO|NO|YES': 'FTA124-300',
    '300/300|12|NO|YES|NO|NO|NO|YES|NO': 'FTA125-300',
    '300/300|12|NO|NO|YES|NO|NO|NO|YES': 'FTA126-300',
    '300/300|12|NO|NO|YES|NO|NO|YES|NO': 'FTA127-300',
    '300/300|12|YES|NO|NO|NO|NO|NO|NO': 'FTTS205-300',
    '300/300|12|YES|YES|NO|NO|NO|NO|NO': 'FTTS206-300',
    '300/300|12|YES|NO|YES|NO|NO|NO|NO': 'FTTS207-300',
    '300/300|12|YES|NO|NO|NO|NO|NO|YES': 'FTTS208-300',
    '300/300|12|YES|NO|NO|NO|NO|YES|NO': 'FTTS209-300',
    '300/300|12|YES|YES|NO|NO|NO|NO|YES': 'FTTS210-300',
    '300/300|12|YES|YES|NO|NO|NO|YES|NO': 'FTTS211-300',
    '300/300|12|YES|NO|YES|NO|NO|NO|YES': 'FTTS212-300',
    '300/300|12|YES|NO|YES|NO|NO|YES|NO': 'FTTS213-300',
    '300/300|12|NO|NO|NO|NO|YES|NO|NO': 'FTOT443-300',
    '300/300|12|NO|NO|NO|YES|NO|NO|NO': 'FTOT444-300',
    '300/300|12|NO|YES|NO|NO|YES|NO|NO': 'FTOT445-300',
    '300/300|12|NO|YES|NO|YES|NO|NO|NO': 'FTOT446-300',
    '300/300|12|NO|NO|YES|NO|YES|NO|NO': 'FTOT466-300',
    '300/300|12|NO|NO|YES|YES|NO|NO|NO': 'FTOT447-300',
    '300/300|12|YES|NO|NO|NO|YES|NO|NO': 'FTOT454-300',
    '300/300|12|YES|NO|NO|YES|NO|NO|NO': 'FTOT455-300',
    '300/300|12|YES|YES|NO|NO|YES|NO|NO': 'FTOT456-300',
    '300/300|12|YES|YES|NO|YES|NO|NO|NO': 'FTOT457-300',
    '300/300|12|YES|NO|YES|NO|YES|NO|NO': 'FTOT458-300',
    '300/300|12|YES|NO|YES|YES|NO|NO|NO': 'FTOT459-300',
    // ── 500/500, 24 months ──
    '500/500|24|NO|NO|NO|NO|NO|NO|NO': 'FTA44-500',
    '500/500|24|NO|YES|NO|NO|NO|NO|NO': 'FTA128-500',
    '500/500|24|NO|NO|YES|NO|NO|NO|NO': 'FTA129-500',
    '500/500|24|NO|NO|NO|NO|NO|NO|YES': 'FTA130-500',
    '500/500|24|NO|NO|NO|NO|NO|YES|NO': 'FTA131-500',
    '500/500|24|NO|YES|NO|NO|NO|NO|YES': 'FTA132-500',
    '500/500|24|NO|YES|NO|NO|NO|YES|NO': 'FTA133-500',
    '500/500|24|NO|NO|YES|NO|NO|NO|YES': 'FTA134-500',
    '500/500|24|NO|NO|YES|NO|NO|YES|NO': 'FTA135-500',
    '500/500|24|YES|NO|NO|NO|NO|NO|NO': 'FTTS214-500',
    '500/500|24|YES|YES|NO|NO|NO|NO|NO': 'FTTS215-500',
    '500/500|24|YES|NO|YES|NO|NO|NO|NO': 'FTTS216-500',
    '500/500|24|YES|NO|NO|NO|NO|NO|YES': 'FTTS217-500',
    '500/500|24|YES|NO|NO|NO|NO|YES|NO': 'FTTS218-500',
    '500/500|24|YES|YES|NO|NO|NO|NO|YES': 'FTTS219-500',
    '500/500|24|YES|YES|NO|NO|NO|YES|NO': 'FTTS220-500',
    '500/500|24|YES|NO|YES|NO|NO|NO|YES': 'FTTS221-500',
    '500/500|24|YES|NO|YES|NO|NO|YES|NO': 'FTTS222-500',
    '500/500|24|NO|NO|NO|NO|YES|NO|NO': 'FTOT448-500',
    '500/500|24|NO|NO|NO|YES|NO|NO|NO': 'FTOT449-500',
    '500/500|24|NO|YES|NO|NO|YES|NO|NO': 'FTOT450-500',
    '500/500|24|NO|YES|NO|YES|NO|NO|NO': 'FTOT451-500',
    '500/500|24|NO|NO|YES|NO|YES|NO|NO': 'FTOT452-500',
    '500/500|24|NO|NO|YES|YES|NO|NO|NO': 'FTOT453-500',
    '500/500|24|YES|NO|NO|NO|YES|NO|NO': 'FTOT460-500',
    '500/500|24|YES|NO|NO|YES|NO|NO|NO': 'FTOT461-500',
    '500/500|24|YES|YES|NO|NO|YES|NO|NO': 'FTOT462-500',
    '500/500|24|YES|YES|NO|YES|NO|NO|NO': 'FTOT463-500',
    '500/500|24|YES|NO|YES|NO|YES|NO|NO': 'FTOT464-500',
    '500/500|24|YES|NO|YES|YES|NO|NO|NO': 'FTOT465-500',
    // ── 500/500, 12 months ──
    '500/500|12|NO|NO|NO|NO|NO|NO|NO': 'FTA19-500',
    '500/500|12|NO|YES|NO|NO|NO|NO|NO': 'FTA120-500',
    '500/500|12|NO|NO|YES|NO|NO|NO|NO': 'FTA121-500',
    '500/500|12|NO|NO|NO|NO|NO|NO|YES': 'FTA122-500',
    '500/500|12|NO|NO|NO|NO|NO|YES|NO': 'FTA123-500',
    '500/500|12|NO|YES|NO|NO|NO|NO|YES': 'FTA124-500',
    '500/500|12|NO|YES|NO|NO|NO|YES|NO': 'FTA125-500',
    '500/500|12|NO|NO|YES|NO|NO|NO|YES': 'FTA126-500',
    '500/500|12|NO|NO|YES|NO|NO|YES|NO': 'FTA127-500',
    '500/500|12|YES|NO|NO|NO|NO|NO|NO': 'FTTS205-500',
    '500/500|12|YES|YES|NO|NO|NO|NO|NO': 'FTTS206-500',
    '500/500|12|YES|NO|YES|NO|NO|NO|NO': 'FTTS207-500',
    '500/500|12|YES|NO|NO|NO|NO|NO|YES': 'FTTS208-500',
    '500/500|12|YES|NO|NO|NO|NO|YES|NO': 'FTTS209-500',
    '500/500|12|YES|YES|NO|NO|NO|NO|YES': 'FTTS210-500',
    '500/500|12|YES|YES|NO|NO|NO|YES|NO': 'FTTS211-500',
    '500/500|12|YES|NO|YES|NO|NO|NO|YES': 'FTTS212-500',
    '500/500|12|YES|NO|YES|NO|NO|YES|NO': 'FTTS213-500',
    '500/500|12|NO|NO|NO|NO|YES|NO|NO': 'FTOT443-500',
    '500/500|12|NO|NO|NO|YES|NO|NO|NO': 'FTOT444-500',
    '500/500|12|NO|YES|NO|NO|YES|NO|NO': 'FTOT445-500',
    '500/500|12|NO|YES|NO|YES|NO|NO|NO': 'FTOT446-500',
    '500/500|12|NO|NO|YES|NO|YES|NO|NO': 'FTOT466-500',
    '500/500|12|NO|NO|YES|YES|NO|NO|NO': 'FTOT447-500',
    '500/500|12|YES|NO|NO|NO|YES|NO|NO': 'FTOT454-500',
    '500/500|12|YES|NO|NO|YES|NO|NO|NO': 'FTOT455-500',
    '500/500|12|YES|YES|NO|NO|YES|NO|NO': 'FTOT456-500',
    '500/500|12|YES|YES|NO|YES|NO|NO|NO': 'FTOT457-500',
    '500/500|12|YES|NO|YES|NO|YES|NO|NO': 'FTOT458-500',
    '500/500|12|YES|NO|YES|YES|NO|NO|NO': 'FTOT459-500',
    // ── 1000/500, 24 months ──
    '1000/500|24|NO|NO|NO|NO|NO|NO|NO': 'FTA81-1000',
    '1000/500|24|NO|YES|NO|NO|NO|NO|NO': 'FTA128-1000',
    '1000/500|24|NO|NO|YES|NO|NO|NO|NO': 'FTA129-1000',
    '1000/500|24|NO|NO|NO|NO|NO|NO|YES': 'FTA130-1000',
    '1000/500|24|NO|NO|NO|NO|NO|YES|NO': 'FTA131-1000',
    '1000/500|24|NO|YES|NO|NO|NO|NO|YES': 'FTA132-1000',
    '1000/500|24|NO|YES|NO|NO|NO|YES|NO': 'FTA133-1000',
    '1000/500|24|NO|NO|YES|NO|NO|NO|YES': 'FTA134-1000',
    '1000/500|24|NO|NO|YES|NO|NO|YES|NO': 'FTA135-1000',
    '1000/500|24|YES|NO|NO|NO|NO|NO|NO': 'FTTS214-1000',
    '1000/500|24|YES|YES|NO|NO|NO|NO|NO': 'FTTS215-1000',
    '1000/500|24|YES|NO|YES|NO|NO|NO|NO': 'FTTS216-1000',
    '1000/500|24|YES|NO|NO|NO|NO|NO|YES': 'FTTS217-1000',
    '1000/500|24|YES|NO|NO|NO|NO|YES|NO': 'FTTS218-1000',
    '1000/500|24|YES|YES|NO|NO|NO|NO|YES': 'FTTS219-1000',
    '1000/500|24|YES|YES|NO|NO|NO|YES|NO': 'FTTS220-1000',
    '1000/500|24|YES|NO|YES|NO|NO|NO|YES': 'FTTS221-1000',
    '1000/500|24|YES|NO|YES|NO|NO|YES|NO': 'FTTS222-1000',
    '1000/500|24|NO|NO|NO|NO|YES|NO|NO': 'FTOT448-1000',
    '1000/500|24|NO|NO|NO|YES|NO|NO|NO': 'FTOT449-1000',
    '1000/500|24|NO|YES|NO|NO|YES|NO|NO': 'FTOT450-1000',
    '1000/500|24|NO|YES|NO|YES|NO|NO|NO': 'FTOT451-1000',
    '1000/500|24|NO|NO|YES|NO|YES|NO|NO': 'FTOT452-1000',
    '1000/500|24|NO|NO|YES|YES|NO|NO|NO': 'FTOT453-1000',
    '1000/500|24|YES|NO|NO|NO|YES|NO|NO': 'FTOT460-1000',
    '1000/500|24|YES|NO|NO|YES|NO|NO|NO': 'FTOT461-1000',
    '1000/500|24|YES|YES|NO|NO|YES|NO|NO': 'FTOT462-1000',
    '1000/500|24|YES|YES|NO|YES|NO|NO|NO': 'FTOT463-1000',
    '1000/500|24|YES|NO|YES|NO|YES|NO|NO': 'FTOT464-1000',
    '1000/500|24|YES|NO|YES|YES|NO|NO|NO': 'FTOT465-1000',
    // ── 1000/500, 12 months ──
    '1000/500|12|NO|NO|NO|NO|NO|NO|NO': 'FTA19-1000',
    '1000/500|12|NO|YES|NO|NO|NO|NO|NO': 'FTA120-1000',
    '1000/500|12|NO|NO|YES|NO|NO|NO|NO': 'FTA121-1000',
    '1000/500|12|NO|NO|NO|NO|NO|NO|YES': 'FTA122-1000',
    '1000/500|12|NO|NO|NO|NO|NO|YES|NO': 'FTA123-1000',
    '1000/500|12|NO|YES|NO|NO|NO|NO|YES': 'FTA124-1000',
    '1000/500|12|NO|YES|NO|NO|NO|YES|NO': 'FTA125-1000',
    '1000/500|12|NO|NO|YES|NO|NO|NO|YES': 'FTA126-1000',
    '1000/500|12|NO|NO|YES|NO|NO|YES|NO': 'FTA127-1000',
    '1000/500|12|YES|NO|NO|NO|NO|NO|NO': 'FTTS205-1000',
    '1000/500|12|YES|YES|NO|NO|NO|NO|NO': 'FTTS206-1000',
    '1000/500|12|YES|NO|YES|NO|NO|NO|NO': 'FTTS207-1000',
    '1000/500|12|YES|NO|NO|NO|NO|NO|YES': 'FTTS208-1000',
    '1000/500|12|YES|NO|NO|NO|NO|YES|NO': 'FTTS209-1000',
    '1000/500|12|YES|YES|NO|NO|NO|NO|YES': 'FTTS210-1000',
    '1000/500|12|YES|YES|NO|NO|NO|YES|NO': 'FTTS211-1000',
    '1000/500|12|YES|NO|YES|NO|NO|NO|YES': 'FTTS212-1000',
    '1000/500|12|YES|NO|YES|NO|NO|YES|NO': 'FTTS213-1000',
    '1000/500|12|NO|NO|NO|NO|YES|NO|NO': 'FTOT443-1000',
    '1000/500|12|NO|NO|NO|YES|NO|NO|NO': 'FTOT444-1000',
    '1000/500|12|NO|YES|NO|NO|YES|NO|NO': 'FTOT445-1000',
    '1000/500|12|NO|YES|NO|YES|NO|NO|NO': 'FTOT446-1000',
    '1000/500|12|NO|NO|YES|NO|YES|NO|NO': 'FTOT466-1000',
    '1000/500|12|NO|NO|YES|YES|NO|NO|NO': 'FTOT447-1000',
    '1000/500|12|YES|NO|NO|NO|YES|NO|NO': 'FTOT454-1000',
    '1000/500|12|YES|NO|NO|YES|NO|NO|NO': 'FTOT455-1000',
    '1000/500|12|YES|YES|NO|NO|YES|NO|NO': 'FTOT456-1000',
    '1000/500|12|YES|YES|NO|YES|NO|NO|NO': 'FTOT457-1000',
    '1000/500|12|YES|NO|YES|NO|YES|NO|NO': 'FTOT458-1000',
    '1000/500|12|YES|NO|YES|YES|NO|NO|NO': 'FTOT459-1000',
};

/**
 * Look up MKT Code from the current plan + add-on combination.
 * @param {string} speed    – e.g. '1000/500 Mbps' or '500/500' (trailing ' Mbps' is stripped)
 * @param {number} contract – 12 or 24
 * @param {object} addOns   – { mobilePack: bool, cctv: string|null, tvPack: string|null }
 *                             (meshWifi is ignored — not in CSV)
 * @returns {string} MKT Code or 'UNKNOWN'
 */
function lookupMktCode(speed, contract, addOns) {
    // Normalise speed: "1000/500 Mbps" → "1000/500", "500/500 Mbps" → "500/500"
    const spd = speed.replace(/\s*Mbps\s*/i, '').trim();
    const yn = (v) => v ? 'YES' : 'NO';
    const key = [
        spd,
        contract,
        yn(addOns.mobilePack),
        yn(addOns.cctv === 'cctv_basic'),
        yn(addOns.cctv === 'cctv_premium'),
        yn(addOns.tvPack === 'asian_combo_plus'),
        yn(addOns.tvPack === 'now_ent_plus'),
        yn(addOns.tvPack === 'asian_combo'),
        yn(addOns.tvPack === 'now_ent'),
    ].join('|');
    return MKT_CODE_MAP[key] || 'UNKNOWN';
}

/**
 * Derive add-on flags from a preset package's activeAddons array.
 * Used for preset/BU-code packages that don't come from the configurator.
 * @param {Array} activeAddons – e.g. [{ label: 'CCTV 1 ตัว', price: 99 }, …]
 * @returns {object} – { mobilePack, cctv, tvPack } matching store shape
 */
function deriveAddonsFromPreset(activeAddons) {
    const result = { mobilePack: false, cctv: null, tvPack: null };
    for (const a of activeAddons) {
        // Match by label (same labels used in ADDON_PRICES)
        if (a.label === ADDON_PRICES.mobilePack.label) result.mobilePack = true;
        else if (a.label === ADDON_PRICES.cctv_basic.label && a.price === ADDON_PRICES.cctv_basic.price) result.cctv = 'cctv_basic';
        else if (a.label === ADDON_PRICES.cctv_premium.label) result.cctv = 'cctv_premium';
        else if (a.label === ADDON_PRICES.asian_combo_plus.label) result.tvPack = 'asian_combo_plus';
        else if (a.label === ADDON_PRICES.asian_combo.label) result.tvPack = 'asian_combo';
        else if (a.label === ADDON_PRICES.now_ent_plus.label) result.tvPack = 'now_ent_plus';
        else if (a.label === ADDON_PRICES.now_ent.label) result.tvPack = 'now_ent';
    }
    return result;
}

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

        /** Build CRM add-on codes from current selection */
        buildCrmAddons() {
            const result = { OfferSGM: '', TelcoOffer: '', NonTelcoOffer: '' };
            if (this.addOns.mobilePack) {
                result.OfferSGM = ADDON_CRM_CODES.mobilePack.code;
            }
            if (this.addOns.meshWifi) {
                result.TelcoOffer = ADDON_CRM_CODES.meshWifi.code;
            }
            if (this.addOns.cctv && ADDON_CRM_CODES[this.addOns.cctv]) {
                result.TelcoOffer = ADDON_CRM_CODES[this.addOns.cctv].code;
            }
            if (this.addOns.tvPack && ADDON_CRM_CODES[this.addOns.tvPack]) {
                result.NonTelcoOffer = ADDON_CRM_CODES[this.addOns.tvPack].code;
            }
            return result;
        },

        /** Serialize current selection → sessionStorage (called before navigating to summary) */
        persistToSession() {
            const plan = this.selectedPlan;
            const snapshot = {
                selectedPlanId: this.selectedPlanId,
                addOns: JSON.parse(JSON.stringify(this.addOns)),
                plan: plan,
                activeAddons: this.activeAddons,
                addonTotal: this.addonTotal,
                total: this.total,
                /* CRM fields */
                packageCode: PACKAGE_CODES[this.selectedPlanId] || '',
                buCode: BU_CODE_SELF_CUSTOM,
                crmAddons: this.buildCrmAddons(),
                /* MKT Code */
                mktCode: plan ? lookupMktCode(plan.speed, plan.contract, this.addOns) : 'UNKNOWN',
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

/**
 * Capture UTM parameters from the landing URL and persist to sessionStorage.
 * Called once on the configurator page load.
 */
function captureUTM() {
    const params = new URLSearchParams(window.location.search);
    const utm = {
        campaign: params.get('utm_campaign') || '',
        source: params.get('utm_source') || '',
        medium: params.get('utm_medium') || '',
    };
    // Only overwrite if this is a fresh landing (has at least one UTM param)
    if (utm.campaign || utm.source || utm.medium) {
        sessionStorage.setItem('myplan_utm', JSON.stringify(utm));
    }
    return utm;
}
