import React, { useState, useEffect } from 'react';
import axios, {AxiosError} from 'axios';
import Sidebar from '../../components/Sidebar';
import './Users.css';

interface User {
    id: number;
    full_name: string;
    email: string;
    role: string;
}
interface ErrorResponse {
    message: string;
}

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Form State
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('finance');

    const API_URL = 'http://127.0.0.1:8000/api/users.php';

    const fetchUsers = async () => {
        try {
            const response = await axios.get(API_URL);
            if (response.data.status === 'success') setUsers(response.data.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(API_URL, {
                full_name: fullName,
                email: email,
                password: password,
                role: role
            });
            
            if (response.data.status === 'success') {
                setFullName(''); setEmail(''); setPassword(''); setRole('finance');
                fetchUsers();
                alert("Account created successfully!");
            }
        } catch (error: unknown) {
            const axiosError = error as AxiosError<ErrorResponse>;
            alert(axiosError.response?.data?.message || "Failed to create user.");
        }
    };

    const handleDelete = async (id: number, userRole: string) => {
        if (userRole === 'pastor') {
            alert("Security Alert: You cannot delete the main Pastor account!");
            return;
        }
        if (window.confirm("Are you sure you want to delete this account? They will lose all access.")) {
            try {
                await axios.delete(API_URL, { data: { id: id } });
                fetchUsers();
            } catch (error: unknown) {
                const axiosError = error as AxiosError<ErrorResponse>;
                alert(axiosError.response?.data?.message || "Failed to delete user.");
            }
        }
    };

    return (
        <div className="d-flex page-wrapper">
            <Sidebar />

            <div className="flex-grow-1 bg-light p-4 content-wrapper">
                <header className="mb-4 d-flex justify-content-between align-items-center">
                    <div>
                        <h2 className="fw-bold">System Accounts</h2>
                        <p className="text-muted">Manage ministry logins and access levels</p>
                    </div>
                </header>

                <div className="row">
                    {/* Create User Form */}
                    <div className="col-md-4 mb-4">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <h5 className="card-title mb-3 fw-bold">Create New Account</h5>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-2">
                                        <label className="form-label small text-muted">Full Name</label>
                                        <input type="text" className="form-control" value={fullName} onChange={e => setFullName(e.target.value)} required placeholder="e.g. Deacon Samuel" />
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label small text-muted">Email Address</label>
                                        <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required placeholder="samuel@church.com" />
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label small text-muted">Temporary Password</label>
                                        <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Enter password" />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="ministryRole" className="form-label small text-muted">
                                            Ministry Role
                                        </label>
                                        <select
                                            id="ministryRole"
                                            name="ministryRole"
                                            title="Ministry Role"
                                            className="form-select"
                                            value={role}
                                            onChange={e => setRole(e.target.value)}
                                        >
                                            <option value="finance">Finance Admin</option>
                                            <option value="welfare">Welfare Admin</option>
                                            <option value="children">Children's Admin</option>
                                            <option value="pastor">Pastor (Full Access)</option>
                                        </select>
                                    </div>
                                    
                                    <button type="submit" className="btn btn-primary w-100 fw-bold">Create Account</button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Users List */}
                    <div className="col-md-8">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <h5 className="card-title mb-3 fw-bold">Active Administrators</h5>
                                {loading ? <p>Loading...</p> : (
                                    <div className="table-responsive">
                                        <table className="table align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Role</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.map(u => (
                                                    <tr key={u.id}>
                                                        <td className="fw-bold">{u.full_name}</td>
                                                        <td>{u.email}</td>
                                                        <td>
                                                            <span className={`badge ${u.role === 'pastor' ? 'bg-danger' : 'bg-secondary'} text-uppercase`}>
                                                                {u.role}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <button 
                                                                onClick={() => handleDelete(u.id, u.role)} 
                                                                className="btn btn-sm btn-outline-danger fw-bold"
                                                                disabled={u.role === 'pastor'} // Disable delete for pastor
                                                            >
                                                                Revoke Access
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
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

export default Users;