import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="custom-sidebar d-flex flex-column">
            <div className="sidebar-brand">
                <h3 className="fw-bold px-2">PASTOR ADMIN</h3>
                <span className="sidebar-role-badge">Administrator</span>
            </div>

            {/* Use 'sidebar-nav' instead of 'nav-pills' to use our custom CSS */}
            <nav className="sidebar-nav">
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
                    <span>📊</span> Dashboard
                </NavLink>
                <NavLink to="/members" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
                    <span>👥</span> Members Directory
                </NavLink>
                <NavLink to="/finance" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
                    <span>💰</span> Finance
                </NavLink>
                <NavLink to="/welfare" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
                    <span>🤝</span> Welfare
                </NavLink>
                <NavLink to="/children" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
                    <span>👶</span> Children's Ministry
                </NavLink>

                <hr className="my-3 text-white-50" />

                <NavLink to="/users" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
                    <span>⚙️</span> Manage Accounts
                </NavLink>
                <NavLink to="/profile" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
                    <span>👤</span> My Profile
                </NavLink>
            </nav>

            {/* Footer Section for Sign Out */}
            <div className="sidebar-footer">
                <button
                    onClick={handleSignOut}
                    className="btn-signout rounded-pill d-flex align-items-center justify-content-center hadow-sm"
                >
                    <span className="me-2">🚪</span> Sign Out
                </button>
            </div>
        </div>
    );
};

export default Sidebar;