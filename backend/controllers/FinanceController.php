<?php

require_once 'BaseController.php';

class FinanceController extends BaseController {

    // GET: Fetch all financial records
    public function index() {
        $query = "SELECT * FROM finances ORDER BY transaction_date DESC";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $records = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return $this->sendResponse("success", $records);
    }

    // POST: Add new transaction (Tithe, Offering, etc.)
    public function store($data) {
        if (empty($data->type) || empty($data->amount) || empty($data->transaction_date)) {
            return $this->sendResponse("error", [], "Type, Amount, and Date are required", 400);
        }

        $query = "INSERT INTO finances (type, amount, description, transaction_date) 
                  VALUES (:type, :amount, :description, :t_date)";
        $stmt = $this->db->prepare($query);
        
        $success = $stmt->execute([
            ':type'        => $this->sanitize($data->type),
            ':amount'      => (float)$data->amount,
            ':description' => $this->sanitize($data->description ?? ''),
            ':t_date'      => $data->transaction_date
        ]);

        if ($success) {
            return $this->sendResponse("success", [], "Transaction recorded successfully", 201);
        }
        return $this->sendResponse("error", [], "Failed to save record", 500);
    }

    // DELETE: Remove a financial record
    public function destroy($data) {
        if (empty($data->id)) return $this->sendResponse("error", [], "ID required", 400);

        $stmt = $this->db->prepare("DELETE FROM finances WHERE id = :id");
        $stmt->execute([':id' => $data->id]);
        
        return $this->sendResponse("success", [], "Record deleted");
    }
}