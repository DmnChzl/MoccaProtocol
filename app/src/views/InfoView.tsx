import { Link } from 'solid-app-router';
import {
  createEffect,
  createResource,
  createSignal,
  onMount,
  Show,
  Switch
} from 'solid-js';
import { useAppContext } from '../AppContext';
import {
  ClickableItem,
  ClickableItemSkeleton
} from '../components/ClickableItem';
import {
  IconAtSymbol,
  IconDownload,
  IconFile,
  IconGrid,
  IconLock,
  IconLogout,
  IconTrash,
  IconUnlock
} from '../icons';
import { ModalWrapper } from '../ModalWrapper';
import * as FileService from '../services/fileService';
// import * as FileService from '../services/fakeService';
import * as PeerService from '../services/peerService';
// import * as PeerService from '../services/fakeService';
import { createDownloadLink, formatSize, sortBy } from '../utils';
import { FlatView } from './FlatView';
import { TopBar } from './TopBar';
import { UploadTo } from './UploadTo';

const copy = (text: string) => navigator.clipboard.writeText(text);

export const InfoView = props => {
  let refInput;

  const [
    { currentJwt, peerInfo, selectedFile, selectedPeer },
    {
      initUpload,
      updatePeerInfo,
      resetStorage,
      setSelectedFile,
      resetSelectedFile,
      resetSelectedPeer
    }
  ] = useAppContext();
  const [inputVal, setInputVal] = createSignal(peerInfo().explicitName);
  const [edition, setEdition] = createSignal(false);
  // Get 'info' at component mount
  const [response, { refetch }] = createResource(
    peerInfo().ipAddress,
    PeerService.getInfo
  );

  onMount(() => {
    initUpload();

    // Cleanup...
    resetSelectedFile();
    resetSelectedPeer();
  });

  // Listening 'PeerService' response...
  createEffect(() => {
    if (!response.loading) {
      updatePeerInfo({
        explicitName: response().explicitName,
        collection: response().collection
      });
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

  const handleClick = async () => {
    if (edition()) {
      // If edition on, update 'peerInfo', then unset edition
      try {
        await PeerService.updatePeer(peerInfo().ipAddress, currentJwt(), {
          explicitName: inputVal()
        });

        updatePeerInfo({ explicitName: inputVal() });
      } catch (res) {
        if (res.status === 401 || res.statusText === 'Unauthorized') {
          unauthorizedModal();
        }

        setInputVal(peerInfo().explicitName);
      }

      setEdition(val => !val);
    } else {
      // If edition off, set it on, then focus on input
      setEdition(val => !val);
      refInput.focus();
    }
  };

  /**
   * Delete the file (by modal)
   * @param {string} fileName
   */
  const handleDelete = async (fileName: string) => {
    const { show } = props.buildWarningModal({
      title: 'Delete File',
      content: <p class="mx-auto text-gray-600">Delete {fileName} !?</p>,
      cancelAction: true, // // Default behaviour
      okAction: {
        onClick: async () => {
          try {
            await FileService.deleteFile(
              peerInfo().ipAddress,
              currentJwt(),
              fileName
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

  /**
   * Download the file
   * @param {string} fileName
   */
  const handleDownload = async (fileName: string) => {
    try {
      const blob = await FileService.openFile(
        peerInfo().ipAddress,
        currentJwt(),
        fileName
      );
      createDownloadLink(blob, fileName);
    } catch (res) {
      if (res.status === 401 || res.statusText === 'Unauthorized') {
        unauthorizedModal();
      }
    }
  };

  return (
    <Switch
      fallback={
        <div class="flex flex-col h-screen">
          <TopBar
            renderAtEnd={() => (
              <div class="flex space-x-3">
                <button type="button" onClick={resetStorage}>
                  <IconLogout class="hover:text-gray-600" />
                </button>
                <Link href="/chain">
                  <IconGrid class="hover:text-gray-600" />
                </Link>
              </div>
            )}>
            <div class="flex flex-col items-center space-y-3">
              <div
                class="flex h-16 w-16 bg-blue-600 text-white ring-2 ring-offset-2  rounded-full shrink-0"
                classList={{
                  'ring-white': edition(),
                  'ring-blue-600': !edition()
                }}>
                <span class="m-auto text-lg">
                  {peerInfo().explicitName?.substring(0, 2)}
                </span>
              </div>

              <div class="flex text-lg">
                <Show
                  when={edition()}
                  fallback={
                    <span class="w-48 text-center font-semibold truncate">
                      {peerInfo().explicitName}
                    </span>
                  }>
                  <input
                    ref={refInput}
                    class="w-48 text-center text-gray-600 focus:text-gray-800 outline-none"
                    value={inputVal()}
                    onInput={e => setInputVal(e.target.value)}
                  />
                </Show>
              </div>

              <div class="flex space-x-3 pb-3">
                <button
                  class="flex p-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded shadow hover:shadow-none focus:shadow-none"
                  onClick={() => copy(peerInfo().ipAddress)}>
                  <IconAtSymbol class="h-5 w-5 my-auto" />
                  <span class="ml-2">{peerInfo().ipAddress}</span>
                </button>

                <Show
                  when={edition()}
                  fallback={
                    <button
                      class="flex p-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded shadow hover:shadow-none focus:shadow-none"
                      onClick={handleClick}>
                      <IconLock class="h-5 w-5 my-auto" />
                      <span class="ml-2">Lock</span>
                    </button>
                  }>
                  <button
                    class="flex p-2 bg-gray-100 hover:bg-gray-50 text-gray-700 rounded shadow-none hover:shadow focus:shadow"
                    onClick={handleClick}>
                    <IconUnlock class="h-5 w-5 my-auto" />
                    <span class="ml-2">Unlock</span>
                  </button>
                </Show>
              </div>
            </div>
          </TopBar>

          <main class="relative flex flex-col flex-grow flex-shrink-0">
            <div class="flex-auto h-0 overflow-y-auto">
              <ul class="shadow">
                <Show
                  when={!response.loading}
                  fallback={[1, 2, 3].map(() => (
                    <ClickableItemSkeleton />
                  ))}>
                  <For each={peerInfo().collection.sort(sortBy('name'))}>
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
                          actionComponent={
                            <div class="flex mx-4">
                              <button
                                class="p-3"
                                onClick={() => handleDownload(file.name)}>
                                <div class="flex h-12 w-12 transition-colors text-gray-400 hover:bg-gray-200 hover:text-gray-600 rounded-full shrink-0">
                                  <IconDownload class="m-auto" />
                                </div>
                              </button>
                              <button
                                class="p-3"
                                onClick={() => handleDelete(file.name)}>
                                <IconTrash class="text-red-600" />
                              </button>
                            </div>
                          }
                        />
                      </li>
                    )}
                  </For>
                </Show>
              </ul>
            </div>
          </main>
        </div>
      }>
      <Match when={selectedFile() && !selectedPeer()}>
        <UploadTo />
      </Match>

      <Match when={selectedFile() && selectedPeer()}>
        <ModalWrapper>{props => <FlatView {...props} />}</ModalWrapper>
      </Match>
    </Switch>
  );
};
