<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once '../config/Database.php';

$database = new Database();
$db = $database->getConnection();

if ($db) {
    echo json_encode([
        "status" => "Success",
        "message" => "Connected to Supabase (PostgreSQL) successfully!"
    ]);
} else {
    echo json_encode([
        "status" => "Error",
        "message" => "Could not connect to database."
    ]);
}
?>