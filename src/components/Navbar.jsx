import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Wallet, Shield, Building, Menu, X, User, Bell } from 'lucide-react';
import { useBlockchain } from '../contexts/BlockchainContext';
import NotificationCenter from './NotificationCenter';
import { HoverEffect } from './ui/HoverEffect';
import styles from './Navbar.module.css';

const Navbar = () => {
    const { account, role, connectWallet, disconnectWallet } = useBlockchain();
    const [isOpen, setIsOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const { notifications } = useBlockchain();

    const links = [
        { path: '/', label: 'Home' },
        { path: '/verifier', label: 'Verify Credential' },
    ];

    if (role === 'student' || role === 'guest') links.push({ path: '/student', label: 'Student' });
    if (role === 'university' || role === 'guest') links.push({ path: '/university', label: 'University' });
    if (role === 'government' || role === 'guest') links.push({ path: '/government', label: 'Government' });

    const handleLogin = () => {
        // For demo, we just toggle a simple role selection or default to student
        // In reality, this would open a modal
        connectWallet('student');
    };

    return (
        <nav className={styles.navbar}>
            <div className={`container ${styles.navContainer}`}>
                <Link to="/" className={styles.logo}>
                    <Shield className={styles.logoIcon} />
                    <span>AcadChain</span>
                </Link>

                <div className={styles.desktopMenu}>
                    <HoverEffect 
                        items={links.map(link => ({
                            title: link.label,
                            link: link.path
                        }))}
                        className={styles.hoverMenu}
                    />
                </div>

                <div className={styles.actions}>
                    {account ? (
                        <div className={styles.walletBadge} onClick={disconnectWallet}>
                            <User size={16} />
                            <span>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
                            <span className={styles.address}>{account.slice(0,6)}...</span>
                        </div>
                    ) : (
                        <button className={styles.connectBtn} onClick={handleLogin}>
                            <Wallet size={16} />
                            Connect Wallet
                        </button>
                    )}

                    <div className={styles.notifWrapper} onClick={() => setIsNotifOpen(true)}>
                        <Bell size={20} className={styles.notifIcon} />
                        {notifications.length > 0 && <span className={styles.notifBadge}>{notifications.length}</span>}
                    </div>
                    
                    <button className={styles.mobileToggle} onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <Motion.div 
                        className={styles.mobileMenu}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                    >
                        {links.map(link => (
                            <Link 
                                key={link.path} 
                                to={link.path} 
                                className={styles.mobileLink}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </Motion.div>
                )}
            </AnimatePresence>

            <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
        </nav>
    );
};

export default Navbar;
