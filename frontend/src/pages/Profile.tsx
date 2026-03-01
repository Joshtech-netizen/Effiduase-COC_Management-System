import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

const Profile: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const userName = localStorage.getItem('user_name') || 'Admin';
    const userRole = localStorage.getItem('user_role') || 'User';
    const userId = localStorage.getItem('user_id');

    const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
        setError("New passwords do not match!");
        return;
    }

    if (!userId) {
        setError("Session error. Please log out and log back in.");
        return;
    }

    try {
       
        const response = await axios.put('http://127.0.0.1:8000/api/users.php', {
            user_id: userId,
            current_password: currentPassword,
            new_password: newPassword,
            action: 'change_password' 
        });

        if (response.data.status === 'success') {
            setMessage("Password updated successfully!");
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }
    } catch (err) {
        const errorMessage = axios.isAxiosError(err) 
            ? err.response?.data?.message 
            : "Failed to update password.";
        setError(errorMessage || "Failed to update password.");
    }
};

    return (
        <div className="d-flex page-wrapper">
            <Sidebar />

            <div className="flex-grow-1 bg-light p-4 content-wrapper">
                <header className="mb-4">
                    <h2 className="fw-bold">My Profile</h2>
                    <p className="text-muted">Manage your personal account settings</p>
                </header>

                <div className="row">
                    <div className="col-md-5">
                        {/* Profile Info Card */}
                        <div className="card shadow-sm border-0 mb-4 bg-primary text-white">
                            <div className="card-body py-4 text-center">
                                <div className="display-1 mb-3">👤</div>
                                <h3 className="fw-bold">{userName}</h3>
                                <p className="mb-0 text-uppercase badge bg-light text-primary">{userRole} Admin</p>
                            </div>
                        </div>

                        {/* Password Change Form */}
                        <div className="card shadow-sm border-0">
                            <div className="card-body p-4">
                                <h5 className="card-title fw-bold mb-4">Change Password</h5>
                                
                                {message && <div className="alert alert-success py-2">{message}</div>}
                                {error && <div className="alert alert-danger py-2">{error}</div>}

                                <form onSubmit={handlePasswordChange}>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-muted">Current Password</label>
                                        <input type="password" className="form-control" placeholder="Enter your current password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-muted">New Password</label>
                                        <input type="password" className="form-control" placeholder="Enter your new password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label small fw-bold text-muted">Confirm New Password</label>
                                        <input type="password" className="form-control" placeholder="Confirm your new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                                    </div>
                                    
                                    <button type="submit" className="btn btn-dark w-100 fw-bold">Update Password</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;