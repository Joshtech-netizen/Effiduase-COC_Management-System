import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const [totalMembers, setTotalMembers] = useState(0);
    const [totalFinances, setTotalFinances] = useState(0);
    const [welfareBalance, setWelfareBalance] = useState(0);
    const [totalChildren, setTotalChildren] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [membersRes, financeRes, welfareRes, childrenRes] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/members.php'),
                    axios.get('http://127.0.0.1:8000/api/finance.php'),
                    axios.get('http://127.0.0.1:8000/api/welfare.php'),
                    axios.get('http://127.0.0.1:8000/api/children.php')
                ]);

                if (membersRes.data.status === 'success') setTotalMembers(membersRes.data.data.length);
                if (financeRes.data.status === 'success') {
                    setTotalFinances(financeRes.data.data.reduce((sum: number, r: { amount: string | number }) => sum + Number(r.amount), 0));
                }
                if (welfareRes.data.status === 'success') {
                    setWelfareBalance(welfareRes.data.data.reduce((sum: number, r: { transaction_type: string; amount: string | number }) => {
                        return r.transaction_type === 'Due' ? sum + Number(r.amount) : sum - Number(r.amount);
                    }, 0));
                }
                if (childrenRes.data.status === 'success') setTotalChildren(childrenRes.data.data.length);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user_token');
        localStorage.removeItem('user_role');
        window.location.href = '/';
    };

    return (
        <div className="d-flex page-wrapper">
            <Sidebar />
            <div className="flex-grow-1 bg-light p-4 content-wrapper">
                <header className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h2 className="mb-0 fw-bold">Church Admin Dashboard</h2>
                        <p className="text-muted">Welcome back. Here is the real-time overview for Effiduase Church of Christ.</p>
                    </div>
                    <button onClick={handleLogout} className="btn btn-outline-danger shadow-sm">Sign Out</button>
                </header>

                {loading ? (
                    <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
                ) : (
                    <>
                        <div className="row g-4 mb-5">
                            <div className="col-md-3">
                                <div className="card shadow border-0 h-100 bg-primary text-white stat-card">
                                    <div className="card-body py-3">
                                        <h6 className="card-title text-uppercase mb-2 opacity-75 fw-bold">Total Members</h6>
                                        <h2 className="fw-bold mb-0">{totalMembers}</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card shadow border-0 h-100 bg-success text-white stat-card">
                                    <div className="card-body py-3">
                                        <h6 className="card-title text-uppercase mb-2 opacity-75 fw-bold">Total Income</h6>
                                        <h2 className="fw-bold mb-0">₵ {totalFinances.toFixed(2)}</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card shadow border-0 h-100 bg-info text-white stat-card">
                                    <div className="card-body py-3">
                                        <h6 className="card-title text-uppercase mb-2 opacity-75 fw-bold">Welfare Fund</h6>
                                        <h2 className="fw-bold mb-0">₵ {welfareBalance.toFixed(2)}</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card shadow border-0 h-100 bg-warning text-dark stat-card">
                                    <div className="card-body py-3">
                                        <h6 className="card-title text-uppercase mb-2 opacity-75 fw-bold">Total Children</h6>
                                        <h2 className="fw-bold mb-0">{totalChildren}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="card shadow-sm border-0">
                                    <div className="card-body p-3">
                                        <h5 className="mb-4 fw-bold text-muted">Quick Actions</h5>
                                        <div className="d-flex gap-3 flex-wrap">
                                            <Link to="/members" className="btn btn-outline-primary px-4 py-2">➕ Add Member</Link>
                                            <Link to="/finance" className="btn btn-outline-success px-4 py-2">💰 Record Offering</Link>
                                            <Link to="/welfare" className="btn btn-outline-info px-4 py-2 text-dark">🤝 Process Welfare</Link>
                                            <Link to="/children" className="btn btn-outline-warning px-4 py-2 text-dark">👶 Register Child</Link>
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