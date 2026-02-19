import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css'; 

const Sidebar: React.FC = () => {
    // This hook tells us the current URL (e.g., "/dashboard" or "/members")
    const location = useLocation();

    return (
        <nav className="custom-sidebar shadow-lg">
            <div className="sidebar-brand">
                Church Admin
            </div>
            
            <div className="sidebar-nav">
                <Link 
                    to="/dashboard" 
                    className={`sidebar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                >
                    Dashboard
                </Link>
                
                <Link 
                    to="/members" 
                    className={`sidebar-link ${location.pathname === '/members' ? 'active' : ''}`}
                >
                    Members
                </Link>
            </div>
        </nav>
    );
};

export default Sidebar;