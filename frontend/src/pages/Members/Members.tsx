import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import './Members.css';

interface Member { id: number; first_name: string; last_name: string; phone: string; gender: string; status: string; }

const Members: React.FC = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('Male');

    const API_URL = 'http://127.0.0.1:8000/api/members.php';

    const fetchMembers = async () => {
        try {
            const response = await axios.get(API_URL);
            if (response.data.status === 'success') setMembers(response.data.data);
        } catch (error) { console.error("Error fetching:", error); } 
        finally { setLoading(false); }
    };

    useEffect(() => { fetchMembers(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = { first_name: firstName, last_name: lastName, phone, gender, status: 'active' };
            if (editingId) {
                await axios.put(API_URL, { ...payload, id: editingId });
            } else {
                await axios.post(API_URL, payload);
            }
            setEditingId(null); setFirstName(''); setLastName(''); setPhone(''); setGender('Male');
            fetchMembers();
        } catch {
            alert("Failed to save member.");
        }
    };

    const handleEditClick = (m: Member) => {
        setEditingId(m.id); setFirstName(m.first_name); setLastName(m.last_name); setPhone(m.phone || ''); setGender(m.gender);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure?")) {
            await axios.delete(API_URL, { data: { id } });
            fetchMembers();
        }
    };

    return (
        <div className="d-flex page-wrapper">
            <Sidebar />
            <div className="flex-grow-1 bg-light p-4 content-wrapper">
                <header className="mb-4">
                    <h2 className="fw-bold">Member Management</h2>
                    <p className="text-muted">Add, edit, and manage church members</p>
                </header>
                <div className="row">
                    <div className="col-md-4 mb-4">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <h5 className="card-title mb-3 fw-bold">{editingId ? 'Edit Member' : 'Add New Member'}</h5>
                                <form onSubmit={handleSubmit}>
                                    <input type="text" className="form-control mb-2" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" required />
                                    <input type="text" className="form-control mb-2" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" required />
                                    <input type="text" className="form-control mb-2" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number" />
                                    <label htmlFor="gender" className="form-label">Gender</label>
                                    <select id="gender" className="form-select mb-3" value={gender} onChange={e => setGender(e.target.value)}>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                    <button type="submit" className={`btn w-100 fw-bold ${editingId ? 'btn-warning' : 'btn-success'}`}>
                                        {editingId ? 'Update Member' : 'Save Member'}
                                    </button>
                                    {editingId && <button type="button" onClick={() => setEditingId(null)} className="btn btn-light w-100 mt-2">Cancel</button>}
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <h5 className="card-title mb-3 fw-bold">Church Roster</h5>
                                {loading ? <p>Loading...</p> : (
                                    <div className="table-responsive">
                                        <table className="table align-middle">
                                            <thead className="table-light">
                                                <tr><th>Name</th><th>Phone</th><th>Gender</th><th>Action</th></tr>
                                            </thead>
                                            <tbody>
                                                {members.map(m => (
                                                    <tr key={m.id}>
                                                        <td className="fw-bold">{m.first_name} {m.last_name}</td>
                                                        <td>{m.phone || 'N/A'}</td>
                                                        <td>{m.gender}</td>
                                                        <td>
                                                            <button onClick={() => handleEditClick(m)} className="btn btn-sm btn-outline-primary me-2">Edit</button>
                                                            <button onClick={() => handleDelete(m.id)} className="btn btn-sm btn-outline-danger">Del</button>
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
export default Members;