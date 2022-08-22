import { render } from 'solid-testing-library';
import { describe, expect, it } from 'vitest';
import { FlatCard } from './FlatCard';

describe('<FlatCard />', () => {
  it('Should render', () => {
    const props = {
      timestamp: 1656626400,
      from: '192.168.1.0',
      to: '172.254.0.1',
      value: {
        fileName: 'hello_world.txt',
        fileSize: 1024 * 1024
      }
    };

    const { getByText, unmount } = render(() => <FlatCard {...props} />);

    expect(getByText('192.168.1.0')).toBeInTheDocument();
    expect(getByText('172.254.0.1')).toBeInTheDocument();
    expect(getByText('hello_world.txt')).toBeInTheDocument();
    expect(getByText('1.05mo')).toBeInTheDocument();
    unmount();
  });
});
