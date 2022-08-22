import { useNavigate } from 'solid-app-router';
import { Match, onMount, Switch } from 'solid-js';
import { useAppContext } from '../AppContext';
import { UploadFile } from '../components/UploadFile';
import * as Constants from '../constants';
import { ModalWrapper } from '../ModalWrapper';
import { FlatView } from './FlatView';
import { TopBar } from './TopBar';
import { UploadTo } from './UploadTo';

export const UploadView = () => {
  const navigate = useNavigate();
  const [
    { selectedFile, selectedPeer },
    { initUpload, setSelectedFile, resetSelectedFile, resetSelectedPeer }
  ] = useAppContext();

  onMount(() => {
    initUpload();

    // Cleanup...
    resetSelectedFile();
    resetSelectedPeer();
  });

  // Using FileReader (recursively) to read a file
  const handleChange = event => {
    const { files } = event.target;
    const reader = new FileReader();

    const readFile = idx => {
      if (idx >= files.length) return;

      const currentFile = files[idx];
      reader.onload = e => {
        // eslint-disable-next-line
        console.log(e.target.result);
        readFile(idx + 1);
      };

      reader.readAsArrayBuffer(currentFile);
    };

    readFile(0);
    setSelectedFile(files[0]);
  };

  return (
    <Switch
      fallback={
        <div class="flex flex-col h-screen">
          <TopBar title={Constants.APP_NAME} />

          <main class="flex-auto">
            <UploadFile onChange={handleChange} />
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
