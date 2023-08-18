import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import reduxStore from 'renderer/redux/store';
import * as router from 'react-router';
import Register from './Register';

const MockRegister = () => {
  return (
    <Provider store={reduxStore}>
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    </Provider>
  );
};

// Mock the Electron store
const electronMock = {
  store: {
    get: jest.fn(),
  },
};

Object.defineProperty(window, 'electron', {
  value: electronMock,
});

jest.mock('./handleAccountRegistration', () => {
  return jest.fn().mockImplementation(() => {
    return Promise.resolve(true);
  });
});

describe('Register Page', () => {
  beforeEach(() => {
    // Any setup or configuration needed before each test
  });

  afterEach(() => {
    // Any cleanup or reset needed after each test
  });

  test('renders register page with required elements', () => {
    render(<MockRegister />);
    const createAccountHeading = screen.getByRole('heading', {
      name: /CREATE ACCOUNT/i,
    });
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const createAccountButton = screen.getByRole('button', {
      name: /CREATE ACCOUNT/i,
    });
    const backButton = screen.getByRole('button', { name: /BACK/i });
    expect(createAccountHeading).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(createAccountButton).toBeInTheDocument();
    expect(backButton).toBeInTheDocument();
  });

  test('displays error when password is too short', async () => {
    render(<MockRegister />);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    fireEvent.change(passwordInput, { target: { value: '12345' } });
    fireEvent.blur(passwordInput);
    await waitFor(() => {
      expect(screen.getByText(/too short/i)).toBeInTheDocument();
    });
  });

  test('displays error when password is too long', async () => {
    render(<MockRegister />);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    fireEvent.change(passwordInput, {
      target: { value: '123456789012345678901' },
    });
    fireEvent.blur(passwordInput);
    await waitFor(() => {
      expect(screen.getByText(/too long/i)).toBeInTheDocument();
    });
  });

  test('should navigate to /login when Back button is clicked', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(router, 'useNavigate').mockReturnValue(mockNavigate);
    render(<MockRegister />);
    const backButton = screen.getByRole('button', { name: /BACK/i });
    fireEvent.click(backButton);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('should navigate to /mnemonics when Create Account button is clicked', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(router, 'useNavigate').mockReturnValue(mockNavigate);
    render(<MockRegister />);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'correctPassword' } });
    const createAccountButton = screen.getByRole('button', {
      name: /CREATE ACCOUNT/i,
    });
    fireEvent.click(createAccountButton);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/mnemonics');
    });
  });
});
