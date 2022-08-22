import { Link } from 'solid-app-router';
import {
  createEffect,
  createResource,
  createSignal,
  For,
  Match,
  onMount,
  Show,
  Switch
} from 'solid-js';
import { useAppContext } from '../AppContext';
import {
  ClickableItem,
  ClickableItemSkeleton
} from '../components/ClickableItem';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { TextField } from '../components/TextField';
import * as Constants from '../constants';
import { IconGrid, IconPlus, IconRefresh, IconTrash } from '../icons';
import { ModalWrapper } from '../ModalWrapper';
import * as PeerService from '../services/peerService';
// import * as PeerService from '../services/fakeService';
import { DownloadFrom } from './DownloadFrom';
import { FlatView } from './FlatView';
import { TopBar } from './TopBar';

export const ListView = props => {
  const [
    { currentJwt, peerInfo, allPeers, selectedFile, selectedPeer },
    {
      initDownload,
      resetStorage,
      setAllPeers,
      resetSelectedFile,
      setSelectedPeer,
      resetSelectedPeer
    }
  ] = useAppContext();
  const [newPeerAddress, setNewPeerAddress] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  /// Get 'allPeers' at component mount
  const [response, { refetch }] = createResource(
    peerInfo().ipAddress,
    PeerService.getAllPeers
  );

  onMount(() => {
    initDownload();

    // Cleanup...
    resetSelectedFile();
    resetSelectedPeer();
  });

  // Listening 'PeerService' response...
  createEffect(() => {
    if (!response.loading) {
      setAllPeers(response());
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

  /**
   * Create the peer
   * @param {string} peerAddress
   * @param {Function} callback NOOP
   */
  const handleCreate = async (peerAddress: string, callback = () => {}) => {
    setLoading(true);

    try {
      await PeerService.createPeer(
        peerInfo().ipAddress,
        currentJwt(),
        peerAddress
      );
      refetch();
      // TODO: Enhancement
      callback();
    } catch (res) {
      if (res.status === 401 || res.statusText === 'Unauthorized') {
        unauthorizedModal();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (peer: { connectionStatus: string }) => {
    if (peer.connectionStatus === 'OFFLINE') {
      await handleCreate(peer.ipAddress);
    }

    setSelectedPeer(peer);
  };

  /**
   * Delete the peer (by modal)
   * @param {string} uid
   */
  const handleDelete = async (uid: string) => {
    const currentPeer = allPeers().find(peer => peer.uid === uid);

    const { show } = props.buildWarningModal({
      title: 'Delete Peer',
      content: (
        <p class="mx-auto text-gray-600">
          Delete {currentPeer.explicitName} !?
        </p>
      ),
      cancelAction: true, // // Default behaviour
      okAction: {
        onClick: async () => {
          try {
            await PeerService.deletePeer(
              peerInfo().ipAddress,
              currentJwt(),
              uid
            );
            refetch();
            // // Force close modal
            props.hideModal();
          } catch (res) {
            if (res.status === 401 || res.statusText === 'Unauthorized') {
              unauthorizedModal();
            }
          }
        }
      }
    });

    show();
  };

  const toggleModal = () => {
    const { show } = props.buildInfoModal({
      title: 'New Peer',
      content: (
        <div class="w-full">
          <TextField
            placeholder="0.0.0.0"
            defaultValue={newPeerAddress()}
            onInput={e => setNewPeerAddress(e.target.value)}
          />
        </div>
      ),
      cancelAction: true, // // Default behaviour
      okAction: {
        onClick: async () => {
          try {
            await handleCreate(newPeerAddress(), props.hideModal);
            setNewPeerAddress('');
          } catch (res) {
            if (res.status === 401 || res.statusText === 'Unauthorized') {
              unauthorizedModal();
            }
          }
        }
      }
    });

    show();
  };

  return (
    <Switch
      fallback={
        <div class="flex flex-col h-screen">
          <TopBar
            title={Constants.APP_NAME}
            renderAtEnd={() => (
              <div class="flex space-x-3">
                <button
                  classList={{ 'animate-spin': response.loading }}
                  type="button"
                  onClick={refetch}>
                  <IconRefresh class="hover:text-gray-600" />
                </button>
                <Link href="/chain">
                  <IconGrid class="hover:text-gray-600" />
                </Link>
              </div>
            )}
          />

          <main class="relative flex flex-col flex-grow flex-shrink-0">
            <div class="flex-auto h-0 overflow-y-auto">
              <ul class="shadow">
                <Show
                  when={!response.loading}
                  fallback={[1, 2, 3].map(() => (
                    <ClickableItemSkeleton />
                  ))}>
                  <For each={allPeers()}>
                    {(peer, idx) => (
                      <li>
                        <ClickableItem
                          onClick={() => handleSelect(peer)}
                          renderAtStart={() => (
                            <div
                              class="flex h-12 w-12 rounded-full shrink-0"
                              classList={{
                                'bg-blue-600':
                                  peer.connectionStatus === 'ONLINE',
                                'bg-gray-400':
                                  peer.connectionStatus === 'OFFLINE'
                              }}>
                              <span class="m-auto text-white">
                                {peer.explicitName?.substring(0, 2)}
                              </span>
                            </div>
                          )}
                          title={peer.explicitName}
                          subTitle={peer.ipAddress}
                          actionComponent={
                            <button
                              class="p-3 mx-4"
                              onClick={() => handleDelete(peer.uid)}>
                              <IconTrash class="text-red-600" />
                            </button>
                          }
                        />
                      </li>
                    )}
                  </For>
                </Show>
              </ul>
            </div>

            <Show when={!props.isModalVisible()}>
              <FloatingActionButton onClick={toggleModal}>
                <IconPlus class="h-5 w-5 text-white" />
              </FloatingActionButton>
            </Show>
          </main>
        </div>
      }>
      <Match when={selectedPeer() && !selectedFile()}>
        <DownloadFrom />
      </Match>

      <Match when={selectedPeer() && selectedFile()}>
        <ModalWrapper>{props => <FlatView {...props} />}</ModalWrapper>
      </Match>
    </Switch>
  );
};
