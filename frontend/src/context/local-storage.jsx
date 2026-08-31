import CryptoJS from "crypto-js";

const getKey = () => {
  const rawKey =
    import.meta.env.VITE_LOCAL_STORAGE_KEY ||
    "fb005ea0442d18ffa7617d8ef587c4ed6ed38ad553dd70437c1bb5360f068ffe";
  return rawKey;
};

export const setDataInLocalStorage = (data) => {
  try {
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      getKey()
    ).toString();
    localStorage.setItem("client_session_data", encryptedData);
  } catch (error) {
    console.error("Error encrypting data:", error);
  }
};

export const modifyEncryptedData = (modificationFunction) => {
  try {
    const encryptedData = localStorage.getItem("client_session_data");
    if (encryptedData) {
      const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, getKey());
      const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
      const modifiedData = modificationFunction(decryptedData);
      const reEncryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(modifiedData),
        getKey()
      ).toString();
      localStorage.setItem("client_session_data", reEncryptedData);
    }
  } catch (error) {
    console.error("Error modifying encrypted data:", error);
  }
};

export const decryptUserData = () => {
  const encryptedData = localStorage.getItem("client_session_data");
  if (encryptedData) {
    try {
      const bytesData = CryptoJS.AES.decrypt(encryptedData, getKey());
      const decryptedData = bytesData.toString(CryptoJS.enc.Utf8);
      if (decryptedData) {
        return JSON.parse(decryptedData);
      }
    } catch (error) {
      console.error("Error decrypting or parsing data:", error);
    }
  }
  return null;
};
