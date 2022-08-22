import { Match, mergeProps, Switch } from 'solid-js';
import * as Constants from '../constants';
import { IconInfo, IconWarning } from '../icons';

interface ModalAction {
  label: string;
  onClick: () => void;
  variant?: string;
  disabled?: boolean;
}

interface ModalProps {
  type?: string;
  title: string;
  content: JSX.Element;
  actions?: ModalAction[];
}

export const Modal = (props: ModalProps) => {
  const merged = mergeProps(
    { type: Constants.MODAL_TYPES.INFO, actions: [] },
    props
  );

  return (
    <div class="relative z-20">
      <div class="fixed inset-0 bg-black bg-opacity-50" />

      <div class="fixed inset-0 z-20">
        <div class="flex min-h-full">
          <div class="modal">
            <Switch>
              <Match when={merged.type === Constants.MODAL_TYPES.INFO}>
                <div class="flex my-3 mx-auto h-12 w-12 bg-blue-200 rounded-full shrink-0">
                  <IconInfo class="m-auto text-blue-600" />
                </div>
              </Match>

              <Match when={merged.type === Constants.MODAL_TYPES.WARN}>
                <div class="flex my-3 mx-auto h-12 w-12 bg-red-200 rounded-full shrink-0">
                  <IconWarning class="m-auto text-red-600" />
                </div>
              </Match>
            </Switch>

            <span class="mx-auto text-lg font-semibold">{props.title}</span>
            {props.content}

            <div class="flex px-3 w-full justify-center">
              <For each={merged.actions}>
                {action => (
                  <button
                    class="modal__action"
                    classList={{
                      'modal__action-primary-info':
                        merged.type === Constants.MODAL_TYPES.INFO &&
                        action.variant === Constants.VARIANTS.PRIMARY,

                      'modal__action-secondary-info':
                        merged.type === Constants.MODAL_TYPES.INFO &&
                        action.variant === Constants.VARIANTS.SECONDARY,

                      'modal__action-primary-warn':
                        merged.type === Constants.MODAL_TYPES.WARN &&
                        action.variant === Constants.VARIANTS.PRIMARY,

                      'modal__action-secondary-warn':
                        merged.type === Constants.MODAL_TYPES.WARN &&
                        action.variant === Constants.VARIANTS.SECONDARY
                    }}
                    type="button"
                    onClick={action.onClick}
                    disabled={action.disabled}>
                    {action.label}
                  </button>
                )}
              </For>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
