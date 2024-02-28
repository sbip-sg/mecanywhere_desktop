const hasBeenDownloaded = async (cid: string) => {
  // const taskList = JSON.parse(window.electron.store.get('taskList'));
  // return taskList.downloaded.includes(taskName);
  const folderExists = await window.electron.checkFolderExists(cid)
  console.log("folderExists", folderExists)
  return folderExists
};

const addToBuilt = (taskName: string) => {
  const taskList = JSON.parse(window.electron.store.get('taskList'));
  if (!taskList.built.includes(taskName)) {
    taskList.built.push(taskName);
    window.electron.store.set('taskList', JSON.stringify(taskList));
  }
};

const removeFromBuilt = (taskName: string) => {
  const taskList = JSON.parse(window.electron.store.get('taskList'));
  taskList.built = taskList.built.filter((name: string) => name !== taskName);
  window.electron.store.set('taskList', JSON.stringify(taskList));
};

const hasBeenBuilt = (taskName: string) => {
  const taskList = JSON.parse(window.electron.store.get('taskList'));
  return taskList.built.includes(taskName);
};

const addToTested = (taskName: string) => {
  const taskList = JSON.parse(window.electron.store.get('taskList'));
  if (!taskList.tested.includes(taskName)) {
    taskList.tested.push(taskName);
    window.electron.store.set('taskList', JSON.stringify(taskList));
  }
};

const removeFromTested = (taskName: string) => {
  const taskList = JSON.parse(window.electron.store.get('taskList'));
  taskList.tested = taskList.tested.filter((name: string) => name !== taskName);
  window.electron.store.set('taskList', JSON.stringify(taskList));
};

const hasBeenTested = (taskName: string) => {
  const taskList = JSON.parse(window.electron.store.get('taskList'));
  return taskList.tested.includes(taskName);
};

const addToActivated = (taskName: string) => {
  const taskList = JSON.parse(window.electron.store.get('taskList'));
  if (!taskList.activated.includes(taskName)) {
    taskList.activated.push(taskName);
    window.electron.store.set('taskList', JSON.stringify(taskList));
  }
};

const removeFromActivated = (taskName: string) => {
  const taskList = JSON.parse(window.electron.store.get('taskList'));
  taskList.activated = taskList.activated.filter(
    (name: string) => name !== taskName
  );
  window.electron.store.set('taskList', JSON.stringify(taskList));
};

const hasBeenActivated = (taskName: string) => {
  const taskList = JSON.parse(window.electron.store.get('taskList'));
  return taskList.activated.includes(taskName);
};

export {
  hasBeenDownloaded,
  addToBuilt,
  removeFromBuilt,
  hasBeenBuilt,
  addToTested,
  removeFromTested,
  hasBeenTested,
  addToActivated,
  removeFromActivated,
  hasBeenActivated,
};
