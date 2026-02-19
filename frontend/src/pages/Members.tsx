import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar'; 

interface Member {
    id: number;
    first_name: string;
    last_name: string;
    phone: string;
    gender: string;
    status: string;
}

const Members: React.FC = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Form State
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('Male');

    // 1. Fetch Members on Load
    const fetchMembers = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/members.php');
            if (response.data.status === 'success') {
                setMembers(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching members:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    // 2. Handle Adding a New Member
    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            await axios.post('http://127.0.0.1:8000/api/members.php', {
                first_name: firstName,
                last_name: lastName,
                phone: phone,
                gender: gender,
                status: 'active'
            });

            // Clear the form
            setFirstName('');
            setLastName('');
            setPhone('');
            setGender('Male');

            // Refresh the table instantly
            fetchMembers();

        } catch (error) {
            console.error("Error adding member:", error);
            alert("Failed to add member.");
        }
    };

    return (
        <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
            
            {/* 🎯 Our clean, reusable Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-grow-1 bg-light p-4" style={{ overflowY: 'auto' }}>
                <header className="mb-4">
                    <h2>Member Management</h2>
                    <p className="text-muted">Add and view church members</p>
                </header>

                <div className="row">
                    {/* Add Member Form */}
                    <div className="col-md-4 mb-4">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <h5 className="card-title mb-3">Add New Member</h5>
                                <form onSubmit={handleAddMember}>
                                    <div className="mb-2">
                                        <label htmlFor="firstName" className="form-label text-muted small">First Name</label>
                                        <input id="firstName" type="text" className="form-control" placeholder="Enter first name" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                                    </div>
                                    <div className="mb-2">
                                        <label htmlFor="lastName" className="form-label text-muted small">Last Name</label>
                                        <input id="lastName" type="text" className="form-control" placeholder="Enter last name" value={lastName} onChange={e => setLastName(e.target.value)} required />
                                    </div>
                                    <div className="mb-2">
                                        <label htmlFor="phone" className="form-label text-muted small">Phone Number</label>
                                        <input id="phone" type="text" className="form-control" placeholder="Enter phone number" value={phone} onChange={e => setPhone(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="gender" className="form-label text-muted small">Gender</label>
                                        <select id="gender" className="form-select" value={gender} onChange={e => setGender(e.target.value)}>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="btn btn-success w-100">Save Member</button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Members Table */}
                    <div className="col-md-8">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <h5 className="card-title mb-3">Church Roster</h5>
                                {loading ? (
                                    <p>Loading members...</p>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Phone</th>
                                                    <th>Gender</th>
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {members.length === 0 ? (
                                                    <tr><td colSpan={5} className="text-center text-muted py-4">No members found. Add someone!</td></tr>
                                                ) : (
                                                    members.map(member => (
                                                        <tr key={member.id}>
                                                            <td className="fw-bold">{member.first_name} {member.last_name}</td>
                                                            <td>{member.phone || 'N/A'}</td>
                                                            <td>{member.gender}</td>
                                                            <td><span className="badge bg-success">{member.status}</span></td>
                                                            <td>
                                                                <button className="btn btn-sm btn-outline-primary me-2">Edit</button>
                                                                <button className="btn btn-sm btn-outline-danger">Delete</button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
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

export default Members;