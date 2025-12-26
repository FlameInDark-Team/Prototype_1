import React, { useState } from 'react';
import { motion as m } from 'framer-motion';
import { User, Mail, Globe, MapPin, Save, ArrowLeft, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import SpotlightCard from '../components/ui/SpotlightCard';
import styles from '../styles/EditProfile.module.css';

const EditProfile = () => {
    const [formData, setFormData] = useState({
        fullName: 'Alice Doe',
        bio: 'Blockchain Enthusiast & Full Stack Developer.',
        location: 'San Francisco, CA',
        website: 'https://alicedoe.dev',
        email: 'alice@example.com'
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        // Simulate save delay
        await new Promise(r => setTimeout(r, 1500));
        setIsSaving(false);
        alert("Profile updated locally!");
    };

    return (
        <div className={`container ${styles.page}`}>
            <Link to="/dashboard" className={styles.backLink}>
                <ArrowLeft size={16} /> Back to Dashboard
            </Link>

            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <h1>Edit Profile</h1>
                    <p>Update your public decentralized identity information.</p>
                </div>

                <SpotlightCard className={styles.formCard}>
                    <form onSubmit={handleSave}>
                        {/* Avatar Section */}
                        <div className={styles.avatarSection}>
                            <div className={styles.avatarPlaceholder}>
                                <User size={48} />
                            </div>
                            <button type="button" className={styles.changePhotoBtn}>
                                <Camera size={16} /> Change Photo
                            </button>
                        </div>

                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label><User size={14} /> Full Name</label>
                                <input 
                                    type="text" 
                                    name="fullName" 
                                    value={formData.fullName} 
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label><MapPin size={14} /> Location</label>
                                <input 
                                    type="text" 
                                    name="location" 
                                    value={formData.location} 
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.formGroup} style={{gridColumn: '1 / -1'}}>
                                <label>Bio</label>
                                <textarea 
                                    name="bio" 
                                    rows="4" 
                                    value={formData.bio} 
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label><Globe size={14} /> Website</label>
                                <input 
                                    type="url" 
                                    name="website" 
                                    value={formData.website} 
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label><Mail size={14} /> Email (Private)</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={formData.email} 
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className={styles.actions}>
                            <button type="button" className={styles.cancelBtn}>Cancel</button>
                            <button type="submit" className={styles.saveBtn} disabled={isSaving}>
                                {isSaving ? 'Saving...' : <><Save size={16} /> Save Changes</>}
                            </button>
                        </div>
                    </form>
                </SpotlightCard>
            </div>
        </div>
    );
};

export default EditProfile;
