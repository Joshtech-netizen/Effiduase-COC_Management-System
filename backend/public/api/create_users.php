<?php
require_once '../../config/Database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    // The 4 ministry accounts we want to create
    $users = [
        ['name' => 'Pastor John', 'email' => 'pastor@church.com', 'password' => password_hash('password123', PASSWORD_DEFAULT), 'role' => 'pastor'],
        ['name' => 'Finance Head', 'email' => 'finance@church.com', 'password' => password_hash('password123', PASSWORD_DEFAULT), 'role' => 'finance'],
        ['name' => 'Welfare Leader', 'email' => 'welfare@church.com', 'password' => password_hash('password123', PASSWORD_DEFAULT), 'role' => 'welfare'],
        ['name' => 'Children Leader', 'email' => 'children@church.com', 'password' => password_hash('password123', PASSWORD_DEFAULT), 'role' => 'children']
    ];

    foreach ($users as $user) {
        // Check if user already exists to prevent duplicates
        $check = $db->prepare("SELECT id FROM users WHERE email = :email");
        $check->execute([':email' => $user['email']]);
        
        if ($check->rowCount() == 0) {
            $query = "INSERT INTO users (full_name, email, password, role) VALUES (:name, :email, :password, :role)";
            $stmt = $db->prepare($query);
            $stmt->execute([
                ':name' => $user['name'],
                ':email' => $user['email'],
                ':password' => $user['password'],
                ':role' => $user['role']
            ]);
            echo "✅ Created user: " . $user['email'] . " (Role: " . $user['role'] . ")<br>";
        } else {
            echo "⚠️ User " . $user['email'] . " already exists.<br>";
        }
    }
    
    echo "<br>🎉 All ministry accounts are ready! You can now log in with these emails and 'password123'.";

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage();
}
?>