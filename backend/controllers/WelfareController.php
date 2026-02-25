<?php
// backend/controllers/WelfareController.php
require_once 'BaseController.php';

class WelfareController extends BaseController {

    // GET: Fetch welfare records with Member names (using a JOIN)
    public function index() {
        $query = "SELECT w.*, m.first_name, m.last_name 
                  FROM welfare w 
                  JOIN members m ON w.member_id = m.id 
                  ORDER BY w.transaction_date DESC";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $records = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return $this->sendResponse("success", $records);
    }

    // POST: Process welfare (Dues or Support)
    public function store($data) {
        if (empty($data->member_id) || empty($data->transaction_type) || empty($data->amount)) {
            return $this->sendResponse("error", [], "Member, Type, and Amount are required", 400);
        }

        $query = "INSERT INTO welfare (member_id, transaction_type, amount, description, transaction_date) 
                  VALUES (:m_id, :type, :amount, :desc, :t_date)";
        $stmt = $this->db->prepare($query);
        
        $success = $stmt->execute([
            ':m_id'   => (int)$data->member_id,
            ':type'   => $this->sanitize($data->transaction_type),
            ':amount' => (float)$data->amount,
            ':desc'   => $this->sanitize($data->description ?? ''),
            ':t_date' => $data->transaction_date ?? date('Y-m-d')
        ]);

        if ($success) {
            return $this->sendResponse("success", [], "Welfare record added", 201);
        }
        return $this->sendResponse("error", [], "Failed to process welfare", 500);
    }
}