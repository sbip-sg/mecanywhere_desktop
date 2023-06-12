import {render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { createStore, Store } from 'redux';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import CustomDropDownMenu from './CustomDropDownMenu'
import reduxStore from 'renderer/redux/store';
import { accountUserReducer, AccountUserState } from 'renderer/redux/reducers';
import NavBar from './NavBar';
import { combineReducers } from 'redux';

const MockNavbar = () => {
    return (
      <Provider store={reduxStore}>
        <BrowserRouter>
            <NavBar>
              <h1>Children</h1>
            </NavBar>
        </BrowserRouter>
      </Provider>
    )
}

const rootReducer = combineReducers({
    accountUser: accountUserReducer,
});

const initialAccountUserState: AccountUserState = {
    publicKey: '',
    did: '',
    authenticated: false,
    userAccessToken: '', // Set userAccessToken to your desired string value
    hostAccessToken: '',
};

const MockCustomDropDownMenu: React.FC<{ mockStore: Store<{ accountUser: AccountUserState }> }> = ({ mockStore }) => {
    return (
      <Provider store={mockStore}>
        <BrowserRouter>
          <CustomDropDownMenu />
        </BrowserRouter>
      </Provider>
    );
  };


describe('Nav Bar', () => {
  beforeEach(() => {
    // (useSelector as jest.Mock).mockReset();
  });

  afterEach(() => {
  });

  test('vertical navbar renders with required elements', () => {
    render(<MockNavbar />);
    const userExpandButton = screen.getByRole("button", { name: /USER/i});
    const hostExpandButton = screen.getByRole("button", { name: /HOST/i});
    const accountExpandButton = screen.getByRole("button", { name: /account/i});
    // click on expand button
    fireEvent.click(userExpandButton);
    fireEvent.click(hostExpandButton);
    fireEvent.click(accountExpandButton);
    const jobSubmissionButton = screen.getByRole("button", { name: /Job Submission/i});
    const dashboardButton = screen.getAllByText('Dashboard');
    const profileButton = screen.getByRole("button", { name: /Profile/i});
    const billingInformationButton = screen.getByRole("button", { name: /Billing Information/i});
    const supportButton = screen.getByRole("button", { name: /Support/i});
    expect(userExpandButton).toBeInTheDocument();
    expect(hostExpandButton).toBeInTheDocument();
    expect(accountExpandButton).toBeInTheDocument();
    expect(jobSubmissionButton).toBeInTheDocument();
    expect(profileButton).toBeInTheDocument();
    expect(billingInformationButton).toBeInTheDocument();
    expect(supportButton).toBeInTheDocument();
    expect(dashboardButton).toHaveLength(2);
  });

    test('renders host icon when isClient is true', () => {
        const AccountUserStateWithUserAccessToken: AccountUserState = {
            ...initialAccountUserState,
            userAccessToken: 'test',
        };
        const mockStore = createStore(rootReducer, { accountUser: AccountUserStateWithUserAccessToken });
        render(<MockCustomDropDownMenu mockStore={mockStore}/>);
        const iconButton = screen.getByRole("button")
        fireEvent.click(iconButton)
        expect(iconButton).toBeInTheDocument();
        expect(screen.getByText(/(^|\b)Registered as client(\b|$)/)).toBeInTheDocument();
        expect(screen.getByTestId('Deregister as Client')).toBeInTheDocument();
        expect(screen.getByTestId('Register as Host')).toBeInTheDocument();

    });

    test('renders host icon when isHost is true', () => {
        const AccountUserStateWithHostAccessToken: AccountUserState = {
            ...initialAccountUserState,
            hostAccessToken: 'test',
        };
        const mockStore = createStore(rootReducer, { accountUser: AccountUserStateWithHostAccessToken });
        render(<MockCustomDropDownMenu mockStore={mockStore}/>);
        const iconButton = screen.getByRole("button")
        fireEvent.click(iconButton)
        expect(iconButton).toBeInTheDocument();
        expect(screen.getByText(/(^|\b)Registered as host(\b|$)/)).toBeInTheDocument();
        expect(screen.getByTestId('Register as Client')).toBeInTheDocument();
        expect(screen.getByTestId('Deregister as Host')).toBeInTheDocument();
    });

    test('renders host icon when both isClient and isHost is true', () => {
        const AccountUserStateWithUserAndHostAccessToken: AccountUserState = {
            ...initialAccountUserState,
            userAccessToken: 'test', 
            hostAccessToken: 'test', 
        };
        const mockStore = createStore(rootReducer, { accountUser: AccountUserStateWithUserAndHostAccessToken });
        render(<MockCustomDropDownMenu mockStore={mockStore}/>);
        const iconButton = screen.getByRole("button")
        fireEvent.click(iconButton)
        expect(iconButton).toBeInTheDocument();
        expect(screen.getByText(/(^|\b)Registered as both client and host(\b|$)/)).toBeInTheDocument();
        expect(screen.getByTestId('Deregister as Client')).toBeInTheDocument();
        expect(screen.getByTestId('Deregister as Host')).toBeInTheDocument();
    });

    test('renders host icon when both isClient and isHost is false', () => {
        const mockStore = createStore(rootReducer, { accountUser: initialAccountUserState });
        render(<MockCustomDropDownMenu mockStore={mockStore}/>);
        const iconButton = screen.getByRole("button")
        fireEvent.click(iconButton)
        expect(iconButton).toBeInTheDocument();
        expect(screen.getByText(/(^|\b)Currently not registered(\b|$)/)).toBeInTheDocument();
        expect(screen.getByTestId('Register as Client')).toBeInTheDocument();
        expect(screen.getByTestId('Register as Host')).toBeInTheDocument();
    });
});