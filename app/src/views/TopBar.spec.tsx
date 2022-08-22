import { Router } from 'solid-app-router';
import { fireEvent, render } from 'solid-testing-library';
import { describe, expect, it, vi } from 'vitest';
import { TopBar } from './TopBar';

describe('<TopBar />', () => {
  it('Should render the title', () => {
    const { getByText, unmount } = render(() => (
      <Router>
        <TopBar
          title="Hello World"
          renderAtEnd={() => <span>Lorem Ipsum</span>}
        />
      </Router>
    ));

    expect(getByText('Hello World')).toBeInTheDocument();
    unmount();
  });

  it('Should trigger a click event', async () => {
    const mockedGoBack = vi.fn();
    const { getByRole, unmount } = render(() => (
      <Router>
        <TopBar goBack={mockedGoBack} renderAtEnd={() => <div />} />
      </Router>
    ));

    const button = getByRole('button', { name: 'Go Back' });
    fireEvent.click(button);

    expect(mockedGoBack).toHaveBeenCalled();
    unmount();
  });
});
