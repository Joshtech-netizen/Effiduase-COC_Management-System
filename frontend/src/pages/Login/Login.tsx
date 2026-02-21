import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

interface LoginResponse {
    message: string;
    user: {
        id: number;
        name: string;
        role: string;
    };
    token: string;
}

interface ErrorResponse {
    message: string;
}

const Login: React.FC = () => {
    // State for form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // State for UI feedback
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post<LoginResponse>('http://127.0.0.1:8000/api/login.php', {
                email: email,
                password: password
            });

            // If the backend sent the user object, login is successful!
            if (response.data && response.data.user) {
                console.log("Login Success:", response.data);
                
                // Save credentials
                localStorage.setItem('user_token', response.data.token);
                localStorage.setItem('user_role', response.data.user.role);
                localStorage.setItem('user_name', response.data.user.name);
                
                // Go to Dashboard
                navigate('/dashboard');
            } else {
                // If it succeeded but no user object (PHP edge case)
                setError(response.data.message || "Invalid credentials.");
            }

        } catch (err: unknown) {
            // Handle actual API errors gracefully
            if (axios.isAxiosError<ErrorResponse>(err) && err.response?.data?.message) {
                setError(err.response.data.message); // Show "User not found" or "Wrong password"
            } else {
                setError("Network Error: Make sure the API is running.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <h3 className="text-center login-title">Church Admin</h3>
                
                {error && <div className="alert alert-danger p-2 small text-center">{error}</div>}
                
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="login-label">Email Address</label>
                        <input
                            type="email"
                            className="form-control login-input"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                            placeholder="admin@church.com"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="login-label">Password</label>
                        <input
                            type="password"
                            className="form-control login-input"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                            placeholder="Enter password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 login-btn"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;