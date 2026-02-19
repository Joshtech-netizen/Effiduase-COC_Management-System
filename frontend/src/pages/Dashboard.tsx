import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('user_role') || 'Guest';
    const userName = localStorage.getItem('user_name') || 'Admin User';

    function handleLogout() {
        localStorage.removeItem('user_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_name');
        navigate('/');
    }

    return (
        <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
            <nav className="bg-dark text-white p-3" style={{ width: '250px' }}>
                <h4 className="mb-1">Church Admin</h4>
                <small className="text-light d-block mb-4">Welcome, {userName}</small>
                <ul className="nav flex-column gap-2">
                    <li className="nav-item">
                        <a href="#" className="nav-link text-white bg-primary rounded">Dashboard</a>
                    </li>
                    <li className="nav-item">
                        <a href="#" className="nav-link text-white-50">Members</a>
                    </li>
                    <li className="nav-item">
                        <a href="#" className="nav-link text-white-50">Finance</a>
                    </li>
                    <li className="nav-item mt-auto">
                        <button onClick={handleLogout} className="btn btn-danger w-100 mt-4">Logout</button>
                    </li>
                </ul>
            </nav>

            <div className="flex-grow-1 bg-light p-4" style={{ overflowY: 'auto' }}>
                <header className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Overview</h2>
                    <span className="badge bg-secondary">{userRole}</span>
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