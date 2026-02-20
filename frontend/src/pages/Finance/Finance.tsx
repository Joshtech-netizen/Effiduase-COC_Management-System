import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';

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
    const [loading, setLoading] = useState(true);
    
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
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFinances();
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

    // Calculate Total
    const totalAmount = records.reduce((sum, record) => sum + Number(record.amount), 0);

    return (
        <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
            <Sidebar />

            <div className="flex-grow-1 bg-light p-4" style={{ overflowY: 'auto' }}>
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
                                <h5 className="card-title mb-3">Transaction History</h5>
                                {loading ? (
                                    <p>Loading records...</p>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Type</th>
                                                    <th>Description</th>
                                                    <th>Amount</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {records.length === 0 ? (
                                                    <tr><td colSpan={5} className="text-center text-muted py-4">No records found.</td></tr>
                                                ) : (
                                                    records.map(record => (
                                                        <tr key={record.id}>
                                                            <td>{new Date(record.transaction_date).toLocaleDateString()}</td>
                                                            <td>
                                                                <span className={`badge ${record.type === 'Tithe' ? 'bg-primary' : 'bg-secondary'}`}>
                                                                    {record.type}
                                                                </span>
                                                            </td>
                                                            <td className="text-muted">{record.description || '-'}</td>
                                                            <td className="fw-bold text-success">₵ {Number(record.amount).toFixed(2)}</td>
                                                            <td>
                                                                <button onClick={() => handleDelete(record.id)} className="btn btn-sm btn-outline-danger">
                                                                    Delete
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Finance;