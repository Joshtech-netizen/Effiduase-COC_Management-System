<?php
// Display errors for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once '../config/Database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    if (!$db) {
        die("❌ Could not connect to the database.");
    }

    // 1. Ensure Users Table exists
    $sql_users = "CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )";
    $db->exec($sql_users);
    echo "✅ Users table is ready!<br>";

    // 2. NEW: Create the Members Table
    $sql_members = "CREATE TABLE IF NOT EXISTS members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone TEXT,
        gender TEXT,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )";
    $db->exec($sql_members);
    echo "✅ Members table is ready!<br>";
    
    echo "<br>🎉 Database is fully prepped for Phase 1!";

} catch(PDOException $e) {
    echo "❌ Database Error: " . $e->getMessage();
} catch(Exception $e) {
    echo "❌ General Error: " . $e->getMessage();
}
?>