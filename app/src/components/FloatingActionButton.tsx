interface Props {
  onClick: () => void;
  children: JSX.Element;
}

export const FloatingActionButton = (props: Props) => (
  <button class="fab" onClick={props.onClick}>
    {props.children}
  </button>
);
