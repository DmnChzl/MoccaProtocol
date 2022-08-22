import { render } from 'solid-testing-library';
import { describe, expect, it } from 'vitest';
import { FlatItem } from './FlatItem';

describe('<FlatItem />', () => {
  it('Should render the title', () => {
    const { getByText, unmount } = render(() => (
      <FlatItem renderAtStart={() => <div />} title="Hello World" />
    ));

    expect(getByText('Hello World')).toBeInTheDocument();
    unmount();
  });

  it('Should render optional props', () => {
    const { getByText, unmount } = render(() => (
      <FlatItem
        itemName="Item Name"
        renderAtStart={() => <span>42</span>}
        title="Hello World"
        subTitle="Lorem Ipsum"
      />
    ));

    expect(getByText('Item Name')).toBeInTheDocument();
    expect(getByText('42')).toBeInTheDocument();
    expect(getByText('Lorem Ipsum')).toBeInTheDocument();
    unmount();
  });
});
