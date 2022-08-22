import { fireEvent, render } from 'solid-testing-library';
import { describe, expect, it, vi } from 'vitest';
import { FloatingActionButton } from './FloatingActionButton';

describe('<FloatingActionButton />', () => {
  it('Should render the children', () => {
    const { getByText, unmount } = render(() => (
      <FloatingActionButton onClick={vi.fn()}>FAB</FloatingActionButton>
    ));

    expect(getByText('FAB')).toBeInTheDocument();
    unmount();
  });

  it('Should trigger a click event', async () => {
    const mockedOnClick = vi.fn();
    const { getByText, unmount } = render(() => (
      <FloatingActionButton onClick={mockedOnClick}>FAB</FloatingActionButton>
    ));

    const button = getByText('FAB');
    fireEvent.click(button);

    expect(mockedOnClick).toHaveBeenCalled();
    unmount();
  });
});
