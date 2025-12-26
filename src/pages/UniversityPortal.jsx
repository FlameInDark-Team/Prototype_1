import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { FilePlus, Table, Upload, AlertCircle, CheckCircle, UserCheck } from 'lucide-react';
import { useBlockchain } from '../contexts/BlockchainContext';
import styles from '../styles/UniversityPortal.module.css';

const UniversityPortal = () => {
    const { account, role, connectWallet, issueCredential, batchIssueCredentials, loading, ipfsProgress } = useBlockchain();
    const [activeTab, setActiveTab] = useState('issue');
    
    // Form State
    const [form, setForm] = useState({
        studentName: '',
        studentDID: '',
        courseName: ''
    });
    const [status, setStatus] = useState(null); 

    const handleBatch = async () => {
        setStatus(null);
        const mockRecords = [
            { did: '0xABC...1', name: 'John Doe', course: 'B.Sc. CS' },
            { did: '0xABC...2', name: 'Jane Smith', course: 'M.Sc. AI' },
            { did: '0xABC...3', name: 'Bob Wilson', course: 'B.Eng' },
            { did: '0xABC...4', name: 'Alice Brown', course: 'PhD Physics' },
            { did: '0xABC...5', name: 'Charlie Davis', course: 'B.A. Arts' }
        ];
        try {
            await batchIssueCredentials(mockRecords);
            setStatus({ type: 'success', msg: 'Batch of 5 credentials successfully issued!' });
        } catch (err) {
            setStatus({ type: 'error', msg: err.message });
        }
    };

    if (role !== 'university') {
        return (
            <div className="container" style={{paddingTop: 120, textAlign: 'center'}}>
                <h2>Restricted Access</h2>
                <p>Please connect as an Authorized University to access this portal.</p>
                <button 
                    onClick={() => connectWallet('university')}
                    className={styles.submitBtn}
                    style={{marginTop: 20, width: 'auto', padding: '10px 30px'}}
                >
                    Login as Demo University
                </button>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus(null);
        try {
            await issueCredential(form.studentDID, form.studentName, form.courseName, {});
            setStatus({ type: 'success', msg: 'Credential successfully issued and recorded on blockchain!' });
            setForm({ studentName: '', studentDID: '', courseName: '' });
        } catch (err) {
            setStatus({ type: 'error', msg: err.message });
        }
    };

    return (
        <div className={`container ${styles.portal}`}>
            <header className={styles.header}>
                <div className={styles.topInfo}>
                    <div className={styles.avatar}>
                        <UserCheck size={24} />
                    </div>
                    <div>
                        <span className={styles.adminName}>Univ Admin</span>
                        <span className={styles.address}>({account.slice(0, 6)}...{account.slice(-4)})</span>
                    </div>
                </div>
                <h1 className={styles.portalTitle}>University X Portal</h1>
                <nav className={styles.portalNav}>
                    <button className={activeTab === 'home' ? styles.activeTab : ''} onClick={() => setActiveTab('home')}>Home</button>
                    <button className={activeTab === 'issue' ? styles.activeTab : ''} onClick={() => setActiveTab('issue')}>Issue Credential</button>
                    <button className={activeTab === 'history' ? styles.activeTab : ''} onClick={() => setActiveTab('history')}>My Issuances</button>
                    <button className={activeTab === 'profile' ? styles.activeTab : ''} onClick={() => setActiveTab('profile')}>Profile</button>
                </nav>
            </header>

            <Motion.div 
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={styles.content}
            >
                {activeTab === 'issue' ? (
                    <div className={styles.issueFormWrapper}>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <h3>Issue New Certificate</h3>
                            
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label>Student DID Address</label>
                                    <input 
                                        type="text" 
                                        placeholder="0x..."
                                        value={form.studentDID}
                                        onChange={(e) => setForm({...form, studentDID: e.target.value})}
                                        required 
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Student Full Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter full legal name"
                                        value={form.studentName}
                                        onChange={(e) => setForm({...form, studentName: e.target.value})}
                                        required 
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Credential Type</label>
                                    <select className={styles.select}>
                                        <option>Degree</option>
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Major / Course Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. B.Sc. Computer Science"
                                        value={form.courseName}
                                        onChange={(e) => setForm({...form, courseName: e.target.value})}
                                        required 
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Final GPA / Grade</label>
                                    <input type="text" placeholder="e.g. 4.0 / A+" />
                                </div>
                            </div>

                            <div className={styles.fileActions}>
                                <div className={styles.fileUpload}>
                                    <Upload size={20} />
                                    <span>Upload Certificate PDF</span>
                                    <button type="button" className={styles.chooseFile}>Choose File</button>
                                </div>
                                <button type="button" className={styles.pinataBtn}>Pinata Upload</button>
                            </div>

                            <div className={styles.formButtons}>
                                <button type="submit" className={styles.submitBtn}>
                                    Issue Credential
                                </button>
                                <button type="button" className={styles.batchBtn} onClick={handleBatch}>
                                    Simulate Batch Issue (5 Records)
                                </button>
                                <button type="button" className={styles.cancelBtn}>Cancel</button>
                            </div>

                            {loading && (
                                <div className={styles.progressWrapper}>
                                    <div className={styles.progressBar} style={{ width: `${ipfsProgress}%` }}></div>
                                    <span className={styles.progressText}>IPFS Upload: {ipfsProgress}%</span>
                                </div>
                            )}

                            {status && (
                                <div className={`${styles.status} ${styles[status.type]}`}>
                                    {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                    {status.msg}
                                </div>
                            )}
                        </form>
                    </div>
                ) : (
                    <HistoryTable />
                )}
            </Motion.div>
        </div>
    );
};

const HistoryTable = () => {
    const { getIssuedCredentials } = useBlockchain();
    const creds = getIssuedCredentials();

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Hash ID</th>
                        <th>Student DID</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {creds.length === 0 ? (
                        <tr><td colSpan="4" style={{textAlign: 'center', padding: 40, color: '#666'}}>No credentials issued yet.</td></tr>
                    ) : creds.map(c => (
                        <tr key={c.hash}>
                            <td className={styles.mono}>{c.hash.substring(0, 10)}...</td>
                            <td className={styles.mono}>{c.studentDID.substring(0, 10)}...</td>
                            <td>{new Date(c.timestamp).toLocaleDateString()}</td>
                            <td>
                                <span className={c.isValid ? styles.badgeSuccess : styles.badgeRevoked}>
                                    {c.isValid ? 'Valid' : 'Revoked'}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UniversityPortal;
