import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';

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
    const [editingId, setEditingId] = useState<number | null>(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('Male');

    const API_URL = 'http://127.0.0.1:8000/api/members.php';

    const fetchMembers = async () => {
        try {
            const response = await axios.get(API_URL);
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

    // Handle Form Submit (Both Add and Update)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            if (editingId) {
                // UPDATE Existing Member
                await axios.put(API_URL, {
                    id: editingId,
                    first_name: firstName,
                    last_name: lastName,
                    phone: phone,
                    gender: gender,
                    status: 'active'
                });
            } else {
                // ADD New Member
                await axios.post(API_URL, {
                    first_name: firstName,
                    last_name: lastName,
                    phone: phone,
                    gender: gender,
                    status: 'active'
                });
            }

            // Reset Form
            setEditingId(null);
            setFirstName('');
            setLastName('');
            setPhone('');
            setGender('Male');

            fetchMembers(); // Refresh table

        } catch (error) {
            console.error("Error saving member:", error);
            alert("Failed to save member.");
        }
    };

    // Load member data into the form for editing
    const handleEditClick = (member: Member) => {
        setEditingId(member.id);
        setFirstName(member.first_name);
        setLastName(member.last_name);
        setPhone(member.phone || '');
        setGender(member.gender);
    };

    // Cancel editing mode
    const handleCancelEdit = () => {
        setEditingId(null);
        setFirstName('');
        setLastName('');
        setPhone('');
        setGender('Male');
    };

    // Delete Member (with confirmation)
    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this member?")) {
            try {
                await axios.delete(API_URL, { data: { id: id } });
                fetchMembers(); // Refresh table
            } catch (error) {
                console.error("Error deleting member:", error);
                alert("Failed to delete member.");
            }
        }
    };

    return (
        <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
            <Sidebar />

            <div className="flex-grow-1 bg-light p-4" style={{ overflowY: 'auto' }}>
                <header className="mb-4">
                    <h2>Member Management</h2>
                    <p className="text-muted">Add, edit, and manage church members</p>
                </header>

                <div className="row">
                    {/* Member Form */}
                    <div className="col-md-4 mb-4">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <h5 className="card-title mb-3">
                                    {editingId ? 'Edit Member' : 'Add New Member'}
                                </h5>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-2">
                                        <label className="form-label text-muted small">First Name</label>
                                        <input type="text" className="form-control" placeholder="Enter first name" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label text-muted small">Last Name</label>
                                        <input type="text" className="form-control" placeholder="Enter last name" value={lastName} onChange={e => setLastName(e.target.value)} required />
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label text-muted small">Phone Number</label>
                                        <input type="text" className="form-control" placeholder="Enter phone number" value={phone} onChange={e => setPhone(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="gender" className="form-label text-muted small">Gender</label>
                                        <select id="gender" className="form-select" value={gender} onChange={e => setGender(e.target.value)}>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div>
                                    
                                    <button type="submit" className={`btn w-100 ${editingId ? 'btn-warning' : 'btn-success'}`}>
                                        {editingId ? 'Update Member' : 'Save Member'}
                                    </button>
                                    
                                    {editingId && (
                                        <button type="button" onClick={handleCancelEdit} className="btn btn-light w-100 mt-2 text-muted">
                                            Cancel
                                        </button>
                                    )}
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
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {members.length === 0 ? (
                                                    <tr><td colSpan={4} className="text-center text-muted py-4">No members found. Add someone!</td></tr>
                                                ) : (
                                                    members.map(member => (
                                                        <tr key={member.id}>
                                                            <td className="fw-bold">{member.first_name} {member.last_name}</td>
                                                            <td>{member.phone || 'N/A'}</td>
                                                            <td>{member.gender}</td>
                                                            <td>
                                                                <button 
                                                                    onClick={() => handleEditClick(member)} 
                                                                    className="btn btn-sm btn-outline-primary me-2"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleDelete(member.id)} 
                                                                    className="btn btn-sm btn-outline-danger"
                                                                >
                                                                    Delete
                                                                </button>
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