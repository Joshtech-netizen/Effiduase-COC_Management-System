<?php
// backend/controllers/MemberController.php
require_once 'BaseController.php';

class MemberController extends BaseController {

    // GET: Fetch all members
    public function index() {
        $query = "SELECT * FROM members ORDER BY first_name ASC";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $members = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return $this->sendResponse("success", $members);
    }

    // POST: Create member
    public function store($data) {
        if (empty($data->first_name) || empty($data->last_name)) {
            return $this->sendResponse("error", [], "First and Last name required", 400);
        }

        $query = "INSERT INTO members (first_name, last_name, phone, gender, status, photo) 
                  VALUES (:fname, :lname, :phone, :gender, :status, :photo)";
        $stmt = $this->db->prepare($query);
        
        $success = $stmt->execute([
            ':fname'  => $this->sanitize($data->first_name),
            ':lname'  => $this->sanitize($data->last_name),
            ':phone'  => $data->phone ?? null,
            ':gender' => $data->gender ?? 'Male',
            ':status' => $data->status ?? 'active',
            ':photo'  => $data->photo ?? null
        ]);

        if ($success) {
            return $this->sendResponse("success", [], "Member created successfully", 201);
        }
        return $this->sendResponse("error", [], "Database error", 500);
    }

    // PUT: Update member
    public function update($data) {
        if (empty($data->id)) {
            return $this->sendResponse("error", [], "ID is required", 400);
        }

        $query = "UPDATE members SET first_name = :fname, last_name = :lname, 
                  phone = :phone, gender = :gender, status = :status, photo = :photo WHERE id = :id";
        $stmt = $this->db->prepare($query);
        
        $success = $stmt->execute([
            ':id'     => (int)$data->id,
            ':fname'  => $this->sanitize($data->first_name),
            ':lname'  => $this->sanitize($data->last_name),
            ':phone'  => $data->phone ?? null,
            ':gender' => $data->gender ?? 'Male',
            ':status' => $data->status ?? 'active',
            ':photo'  => $data->photo ?? null
        ]);

        return $this->sendResponse("success", [], "Member updated successfully");
    }

    // DELETE: Remove member
    public function destroy($data) {
        if (empty($data->id)) return $this->sendResponse("error", [], "ID required", 400);

        $stmt = $this->db->prepare("DELETE FROM members WHERE id = :id");
        $stmt->execute([':id' => $data->id]);
        
        return $this->sendResponse("success", [], "Member deleted");
    }
}