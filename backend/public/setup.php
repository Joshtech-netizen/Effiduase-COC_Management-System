<?php
require_once '../config/Database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    // 1. Create Users Table
    $sql_users = "CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'member',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )";

    $db->exec($sql_users);
    echo "✅ Users table created successfully!<br>";

    // 2. Create a Test Admin User (Password: 123456)
    // We check if empty first so we don't create duplicates
    $check = $db->query("SELECT count(*) FROM users WHERE email = 'admin@church.com'")->fetchColumn();
    
    if ($check == 0) {
        $password = password_hash("123456", PASSWORD_DEFAULT);
        $sql_insert = "INSERT INTO users (full_name, email, password, role) 
                       VALUES ('Admin User', 'admin@church.com', '$password', 'admin')";
        $db->exec($sql_insert);
        echo "✅ Test Admin user created! (Email: admin@church.com | Pass: 123456)<br>";
    } else {
        echo "ℹ️ Admin user already exists.<br>";
    }

} catch(PDOException $e) {
    echo "❌ Error: " . $e->getMessage();
}
?>