import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import { createStore, combineReducers } from 'redux';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { accountUserReducer, AccountUserState } from 'renderer/redux/reducers';
import { MenuComponent } from './menu';
import NavBar from './NavigationLayout';

interface MockMenuComponentProps {
  userAccessToken: string;
  hostAccessToken: string;
}

const initialAccountUserState: AccountUserState = {
  publicKey: '',
  did: '',
  authenticated: false,
  userAccessToken: '',
  hostAccessToken: '',
};

const MockNavbar = () => {
  const AccountUserState: AccountUserState = {
    ...initialAccountUserState,
    authenticated: true,
  };
  const rootReducer = combineReducers({
    accountUser: accountUserReducer,
  });
  const mockStore = createStore(rootReducer, { accountUser: AccountUserState });
  return (
    <Provider store={mockStore}>
      <BrowserRouter>
        <NavBar>
          <h1>Children</h1>
        </NavBar>
      </BrowserRouter>
    </Provider>
  );
};

const MockMenuComponent: React.FC<MockMenuComponentProps> = ({
  userAccessToken,
  hostAccessToken,
}) => {
  const accountUserState: AccountUserState = {
    ...initialAccountUserState,
    userAccessToken,
    hostAccessToken,
  };
  const rootReducer = combineReducers({
    accountUser: accountUserReducer,
  });
  const mockStore = createStore(rootReducer, { accountUser: accountUserState });
  return (
    <Provider store={mockStore}>
      <BrowserRouter>
        <MenuComponent />
      </BrowserRouter>
    </Provider>
  );
};

describe('Nav Bar', () => {
  beforeEach(() => {});

  afterEach(() => {});

  test('drawer component renders with required elements', () => {
    render(<MockNavbar />);
    const userExpandButton = screen.getByRole('button', { name: /USER/i });
    const hostExpandButton = screen.getByRole('button', { name: /HOST/i });
    const accountExpandButton = screen.getByRole('button', {
      name: /account/i,
    });
    fireEvent.click(userExpandButton); // click on expand button
    fireEvent.click(hostExpandButton);
    fireEvent.click(accountExpandButton);
    const jobSubmissionButton = screen.getByRole('button', {
      name: /Job Submission/i,
    });
    const dashboardButton = screen.getAllByText('Dashboard');
    const profileButton = screen.getByRole('button', { name: /Profile/i });
    const billingInformationButton = screen.getByRole('button', {
      name: /Billing Information/i,
    });
    const supportButton = screen.getByRole('button', { name: /Support/i });
    expect(userExpandButton).toBeInTheDocument();
    expect(hostExpandButton).toBeInTheDocument();
    expect(accountExpandButton).toBeInTheDocument();
    expect(jobSubmissionButton).toBeInTheDocument();
    expect(profileButton).toBeInTheDocument();
    expect(billingInformationButton).toBeInTheDocument();
    expect(supportButton).toBeInTheDocument();
    expect(dashboardButton).toHaveLength(2);
  });

  test('renders correct icon when isClient is true', () => {
    render(<MockMenuComponent userAccessToken="test" hostAccessToken="" />);
    const iconButton = screen.getByRole('button', { name: /role-icon/i });
    fireEvent.click(iconButton);
    expect(iconButton).toBeInTheDocument();
    expect(
      screen.getByText(/(^|\b)Registered as client(\b|$)/)
    ).toBeInTheDocument();
    expect(screen.getByTestId('Deregister as Client')).toBeInTheDocument();
    expect(screen.getByTestId('Register as Host')).toBeInTheDocument();
  });

  test('renders correct icon when isHost is true', () => {
    render(<MockMenuComponent userAccessToken="" hostAccessToken="test" />);
    const iconButton = screen.getByRole('button');
    fireEvent.click(iconButton);
    expect(iconButton).toBeInTheDocument();
    expect(
      screen.getByText(/(^|\b)Registered as host(\b|$)/)
    ).toBeInTheDocument();
    expect(screen.getByTestId('Register as Client')).toBeInTheDocument();
    expect(screen.getByTestId('Deregister as Host')).toBeInTheDocument();
  });

  test('renders correct icon when both isClient and isHost is true', () => {
    render(<MockMenuComponent userAccessToken="test" hostAccessToken="test" />);
    const iconButton = screen.getByRole('button');
    fireEvent.click(iconButton);
    expect(iconButton).toBeInTheDocument();
    expect(
      screen.getByText(/(^|\b)Registered as both client and host(\b|$)/)
    ).toBeInTheDocument();
    expect(screen.getByTestId('Deregister as Client')).toBeInTheDocument();
    expect(screen.getByTestId('Deregister as Host')).toBeInTheDocument();
  });

  test('renders correct icon when both isClient and isHost is false', () => {
    render(<MockMenuComponent userAccessToken="" hostAccessToken="" />);
    const iconButton = screen.getByRole('button');
    fireEvent.click(iconButton);
    expect(iconButton).toBeInTheDocument();
    expect(
      screen.getByText(/(^|\b)Currently not registered(\b|$)/)
    ).toBeInTheDocument();
    expect(screen.getByTestId('Register as Client')).toBeInTheDocument();
    expect(screen.getByTestId('Register as Host')).toBeInTheDocument();
  });
});
