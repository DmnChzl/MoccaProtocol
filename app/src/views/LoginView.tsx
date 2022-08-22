import { useNavigate } from 'solid-app-router';
import { createEffect, createSignal } from 'solid-js';
import { TextField } from '../components/TextField';
import * as Constants from '../constants';
import { IconEye, IconEyeOff, IconKey, IconUser } from '../icons';
import { Logo } from '../icons/Logo';
// import * as PeerService from '../services/peerService';
import * as PeerService from '../services/fakeService';
import { useAppContext } from '../AppContext';

export const LoginView = props => {
  const [{ currentJwt, peerInfo }, { setCurrentJwt, updatePeerInfo }] =
    useAppContext();
  const [host, setHost] = createSignal('');
  const [pswd, setPswd] = createSignal('');
  const [pswdType, setPswdType] = createSignal('password');
  const [loading, setLoading] = createSignal(false);
  const navigate = useNavigate();

  /**
   * If the 'currentJwt' + 'ipAddress' exists in the context,
   * that's to say the user is connected (redirect)
   */
  createEffect(() => {
    if (currentJwt() && peerInfo().ipAddress) {
      navigate('/upload');
    }
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    setLoading(true);

    try {
      const { jwt } = await PeerService.connect(host(), pswd());

      setCurrentJwt(jwt);

      const { explicitName, collection } = await PeerService.getInfo(host());

      updatePeerInfo({
        ipAddress: host(),
        explicitName,
        collection
      });
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="flex flex-col justify-center h-screen">
      <Logo class="py-3 mx-auto" color={Constants.GRAY_600} />

      <form
        class="flex flex-col flex-grow-0 flex-shrink p-3 mx-3 sm:mx-auto sm:w-3/4 md:w-2/3 lg:w-1/2 bg-white border border-gray-200 rounded-md shadow-md"
        onSubmit={handleSubmit}>
        <span class="m-3 text-gray-800 text-lg font-semibold">Connection</span>

        <TextField
          startAdornment={
            <IconUser class="absolute left-0 my-auto mx-6 h-full text-gray-400 flex-shrink-0" />
          }
          placeholder="0.0.0.0"
          defaultValue={host()}
          onInput={e => setHost(e.target.value)}
        />

        <TextField
          startAdornment={
            <IconKey class="absolute left-0 my-auto mx-6 h-full text-gray-400 flex-shrink-0" />
          }
          placeholder="********"
          defaultValue={pswd()}
          type={pswdType()}
          onInput={e => setPswd(e.target.value)}
          endAdornment={
            <button
              class="absolute right-0 my-auto mx-6 h-full w-6 text-gray-400 flex-shrink-0"
              type="button"
              onClick={() =>
                setPswdType(val => (val === 'password' ? 'text' : 'password'))
              }>
              <Show when={pswdType() === 'password'} fallback={<IconEye />}>
                <IconEyeOff />
              </Show>
            </button>
          }
        />

        <button
          class="p-2 my-3 mx-auto w-48 font-semibold tracking-wider bg-blue-600 hover:bg-blue-500 focus:bg-blue-600 text-white focus:ring-2 ring-offset-2 focus:ring-blue-600 disabled:bg-blue-400 rounded-md enabled:shadow-md focus:shadow-none"
          type="submit"
          disabled={!host() || !pswd() || loading()}>
          {loading() ? 'Loading . . .' : 'Connect'}
        </button>
      </form>
    </div>
  );
};
