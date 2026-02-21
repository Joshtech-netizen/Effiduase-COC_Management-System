import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import './Welfare.css';

interface Member {
    id: number;
    first_name: string;
    last_name: string;
}

interface WelfareRecord {
    id: number;
    member_id: number;
    first_name: string;
    last_name: string;
    transaction_type: string;
    amount: number;
    description: string;
    transaction_date: string;
}

const Welfare: React.FC = () => {
    const [records, setRecords] = useState<WelfareRecord[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    
    const today = new Date().toISOString().split('T')[0];

    // Form State
    const [memberId, setMemberId] = useState('');
    const [transactionType, setTransactionType] = useState('Due');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [transactionDate, setTransactionDate] = useState(today);

    const WELFARE_API = 'http://127.0.0.1:8000/api/welfare.php';
    const MEMBERS_API = 'http://127.0.0.1:8000/api/members.php';

    const fetchData = async () => {
        try {
            // Fetch both members and welfare records at the same time
            const [welfareRes, membersRes] = await Promise.all([
                axios.get(WELFARE_API),
                axios.get(MEMBERS_API)
            ]);

            if (welfareRes.data.status === 'success') {
                setRecords(welfareRes.data.data);
            }
            if (membersRes.data.status === 'success') {
                setMembers(membersRes.data.data);
                // Set default member if available
                if (membersRes.data.data.length > 0) {
                    setMemberId(membersRes.data.data[0].id.toString());
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            await axios.post(WELFARE_API, {
                member_id: memberId,
                transaction_type: transactionType,
                amount: amount,
                description: description,
                transaction_date: transactionDate
            });

            // Reset Form (keep the date and type)
            setAmount('');
            setDescription('');

            fetchData(); // Refresh table
            alert("Welfare record saved successfully!");

        } catch (error) {
            console.error("Error saving record:", error);
            alert("Failed to save record.");
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this record?")) {
            try {
                await axios.delete(WELFARE_API, { data: { id: id } });
                fetchData();
            } catch (error) {
                console.error("Error deleting record:", error);
                alert("Failed to delete record.");
            }
        }
    };

    // Calculate Total Welfare Fund Balance (Dues - Payouts)
    const totalBalance = records.reduce((balance, record) => {
        if (record.transaction_type === 'Due') {
            return balance + Number(record.amount);
        } else {
            return balance - Number(record.amount);
        }
    }, 0);

    return (
        <div className="d-flex paper-wrapper">
            <Sidebar />

            <div className="flex-grow-1 bg-light p-4 content-wrapper">
                <header className="mb-4 d-flex justify-content-between align-items-center">
                    <div>
                        <h2>Welfare Ministry</h2>
                        <p className="text-muted">Manage member dues and benefit payouts</p>
                    </div>
                    {/* The Welfare Balance Widget */}
                    <div className="bg-info text-white px-4 py-2 rounded shadow-sm text-end">
                        <small className="d-block text-white-50">Current Welfare Fund</small>
                        <h3 className="mb-0">₵ {totalBalance.toFixed(2)}</h3>
                    </div>
                </header>

                <div className="row">
                    {/* Welfare Form */}
                    <div className="col-md-4 mb-4">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <h5 className="card-title mb-3">Record Transaction</h5>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="member-select" className="form-label text-muted small">Select Member</label>
                                        <select id="member-select" className="form-select" value={memberId} onChange={e => setMemberId(e.target.value)} required>
                                            {members.length === 0 ? (
                                                <option value="">No members found...</option>
                                            ) : (
                                                members.map(m => (
                                                    <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>
                                                ))
                                            )}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="transaction-type-select" className="form-label text-muted small">Transaction Type</label>
                                        <select id="transaction-type-select" className="form-select" value={transactionType} onChange={e => setTransactionType(e.target.value)}>
                                            <option value="Due">Member Due (Income)</option>
                                            <option value="Payout">Benefit / Payout (Expense)</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="amount-input" className="form-label text-muted small">Amount (GHS)</label>
                                        <input type="number" step="0.01" id="amount-input" className="form-control" value={amount} onChange={e => setAmount(e.target.value)} required placeholder="0.00" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="date-input" className="form-label text-muted small">Date</label>
                                        <input type="date" id="date-input" className="form-control" value={transactionDate} onChange={e => setTransactionDate(e.target.value)} required />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="description-input" className="form-label text-muted small">Reason / Description</label>
                                        <input type="text" id="description-input" className="form-control" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Monthly Due, Funeral Support" required />
                                    </div>
                                    
                                    <button type="submit" className={`btn w-100 ${transactionType === 'Due' ? 'btn-success' : 'btn-warning'}`}>
                                        {transactionType === 'Due' ? 'Record Due' : 'Issue Payout'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Welfare Table */}
                    <div className="col-md-8">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <h5 className="card-title mb-3">Welfare Ledger</h5>
                                {loading ? (
                                    <p>Loading records...</p>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Member</th>
                                                    <th>Type</th>
                                                    <th>Description</th>
                                                    <th>Amount</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {records.length === 0 ? (
                                                    <tr><td colSpan={6} className="text-center text-muted py-4">No welfare records found.</td></tr>
                                                ) : (
                                                    records.map(record => (
                                                        <tr key={record.id}>
                                                            <td>{new Date(record.transaction_date).toLocaleDateString()}</td>
                                                            <td className="fw-bold">{record.first_name} {record.last_name}</td>
                                                            <td>
                                                                <span className={`badge ${record.transaction_type === 'Due' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                                    {record.transaction_type}
                                                                </span>
                                                            </td>
                                                            <td className="text-muted">{record.description}</td>
                                                            <td className={`fw-bold ${record.transaction_type === 'Due' ? 'text-success' : 'text-danger'}`}>
                                                                {record.transaction_type === 'Due' ? '+' : '-'} ₵{Number(record.amount).toFixed(2)}
                                                            </td>
                                                            <td>
                                                                <button onClick={() => handleDelete(record.id)} className="btn btn-sm btn-outline-danger">
                                                                    Del
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

export default Welfare;