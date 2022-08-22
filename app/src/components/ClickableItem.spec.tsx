import { fireEvent, render } from 'solid-testing-library';
import { describe, expect, it, vi } from 'vitest';
import { ClickableItem } from './ClickableItem';

describe('<ClickableItem />', () => {
  it('Should render the title', () => {
    const { getByText, unmount } = render(() => (
      <ClickableItem
        onClick={vi.fn()}
        renderAtStart={() => <div />}
        title="Hello World"
        actionComponent={<span>Lorem Ipsum</span>}
      />
    ));

    expect(getByText('Hello World')).toBeInTheDocument();
    expect(getByText('Lorem Ipsum')).toBeInTheDocument();
    unmount();
  });

  it('Should render optional props', () => {
    const { getByText, unmount } = render(() => (
      <ClickableItem
        onClick={vi.fn()}
        renderAtStart={() => <span>42</span>}
        title="Hello World"
        subTitle="Lorem Ipsum"
      />
    ));

    expect(getByText('42')).toBeInTheDocument();
    expect(getByText('Lorem Ipsum')).toBeInTheDocument();
    unmount();
  });

  it('Should trigger a click event', async () => {
    const mockedOnClick = vi.fn();
    const { getByRole, unmount } = render(() => (
      <ClickableItem
        onClick={mockedOnClick}
        renderAtStart={() => <div />}
        title="Hello World"
      />
    ));

    const button = getByRole('button');
    fireEvent.click(button);

    expect(mockedOnClick).toHaveBeenCalled();
    unmount();
  });
});
