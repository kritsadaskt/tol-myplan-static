<?php
/**
 * TrueOnline My Plan — CRM API Configuration
 *
 * Copy this file to config.php and fill in credentials from the infra team.
 *   cp config.example.php config.php
 *
 * NEVER commit config.php to version control.
 */

// ─── Environment: 'uat' or 'prod' ───────────────────────────────────
define('APP_ENV', 'uat');

// ─── CLM API Credentials ────────────────────────────────────────────
define('CLM_USER', '');
define('CLM_PASS', '');

// ─── PDS API Credentials ────────────────────────────────────────────
define('PDS_USER', '');
define('PDS_PASS', '');

// ─── API Endpoints ──────────────────────────────────────────────────
if (APP_ENV === 'prod') {
    define('CLM_URL', 'http://clmapi.truecorp.co.th/CRMICampaignGo/upsertCampaignCLM');
    define('PDS_URL', 'http://pdsinter.truecorp.co.th/PdsTelesaleApi/addLeads');
}
else {
    define('CLM_URL', 'http://clmapi-uat2.truecorp.co.th/CRMICampaignGo/upsertCampaignCLM');
    define('PDS_URL', 'http://pdsinter-uat.truecorp.co.th/PdsTelesaleApi/addLeads');
}

// ─── CORS Allowed Origins ───────────────────────────────────────────
define('ALLOWED_ORIGINS', [
    'https://true.th',
    'https://tol.otters.dev',
    'http://localhost:3000',
    'http://localhost:5500',
]);

// ─── Fixed CRM Field Values ─────────────────────────────────────────
define('CRM_CHANNEL', 'TOL-MYPLAN');
define('CRM_PRODUCT_NAME', 'Mobile');
define('CRM_PROJECT_NAME', 'TrueOneline My Plan');
define('CRM_PRODUCT', 'TOL');
define('CRM_PRODUCT_NUM', 'N/A');
define('CRM_STATUS', 'New');
define('CRM_ID_TYPE', 'Thai id');
define('CRM_ID_PREFIX', 'TOLMYPLAN');

// ─── Paths ──────────────────────────────────────────────────────────
define('COUNTER_FILE', __DIR__ . '/counter.txt');
define('LOG_DIR', __DIR__ . '/logs');