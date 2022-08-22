interface FlatItemProps {
  itemName?: string;
  renderAtStart: () => JSX.Element;
  title: string;
  subTitle?: string;
}

export const FlatItem = props => (
  <div class="flex flex-col m-3 border rounded">
    {props.itemName && <span class="ml-3 mt-3">{props.itemName}</span>}
    <div class="flex w-full m-3">
      {props.renderAtStart()}

      <div class="flex flex-col w-full mx-3 my-auto">
        <p class="font-semibold">{props.title}</p>
        {props.subTitle && <p class="text-gray-400">{props.subTitle}</p>}
      </div>
    </div>
  </div>
);
