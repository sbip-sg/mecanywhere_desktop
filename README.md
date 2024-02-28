# MECAnywhere Desktop App

The desktop app for interacting with MECA ecosystem. Uses Electron-React Boilerplate (Electron, React, React Router, Webpack) under the hood.

### Install

1. Clone the repo and install dependencies:

    ```bash
    git clone https://github.com/sbip-sg/mec_anywhere_desktop.git
    npm install
    ```

2. Install Docker Engine at https://docs.docker.com/engine/install/.

3. Build the Task Executor's docker image with: 

    ```bash
    docker build -t meca-executor -f task_executor/docker/Dockerfile .
    ```

4. Install IPFS Kubo from https://github.com/ipfs/kubo.git

### Starting Development

1. Ensure that Docker Engine is installed and Docker Daemon is started.

2. Ensure that IPFS is installed and IPFS Daemon is started.

3. Start the app in the `dev` environment:

    ```bash
    npm start
    ```

### Packaging for Production

To package apps for the local platform (Docker Daemon require separate installation):

```bash
npm run package
```

Note:
- In Windows environments, the packaged application is output as an .exe file within the /release/build directory. It is important to highlight that, in the absence of code signing, the application may not execute as intended on distribution due to Windows security protocols.
- In Linux, the packaged app is output as an AppImage. Then, install FUSE to enable AppImage support:
  ```bash
  sudo apt update
  sudo apt install libfuse2
  ```

# Main

The main process executes the entry point script defined in the package.json (as 'main'). It manages the application's lifecycle, and has native access to desktop functionality, such as menus, dialogs, and tray icons. More specifically, the main process for this app is responsible for the following:
- Manage lifecycle events (e.g. 'ready', 'closed'. Refer to the official docs for a complete list: *https://www.electronjs.org/docs/latest/api/app*)
- Create BrowserWindows (see *Renderer* below), Menu, Tray.
- Communicating with the MECA SDK to handle task processing via sockets (see ```sdk\README.md```).
- Communicating with the Docker Daemon with Dockerode to orchestrate the execution of Task Executor containers during Node.js runtime (see ```task_executor\README.md```).
- Communicating with IPFS to upload and download tasks.
  - In Linux, the default download directory is `/home/$USER/.MECA/ipfsFiles`
  - In Windows, the default download directory is `%LOCALAPPDATA%\.MECA\ipfsFiles`
- Handle persistent storage (mnemonics, keypairs, settings etc) with electron-store and safeStorage.

### Some technical notes:
- **Native Modules**

    During npm installation, there will be a post-installation process which will rebuild the native modules. A native module is any dependency that requires compilation of C++/C for performance reasons. These modules need to be compiled on the user's system upon installation. To prevent compilation errors, by default all non-native modules need to be placed inside ```./package.json```, and all native modules in ```./release/app/package.json```. To find native modules, try:
    ```bash
    find node_modules -type f -name "*.node" 2>/dev/null | grep -v "obj\.target"
    ```
    To prevent errors on dev build, instead of importing native modules like so: 
    ```bash
    import secp256k1 from 'secp256k1';
    ```
    Try:
    ```bash
    import secp256k1 from '../../node_modules/secp256k1';
    ```

    Read more about the rationale behind native modules here:
    https://github.com/electron-react-boilerplate/electron-react-boilerplate/issues/1042

- **Inter-Process Communication**

    In general, for security purpose, Inter-process communication (IPC) is required to communicate between the main process and the renderer process. The general idea involves establishing dedicated channels for these processes to monitor. Through the use of a preload script, we can then safely expose privileged APIs to the renderer process.


- **Installation issues**

  Sometimes post installation complains about react-redux being a native module and should be in ```/release/app```. This error might only surface when doing a fresh ```npm install``` instead of doing a single ```npm install```. It could be due:
  - newly installed module(s) being a native module instead of react-redux. In this case try moving the newly added modules into /release/app and do a clean reinstall.
  - some unknown dependency issues. In this case, delete package.lock and do a clean reinstall.


- **ESM incompatiblity**

  When installing a new module and using it in main process, sometimes one might face: 
  ```bash
  Error [ERR_REQUIRE_ESM]: require() of ES Module fix-path/index.js from main.ts not supported.
  ``````
  
  My understanding is that in development, instead of using webpack (which allows usage of *import* in renderer process), electronmon is used to run Electron in the main process. (This is why we don't have a `webpack.config.main.dev.ts` but only `webpack.config.main.prod.ts`.) Under the hood, electronmon will convert all *import* to *require*. Thus if the installed module is purely ESM, the above error will pop. While Electron itself has started supporting ESM since v28, this feature is still not made compatible with this our electron-react-boilerplate at the point of writing this. One solution is to downgrade the  module, for example now we are using a downgraded version of *ipfs-http-client* v50 (commonJS) instead of v60 (ESM only).



# Renderer

Each Electron app spawns a separate renderer process for each open BrowserWindow. BrowserWindow can display web content and use web technologies like HTML, CSS, and JavaScript to build the UI of the application. There are 2 BrowserWindows in our app:
- MainWindow: Uses React and Material UI to render webpages, just like any other React projects.
- WorkerWindow: This window is hidden and is solely responsible for task processing logic.

Routes are managed under App.tsx. Each route is wrapped with a Transition component for smooth transition animation.
```bash
<Route
  path="/login"
  element={
    <Transitions>
      <Login />
    </Transitions>
  }
/>
```
Route components are grouped into multiple folders based on their purpose. Each component folder are explained in detail below.

### auth
The components here are linked to public routes, meaning they do not require authentication to view, contrary to the rest of the routes nested under PrivateRoutes in App.tsx. 

Responsible for below:
- **Account registration**: Provide a password, after which a mnemonic phrase is generated. The mnemonic phrase is used for generating a secp256k1 key pair. The key pair is originally used for creating DID and signing verifiable credential. Now it's responsible solely for creating DID. Additionally, every field required for electron-store will be initialized once account is created.
- **Login**: Requires a password to log in, which is required for logging in decrypting the private keys (encrypted with password during account registration). Note that the password is stored in electron-store. Once logged in, page redirects to Transaction Dashboard as default. 
- **Mnemonic Phrase**: The mnemonic phrase (a.k.a. seed phrase) is revealed during account registration where user is required to physically record down. User also has the option to import account when migrating to new devices by importing the mnemonic phrase instead of registering a new account (the mnemonics will be converted to DID as identification).

### transactions
To display transaction data which was fetched from full node. Future implementation require retrieving data from blockchain directly. Mainly consist of 2 components:

- **Linechart**: Visually displays transaction data in different groupby format. Allows filtering by role and by datetime.
- **Datagrid**: Displays the data in table view. Each row click leads to a Transaction Detail page, which (in the future) could lay out more details of the record. Could be expanded to full page view. 

The grouped data are derived from the *groupData* transaction pipeline (which is also used by other components like billing).

### billing
Mainly intended for viewing past (grouped) billing data in a dashboard format. Originally created when staking is a core feature. Might be defunct in the future as they are intended more for viewing grouped transaction data, whereas individual transaction data (which contains *price*) can already be viewed from Transaction Dashboard. Similarly consists of 2 components:

- **Billing Overview**: Consists of a left card summarizing the current bill to settle, and a right card showing the past 6 months of monthly billing history.
- **Billing History**: Shows past billing records.  Certain data fields, such as status and date of payment, are currently placeholders and should be integrated with a backend API in future updates.

### payment
Used for settling payments by interacting with the MECA smart contract. Currently only supports Metamask Mobile. Once the QR code is scanned and connected, the user's Metamask wallet could be accessed. Currently implemented with staking in mind, i.e. the client 'tops up' into the MECA contract before they can offload tasks into the pool. 

It carries two primary functionalities:

- **Payment**: Handles transferring ethers from user's Metamask Wallet into the MECA Smart Contract.
- **Withdrawal**: Handles withdrawing ethers from the MECA Smart Contract into the connected wallet.

Note:
- A web3 provider is required for connecting to Ethereum networks. Due to the native environment of Electron, (so far) we cannot directly use the Metamask browser extension for Ethereum interaction. Instead, we use MetaMask Mobile, which can instantiate its own provider from the MetaMask SDK for non-browser context use. 
- Technically, it is possible to inject the Metamask extension into Electron app but it requires complicated workarounds and might introduce security issues. Read more below (take note the repo mentioned in the article is no longer maintained since a few years ago):
https://medium.com/swapynetwork/integrating-metamask-with-electron-a-simple-secure-and-non-intrusive-approach-517a04da1656


### tasks
Task Management page is responsible for allowing hosts to select the tasks they are willing to download to their system and share resource to. In general, each task should go through following steps before it could be activated to share resource:

- **Download**: Install the task files to local/app/roaming (tentatively)
- **Build**: Build the task files as Docker image.
- **Run Test**: Run the built task with test input for purpose of estimating task fee.
- **Activate/Deactivate**: Allow the host to choose whether to activate the task. The host is allowed to activate as many tasks as he would like to, as long as he has sufficient storage and resource.

Currently the listed tasks are placeholders, future implementation require reading the tasks directly from blockchain.

### navigation
The main layout, which can be viewed after logging into the app, consists of the top menu bar, the left drawer, and the right drawer. We will discuss some key components below.

- **Host Sharing Widget**: Responsible for allowing host to select settings for resource allocation (e.g. number of cores and memory) as well as option whether to allocate GPU. The widget view comprises *PreSharingEnabledComponent* and *PostSharingEnabledComponent*, which are respectively responsible for the states before and after resource sharing is enabled.
- **Export Key**: Reveals the mnemonics and allows copy to clipboard. Might be removed in the future due to deprecation of ```did```
- **Light/Dark Mode**: Toggles between light and dark theme. Theming is based on Material UI and is set in ```src\renderer\utils\theme.tsx```.


### redux 
This directory contains the state management logic for the application, utilizing Redux.

To set the state using redux, use the ```actionCreators.setState()```. For example:

```bash
import actions from 'renderer/redux/actionCreators';

actions.setImportingAccount(false);
```

To read the state within a React component, use ```useSelector()```. For example:

```bash
import { useSelector } from 'react-redux';
import { RootState } from 'renderer/redux/store';

const isAuthenticated = useSelector((state: RootState) => state.userReducer.authenticated);
```

To obtain a direct snapshot of the current state from the Redux store, use ```reduxStore.getState()```. Utilize this method only if you need a one-time reading of the state, as it won't be automatically updated in response to changes by other components. For example:

```bash
import reduxStore from 'renderer/redux/store';

const dataEntry = reduxStore.getState().dataEntryReducer;
```

### services

This directory simple handles the external api calls.


## Other notes
- Use electron-store for persistent storage, redux for global state management, and React's useState() hook for component-level state.
- Under `webpack.config.base.ts`, there is an alias of react pointing to `./src/node_modules/react'`. This is because the *@metamask/sdk* introduces another instance of React, causing conflicts. The alias ensures the project uses only one instance of React. 


## To do list
- Building docker image within the downloaded task folder. This could be done with Dockerode, which is already used for other docker orchestration tasks (see *handleBuild*).
- Task testing. Docker run can be done with Dockerode as well (see *handleRunTest*).
- Fetching tasks data and transaction data from blockchain. Currently the data are still coming from the fullnode database.
- Put forward a solution for the inconvenience caused by the requirement of accessing Metamask for every blockchain call due to gas fee. 
- Potentially remove the account recovery functionality.   
