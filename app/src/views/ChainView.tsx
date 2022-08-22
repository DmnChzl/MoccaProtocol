import { useNavigate } from 'solid-app-router';
import { createEffect, createResource, Show } from 'solid-js';
import { useAppContext } from '../AppContext';
import { CardItem, CardItemSkeleton } from '../components/CardItem';
import * as ChainService from '../services/chainService';
// import * as ChainService from '../services/fakeService';
import { TopBar } from './TopBar';

export const ChainView = () => {
  const navigate = useNavigate();
  const [{ peerInfo, chain }, { setChain }] = useAppContext();
  // Fetch 'chain' at component mount
  const [response] = createResource(
    peerInfo().ipAddress,
    ChainService.getChain
  );

  // Listening 'ChainService' response...
  createEffect(() => {
    if (!response.loading) {
      setChain(response());
    }
  });

  return (
    <div class="flex flex-col h-screen">
      <TopBar title="Chain" goBack={() => navigate(-1)} />

      <main class="flex-auto h-0 overflow-y-auto">
        <div class="grid md:grid-cols-2 lg:grid-cols-3">
          <Show when={!response.loading} fallback={<CardItemSkeleton />}>
            <For each={chain()}>{block => <CardItem {...block} />}</For>
          </Show>
        </div>
      </main>
    </div>
  );
};
