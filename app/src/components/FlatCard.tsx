import { IconFile, IconSwitch } from '../icons';
import { formatSize } from '../utils';

interface FlatCardProps {
  from: string;
  to: string;
  value: {
    fileName: string;
    fileSize: number;
  };
}

export const FlatCard = (props: FlatCardProps) => {
  return (
    <div class="group flex m-3 border-l-4 border-l-blue-600 rounded">
      <div class="flex flex-col w-full border border-l-0 rounded rounded-l-none">
        <span class="ml-3 mt-3">Transaction</span>

        <div class="flex flex-col p-3 space-y-3">
          <div class="flex w-full">
            <div class="flex h-12 w-12 bg-blue-600 rounded-full shrink-0">
              <IconSwitch class="m-auto text-white" />
            </div>

            <div class="flex flex-col w-full mx-3 my-auto">
              <p>
                From <span class="font-semibold">{props.from}</span>
              </p>
              <p>
                To <span class="font-semibold">{props.to}</span>
              </p>
            </div>
          </div>

          <div class="flex w-full">
            <div class="flex h-12 w-12 bg-blue-600 rounded-full shrink-0">
              <IconFile class="m-auto text-white" />
            </div>

            <div class="flex flex-col w-full mx-3 my-auto">
              <p>
                File Name:{' '}
                <span class="font-semibold">{props.value.fileName}</span>
              </p>
              <p>
                File Size:{' '}
                <span class="font-semibold">
                  {formatSize(props.value.fileSize)}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
