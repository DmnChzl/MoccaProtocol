import { fireEvent, render } from 'solid-testing-library';
import { describe, expect, it, vi } from 'vitest';
import { TextField } from './TextField';

describe('<TextField />', () => {
  it('Should render', () => {
    const { getByPlaceholderText, unmount } = render(() => (
      <TextField defaultValue="DefaultValue" onInput={vi.fn()} />
    ));

    expect(getByPlaceholderText('> input value goes here <').value).toEqual(
      'DefaultValue'
    );
    unmount();
  });

  it('Should render with optional props', () => {
    const { getByText, getByPlaceholderText, unmount } = render(() => (
      <TextField
        startAdornment={<span>Start</span>}
        defaultValue="DefaultValue"
        onInput={vi.fn()}
        endAdornment={<span>End</span>}
      />
    ));

    expect(getByText('Start')).toBeInTheDocument();
    expect(getByText('End')).toBeInTheDocument();
    unmount();
  });

  it.skip('Should trigger a input event', async () => {
    const mockedOnInput = vi.fn();

    const { getByPlaceholderText, getByText, unmount } = render(() => (
      <TextField
        iconComponent={<span>Icon</span>}
        placeholder="Test"
        defaultValue="DefaultValue"
        onInput={vi.fn()}
      />
    ));

    const input = getByPlaceholderText('Test');

    expect(input.value).toEqual('DefaultValue');
    // ? fireEvent.input
    // ? userEvent.type
    fireEvent.change(input, { target: { value: 'Lorem' } });
    fireEvent.change(input, { target: { value: 'Ipsum' } });
    expect(mockedOnInput).toHaveBeenCalledTimes(2);

    unmount();
  });
});
