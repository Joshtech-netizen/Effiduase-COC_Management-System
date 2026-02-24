import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import './Members.css';

interface Member { id: number; first_name: string; last_name: string; phone: string; gender: string; status: string; photo?: string; }

const Members: React.FC = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    
    // View Modal State
    const [viewMember, setViewMember] = useState<Member | null>(null);

    // Form State
    const [editingId, setEditingId] = useState<number | null>(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('Male');
    const [photo, setPhoto] = useState(''); // Base64 image string

    const API_URL = 'http://127.0.0.1:8000/api/members.php';

    const fetchMembers = async () => {
        try {
            const response = await axios.get(API_URL);
            if (response.data.status === 'success') setMembers(response.data.data);
        } catch (error) { console.error("Error fetching:", error); } 
        finally { setLoading(false); }
    };

    useEffect(() => { fetchMembers(); }, []);

    // Convert uploaded image to Base64 String
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => { setPhoto(reader.result as string); };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = { first_name: firstName, last_name: lastName, phone, gender, status: 'active', photo: photo };
            if (editingId) {
                await axios.put(API_URL, { ...payload, id: editingId });
            } else {
                await axios.post(API_URL, payload);
            }
            // Reset Form
            setEditingId(null); setFirstName(''); setLastName(''); setPhone(''); setGender('Male'); setPhoto('');
            fetchMembers();
        } catch { alert("Failed to save member."); }
    };

    const handleEditClick = (m: Member) => {
        setEditingId(m.id); setFirstName(m.first_name); setLastName(m.last_name); setPhone(m.phone || ''); setGender(m.gender); setPhoto(m.photo || '');
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
            
            {/* --- VIEW MEMBER MODAL --- */}
            {viewMember && (
                <div className="custom-modal-overlay" onClick={() => setViewMember(null)}>
                    <div className="custom-modal-card" onClick={e => e.stopPropagation()}>
                        <img src={viewMember.photo || 'https://via.placeholder.com/150'} alt="Profile" className="profile-img-large shadow-sm" />
                        <h3 className="fw-bold mt-2">{viewMember.first_name} {viewMember.last_name}</h3>
                        <span className="badge bg-success mb-3">{viewMember.status}</span>
                        
                        <div className="text-start bg-light p-3 rounded mb-4">
                            <p className="mb-1"><strong>Phone:</strong> {viewMember.phone || 'N/A'}</p>
                            <p className="mb-1"><strong>Gender:</strong> {viewMember.gender}</p>
                            <p className="mb-0"><strong>Member ID:</strong> #{viewMember.id}</p>
                        </div>
                        
                        <button className="btn btn-secondary w-100 fw-bold" onClick={() => setViewMember(null)}>Close Profile</button>
                    </div>
                </div>
            )}

            <div className="flex-grow-1 bg-light p-4 content-wrapper">
                <header className="mb-4">
                    <h2 className="fw-bold">Member Management</h2>
                    <p className="text-muted">Add, edit, and view church members</p>
                </header>
                <div className="row">
                    <div className="col-md-4 mb-4">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <h5 className="card-title mb-3 fw-bold">{editingId ? 'Edit Member' : 'Add New Member'}</h5>
                                
                                {/* Image Preview Box */}
                                {photo && <div className="text-center mb-3"><img src={photo} alt="Preview" className="profile-img-large" /></div>}

                                <form onSubmit={handleSubmit}>
                                    <label htmlFor="profilePicture" className="form-label small text-muted">Profile Picture</label>
                                    <input id="profilePicture" type="file" accept="image/*" className="form-control mb-2" onChange={handleImageUpload} title="Upload a profile picture" />
                                    
                                    <input type="text" className="form-control mb-2" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" required />
                                    <input type="text" className="form-control mb-2" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" required />
                                    <input type="text" className="form-control mb-2" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number" />
                                    <label htmlFor="genderSelect" className="form-label small text-muted">Gender</label>
                                    <select id="genderSelect" className="form-select mb-3" value={gender} onChange={e => setGender(e.target.value)} title="Select member gender">
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                    <button type="submit" className={`btn w-100 fw-bold ${editingId ? 'btn-warning' : 'btn-success'}`}>
                                        {editingId ? 'Update Member' : 'Save Member'}
                                    </button>
                                    {editingId && <button type="button" onClick={() => { setEditingId(null); setPhoto(''); }} className="btn btn-light w-100 mt-2">Cancel</button>}
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
                                                <tr><th>Photo</th><th>Name</th><th>Action</th></tr>
                                            </thead>
                                            <tbody>
                                                {members.map(m => (
                                                    <tr key={m.id}>
                                                        <td>
                                                            <img src={m.photo || 'https://via.placeholder.com/40'} alt="pic" className="profile-img-small shadow-sm" />
                                                        </td>
                                                        <td className="fw-bold">{m.first_name} {m.last_name}</td>
                                                        <td>
                                                            <button onClick={() => setViewMember(m)} className="btn btn-sm btn-info text-white me-2 fw-bold">View</button>
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