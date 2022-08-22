import { Router } from 'solid-app-router';
import { render } from 'solid-js/web';
import { App } from './App';
import { AppProvider } from './AppContext';
import './index.css';

render(
  () => (
    <Router>
      <AppProvider>
        <App />
      </AppProvider>
    </Router>
  ),
  document.getElementById('root') as HTMLElement
);
