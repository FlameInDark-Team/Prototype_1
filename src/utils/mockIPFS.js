
const simpleHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; 
    }
    return Math.abs(hash).toString(16);
};

export const ipfsService = {

  upload: async (data) => {
    console.log("[IPFS] Uploading data...", data);
    

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const jsonString = JSON.stringify(data);
    const mockHash = "0x" + simpleHash(jsonString + Date.now()).padStart(64, '0');
    const mockCID = "Qm" + simpleHash(jsonString).repeat(4).substring(0, 44);

    const storageKey = `ipfs_${mockCID}`;
    localStorage.setItem(storageKey, jsonString);

    return {
      cid: mockCID,
      hash: mockHash,
      url: `https://fake-ipfs.io/ipfs/${mockCID}`
    };
  },


  fetch: async (cid) => {
    console.log("[IPFS] Fetching CID:", cid);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const data = localStorage.getItem(`ipfs_${cid}`);
    if (!data) throw new Error("Content not found on IPFS");
    
    return JSON.parse(data);
  }
};
