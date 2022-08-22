import { Link, useLocation } from 'solid-app-router';
import { IconShare, IconUpload, IconUser } from '../icons';

const LINKS = [
  {
    path: '/upload',
    // prettier-ignore
    icon: <IconUpload class="group-hover:text-blue-600 group-focus:text-blue-400" />,
    name: 'Upload'
  },
  {
    path: '/network',
    // prettier-ignore
    icon: <IconShare class="group-hover:text-blue-600 group-focus:text-blue-400" />,
    name: 'Network'
  },
  {
    path: '/info',
    // prettier-ignore
    icon: <IconUser class="group-hover:text-blue-600 group-focus:text-blue-400" />,
    name: 'Info'
  }
];

export const NavBar = () => {
  const location = useLocation();

  /**
   * @method activeClass
   * @param {string} pathname
   * @returns {string}
   */
  const activeClass = pathname => {
    if (location.pathname === pathname) {
      return 'text-blue-400';
    }

    return 'text-gray-800';
  };

  return (
    <footer class="flex flex-grow-0 flex-shrink p-3 mx-3 mb-3 h-18 sm:mx-auto sm:w-3/4 md:w-2/3 lg:w-1/2 bg-white text-gray-800 border border-gray-200 rounded shadow z-10">
      {LINKS.map(link => (
        <Link
          href={link.path}
          class={`group flex justify-center w-full ${activeClass(link.path)}`}>
          {link.icon}
          {location.pathname === link.path && (
            <span class="ml-3 group-hover:text-blue-600 group-focus:text-blue-400">
              {link.name}
            </span>
          )}
        </Link>
      ))}
    </footer>
  );
};
