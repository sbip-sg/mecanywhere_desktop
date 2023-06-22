import {render, fireEvent, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Login from './Login'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import reduxStore from 'renderer/redux/store';
import * as router from 'react-router'
const MockLogin = () => {
  return (
    <Provider store={reduxStore}>
      <BrowserRouter>
          <Login />
      </BrowserRouter>
    </Provider>
  )
}
  
jest.mock('./handleLogin', () => {
  return jest.fn().mockImplementation((password) => {
    return Promise.resolve(password === 'correctPassword');
  });
});

describe('Login Page', () => {
  beforeEach(() => {
    // Any setup or configuration needed before each test
  });

  afterEach(() => {
    // Any cleanup or reset needed after each test
  });

  test('renders login page with required elements', () => {
    render(<MockLogin />);
    const logInHeading = screen.getByRole("heading", { name: /LOG IN/i});
    const passwordInput = screen.getByPlaceholderText(/password/i);    
    const logInButton = screen.getByRole("button", { name: /LOG IN/i});
    const createAccountButton = screen.getByRole("button", {name: /CREATE ACCOUNT/i});
    expect(logInHeading).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(logInButton).toBeInTheDocument();
    expect(createAccountButton).toBeInTheDocument();
  });

  test('displays error when password is too short', async () => {
    render(<MockLogin />);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    fireEvent.change(passwordInput, { target: { value: '12345' } });
    fireEvent.blur(passwordInput);
    await waitFor(() => {
      expect(screen.getByText(/too short/i)).toBeInTheDocument()
    });
  });

  test('displays error when password is too long', async () => {
    render(<MockLogin />);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    fireEvent.change(passwordInput, { target: { value: '123456789012345678901' } });
    fireEvent.blur(passwordInput);
    await waitFor(() => {
      expect(screen.getByText(/too long/i)).toBeInTheDocument()
    });
  });

  test('should display error dialog on incorrect password', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(router, 'useNavigate').mockReturnValue(mockNavigate);
    render(<MockLogin />);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'incorrectPassword' } });
    const logInButton = screen.getByRole("button", { name: /LOG IN/i });
    fireEvent.click(logInButton);
    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
      const errorDialog = screen.getByRole('dialog');
      expect(errorDialog).toBeInTheDocument();
    });
  });

  test('should navigate to another page on correct password', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(router, 'useNavigate').mockReturnValue(mockNavigate);
    render(<MockLogin />);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'correctPassword' } });
    const logInButton = screen.getByRole("button", { name: /LOG IN/i});
    fireEvent.click(logInButton);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/userjobsubmission');
    });
  });

  test('should navigate to /register when Create Account button is clicked', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(router, 'useNavigate').mockReturnValue(mockNavigate);
    render(<MockLogin />);
    const createAccountButton = screen.getByRole("button", { name: /CREATE ACCOUNT/i });
    fireEvent.click(createAccountButton);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/register');
    });
  });

});