import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import supabase from '../supabase';

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getSessionFromUrl();

      if (error) {
        console.error('Error confirming email:', error.message);
        return;
      }

      // Get redirect param or default to /admin
      const params = new URLSearchParams(location.search);
      const redirect = params.get('redirect') || '/admin';

      if (data?.session) {
        navigate(redirect);
      }
    })();
  }, [navigate, location]);

  return <div>Confirming your email...</div>;
}
