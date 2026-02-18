import React, { useState } from 'react';
import axios from 'axios';

interface LoginResponse {
    message: string;
    user: {
        id: number;
        name: string;
        role: string;
    };
    token: string;
}

const Login: React.FC = () => {
    // State for form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // State for UI feedback
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // THE API CALL
            // Note: We use the Docker service name or localhost depending on setup.
            // Since browser runs on Host, we use localhost:8000
            const response = await axios.post<LoginResponse>('http://localhost:8000/api/login.php', {
                email: email,
                password: password
            });

            console.log("Login Success:", response.data);
            alert(`Welcome back, ${response.data.user.name}!`);
            
            // Save token to LocalStorage (Persist login)
            localStorage.setItem('user_token', response.data.token);
            localStorage.setItem('user_role', response.data.user.role);
            
            // TODO: Redirect to Dashboard here

        } catch (err) {
            // Handle Errors
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.message);
            } else {
                setError("Network Error: Is the backend running?");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <div className="card shadow p-4" style={{ width: '400px' }}>
                <h3 className="text-center mb-4">Church Admin</h3>
                
                {error && <div className="alert alert-danger">{error}</div>}
                
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Email Address</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                            placeholder="admin@church.com"
                        />
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                            placeholder="Enter password"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;