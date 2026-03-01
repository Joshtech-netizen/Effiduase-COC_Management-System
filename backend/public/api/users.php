<?php
// backend/public/api/users.php

// 1. BULLETPROOF CORS HEADERS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 2. IMPORT THE CORE
require_once '../../config/Database.php';
require_once '../../controllers/UserController.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Initialize the Controller (The Brain)
    $controller = new UserController($db);

    $method = $_SERVER['REQUEST_METHOD'];
    $data = json_decode(file_get_contents("php://input"));

    switch ($method) {
        case 'GET':
            // Fetch users
            echo $controller->index();
            break;

        case 'POST':
            // Create a new user
            echo $controller->store($data);
            break;

        case 'PUT':
            /**
             * PASSWORD RESET LOGIC
             * This handles the request from your React Profile/Settings page
             */
            if (isset($data->action) && $data->action === 'change_password') {
                echo $controller->updatePassword($data);
            } else {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Invalid update action."]);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(["message" => "Method not allowed"]);
            break;
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Server error: " . $e->getMessage()]);
}