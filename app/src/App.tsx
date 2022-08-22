import { Navigate, Route, Routes } from 'solid-app-router';
import { useAppContext } from './AppContext';
import { AuthHandler } from './AuthHandler';
import { ModalWrapper } from './ModalWrapper';
import { BlockDetail } from './views/BlockDetail';
import { ChainView } from './views/ChainView';
import { InfoView } from './views/InfoView';
import { ListView } from './views/ListView';
import { LoginView } from './views/LoginView';
import { NavBar } from './views/NavBar';
import { UploadView } from './views/UploadView';

export const App = () => {
  const [{ currentJwt, peerInfo }] = useAppContext();

  return (
    <div class="flex flex-col h-screen">
      <Routes>
        <Route path="/">
          <Navigate href="/upload" />
        </Route>

        <Route
          path="/login"
          element={
            <ModalWrapper>{props => <LoginView {...props} />}</ModalWrapper>
          }
        />

        <Route
          path="/upload"
          element={
            <AuthHandler>
              <UploadView />
            </AuthHandler>
          }
        />

        <Route
          path="/network"
          element={
            <AuthHandler>
              <ModalWrapper>{props => <ListView {...props} />}</ModalWrapper>
            </AuthHandler>
          }
        />

        <Route
          path="/info"
          element={
            <AuthHandler>
              <ModalWrapper>{props => <InfoView {...props} />}</ModalWrapper>
            </AuthHandler>
          }
        />

        <Route
          path="/chain"
          element={
            <AuthHandler>
              <ChainView />
            </AuthHandler>
          }
        />

        <Route
          path="/block/:id"
          element={
            <AuthHandler>
              <BlockDetail />
            </AuthHandler>
          }
        />
      </Routes>

      {currentJwt() && peerInfo().ipAddress && <NavBar />}
    </div>
  );
};
