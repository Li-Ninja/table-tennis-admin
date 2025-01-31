import { useApi } from '@/composables/useApi';
import {
  DoublePlayer, Player, PlayerPost,
} from '@/types/player';

const { getApi, postApi } = useApi();

export function usePlayerApi() {
  const url = {
    player: '/player',
    playerList: '/player',
    doublePlayerList: '/player/doublePlayer',
  };

  function getPlayerList() {
    return getApi<Player[]>(url.playerList);
  }

  function getDoublePlayerList() {
    return getApi<DoublePlayer[]>(url.doublePlayerList);
  }

  function postPlayer(postData: PlayerPost[]) {
    return postApi(url.player, postData);
  }

  return {
    getPlayerList,
    getDoublePlayerList,
    postPlayer,
  };
}
