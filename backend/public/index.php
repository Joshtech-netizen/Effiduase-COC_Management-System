<?php
// SECURITY HEADERS (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle Pre-flight requests (Browser security check)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/Database.php';

// Simple Router
$request = $_SERVER['REQUEST_URI'];

// JSON Response Wrapper
function jsonResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit();
}

// Test Route
if ($request == '/' || $request == '/api/health') {
    jsonResponse(["status" => "Online", "service" => "Church API v1"]);
}
?>