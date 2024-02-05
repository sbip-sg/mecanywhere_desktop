import { safeStorage } from 'electron';

const Store = require('electron-store');

const store = new Store();

export const getElectronStore = async (event, key) => {
  try {
    const encryptedKey = store.get(key);
    if (encryptedKey !== undefined) {
      const decryptedKey = safeStorage.decryptString(
        Buffer.from(encryptedKey, 'latin1')
      );
      event.returnValue = decryptedKey;
    } else {
      event.returnValue = null;
    }
  } catch (error) {
    console.error('Error while getting value:', error);
    event.returnValue = null;
  }
};

export const setElectronStore = async (event, key, val) => {
  const buffer = safeStorage.encryptString(val);
  store.set(key, buffer.toString('latin1'));
};
