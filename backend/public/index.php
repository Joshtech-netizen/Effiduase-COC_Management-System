<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

echo json_encode([
    "system" => "Effiduase Church of Christ Management",
    "status" => "Online",
    "infrastructure" => "Docker Container Running PHP 8.2"
]);
?>