import { defineStore } from 'pinia';
import {
  readonly, ref, shallowReactive, toRefs,
} from 'vue';
import { usePlayerApi } from '@/apis/player.api';
import {
  DoublePlayer,
  Player, PlayerPost,
} from '@/types/player';

export const useApiPlayerStore = defineStore('apiPlayer', () => {
  // state
  const state = shallowReactive({
    playerList: [] as Player[],
    doublePlayerList: [] as DoublePlayer[],
  });

  const test = ref('');

  async function getPlayerList() {
    const res = await usePlayerApi().getPlayerList();

    if (res?.data) {
      state.playerList = res.data;
    }
  }

  async function getDoublePlayerList() {
    const res = await usePlayerApi().getDoublePlayerList();

    if (res?.data) {
      state.doublePlayerList = res.data;
    }
  }

  function postPlayerList(postData: PlayerPost[]) {
    return usePlayerApi().postPlayer(postData);
  }

  return {
    ...toRefs(readonly(state)),
    getPlayerList,
    getDoublePlayerList,
    postPlayerList,
    state,
    test,
  };
});
