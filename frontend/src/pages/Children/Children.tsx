import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';

interface Member {
    id: number;
    first_name: string;
    last_name: string;
}

interface Child {
    id: number;
    first_name: string;
    last_name: string;
    parent_id: number;
    parent_first: string;
    parent_last: string;
    date_of_birth: string;
    gender: string;
}

const Children: React.FC = () => {
    const [childrenList, setChildrenList] = useState<Child[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Form State
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [parentId, setParentId] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('Male');

    const CHILDREN_API = 'http://127.0.0.1:8000/api/children.php';
    const MEMBERS_API = 'http://127.0.0.1:8000/api/members.php';

    const fetchData = async () => {
        try {
            const [childrenRes, membersRes] = await Promise.all([
                axios.get(CHILDREN_API),
                axios.get(MEMBERS_API)
            ]);

            if (childrenRes.data.status === 'success') setChildrenList(childrenRes.data.data);
            if (membersRes.data.status === 'success') {
                setMembers(membersRes.data.data);
                if (membersRes.data.data.length > 0) setParentId(membersRes.data.data[0].id.toString());
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(CHILDREN_API, {
                first_name: firstName,
                last_name: lastName,
                parent_id: parentId,
                date_of_birth: dob,
                gender: gender
            });

            // Reset Form fields
            setFirstName('');
            setLastName('');
            setDob('');
            
            fetchData();
            alert("Child registered successfully!");
        } catch (error) {
            console.error("Error saving record:", error);
            alert("Failed to register child.");
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to remove this child's record?")) {
            try {
                await axios.delete(CHILDREN_API, { data: { id: id } });
                fetchData();
            } catch (error) {
                console.error("Error deleting record:", error);
                alert("Failed to delete record.");
            }
        }
    };

    // Helper function to calculate age
    const calculateAge = (birthdate: string) => {
        if (!birthdate) return 'N/A';
        const today = new Date();
        const birthDate = new Date(birthdate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
            <Sidebar />

            <div className="flex-grow-1 bg-light p-4" style={{ overflowY: 'auto' }}>
                <header className="mb-4 d-flex justify-content-between align-items-center">
                    <div>
                        <h2>Children's Ministry</h2>
                        <p className="text-muted">Register kids and assign them to parents</p>
                    </div>
                    <div className="bg-warning text-dark px-4 py-2 rounded shadow-sm text-end">
                        <small className="d-block opacity-75 fw-bold">Total Children</small>
                        <h3 className="mb-0 fw-bold">{childrenList.length}</h3>
                    </div>
                </header>

                <div className="row">
                    {/* Add Child Form */}
                    <div className="col-md-4 mb-4">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <h5 className="card-title mb-3">Register Child</h5>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-2">
                                        <label className="form-label text-muted small" htmlFor="firstName">First Name</label>
                                        <input id="firstName" type="text" className="form-control" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label text-muted small" htmlFor="lastName">Last Name</label>
                                        <input id="lastName" type="text" className="form-control" value={lastName} onChange={e => setLastName(e.target.value)} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label text-muted small" htmlFor="parentId">Parent / Guardian</label>
                                        <select id="parentId" className="form-select" value={parentId} onChange={e => setParentId(e.target.value)} required>
                                            {members.length === 0 ? <option value="">No members found...</option> : 
                                                members.map(m => <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>)
                                            }
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label text-muted small" htmlFor="dob">Date of Birth</label>
                                        <input id="dob" type="date" className="form-control" value={dob} onChange={e => setDob(e.target.value)} required />
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label text-muted small" htmlFor="gender">Gender</label>
                                        <select id="gender" className="form-select" value={gender} onChange={e => setGender(e.target.value)}>
                                            <option value="Male">Boy</option>
                                            <option value="Female">Girl</option>
                                        </select>
                                    </div>
                                    
                                    <button type="submit" className="btn btn-warning w-100 fw-bold">Register Child</button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Children List */}
                    <div className="col-md-8">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <h5 className="card-title mb-3">Sunday School Roster</h5>
                                {loading ? (
                                    <p>Loading records...</p>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Age</th>
                                                    <th>Gender</th>
                                                    <th>Parent / Guardian</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {childrenList.length === 0 ? (
                                                    <tr><td colSpan={5} className="text-center text-muted py-4">No children registered yet.</td></tr>
                                                ) : (
                                                    childrenList.map(child => (
                                                        <tr key={child.id}>
                                                            <td className="fw-bold">{child.first_name} {child.last_name}</td>
                                                            <td>
                                                                <span className="badge bg-secondary">{calculateAge(child.date_of_birth)} yrs</span>
                                                            </td>
                                                            <td>{child.gender}</td>
                                                            <td className="text-primary">{child.parent_first} {child.parent_last}</td>
                                                            <td>
                                                                <button onClick={() => handleDelete(child.id)} className="btn btn-sm btn-outline-danger">Del</button>
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

export default Children;