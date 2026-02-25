<?php

require_once 'BaseController.php';

class ChildrenController extends BaseController {

    // GET: Fetch all children with Parent names
    public function index() {
        $query = "SELECT c.*, m.first_name as p_first, m.last_name as p_last 
                  FROM children c 
                  LEFT JOIN members m ON c.parent_id = m.id 
                  ORDER BY c.first_name ASC";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $children = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return $this->sendResponse("success", $children);
    }

    // POST: Register a child
    public function store($data) {
        if (empty($data->first_name) || empty($data->last_name)) {
            return $this->sendResponse("error", [], "Name fields are required", 400);
        }

        $query = "INSERT INTO children (first_name, last_name, parent_id, date_of_birth, gender) 
                  VALUES (:fname, :lname, :p_id, :dob, :gender)";
        $stmt = $this->db->prepare($query);
        
        $success = $stmt->execute([
            ':fname'  => $this->sanitize($data->first_name),
            ':lname'  => $this->sanitize($data->last_name),
            ':p_id'   => $data->parent_id ?? null,
            ':dob'    => $data->date_of_birth ?? null,
            ':gender' => $data->gender ?? 'Male'
        ]);

        if ($success) {
            return $this->sendResponse("success", [], "Child registered successfully", 201);
        }
        return $this->sendResponse("error", [], "Failed to register child", 500);
    }

    // DELETE: Remove child record
    public function destroy($data) {
        if (empty($data->id)) return $this->sendResponse("error", [], "ID required", 400);

        $stmt = $this->db->prepare("DELETE FROM children WHERE id = :id");
        $stmt->execute([':id' => (int)$data->id]);
        
        return $this->sendResponse("success", [], "Record deleted");
    }
}