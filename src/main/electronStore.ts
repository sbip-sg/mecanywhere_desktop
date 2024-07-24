import { safeStorage } from 'electron';

const Store = require('electron-store');

const store = new Store();

export const getElectronStore = async (event, key) => {
  try {
    const keyValue = getElectronStoreFromKey(key);
    event.returnValue = keyValue;
  } catch (error) {
    console.error('Error while getting value:', error);
    event.returnValue = null;
  }
};

export const getElectronStoreFromKey = (key): string => {
  try {
    const encryptedKey = store.get(key);
    if (encryptedKey !== undefined) {
      const decryptedKey = safeStorage.decryptString(
        Buffer.from(encryptedKey, 'latin1')
      );
      return decryptedKey;
    } else {
      return "";
    }
  } catch (error) {
    console.error('Error while getting value:', error);
  }
};

export const setElectronStore = async (event, key, val) => {
  try {
    const buffer = safeStorage.encryptString(val);
    store.set(key, buffer.toString('latin1'));
  } catch (error) {
    console.log('setElectionStore Error: ', error);
  }
};

export const equalsElectronStore = async (event, key, value) => {
  const encryptedKey = store.get(key);
  if (encryptedKey !== undefined) {
    event.returnValue = safeStorage.decryptString(Buffer.from(encryptedKey, 'latin1')) === value;
  } else {
    event.returnValue = false;
  }
};
