import { Router } from 'solid-app-router';
import { render } from 'solid-testing-library';
import { describe, expect, it } from 'vitest';
import { CardItem } from './CardItem';

describe('<CardItem />', () => {
  it('Should render', () => {
    const props = {
      idx: 42,
      timestamp: 1656626400,
      transactions: [
        {
          timestamp: 1656626400,
          from: '192.168.1.0',
          to: '172.254.0.1',
          value: {
            fileName: 'hello_world.txt',
            fileSize: 1024 * 1024
          }
        }
      ]
    };

    const { getByText, unmount } = render(() => (
      <Router>
        <CardItem {...props} />
      </Router>
    ));

    expect(getByText('Block #42')).toBeInTheDocument();
    expect(getByText('1 Transaction')).toBeInTheDocument();
    unmount();
  });
});
