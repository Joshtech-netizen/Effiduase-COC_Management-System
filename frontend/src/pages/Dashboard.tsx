import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('user_role') || 'Guest';

    function handleLogout() {
        localStorage.removeItem('user_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_name');
        navigate('/');
    }

    return (
        <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
            <Sidebar />

            <div className="flex-grow-1 bg-light p-4" style={{ overflowY: 'auto' }}>
                <header className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Overview</h2>
                    <div className="d-flex align-items-center gap-3">
                        <span className="badge bg-secondary">{userRole}</span>
                        <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Logout</button>
                    </div>
                </header>

                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <h6 className="text-muted">Total Members</h6>
                                <h3>124</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <h6 className="text-muted">Total Offerings (GHS)</h6>
                                <h3>₵ 4,250.00</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;