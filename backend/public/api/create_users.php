<?php
// BULLETPROOF CORS HEADERS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once '../../config/Database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    $users = [
        ['name' => 'Pastor John', 'email' => 'pastor@church.com', 'password' => password_hash('password123', PASSWORD_DEFAULT), 'role' => 'pastor'],
        ['name' => 'Finance Head', 'email' => 'finance@church.com', 'password' => password_hash('password123', PASSWORD_DEFAULT), 'role' => 'finance'],
        ['name' => 'Welfare Leader', 'email' => 'welfare@church.com', 'password' => password_hash('password123', PASSWORD_DEFAULT), 'role' => 'welfare'],
        ['name' => 'Children Leader', 'email' => 'children@church.com', 'password' => password_hash('password123', PASSWORD_DEFAULT), 'role' => 'children']
    ];

    foreach ($users as $user) {
        // FORCE UPDATE the password and role to ensure they are 100% correct
        $query = "UPDATE users SET password = :password, role = :role, full_name = :name WHERE email = :email";
        $stmt = $db->prepare($query);
        $stmt->execute([
            ':password' => $user['password'],
            ':role' => $user['role'],
            ':name' => $user['name'],
            ':email' => $user['email']
        ]);

        // If the user didn't exist, INSERT them instead
        if ($stmt->rowCount() == 0) {
            $insert = "INSERT INTO users (full_name, email, password, role) VALUES (:name, :email, :password, :role)";
            $stmtInsert = $db->prepare($insert);
            $stmtInsert->execute([
                ':name' => $user['name'],
                ':email' => $user['email'],
                ':password' => $user['password'],
                ':role' => $user['role']
            ]);
            echo "✅ Created new user: " . $user['email'] . "<br>";
        } else {
            echo "🔄 Successfully RESET password for: " . $user['email'] . "<br>";
        }
    }
    
    echo "<br>🎉 ALL ACCOUNTS FORCE RESET! You can absolutely log in with 'password123' now.";

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage();
}
?>