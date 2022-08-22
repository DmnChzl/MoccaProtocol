import { createSignal, Show } from 'solid-js';
import { useAppContext } from '../AppContext';
import { FlatItem } from '../components/FlatItem';
import { FloatingActionButton } from '../components/FloatingActionButton';
import * as Constants from '../constants';
import { IconDownload, IconFile, IconUpload } from '../icons';
// import * as FileService from '../services/fileService';
import * as FileService from '../services/fakeService';
import { createDownloadLink, formatSize } from '../utils';
import { TopBar } from './TopBar';

// ! <Dynamic /> not working in prod
/*
const icons = {
  UPLOAD: <IconUpload class="h-5 w-5 text-white" />,
  DOWNLOAD: <IconDownload class="h-5 w-5 text-white" />
};
*/

export const FlatView = props => {
  const [
    { peerInfo, isUpload, isDownload, selectedFile, selectedPeer },
    { resetSelectedFile, resetSelectedPeer }
  ] = useAppContext();
  const [downloaded, setDownloaded] = createSignal(false);

  // * UTILS
  const fromPeer = () => (isUpload() ? peerInfo() : selectedPeer());
  const toPeer = () => (isDownload() ? peerInfo() : selectedPeer());

  const handleClick = async () => {
    // Processing a new file...
    if (selectedFile() instanceof File) {
      const formData = new FormData();
      formData.append('file', selectedFile());

      await FileService.uploadFile(peerInfo().ipAddress, formData);
    }

    try {
      const blob = await FileService.downloadFile(
        fromPeer().ipAddress,
        selectedFile().name,
        toPeer().ipAddress
      );

      setDownloaded(true);

      // Everything is good, display info modal
      const { show } = props.buildInfoModal({
        title: 'Success',
        content: (
          <p class="mx-auto text-gray-600">File Downloaded Successfully</p>
        ),
        cancelAction: {
          label: 'Dismiss'
        },
        okAction: {
          label: 'Open',
          onClick: () => {
            createDownloadLink(blob, selectedFile().name);
            props.hideModal();
          }
        }
      });

      show();
    } catch (error) {
      // eslint-disable-next-line
      console.log(error);

      // There is an error, display warning modal
      const { show } = props.buildWarningModal({
        title: 'Error',
        content: <p class="mx-auto text-gray-600">{error.message}</p>,
        cancelAction: {
          label: 'Dismiss'
        }
      });

      show();
    }
  };

  return (
    <div class="flex flex-col h-screen">
      <TopBar
        title={isUpload() ? 'Upload' : 'Download'}
        goBack={isDownload() ? resetSelectedFile : resetSelectedPeer}
      />

      <main class="relative flex flex-col flex-grow flex-shrink-0">
        <div class="flex-auto h-0 overflow-y-auto">
          <div class="grid md:grid-cols-2 lg:grid-cols-3">
            <FlatItem
              itemName={Constants.ITEM_NAMES.FROM}
              renderAtStart={() => (
                <div class="flex h-12 w-12 bg-blue-600 rounded-full shrink-0">
                  <span class="m-auto text-white">
                    {fromPeer().explicitName?.substring(0, 2)}
                  </span>
                </div>
              )}
              title={fromPeer().explicitName}
              subTitle={fromPeer().ipAddress}
            />

            <FlatItem
              itemName={Constants.ITEM_NAMES.TO}
              renderAtStart={() => (
                <div class="flex h-12 w-12 bg-blue-600 rounded-full shrink-0">
                  <span class="m-auto text-white">
                    {toPeer().explicitName?.substring(0, 2)}
                  </span>
                </div>
              )}
              title={toPeer().explicitName}
              subTitle={toPeer().ipAddress}
            />

            <FlatItem
              itemName={Constants.ITEM_NAMES.FILE}
              renderAtStart={() => (
                <div class="flex h-12 w-12 bg-blue-600 rounded-full shrink-0">
                  <IconFile class="m-auto text-white" />
                </div>
              )}
              title={selectedFile().name}
              subTitle={formatSize(selectedFile().size)}
            />
          </div>

          <Show when={!downloaded()}>
            <FloatingActionButton onClick={handleClick}>
              <Switch>
                <Match when={isUpload()}>
                  <IconUpload class="h-5 w-5 text-white" />
                </Match>

                <Match when={isDownload()}>
                  <IconDownload class="h-5 w-5 text-white" />
                </Match>
              </Switch>
            </FloatingActionButton>
          </Show>
        </div>
      </main>
    </div>
  );
};
