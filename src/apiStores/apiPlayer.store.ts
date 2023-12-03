import { defineStore } from 'pinia';
import {
  readonly, ref, shallowReactive, toRefs,
} from 'vue';
import { usePlayerApi } from '@/apis/player.api';
import {
  Player, PlayerPost,
} from '@/types/player';

export const useApiPlayerStore = defineStore('apiPlayer', () => {
  // state
  const state = shallowReactive({
    playerList: [] as Player[],
  });

  const test = ref('');

  async function getPlayerList() {
    const res = await usePlayerApi().getPlayerList();

    if (res?.data) {
      state.playerList = res.data;
    }
  }

  function postPlayerList(postData: PlayerPost[]) {
    return usePlayerApi().postPlayer(postData);
  }

  return {
    ...toRefs(readonly(state)),
    getPlayerList,
    postPlayerList,
    state,
    test,
  };
});
