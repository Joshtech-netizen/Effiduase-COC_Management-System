import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar: React.FC = () => {
    const location = useLocation();
    
    // Get the user's role from local storage (defaults to 'guest' if missing)
    const userRole = localStorage.getItem('user_role') || 'guest';

    // Helper functions to check access
    const isPastor = userRole === 'pastor' || userRole === 'admin';
    const canSeeFinance = isPastor || userRole === 'finance';
    const canSeeWelfare = isPastor || userRole === 'welfare';
    const canSeeChildren = isPastor || userRole === 'children';

    return (
        <nav className="custom-sidebar shadow-lg">
            <div className="sidebar-brand">
                Church Admin
                <div className="sidebar-role-badge badge bg-secondary mt-2 d-block text-uppercase">
                    Role: {userRole}
                </div>
            </div>
            
            <div className="sidebar-nav">
                <Link to="/dashboard" className={`sidebar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                    Dashboard
                </Link>
                
                {/* Pastor gets the Members directory */}
                {isPastor && (
                    <Link to="/members" className={`sidebar-link ${location.pathname === '/members' ? 'active' : ''}`}>
                        Members Directory
                    </Link>
                )}
                
                {/* Finance Head & Pastor */}
                {canSeeFinance && (
                    <Link to="/finance" className={`sidebar-link ${location.pathname === '/finance' ? 'active' : ''}`}>
                        Finances
                    </Link>
                )}

                {/* Welfare Leader & Pastor */}
                {canSeeWelfare && (
                    <Link to="/welfare" className={`sidebar-link ${location.pathname === '/welfare' ? 'active' : ''}`}>
                        Welfare
                    </Link>
                )}

                {/* Children's Leader & Pastor */}
                {canSeeChildren && (
                    <Link to="/children" className={`sidebar-link ${location.pathname === '/children' ? 'active' : ''}`}>
                        Children's Ministry
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Sidebar;