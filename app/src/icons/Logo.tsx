import { mergeProps } from 'solid-js';

interface Props {
  color?: string;
}

export const Logo = (props: Props) => {
  const merged = mergeProps({ color: '#000' }, props);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="96"
      height="96"
      viewBox="0 0 96 96"
      fill="none"
      {...props}>
      <path
        d="M47.998 82.288c-8.157 0-15.82-2.099-22.482-5.786.444-16.36 9.338-30.613 22.482-38.55 13.144 7.937 22.039 22.19 22.483 38.55a46.285 46.285 0 01-22.483 5.786z"
        fill="#fff"
        stroke={merged.color}
        stroke-width="4"
      />
      <path
        d="M48 94.496a34.343 34.343 0 01-16.482-4.183C31.921 78.351 38.414 67.93 48 62.056c9.586 5.874 16.079 16.295 16.481 28.257A34.343 34.343 0 0148 94.496z"
        fill="#fff"
        stroke={merged.color}
        stroke-width="4"
      />
      <path d="M80 40a32 32 0 10-64 0" stroke={merged.color} stroke-width="4" />
      <path
        d="M10.752 48.808c-5.022-2.9-6.743-9.321-3.843-14.343 2.9-5.022 9.32-6.743 14.343-3.843 5.022 2.899 6.743 9.32 3.843 14.343-2.9 5.022-9.32 6.743-14.343 3.843zM26.752 21.095c-5.022-2.9-6.743-9.32-3.843-14.343 2.9-5.022 9.32-6.743 14.343-3.843 5.022 2.9 6.743 9.32 3.843 14.343-2.9 5.022-9.32 6.743-14.343 3.843zM69.252 21.095c-5.022 2.9-11.444 1.18-14.343-3.843-2.9-5.022-1.18-11.444 3.843-14.343 5.022-2.9 11.444-1.18 14.343 3.843 2.9 5.022 1.18 11.444-3.843 14.343zM85.252 48.808c-5.022 2.9-11.444 1.179-14.343-3.843-2.9-5.022-1.18-11.444 3.843-14.343 5.022-2.9 11.444-1.18 14.343 3.843 2.9 5.022 1.18 11.444-3.843 14.343z"
        fill="#fff"
        stroke={merged.color}
        stroke-width="4"
      />
    </svg>
  );
};
