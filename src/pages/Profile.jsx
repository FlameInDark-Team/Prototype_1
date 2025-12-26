import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { Award, Shield, User, MapPin, Link as LinkIcon, Building, Calendar, CheckCircle, ExternalLink } from 'lucide-react';
import { useBlockchain } from '../contexts/BlockchainContext';
import styles from '../styles/Profile.module.css';

const Profile = () => {
    const { address } = useParams();
    const { getAllIssuers, credentials: allCredentials } = useBlockchain();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching public profile data
        const loadProfile = async () => {
            await new Promise(r => setTimeout(r, 1000));
            setProfileData({
                name: 'Alice Doe',
                bio: 'Blockchain Enthusiast & Full Stack Developer. Graduated with honors.',
                location: 'San Francisco, CA',
                website: 'https://alicedoe.dev',
                avatar: null
            });
            setLoading(false);
        };
        loadProfile();
    }, [address]);

    const studentCredentials = Object.values(allCredentials).filter(c => c.studentDID === address);
    const issuers = getAllIssuers();

    if (loading) return <div className={styles.loading}>Loading Identity...</div>;

    return (
        <div className={`container ${styles.profilePage}`}>
            <Motion.div 
                className={styles.header}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className={styles.avatarLarge}>
                    <User size={64} />
                    <div className={styles.verifiedBadge}><CheckCircle size={16} /></div>
                </div>
                <h1>{profileData.name}</h1>
                <p className={styles.address}>{address}</p>
                <p className={styles.bio}>{profileData.bio}</p>
                
                <div className={styles.meta}>
                    <span><MapPin size={14} /> {profileData.location}</span>
                    <a href={profileData.website} target="_blank" rel="noreferrer"><LinkIcon size={14} /> Portfolio</a>
                </div>
            </Motion.div>

            <div className={styles.credentialsSection}>
                <h2>Verified Credentials <span className={styles.count}>{studentCredentials.length}</span></h2>
                <div className={styles.grid}>
                    {studentCredentials.map((cred, index) => (
                        <Motion.div 
                            key={cred.hash}
                            className={styles.credCard}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className={styles.credIcon}>
                                <Award size={32} />
                            </div>
                            <div className={styles.credDetails}>
                                <h3>{cred.courseName || 'Academic Degree'}</h3>
                                <p className={styles.issuerName}>
                                    <Building size={14} /> {issuers[cred.issuer]?.name || 'Autonomous University'}
                                </p>
                                <div className={styles.footer}>
                                    <span><Calendar size={14} /> {new Date(cred.timestamp).getFullYear()}</span>
                                    <span className={styles.status}><Shield size={12} /> On-Chain Verified</span>
                                </div>
                            </div>
                        </Motion.div>
                    ))}
                </div>
            </div>

            <div className={styles.cta}>
                <p>Are you an employer? Verify these details instantly.</p>
                <Link to="/verifier" className={styles.verifyLink}>Go to Verifier Portal</Link>
            </div>
        </div>
    );
};

export default Profile;
