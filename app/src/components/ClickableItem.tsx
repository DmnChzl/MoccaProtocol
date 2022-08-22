interface ClickableItemProps {
  onClick: () => void;
  renderAtStart: () => JSX.Element;
  title: string;
  subTitle?: string;
  actionComponent: JSX.Element;
}

export const ClickableItem = (props: ClickableItemProps) => (
  <div class="flex transition-colors hover:bg-gray-100">
    <button class="flex p-3 w-full" onClick={props.onClick}>
      {props.renderAtStart()}

      <div class="flex flex-col w-full m-3 my-auto">
        <span class="text-left">{props.title}</span>
        {props.subTitle && (
          <div class="flex text-gray-400">
            <span>{props.subTitle}</span>
          </div>
        )}
      </div>
    </button>

    {props.actionComponent}
  </div>
);

export const ClickableItemSkeleton = () => (
  <div class="flex p-3 w-full animate-pulse">
    <div class="flex h-12 w-12 bg-gray-400 rounded-full shrink-0" />

    <div class="flex flex-col w-full mx-3 my-auto">
      <div class="h-4 my-1 w-36 bg-gray-400 rounded-md" />
      <div class="h-4 my-1 w-24 bg-gray-400 rounded-md" />
    </div>
  </div>
);
