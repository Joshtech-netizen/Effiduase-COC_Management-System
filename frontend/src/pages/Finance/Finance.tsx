import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import Sidebar from '../../components/Sidebar';
import './Finance.css';

interface FinanceRecord {
    id: number;
    type: string;
    amount: number;
    description: string;
    transaction_date: string;
    created_at: string;
}

const Finance: React.FC = () => {
    const [records, setRecords] = useState<FinanceRecord[]>([]);
    
    // Get today's date in YYYY-MM-DD format for the default input
    const today = new Date().toISOString().split('T')[0];

    // Form State
    const [type, setType] = useState('Offering');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [transactionDate, setTransactionDate] = useState(today);

    const API_URL = 'http://127.0.0.1:8000/api/finance.php';

    const fetchFinances = async () => {
        try {
            const response = await axios.get(API_URL);
            if (response.data.status === 'success') {
                setRecords(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching finances:", error);
        }
    };

    useEffect(() => {
        const loadFinances = async () => {
            try {
                const response = await axios.get(API_URL);
                if (response.data.status === 'success') {
                    setRecords(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching finances:", error);
            }
        };
        
        loadFinances();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            await axios.post(API_URL, {
                type: type,
                amount: amount,
                description: description,
                transaction_date: transactionDate
            });

            // Reset Form
            setType('Offering');
            setAmount('');
            setDescription('');
            setTransactionDate(today);

            fetchFinances(); // Refresh table
            alert("Record added successfully!");

        } catch (error) {
            console.error("Error saving record:", error);
            alert("Failed to save record.");
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this financial record?")) {
            try {
                await axios.delete(API_URL, { data: { id: id } });
                fetchFinances();
            } catch (error) {
                console.error("Error deleting record:", error);
                alert("Failed to delete record.");
            }
        }
    };

    // --- EXPORT TO PDF ---
    const exportToPDF = () => {
        const doc = new jsPDF();
        
        // Add a Title
        doc.setFontSize(18);
        doc.text("Financial Report - Effiduase Church of Christ", 14, 20);
        doc.setFontSize(11);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

        // Prepare Table Data
        const tableColumns = ["Date", "Type", "Description", "Amount (GHS)"];
        const tableRows = records.map(record => [
            new Date(record.transaction_date).toLocaleDateString(),
            record.type,
            record.description || '-',
            Number(record.amount).toFixed(2)
        ]);

        // Draw the Table
        autoTable(doc, {
            head: [tableColumns],
            body: tableRows,
            startY: 35,
            theme: 'striped',
            headStyles: { fillColor: [13, 110, 253] } // Primary blue header
        });

        // Save the file
        doc.save("Church_Financial_Report.pdf");
    };

    // --- EXPORT TO EXCEL ---
    const exportToExcel = () => {
        // Format the data perfectly for Excel rows
        const excelData = records.map(record => ({
            "Date": new Date(record.transaction_date).toLocaleDateString(),
            "Transaction Type": record.type,
            "Description": record.description || '-',
            "Amount (GHS)": Number(record.amount)
        }));

        // Create the spreadsheet
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Finances");
        
        // Save the file
        XLSX.writeFile(workbook, "Church_Financial_Report.xlsx");
    };

    // Calculate Total
    const totalAmount = records.reduce((sum, record) => sum + Number(record.amount), 0);

    return (
        <div className="d-flex paper-wrapper">
            <Sidebar />

            <div className="flex-grow-1 bg-light p-4 content-wrapper">
                <header className="mb-4 d-flex justify-content-between align-items-center">
                    <div>
                        <h2>Financial Records</h2>
                        <p className="text-muted">Manage tithes, offerings, and donations</p>
                    </div>
                    {/* The Total Widget */}
                    <div className="bg-success text-white px-4 py-2 rounded shadow-sm text-end">
                        <small className="d-block text-white-50">Total Recorded (GHS)</small>
                        <h3 className="mb-0">₵ {totalAmount.toFixed(2)}</h3>
                    </div>
                </header>

                <div className="row">
                    {/* Record Finance Form */}
                    <div className="col-md-4 mb-4">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <h5 className="card-title mb-3">Add New Record</h5>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label text-muted small" htmlFor="recordType">Record Type</label>
                                        <select 
                                        id="recordType"
                                        className="form-select" value={type} onChange={e => setType(e.target.value)}>
                                            <option value="Offering">Weekly Offering</option>
                                            <option value="Tithe">Tithe</option>
                                            <option value="Thanksgiving">Thanksgiving</option>
                                            <option value="Donation">Special Donation</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label text-muted small" htmlFor="amount">Amount (GHS)</label>
                                        <input type="number" step="0.01" className="form-control" value={amount} onChange={e => setAmount(e.target.value)} required placeholder="0.00" />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label text-muted small">Date</label>
                                        <input type="date" className="form-control" value={transactionDate} onChange={e => setTransactionDate(e.target.value)} required title="Select transaction date" />
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label text-muted small">Description / Name (Optional)</label>
                                        <input type="text" className="form-control" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Bro. John Tithe" />
                                    </div>
                                    
                                    <button type="submit" className="btn btn-success w-100">
                                        Save Record
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Finances Table */}
                    <div className="col-md-8">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="card-title mb-0 fw-bold">Transaction History</h5>
                                    <div>
                                        <button onClick={exportToExcel} className="btn btn-sm btn-outline-success me-2 fw-bold">
                                            📊 Export Excel
                                        </button>
                                        <button onClick={exportToPDF} className="btn btn-sm btn-outline-danger fw-bold">
                                            📄 Export PDF
                                        </button>
                                    </div>
                                </div>
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Date</th>
                                                <th>Type</th>
                                                <th>Description</th>
                                                <th>Amount (GHS)</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {records.length > 0 ? (
                                                records.map(record => (
                                                    <tr key={record.id}>
                                                        <td>{new Date(record.transaction_date).toLocaleDateString()}</td>
                                                        <td><span className="badge bg-info">{record.type}</span></td>
                                                        <td>{record.description || '-'}</td>
                                                        <td className="fw-bold">₵ {Number(record.amount).toFixed(2)}</td>
                                                        <td>
                                                            <button 
                                                                onClick={() => handleDelete(record.id)} 
                                                                className="btn btn-sm btn-outline-danger"
                                                            >
                                                                🗑️ Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={5} className="text-center text-muted py-4">
                                                        No records found. Add a new record to get started.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Finance;