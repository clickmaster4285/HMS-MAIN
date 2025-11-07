import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, clearError } from '../../features/auth/authSlice';
import login_back from '../../assets/images/login_back.jpg';
import { toast } from 'react-toastify';

const Login = () => {
  const [emailOrIdentifier, setEmailOrIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector((state) => state.auth.status);
  const error = useSelector((state) => state.auth.error);

  // Clear errors when component mounts or when inputs change
  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [emailOrIdentifier, password, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resultAction = await dispatch(
      loginUser({
        email: emailOrIdentifier,
        identifier: emailOrIdentifier,
        password
      })
    );

    if (loginUser.fulfilled.match(resultAction)) {
      const userRole = resultAction.payload.user.user_Access;
      toast.success('Login successful!');
      navigate(`/${userRole.toLowerCase()}/dashboard`);
    } else if (loginUser.rejected.match(resultAction)) {
      // Handle specific error cases with the full error object
      const errorPayload = resultAction.payload;

      if (errorPayload?.status === 403) {
        // User account is deleted
        toast.error(errorPayload.message || 'Your account has been deactivated. Please contact administrator.');
      } else if (errorPayload?.status === 401) {
        // Email not verified
        toast.error(errorPayload.message || 'Please verify your email before logging in.');
      } else if (errorPayload?.status === 404) {
        // User not found
        toast.error('Invalid credentials. Please check your email/identifier and password.');
      } else if (errorPayload?.status === 400) {
        // Invalid credentials
        toast.error('Invalid credentials. Please check your email/identifier and password.');
      } else {
        // Generic error
        toast.error(errorPayload?.message || 'Login failed. Please try again.');
      }
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center pl-40 bg-gray-100"
      style={{
        backgroundImage: `url(${login_back})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full max-w-md p-8 bg-white bg-opacity-80 shadow-lg rounded-3xl border border-gray-300">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Welcome Back</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email or Identifier
            </label>
            <input
              type="text"
              id="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter your email or ID"
              required
              value={emailOrIdentifier}
              onChange={(e) => setEmailOrIdentifier(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-primary-600 hover:underline focus:outline-none">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-primary-500 text-white font-semibold rounded-lg shadow-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="#" onClick={() => navigate('/signup')} className="text-primary-600 font-medium hover:underline focus:outline-none">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;