import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Award, Share2, X, Wallet, ExternalLink, Search, UserCheck, CheckCircle2, Shield } from 'lucide-react';
import { useBlockchain } from '../contexts/BlockchainContext';
import  TiltCard  from '../components/ui/TiltCard';
import styles from '../styles/StudentDashboard.module.css';

const StudentDashboard = () => {
    const { account, role, connectWallet, getMyCredentials } = useBlockchain();
    const [selectedCred, setSelectedCred] = useState(null);

    if (role !== 'student') {
        return (
            <div className="container" style={{paddingTop: 120, textAlign: 'center'}}>
                <h2>Access Your Digital Wallet</h2>
                <p>Please connect your wallet to view your academic credentials.</p>
                <button 
                    onClick={() => connectWallet('student')}
                    className={styles.connectBtn}
                >
                    Connect Wallet
                </button>
            </div>
        );
    }

    const credentials = getMyCredentials();

    return (
        <div className={`container ${styles.dashboard}`}>
            {/* Wallet Header */}
            <div className={styles.header}>
                <div className={styles.profile}>
                    <div className={styles.avatar}>
                        <UserCheck size={32} />
                    </div>
                    <div>
                        <h1>Alice Doe <span className={styles.displayName}>({account.slice(0, 6)}...{account.slice(-4)})</span></h1>
                        <p className={styles.did}>DID: {account}</p>
                    </div>
                </div>
                <div className={styles.topActions}>
                    <div className={styles.balanceBox}>
                        <span className={styles.label}>Balance:</span>
                        <span className={styles.value}>0 MATIC</span>
                    </div>
                    <Link to={`/profile/${account}`} className={styles.shareProfileBtn}>
                        <Share2 size={16} /> Public Profile
                    </Link>
                    <button className={styles.disconnectBtn}>Disconnect</button>
                </div>
            </div>

            {/* Dashboard Nav */}
            <nav className={styles.dashboardNav}>
                <button className={styles.activeTab}>Dashboard</button>
                <button>Credentials</button>
                <button>Profile</button>
                <button>Settings</button>
            </nav>

            <div className={styles.toolbar}>
                <button className={styles.addBtn}>+ Add/Import Credential</button>
            </div>

            <div className={styles.filters}>
                <span className={styles.filterLabel}>Filter by:</span>
                <select className={styles.select}>
                    <option>Degree Type</option>
                </select>
                <div className={styles.searchBox}>
                    <input type="text" placeholder="Search..." />
                    <Search size={18} />
                </div>
            </div>

            {/* Credentials Grid */}
            <div className={styles.grid}>
                {credentials.length === 0 ? (
                    <div className={styles.emptyState}>
                        <Award size={48} />
                        <p>No credentials found in your wallet yet.</p>
                    </div>
                ) : credentials.map((cred, index) => (
                    <TiltCard 
                        key={cred.hash}
                        className={styles.card}
                    >
                        <Motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => setSelectedCred(cred)}
                            style={{height: '100%'}}
                        >
                            <div className={styles.cardHeader}>
                                <Award className={styles.cardIcon} />
                                <span className={styles.status}>Verified</span>
                            </div>
                            <h4>{cred.courseName}</h4>
                            <p className={styles.issuer}>Issuer: {cred.issuer.slice(0, 10)}...</p>
                            <div className={styles.cardFooter}>
                                <span>{new Date(cred.timestamp).getFullYear()}</span>
                                <Link to={`/credential/${cred.hash}`} className={styles.viewBtn}>View</Link>
                            </div>
                        </Motion.div>
                    </TiltCard>
                ))}
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedCred && (
                    <Modal cred={selectedCred} onClose={() => setSelectedCred(null)} />
                )}
            </AnimatePresence>
        </div>
    );
};

const Modal = ({ cred, onClose }) => {
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <Motion.div 
                className={styles.modalContent}
                onClick={e => e.stopPropagation()}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
            >
                <button className={styles.closeBtn} onClick={onClose}><X size={24} /></button>
                
                <div className={styles.modalHeader}>
                    <h2>{cred.courseName}</h2>
                    <span className={styles.verifiedBadge}>
                        <Award size={16} /> Blockchain Verified
                    </span>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.infoRow}>
                        <label>Issued To:</label>
                        <p>{cred.studentDID}</p>
                    </div>
                    <div className={styles.infoRow}>
                        <label>Issuer Address:</label>
                        <p>{cred.issuer}</p>
                    </div>
                    <div className={styles.infoRow}>
                        <label>Credential Hash:</label>
                        <p className={styles.mono}>{cred.hash}</p>
                    </div>
                    <div className={styles.infoRow}>
                        <label>IPFS CID:</label>
                        <a 
                            href={`https://ipfs.io/ipfs/${cred.ipfsCID}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className={styles.ipfsLink}
                        >
                            {cred.ipfsCID} <ExternalLink size={14} />
                        </a>
                    </div>
                    
                    <div className={styles.qrSection}>
                        <p>Scan to Verify</p>
                        <div className={styles.qrWrapper}>
                            <QRCodeSVG value={cred.hash} size={120} />
                        </div>
                        <div className={styles.statusGroup}>
                            <span className={styles.tag}><CheckCircle2 size={14} /> Authentic</span>
                            <span className={styles.tag}><Shield size={14} /> Signed</span>
                        </div>
                    </div>
                </div>

                <button className={styles.shareBtn}>
                    <Share2 size={18} /> Share Credential
                </button>
            </Motion.div>
        </div>
    );
};

export default StudentDashboard;
