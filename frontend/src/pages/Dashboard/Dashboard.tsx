import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

interface FinanceRecord {
    amount: number | string;
}

interface WelfareRecord {
    transaction_type: string;
    amount: number | string;
}

const Dashboard: React.FC = () => {
    // State to hold all our metrics
    const [totalMembers, setTotalMembers] = useState(0);
    const [totalFinances, setTotalFinances] = useState(0);
    const [welfareBalance, setWelfareBalance] = useState(0);
    const [totalChildren, setTotalChildren] = useState(0);
    const [loading, setLoading] = useState(true);
    
    const navigate = useNavigate();

    // 🔒 Security: Get the user's role from local storage
    const userRole = localStorage.getItem('user_role') || 'guest';
    const isPastor = userRole === 'pastor' || userRole === 'admin';

    // Fetch the real data when the dashboard loads
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch everything at the exact same time for speed
                const [membersRes, financeRes, welfareRes, childrenRes] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/members.php'),
                    axios.get('http://127.0.0.1:8000/api/finance.php'),
                    axios.get('http://127.0.0.1:8000/api/welfare.php'),
                    axios.get('http://127.0.0.1:8000/api/children.php')
                ]);

                // 1. Members
                if (membersRes.data.status === 'success') {
                    setTotalMembers(membersRes.data.data.length);
                }

                // 2. Finances (Tithes & Offerings)
                if (financeRes.data.status === 'success') {
                    const total = financeRes.data.data.reduce((sum: number, record: FinanceRecord) => sum + Number(record.amount), 0);
                    setTotalFinances(total);
                }

                // 3. Welfare Balance
                if (welfareRes.data.status === 'success') {
                    const balance = welfareRes.data.data.reduce((sum: number, record: WelfareRecord) => {
                        return record.transaction_type === 'Due' ? sum + Number(record.amount) : sum - Number(record.amount);
                    }, 0);
                    setWelfareBalance(balance);
                }

                // 4. Children
                if (childrenRes.data.status === 'success') {
                    setTotalChildren(childrenRes.data.data.length);
                }

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Handle Logout
    const handleLogout = () => {
        localStorage.removeItem('user_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_name');
        navigate('/'); // Safely redirect back to login
    };

    return (
        <div className="d-flex page-wrapper">
            <Sidebar />

            <div className="flex-grow-1 bg-light p-4 content-wrapper">
                <header className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h2 className="mb-0 fw-bold text-capitalize">{userRole === 'pastor' ? 'Pastor' : userRole} Dashboard</h2>
                        <p className="text-muted">Welcome back. Here is the real-time overview for Effiduase Church of Christ.</p>
                    </div>
                    <button onClick={handleLogout} className="btn btn-outline-danger shadow-sm fw-bold">
                        Sign Out
                    </button>
                </header>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2 text-muted">Gathering church data...</p>
                    </div>
                ) : (
                    <>
                        {/* 4-Card Grid for Stats - CONDITIONALLY RENDERED */}
                        <div className="row g-4 mb-5">
                            
                            {/* MEMBERS VIEW (Pastor / Admin only) */}
                            {isPastor && (
                                <div className="col-md-3">
                                    <div className="card shadow border-0 h-100 bg-primary text-white stat-card">
                                        <div className="card-body py-3">
                                            <h6 className="card-title text-uppercase mb-1 opacity-75 fw-bold stat-card-title">Total Members</h6>
                                            <h2 className="fw-bold mb-0">{totalMembers}</h2>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* FINANCE VIEW (Pastor + Finance) */}
                            {(isPastor || userRole === 'finance') && (
                                <div className="col-md-3">
                                    <div className="card shadow border-0 h-100 bg-success text-white stat-card">
                                        <div className="card-body py-3">
                                            <h6 className="card-title text-uppercase mb-1 opacity-75 fw-bold stat-card-title">Total Income</h6>
                                            <h2 className="fw-bold mb-0">₵ {totalFinances.toFixed(2)}</h2>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* WELFARE VIEW (Pastor + Welfare) */}
                            {(isPastor || userRole === 'welfare') && (
                                <div className="col-md-3">
                                    <div className="card shadow border-0 h-100 bg-info text-white stat-card">
                                        <div className="card-body py-3">
                                            <h6 className="card-title text-uppercase mb-1 opacity-75 fw-bold stat-card-title">Welfare Fund</h6>
                                            <h2 className="fw-bold mb-0">₵ {welfareBalance.toFixed(2)}</h2>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* CHILDREN VIEW (Pastor + Children) */}
                            {(isPastor || userRole === 'children') && (
                                <div className="col-md-3">
                                    <div className="card shadow border-0 h-100 bg-warning text-dark stat-card">
                                        <div className="card-body py-3">
                                            <h6 className="card-title text-uppercase mb-1 opacity-75 fw-bold stat-card-title">Total Children</h6>
                                            <h2 className="fw-bold mb-0">{totalChildren}</h2>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick Action Links - CONDITIONALLY RENDERED */}
                        <div className="row">
                            <div className="col-12">
                                <div className="card shadow-sm border-0">
                                    <div className="card-body p-4">
                                        <h5 className="mb-4 fw-bold text-muted">Quick Actions</h5>
                                        <div className="d-flex gap-3 flex-wrap">
                                            {isPastor && (
                                                <Link to="/members" className="btn btn-outline-primary px-4 py-2 fw-bold">
                                                    ➕ Add Member
                                                </Link>
                                            )}
                                            
                                            {(isPastor || userRole === 'finance') && (
                                                <Link to="/finance" className="btn btn-outline-success px-4 py-2 fw-bold">
                                                    💰 Record Offering
                                                </Link>
                                            )}
                                            
                                            {(isPastor || userRole === 'welfare') && (
                                                <Link to="/welfare" className="btn btn-outline-info px-4 py-2 text-dark fw-bold">
                                                    🤝 Process Welfare
                                                </Link>
                                            )}
                                            
                                            {(isPastor || userRole === 'children') && (
                                                <Link to="/children" className="btn btn-outline-warning px-4 py-2 text-dark fw-bold">
                                                    👶 Register Child
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;