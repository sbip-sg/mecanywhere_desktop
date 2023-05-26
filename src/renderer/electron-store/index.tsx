export const deleteAccount = () => {
  window.electron.store.set('publicKey-wallet', '');
  window.electron.store.set('privateKey-wallet', '');
  window.electron.store.set('mnemonic', '');
  window.electron.store.set('publicKey', '');
  window.electron.store.set('privateKey', '');
  window.electron.store.set('did', '');
  window.electron.store.set('credential', '');
};
