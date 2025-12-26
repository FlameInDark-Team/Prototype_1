import React, { createContext, useContext, useState, useEffect } from 'react';
import { ipfsService } from '../utils/mockIPFS';

const BlockchainContext = createContext();


export const useBlockchain = () => useContext(BlockchainContext);

export const BlockchainProvider = ({ children }) => {
  const [account, setAccount] = useState(null); 
  const [role, setRole] = useState('guest'); 
  const [loading, setLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const [systemMetrics, setSystemMetrics] = useState({
    activeUsers: 89,
    txPerHour: 12,
    ipfsSuccess: 99.8,
    avgGas: 0.0022,
    latestBlock: 19234567
  });

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Welcome to AcadChain', message: 'Your decentralized academic identity wallet is ready.', type: 'info', time: 1735163000000 }
  ]);

  const addNotification = (title, message, type = 'info') => {
    setNotifications(prev => [{
      id: Date.now(),
      title,
      message,
      type,
      time: Date.now()
    }, ...prev].slice(0, 10));
  };


  const [credentials, setCredentials] = useState(() => {
    const saved = localStorage.getItem('chain_credentials');
    return saved ? JSON.parse(saved) : {}; 
  });
  
  const [authorizedIssuers, setAuthorizedIssuers] = useState(() => {
    const saved = localStorage.getItem('chain_issuers');
    return saved ? JSON.parse(saved) : {
      '0x123...UNIVERSITY': { name: 'University of Technology', authorized: true } 
    };
  });

  useEffect(() => {
    localStorage.setItem('chain_credentials', JSON.stringify(credentials));
  }, [credentials]);

  useEffect(() => {
    localStorage.setItem('chain_issuers', JSON.stringify(authorizedIssuers));
  }, [authorizedIssuers]);

  const [ipfsProgress, setIpfsProgress] = useState(0);

  // --- Wallet Connection (Mock) ---
  const connectWallet = async (selectedRole = 'student') => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    

    let mockAddr = "";
    if (selectedRole === 'university') mockAddr = "0x123...UNIVERSITY";
    else if (selectedRole === 'government') mockAddr = "0x999...GOV";
    else if (selectedRole === 'admin') mockAddr = "0xADM...111";
    else mockAddr = "0xABC...STUDENT";

    setAccount(mockAddr);
    setRole(selectedRole);
    setLoading(false);
  };

  const disconnectWallet = () => {
    setAccount(null);
    setRole('guest');
  };

  const togglePause = () => {
    if (role !== 'admin') throw new Error("Unauthorized: Only SuperAdmin can pause the contract.");
    setIsPaused(prev => !prev);
  };



  const issueCredential = async (studentDID, studentName, courseName, fileData) => {
    if (isPaused) throw new Error("Contract is currently paused by SuperAdmin.");
    if (role !== 'university' || !authorizedIssuers[account]?.authorized) {
      throw new Error("Unauthorized: Only authorized universities can issue credentials.");
    }

    setLoading(true);
    setIpfsProgress(0);
    try {
      setIpfsProgress(10);
      await new Promise(r => setTimeout(r, 200));
      setIpfsProgress(40);
      
      const { cid, hash } = await ipfsService.upload({
        studentDID, studentName, courseName, fileData, timestamp: Date.now()
      });
      
      setIpfsProgress(80);
      await new Promise(r => setTimeout(r, 300));


      const newCred = {
        issuer: account,
        studentDID,
        hash,
        ipfsCID: cid,
        timestamp: Date.now(),
        isValid: true
      };

      setCredentials(prev => ({
        ...prev,
        [hash]: newCred
      }));

      setIpfsProgress(100);
      await new Promise(r => setTimeout(r, 200));
      setLoading(false);
      return { hash, cid };
    } catch (e) {
      setLoading(false);
      setIpfsProgress(0);
      throw e;
    }
  };

  const batchIssueCredentials = async (records) => {
    if (role !== 'university') throw new Error("Unauthorized");
    setLoading(true);
    const results = [];
    for (const record of records) {
      const res = await issueCredential(record.did, record.name, record.course, null);
      results.push(res);
    }
    setLoading(false);
    return results;
  };

  const verifyCredential = async (hashOrId) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    setLoading(false);

    const cred = credentials[hashOrId];
    if (!cred) return { valid: false, message: "Credential hash not found in registry." };
    if (!cred.isValid) return { valid: false, message: "Credential has been revoked by issuer." };


    const ipfsData = await ipfsService.fetch(cred.ipfsCID);
    
    return { 
      valid: true, 
      record: cred, 
      data: ipfsData,
      issuerName: authorizedIssuers[cred.issuer]?.name || "Unknown Issuer"
    };
  };

  const batchVerifyCredentials = async (hashes) => {
    setLoading(true);
    const results = await Promise.all(hashes.map(h => verifyCredential(h)));
    setLoading(false);
    return results;
  };

  const revokeCredential = async (hash) => {
    if (isPaused) throw new Error("Contract is currently paused.");
    if (role !== 'university' && role !== 'government') throw new Error("Unauthorized");
    
    setCredentials(prev => ({
      ...prev,
      [hash]: { ...prev[hash], isValid: false }
    }));
  };

  const authorizeIssuer = async (address, name) => {
    if (isPaused) throw new Error("Contract is currently paused.");
    if (role !== 'government') throw new Error("Only Government can authorize issuers");
    
    setAuthorizedIssuers(prev => ({
      ...prev,
      [address]: { name, authorized: true }
    }));
  };


  const getMyCredentials = () => {
    return Object.values(credentials).filter(c => c.studentDID === account);
  };
  
  const getIssuedCredentials = () => {
    return Object.values(credentials).filter(c => c.issuer === account);
  };

  const getAllIssuers = () => authorizedIssuers;

  return (
    <BlockchainContext.Provider value={{
      account,
      role,
      loading,
      ipfsProgress,
      isPaused,
      systemMetrics,
      notifications,
      addNotification,
      togglePause,
      setSystemMetrics,
      connectWallet,
      disconnectWallet,
      issueCredential,
      batchIssueCredentials,
      verifyCredential,
      batchVerifyCredentials,
      revokeCredential,
      authorizeIssuer,
      getMyCredentials,
      getIssuedCredentials,
      getAllIssuers
    }}>
      {children}
    </BlockchainContext.Provider>
  );
};
