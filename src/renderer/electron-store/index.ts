const deleteAccount = () => {
  window.electron.store.set('publicKey-wallet', '');
  window.electron.store.set('privateKey-wallet', '');
  window.electron.store.set('mnemonic', '');
  window.electron.store.set('publicKey', '');
  window.electron.store.set('privateKey', '');
  window.electron.store.set('did-temp', window.electron.store.get('did'));
  window.electron.store.set('credential-temp', window.electron.store.get('credential'));
  window.electron.store.set('did', '');
  window.electron.store.set('credential', '');
  window.electron.store.set('role', '');
};

export default deleteAccount;
