import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuthCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginUser } = useAuth();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const name = searchParams.get('name');
    const email = searchParams.get('email');

    if (accessToken && refreshToken) {
      loginUser(accessToken, refreshToken, { name, email });
      navigate('/trails');
    } else {
      navigate('/login');
    }
  }, []);

  return (
    <div className="min-h-screen bg-summit-light flex items-center justify-center">
      <div className="text-center">
        <span className="text-6xl">⛰️</span>
        <p className="mt-4 text-summit-primary font-semibold text-lg">
          Signing you in...
        </p>
      </div>
    </div>
  );
};

export default OAuthCallbackPage;