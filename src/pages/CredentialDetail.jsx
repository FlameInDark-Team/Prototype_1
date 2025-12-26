import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion as m } from 'framer-motion';
import { Award, CheckCircle2, Share2, Download, Shield, ArrowLeft, Calendar, Building, Hash } from 'lucide-react';
import TiltCard from '../components/ui/TiltCard';
import SpotlightCard from '../components/ui/SpotlightCard';
import styles from '../styles/CredentialDetail.module.css';

const CredentialDetail = () => {
    const { id } = useParams();
    const [credential, setCredential] = useState(null);


    useEffect(() => {
       
        setTimeout(() => {
            setCredential({
                id: id,
                title: "Bachelor of Computer Science",
                studentName: "Alice Doe",
                issuer: "Stanford University",
                issuerLogo: null, 
                date: "2024-05-15",
                skills: ["Blockchain", "Cryptography", "Smart Contracts", "React"],
                gpa: "3.9",
                hash: "0x7f...3a2b",
                description: "Awarded for demonstrating excellence in decentralized systems and software engineering."
            });
        }, 500);
    }, [id]);

    if (!credential) {
        return <div className={styles.loading}>Loading Credential...</div>;
    }

    return (
        <div className={`container ${styles.page}`}>
            <Link to="/dashboard" className={styles.backLink}>
                <ArrowLeft size={16} /> Back to Dashboard
            </Link>

            <div className={styles.content}>
                {/* Left Side: The Certificate */}
                <m.div 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className={styles.certContainer}
                >
                    <TiltCard className={styles.certificate}>
                        <div className={styles.certInner}>
                            <div className={styles.certHeader}>
                                <div className={styles.logoPlaceholder}>
                                    <Building size={32} />
                                </div>
                                <div className={styles.certIssues}>
                                    <span className={styles.label}>Issued By</span>
                                    <h3>{credential.issuer}</h3>
                                </div>
                            </div>
                            
                            <div className={styles.certBody}>
                                <span className={styles.certSubtitle}>This certifies that</span>
                                <h1>{credential.studentName}</h1>
                                <span className={styles.certSubtitle}>has successfully completed the requirements for</span>
                                <h2 className={styles.courseTitle}>{credential.title}</h2>
                                <p className={styles.description}>{credential.description}</p>
                            </div>

                            <div className={styles.certFooter}>
                                <div className={styles.issueDate}>
                                    <Calendar size={14} /> Issued: {credential.date}
                                </div>
                                <div className={styles.signature}>
                                    {/* Mock Signature */}
                                    <span className={styles.sigText}>Dean of Engineering</span>
                                </div>
                            </div>
                            
                            <div className={styles.seal}>
                                <Award size={40} />
                            </div>
                        </div>
                    </TiltCard>
                    
                    <div className={styles.certActions}>
                        <button className={styles.actionBtn}>
                            <Share2 size={16} /> Share
                        </button>
                        <button className={styles.actionBtn}>
                            <Download size={16} /> PDF
                        </button>
                    </div>
                </m.div>

                {/* Right Side: Metadata & Verification */}
                <div className={styles.metaContainer}>
                    <SpotlightCard className={styles.statusCard}>
                        <div className={styles.verifiedHeader}>
                            <Shield size={24} className={styles.verifiedIcon} />
                            <div>
                                <h3>Verified On-Chain</h3>
                                <span className={styles.network}>Polygon Amoy Testnet</span>
                            </div>
                        </div>
                        <div className={styles.hashBox}>
                            <Hash size={14} />
                            <span>{credential.hash}</span>
                        </div>
                        <Link to="/verifier" className={styles.verifyLink}>
                            Verify Independently <CheckCircle2 size={14} />
                        </Link>
                    </SpotlightCard>

                    <SpotlightCard className={styles.skillsCard}>
                        <h3>Skills & Competencies</h3>
                        <div className={styles.tags}>
                            {credential.skills.map((skill, i) => (
                                <span key={i} className={styles.tag}>{skill}</span>
                            ))}
                        </div>
                    </SpotlightCard>

                    <div className={styles.jsonLink}>
                        View Raw Metadata (IPFS)
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CredentialDetail;
