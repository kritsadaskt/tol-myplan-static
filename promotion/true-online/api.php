<?php
/**
 * TrueOnline My Plan — CRM Lead Activity Proxy
 *
 * 2-step API flow:
 *   1. POST → CLM API (upsertCampaignCLM) → get campTransID
 *   2. POST → PDS API (addLeads) using campTransID
 *
 * Usage:
 *   POST /promotion/true-online/api.php
 *   Content-Type: application/json
 */

// ─── Bootstrap ──────────────────────────────────────────────────────
require_once __DIR__ . '/config.php';

// ─── CORS ───────────────────────────────────────────────────────────
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, ALLOWED_ORIGINS, true)) {
    header("Access-Control-Allow-Origin: $origin");
}
else {
    header('Access-Control-Allow-Origin: ' . ALLOWED_ORIGINS[0]);
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Only POST allowed
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(405, false, 'Method not allowed');
}

// ─── Parse Input ────────────────────────────────────────────────────
$raw = file_get_contents('php://input');
$input = json_decode($raw, true);

if (!$input) {
    jsonResponse(400, false, 'Invalid JSON body');
}

// ─── Validate Required Fields ───────────────────────────────────────
$required = ['campaignCode', 'firstName', 'lastName', 'phone'];
$missing = [];
foreach ($required as $field) {
    if (empty(trim($input[$field] ?? ''))) {
        $missing[] = $field;
    }
}
if ($missing) {
    jsonResponse(400, false, 'Missing required fields: ' . implode(', ', $missing));
}

// ─── Extract Fields ─────────────────────────────────────────────────
$campaignCode = trim($input['campaignCode']);
$firstName = trim($input['firstName']);
$lastName = trim($input['lastName']);
$phone = trim($input['phone']);
$dataSource = trim($input['dataSource'] ?? '');
$offerSGM = trim($input['offerSGM'] ?? '');
$packageCode = trim($input['packageCode'] ?? '');
$telcoOffer = trim($input['telcoOffer'] ?? '');
$nonTelcoOffer = trim($input['nonTelcoOffer'] ?? '');
$leadSGM = trim($input['leadSGM'] ?? '');
$total = $input['total'] ?? 0;

// ─── Generate Dates ─────────────────────────────────────────────────
$now = new DateTime('now', new DateTimeZone('Asia/Bangkok'));
$effectiveDate = $now->format('Y-m-d\TH:i:s.v') . $now->format('O');

$expireDate = clone $now;
$expireDate->modify('+1 year');
$expireDateStr = $expireDate->format('Y-m-d\TH:i:s.v') . $expireDate->format('O');

// ─── Generate Unique ID (idNo) ──────────────────────────────────────
$idNo = generateIdNo($now);

$fullName = $firstName . ' ' . $lastName;
$phoneMasked = maskPhone($phone);

// =====================================================================
// STEP 1: CLM API — Upsert Campaign
// =====================================================================
$clmPayload = [
    'campCode' => $campaignCode,
    'serviceID' => $phone,
    'productName' => CRM_PRODUCT_NAME,
    'channel' => CRM_CHANNEL,
    'status' => CRM_STATUS,
    'effectiveDate' => $effectiveDate,
    'expireDate' => $expireDateStr,
    'contactBean' => [
        'idNo' => $idNo,
        'idType' => CRM_ID_TYPE,
        'firstname' => $firstName,
        'lastname' => $lastName,
        'contact_no1' => $phone,
    ],
];

$clmResult = callApi(CLM_URL, $clmPayload, CLM_USER, CLM_PASS);

// Log CLM
logCLM(
    $clmResult['success'] ? 'SUCCESS' : 'ERR',
    $idNo,
    $campaignCode,
    $now->format('Y-m-d H:i:s'),
    CRM_PROJECT_NAME,
    $packageCode,
    $fullName,
    $phoneMasked,
    $clmResult['data']['transID'] ?? '',
    $clmResult['data']['campTransID'] ?? ''
);

// Validate CLM response
$campTransID = $clmResult['data']['campTransID'] ?? null;
if (!$clmResult['success'] || empty($campTransID)) {
    $errMsg = $clmResult['data']['msg'] ?? ($clmResult['error'] ?? 'CLM returned empty campTransID');
    jsonResponse(502, false, 'CLM API error: ' . $errMsg);
}

// =====================================================================
// STEP 2: PDS API — Add Lead
// =====================================================================
$pdsPayload = [
    'CamsTransId' => $campTransID,
    'CampaignCode' => $campaignCode,
    'ProjectName' => CRM_PROJECT_NAME,
    'ContactNo1' => $phone,
    'ContactNo2' => '',
    'ContactNo3' => '',
    'SMS' => $phone,
    'CustomerName' => $fullName,
    'ThaiID' => '',
    'DataSource' => $dataSource,
    'Product' => CRM_PRODUCT,
    'ProductNumber' => CRM_PRODUCT_NUM,
    'LeadSGM' => $leadSGM,
    'OfferSGM' => $offerSGM,
    'Package' => $packageCode,
    'TelcoOffer' => $telcoOffer,
    'NonTelcoOffer' => $nonTelcoOffer,
];

$pdsResult = callApi(PDS_URL, $pdsPayload, PDS_USER, PDS_PASS);

// Determine PDS success
$pdsCode = $pdsResult['data']['errorCode']['code'] ?? '-1';
$pdsSuccess = ($pdsResult['success'] && $pdsCode === '0');
$pdsMsg = $pdsResult['data']['errorCode']['message'] ?? ($pdsResult['error'] ?? 'Unknown PDS error');

// Log PDS
logPDS(
    $pdsSuccess ? 'SUCCESS' : 'ERR',
    $campaignCode,
    $now->format('Y-m-d H:i:s'),
    CRM_PROJECT_NAME,
    $packageCode,
    $fullName,
    $phoneMasked,
    $pdsSuccess ? '' : $pdsMsg,
    $pdsResult['data']['transestionID'] ?? '',
    $campTransID
);

if (!$pdsSuccess) {
    jsonResponse(502, false, 'PDS API error: ' . $pdsMsg);
}

// ─── Success ────────────────────────────────────────────────────────
jsonResponse(200, true, 'Lead submitted successfully', [
    'campTransID' => $campTransID,
    'transestionID' => $pdsResult['data']['transestionID'] ?? '',
]);


// =====================================================================
// Helper Functions
// =====================================================================

/**
 * Call an API endpoint with JSON body and Basic Auth.
 */
function callApi(string $url, array $payload, string $user, string $pass): array
{
    $json = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $json,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Accept: application/json',
            'Accept-Encoding: gzip, deflate, identity',
        ],
        CURLOPT_USERPWD => "$user:$pass",
        CURLOPT_HTTPAUTH => CURLAUTH_BASIC,
        CURLOPT_ENCODING => '', // handle gzip/deflate
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($error) {
        return ['success' => false, 'error' => "cURL error: $error", 'data' => []];
    }

    $data = json_decode($response, true);
    if ($data === null) {
        return ['success' => false, 'error' => "Invalid JSON response (HTTP $httpCode): $response", 'data' => []];
    }

    return ['success' => ($httpCode >= 200 && $httpCode < 300), 'error' => '', 'data' => $data];
}

/**
 * Generate unique idNo: {DDMMYY}{PREFIX}{5-digit counter}
 * Uses file lock for atomic counter increment.
 */
function generateIdNo(DateTime $now): string
{
    $datePrefix = $now->format('dmy');

    // Ensure counter file exists
    if (!file_exists(COUNTER_FILE)) {
        file_put_contents(COUNTER_FILE, '0');
    }

    $fp = fopen(COUNTER_FILE, 'c+');
    if (!$fp) {
        // Fallback: use random suffix
        return $datePrefix . CRM_ID_PREFIX . str_pad(mt_rand(1, 99999), 5, '0', STR_PAD_LEFT);
    }

    flock($fp, LOCK_EX);
    $current = (int)trim(fread($fp, 10) ?: '0');
    $next = $current + 1;

    fseek($fp, 0);
    ftruncate($fp, 0);
    fwrite($fp, (string)$next);
    flock($fp, LOCK_UN);
    fclose($fp);

    return $datePrefix . CRM_ID_PREFIX . str_pad($next, 5, '0', STR_PAD_LEFT);
}

/**
 * Mask phone number: replace last 3 digits with XXX.
 */
function maskPhone(string $phone): string
{
    if (strlen($phone) < 4)
        return $phone;
    return substr($phone, 0, -3) . 'XXX';
}

/**
 * Send JSON response and exit.
 */
function jsonResponse(int $httpCode, bool $success, string $message, array $data = []): void
{
    http_response_code($httpCode);
    $response = ['success' => $success, 'message' => $message];
    if ($data) {
        $response['data'] = $data;
    }
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Ensure log directory exists.
 */
function ensureLogDir(): void
{
    if (!is_dir(LOG_DIR)) {
        mkdir(LOG_DIR, 0755, true);
    }
}

/**
 * Append a row to CLM log CSV.
 * Columns: STATUS, uniqueID, campCode, datetime, projectName, packageName, fullName, phone(masked), transID, campTransID
 */
function logCLM(
    string $status, string $uniqueID, string $campCode, string $datetime,
    string $projectName, string $packageName, string $fullName,
    string $phoneMasked, string $transID, string $campTransID
    ): void
{
    ensureLogDir();
    $file = LOG_DIR . '/log_CLM_' . date('Y-m-d') . '.csv';
    $row = [
        $status, $uniqueID, $campCode, $datetime, $projectName,
        $packageName, $fullName, $phoneMasked, $transID, $campTransID,
    ];

    // Write header if file is new
    if (!file_exists($file)) {
        $header = ['STATUS', 'uniqueID', 'campCode', 'datetime', 'projectName',
            'packageName', 'fullName', 'phone', 'transID', 'campTransID'];
        $fp = fopen($file, 'a');
        fputcsv($fp, $header, ',', '"', '');
        fputcsv($fp, $row, ',', '"', '');
        fclose($fp);
    }
    else {
        $fp = fopen($file, 'a');
        fputcsv($fp, $row, ',', '"', '');
        fclose($fp);
    }
}

/**
 * Append a row to PDS log CSV.
 * Columns: STATUS, campCode, datetime, projectName, packageName, fullName, phone(masked), errorMessage, transestionID, campTransID
 */
function logPDS(
    string $status, string $campCode, string $datetime,
    string $projectName, string $packageName, string $fullName,
    string $phoneMasked, string $errorMessage, string $transestionID,
    string $campTransID
    ): void
{
    ensureLogDir();
    $file = LOG_DIR . '/log_PDS_' . date('Y-m-d') . '.csv';
    $row = [
        $status, $campCode, $datetime, $projectName, $packageName,
        $fullName, $phoneMasked, $errorMessage, $transestionID, $campTransID,
    ];

    if (!file_exists($file)) {
        $header = ['STATUS', 'campCode', 'datetime', 'projectName', 'packageName',
            'fullName', 'phone', 'errorMessage', 'transestionID', 'campTransID'];
        $fp = fopen($file, 'a');
        fputcsv($fp, $header, ',', '"', '');
        fputcsv($fp, $row, ',', '"', '');
        fclose($fp);
    }
    else {
        $fp = fopen($file, 'a');
        fputcsv($fp, $row, ',', '"', '');
        fclose($fp);
 
    }
}
