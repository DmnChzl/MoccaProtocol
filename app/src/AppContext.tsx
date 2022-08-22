import {
  createContext,
  createEffect,
  createSignal,
  useContext
} from 'solid-js';
import * as Constants from './constants';

const AppContext = createContext();

// Handling session / data storage (GET)
const sessionItem = sessionStorage.getItem(Constants.STORAGE_KEY);
const storedValue = sessionItem ? JSON.parse(sessionItem) : undefined;

interface Props {
  children: JSX.Element;
}
/**
 * Using context for state management
 */
export const AppProvider = (props: Props) => {
  const [currentJwt, setCurrentJwt] = createSignal(
    storedValue ? storedValue.currentJwt : ''
  );
  const [transferType, setTransferType] = createSignal('');
  const [chain, setChain] = createSignal([]);
  const [peerInfo, setPeerInfo] = createSignal({
    ipAddress: storedValue ? storedValue.ipAddress : '',
    explicitName: '',
    collection: []
  });
  const [allPeers, setAllPeers] = createSignal([]);
  const [selectedFile, setSelectedFile] = createSignal(undefined);
  const [selectedPeer, setSelectedPeer] = createSignal(undefined);

  createEffect(() => {
    // Handling session / data storage (SET)
    sessionStorage.setItem(
      Constants.STORAGE_KEY,
      JSON.stringify({
        currentJwt: currentJwt(),
        ipAddress: peerInfo().ipAddress
      })
    );
  });

  // * UTILS
  const isUpload = () => transferType() === Constants.TRANSFER_TYPES.UPLOAD;
  const isDownload = () => transferType() === Constants.TRANSFER_TYPES.DOWNLOAD;

  const value = [
    {
      currentJwt,
      transferType,
      isUpload,
      isDownload,
      chain,
      peerInfo,
      allPeers,
      selectedFile,
      selectedPeer
    },
    {
      setCurrentJwt,
      initUpload() {
        setTransferType(Constants.TRANSFER_TYPES.UPLOAD);
      },
      initDownload() {
        setTransferType(Constants.TRANSFER_TYPES.DOWNLOAD);
      },
      setChain,
      updatePeerInfo(newPeerInfo) {
        setPeerInfo(currentPeerInfo => ({
          ...currentPeerInfo,
          ...newPeerInfo
        }));
      },
      resetStorage() {
        setCurrentJwt('');
        setPeerInfo({
          ipAddress: '',
          explicitName: '',
          collection: []
        });
      },
      setAllPeers,
      setSelectedFile,
      resetSelectedFile() {
        setSelectedFile(undefined);
      },
      setSelectedPeer,
      resetSelectedPeer() {
        setSelectedPeer(undefined);
      }
    }
  ];

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
