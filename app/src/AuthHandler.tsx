import { useNavigate } from 'solid-app-router';
import { createEffect } from 'solid-js';
import { useAppContext } from './AppContext';

// Authentication wrapper
export const AuthHandler = ({ children }) => {
  const [{ currentJwt, peerInfo }] = useAppContext();
  const navigate = useNavigate();

  /**
   * If the 'currentJwt' + 'ipAddress' doesn't exist in the context,
   * that's to say the user is disconnected (redirect)
   */
  createEffect(() => {
    if (!currentJwt() || !peerInfo().ipAddress) {
      navigate('/login');
    }
  });

  return children;
};
