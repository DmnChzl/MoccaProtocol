import { Router } from 'solid-app-router';
import { render } from 'solid-testing-library';
import { describe, expect, it, vi } from 'vitest';
import { NavBar } from './NavBar';

vi.mock('solid-app-router', () => ({
  Router: ({ children }) => children,
  Link: ({ href, children }) => <a href={href}>{children}</a>,
  useLocation: () => ({
    pathname: '/upload'
  })
}));

describe('<NavBar />', () => {
  it('Should render all links', () => {
    const { getByText, queryByText, unmount } = render(
      <Router>
        <NavBar />
      </Router>
    );

    expect(getByText('Upload')).toBeInTheDocument();
    expect(queryByText('Network')).not.toBeInTheDocument();
    expect(queryByText('Profile')).not.toBeInTheDocument();
    unmount();
  });
});
