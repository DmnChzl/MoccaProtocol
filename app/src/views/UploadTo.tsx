import { createEffect, createResource, For, Show } from 'solid-js';
import { useAppContext } from '../AppContext';
import {
  ClickableItem,
  ClickableItemSkeleton
} from '../components/ClickableItem';
import * as Constants from '../constants';
// import * as PeerService from '../services/peerService';
import * as PeerService from '../services/fakeService';
import { formatSize } from '../utils';
import { TopBar } from './TopBar';

/**
 * @method formatFileName
 * @param file { name, size }
 * @returns {string}
 */
const formatFileName = (file: { name: string; size: number }) => {
  return `${file.name} (${formatSize(file.size)})`;
};

export const UploadTo = () => {
  const [
    { peerInfo, allPeers, selectedFile },
    { setAllPeers, resetSelectedFile, setSelectedPeer }
  ] = useAppContext();
  // Fetch 'allPeers' at component mount
  const [response] = createResource(
    peerInfo().ipAddress,
    PeerService.getAllPeers
  );

  // Listening 'PeerService' response...
  createEffect(() => {
    if (!response.loading) {
      setAllPeers(response());
    }
  });

  return (
    <div class="flex flex-col h-screen">
      <TopBar title={Constants.SELECTED_FILE} goBack={resetSelectedFile}>
        <p class="mt-3 text-gray-600">{formatFileName(selectedFile())}</p>
      </TopBar>

      <main class="flex-auto h-0 overflow-y-auto">
        <ul class="shadow">
          <Show
            when={!response.loading}
            fallback={[1, 2, 3].map(() => (
              <ClickableItemSkeleton />
            ))}>
            <For each={allPeers()}>
              {peer => (
                <li>
                  <ClickableItem
                    onClick={() => setSelectedPeer(peer)}
                    renderAtStart={() => (
                      <div
                        class="flex h-12 w-12 rounded-full shrink-0"
                        classList={{
                          'bg-blue-600': peer.connectionStatus === 'ONLINE',
                          'bg-gray-400': peer.connectionStatus === 'OFFLINE'
                        }}>
                        <span class="m-auto text-white">
                          {peer.explicitName?.substring(0, 2)}
                        </span>
                      </div>
                    )}
                    title={peer.explicitName}
                    subTitle={peer.ipAddress}
                  />
                </li>
              )}
            </For>
          </Show>
        </ul>
      </main>
    </div>
  );
};
