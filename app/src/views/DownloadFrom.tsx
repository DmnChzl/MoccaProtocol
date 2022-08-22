import { createEffect, createResource, createSignal, For } from 'solid-js';
import { useAppContext } from '../AppContext';
import {
  ClickableItem,
  ClickableItemSkeleton
} from '../components/ClickableItem';
import * as Constants from '../constants';
import { IconFile } from '../icons';
import * as PeerService from '../services/peerService';
// import * as PeerService from '../services/fakeService';
import { formatSize, sortBy } from '../utils';
import { TopBar } from './TopBar';

/**
 * @method formatPeerName
 * @param peer { explicitName, ipAddress }
 * @returns {string}
 */
const formatPeerName = (peer: { explicitName: string; ipAddress: string }) => {
  return `${peer.explicitName} (${peer.ipAddress})`;
};

export const DownloadFrom = () => {
  const [
    { currentJwt, peerInfo, selectedPeer },
    { setSelectedFile, resetSelectedPeer }
  ] = useAppContext();
  const [fileList, setFileList] = createSignal([]);
  // Fetch 'peer' at component mount
  const [response] = createResource(() =>
    PeerService.getPeer(peerInfo().ipAddress, currentJwt(), selectedPeer().uid)
  );

  // Listening 'PeerService' response...
  createEffect(() => {
    if (!response.loading) {
      setFileList(response().collection);
    }

    if (response.error) {
      const { status, statusText } = response.error;

      if (status === 401 || statusText === 'Unauthorized') {
        unauthorizedModal();
      }
    }
  });

  // Building the 401 / unauthorized modal, and display it
  const unauthorizedModal = () => {
    const { show } = props.buildWarningModal({
      title: 'Warning',
      content: <p class="mx-auto text-gray-600">U're No Longer Connected !</p>,
      cancelAction: {
        label: 'Reconnect',
        onClick: () => {
          // // Force close modal
          props.hideModal();
          resetStorage();
        }
      }
    });

    show();
  };

  return (
    <>
      <TopBar title={Constants.DOWNLOAD_FROM} goBack={resetSelectedPeer}>
        <p class="mt-3 text-gray-600">{formatPeerName(selectedPeer())}</p>
      </TopBar>

      <main class="flex-auto h-0 overflow-y-auto">
        <ul class="shadow">
          <Show
            when={!response.loading}
            fallback={[1, 2, 3].map(() => (
              <ClickableItemSkeleton />
            ))}>
            <For each={fileList().sort(sortBy('name'))}>
              {file => (
                <li>
                  <ClickableItem
                    onClick={() => setSelectedFile(file)}
                    renderAtStart={() => (
                      <div class="flex h-12 w-12 bg-blue-600 rounded-full shrink-0">
                        <IconFile class="m-auto text-white" />
                      </div>
                    )}
                    title={file.name}
                    subTitle={formatSize(file.size)}
                  />
                </li>
              )}
            </For>
          </Show>
        </ul>
      </main>
    </>
  );
};
