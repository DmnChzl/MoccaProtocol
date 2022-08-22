import { fireEvent, render } from 'solid-testing-library';
import { describe, expect, it, vi } from 'vitest';
import { UploadFile } from './UploadFile';

describe('<UploadFile />', () => {
  it('Should render', () => {
    const { getByText, unmount } = render(() => (
      <UploadFile onSubmit={vi.fn()} />
    ));

    expect(getByText('Choose A File')).toBeInTheDocument();
    unmount();
  });

  it.skip('Should trigger all click cvents', async () => {
    const fakeText = new File(['fake text'], 'plain.txt', {
      type: 'text/plain'
    });
    const mockedOnChange = vi.fn();

    const { getByLabelText, getByRole, unmount } = render(() => (
      <UploadFile onSubmit={mockedOnChange} />
    ));

    // const input = getByLabelText('upload-file');
    const input = getByRole('input', { name: 'file' });

    expect(input.files).toHaveLength(0);
    fireEvent.change(input, { target: { files: [fakeText] } });
    expect(input.files).toHaveLength(1);

    expect(mockedOnChange).toHaveBeenCalled();
    unmount();
  });
});
