import { createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';
import { Modal } from './components/Modal';
import * as Constants from './constants';

interface ModalAction {
  label: string;
  onClick: () => void;
  variant?: string;
  disabled?: boolean;
}

type BooleanOrModalAction = boolean | ModalAction;

interface ModalParams {
  title: string;
  content: string;
  cancelAction: BooleanOrModalAction;
  okAction: BooleanOrModalAction;
}

interface Props {
  children: () => JSX.Element;
}

/**
 * Using the portal for handling modals
 */
export const ModalWrapper = (props: Props) => {
  const [visible, setVisible] = createSignal(false);
  const [type, setType] = createSignal(Constants.MODAL_TYPES.INFO);
  const [title, setTitle] = createSignal('');
  const [content, setContent] = createSignal(null);
  const [actions, setActions] = createSignal<ModalAction>([]);

  // * UTILS
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const toggleInfo = () => setType(Constants.MODAL_TYPES.INFO);
  const toggleWarning = () => setType(Constants.MODAL_TYPES.WARN);
  const resetActions = () => setActions([]);

  /**
   * Adding button (as action)
   * @param {ModalAction} params
   */
  const addAction = ({
    variant = Constants.VARIANTS.PRIMARY,
    disabled = false,
    ...action
  }: ModalAction) => {
    setActions(actions => [...actions, { ...action, variant, disabled }]);
  };

  // Reset to avoid side effects between modals (hide / show)
  const cleanup = () => {
    setType(Constants.MODAL_TYPES.INFO);
    setTitle('');
    setContent(null);
    setActions([]);
  };

  /**
   * Building a modal (without tears)
   * @param {ModalParams} params
   * @returns Utils: show / hide
   */
  const buildModal = ({
    title,
    content,
    cancelAction,
    okAction
  }: ModalProps) => {
    setTitle(title);
    setContent(content);

    // Handling 'cancel' button
    if (cancelAction) {
      const { label, onClick, disabled } = cancelAction;

      addAction({
        label: label || 'Cancel',
        onClick: onClick || hideModal,
        variant: Constants.VARIANTS.SECONDARY,
        disabled: disabled || false
      });
    }

    // Handling 'ok' button
    if (okAction) {
      const { label, onClick, disabled } = okAction;

      addAction({
        label: label || 'Ok',
        onClick: onClick || hideModal,
        variant: Constants.VARIANTS.PRIMARY,
        disabled: disabled || false
      });
    }

    return {
      show: showModal,
      hide: hideModal
    };
  };

  // Wrapper for building a (info) modal
  const buildInfoModal = (params: ModalParams) => {
    cleanup();
    toggleInfo();
    return buildModal(params);
  };

  // Wrapper for building a (warning) modal
  const buildWarningModal = (params: ModalParams) => {
    cleanup();
    toggleWarning();
    return buildModal(params);
  };

  return (
    <>
      <Portal>
        {visible() && (
          <Modal
            type={type()}
            title={title()}
            content={content()}
            actions={actions()}
          />
        )}
      </Portal>

      {/* Render Props Pattern */}
      {props.children({
        isModalVisible: visible,
        buildInfoModal,
        buildWarningModal,
        showModal,
        hideModal,
        toggleInfo,
        toggleWarning,
        setType,
        setTitle,
        setContent,
        addAction,
        resetActions,
        cleanupModal: cleanup
      })}
    </>
  );
};
