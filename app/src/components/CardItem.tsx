import { format } from 'date-fns';
import { Link } from 'solid-app-router';
import * as Constants from '../constants';
import {
  IconCalendar,
  IconChevronRight,
  IconClock,
  IconSwitch
} from '../icons';

type StringOrBoolean = string | boolean;

interface LinkWrapperProps {
  href: StringOrBoolean;
  className: string;
  children: JSX.Element;
}

const LinkWrapper = (props: LinkWrapperProps) => {
  if (props.href) {
    return (
      <Link href={props.href} class={props.className}>
        {props.children}
      </Link>
    );
  }

  return <div class={props.className}>{props.children}</div>;
};

interface Transaction {
  timestamp: number;
  from: string;
  to: string;
  value: {
    fileName: string;
    fileSize: number;
  };
}

interface CardItemProps {
  idx: number;
  timestamp: number;
  transactions: Transaction[];
}

export const CardItem = (props: CardItemProps) => {
  const date = format(new Date(props.timestamp), Constants.DATE_PATTERN);
  const time = format(new Date(props.timestamp), Constants.TIME_PATTERN);

  return (
    <LinkWrapper
      href={props.transactions.length && `/block/${props.idx}`}
      className={`group flex m-3 border-l-4 border-l-blue-600 rounded${
        props.transactions.length ? ' transition-shadow hover:shadow' : ''
      }`}>
      <div class="flex flex-col w-full border border-l-0 rounded rounded-l-none">
        <div class="flex px-3 mt-3 justify-between">
          <span class="font-semibold tracking-wider">Block #{props.idx}</span>
          <Show when={props.transactions.length}>
            <IconChevronRight class="text-blue-600 transition-opacity opacity-0 group-hover:opacity-100" />
          </Show>
        </div>

        <div class="flex flex-col p-3 space-y-3">
          <div class="flex mx-3 space-x-3">
            <div class="flex w-full">
              <IconCalendar />
              <span class="ml-3">{date}</span>
            </div>

            <div class="flex w-full">
              <IconClock />
              <span class="ml-3">{time}</span>
            </div>
          </div>

          <div class="flex mx-3 w-full">
            <IconSwitch />
            <span class="ml-3">
              {props.transactions.length} Transaction
              {props.transactions.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
    </LinkWrapper>
  );
};

export const CardItemSkeleton = () => (
  <div class="flex m-3 border-l-4 border-l-gray-400 rounded animate-pulse">
    <div class="flex flex-col w-full border border-l-0 rounded rounded-l-none">
      <div class="flex px-3 mt-3 justify-between">
        <div class="h-4 my-1 w-12 bg-gray-400 rounded-md" />
      </div>

      <div class="flex flex-col p-3 space-y-3">
        <div class="flex mx-3 space-x-3">
          <div class="flex w-full">
            <IconCalendar class="text-gray-600" />
            <div class="ml-3 h-4 my-1 w-24 bg-gray-400 rounded-md" />
          </div>

          <div class="flex w-full">
            <IconClock class="text-gray-600" />
            <div class="ml-3 h-4 my-1 w-24 bg-gray-400 rounded-md" />
          </div>
        </div>

        <div class="flex mx-3 w-full">
          <IconSwitch class="text-gray-600" />
          <div class="ml-3 h-4 my-1 w-36 bg-gray-400 rounded-md" />
        </div>
      </div>
    </div>
  </div>
);
