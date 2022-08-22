import { fireEvent, render } from 'solid-testing-library';
import { describe, expect, it, vi } from 'vitest';
import { Modal } from './Modal';

describe('<Modal />', () => {
  it('Should render', () => {
    const { getByText, unmount } = render(() => (
      <Modal title="Info" content={<p>Lorem ipsum dolor sit amet</p>} />
    ));

    expect(getByText('Info')).toBeInTheDocument();
    expect(getByText('Lorem ipsum dolor sit amet')).toBeInTheDocument();
    unmount();
  });

  it('Should render with optional props', () => {
    const { getByText, unmount } = render(() => (
      <Modal type="WARNING" title="Warning" />
    ));

    expect(getByText('Warning')).toBeInTheDocument();
    unmount();
  });

  it('Should trigger a click event', async () => {
    const mockedOnClick = vi.fn();

    const { getByText, unmount } = render(() => (
      <Modal
        type="WARNING"
        title="Warning"
        content={<p>Lorem ipsum dolor sit amet</p>}
        actions={[{ label: 'Click Me', onClick: mockedOnClick }]}
      />
    ));

    const clickMe = getByText('Click Me');
    fireEvent.click(clickMe);
    expect(mockedOnClick).toHaveBeenCalled();

    unmount();
  });
});
