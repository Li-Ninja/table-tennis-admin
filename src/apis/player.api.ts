import { useApi } from '@/composables/useApi';
import {
  Player, PlayerPost,
} from '@/types/player';

const { getApi, postApi } = useApi();

export function usePlayerApi() {
  const url = {
    player: '/player',
    playerList: '/player',
  };

  function getPlayerList() {
    return getApi<Player[]>(url.playerList);
  }

  function postPlayer(postData: PlayerPost[]) {
    return postApi(url.player, postData);
  }

  return {
    getPlayerList,
    postPlayer,
  };
}
