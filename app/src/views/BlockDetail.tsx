import { useNavigate, useParams } from 'solid-app-router';
import { For } from 'solid-js';
import { useAppContext } from '../AppContext';
import { FlatCard } from '../components/FlatCard';
import { TopBar } from './TopBar';

export const BlockDetail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [{ peerInfo, chain }] = useAppContext();
  const block = () => chain().find(b => b.idx === +params.id);

  return (
    <div class="flex flex-col h-screen">
      <TopBar title="Chain Detail" goBack={() => navigate(-1)}>
        <p class="mt-3 text-gray-600">Block #{params.id}</p>
      </TopBar>

      <main class="flex-auto h-0 overflow-y-auto">
        <div class="grid md:grid-cols-2 lg:grid-cols-3">
          <For each={block().transactions}>
            {transaction => <FlatCard {...transaction} />}
          </For>
        </div>
      </main>
    </div>
  );
};
