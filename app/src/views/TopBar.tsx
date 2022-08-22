import { Link, useLocation } from 'solid-app-router';
import { mergeProps, Show } from 'solid-js';
import { IconArrowLeft, IconGrid } from '../icons';

/**
 * @method isBlockChainRoute
 * @param {string} pathname
 * @returns {boolean}
 */
const isBlockChainRoute = (pathname: string) => {
  if (pathname.startsWith('/chain') || pathname.startsWith('/block')) {
    return true;
  }
  return false;
};

interface TopBarProps {
  goBack?: () => void;
  title?: string;
  renderAtEnd: () => JSX.Element;
  children: JSX.Element;
}

export const TopBar = (props: TopBarProps) => {
  const { pathname } = useLocation();
  const merged = mergeProps(
    {
      renderAtEnd: () => (
        <Link href="/chain">
          <IconGrid
            classList={{
              'hover:text-gray-600': !isBlockChainRoute(pathname),
              'text-blue-400': isBlockChainRoute(pathname)
            }}
          />
        </Link>
      )
    },
    props
  );

  return (
    <header class="flex flex-col flex-grow-0 flex-shrink p-3 h-18 bg-white text-gray-800 z-10 shadow">
      <div class="flex">
        <Show when={props.goBack}>
          <button onClick={props.goBack} aria-label="Go Back">
            <IconArrowLeft class="mr-3 hover:text-gray-600 cursor-pointer" />
          </button>
        </Show>

        {props.title && <h1 class="font-semibold">{props.title}</h1>}

        <div class="ml-auto">{merged.renderAtEnd()}</div>
      </div>

      {props.children}
    </header>
  );
};
