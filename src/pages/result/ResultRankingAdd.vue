<script setup lang="ts">
import { HttpStatusCode } from 'axios';
import { storeToRefs } from 'pinia';
import {
  Notify, QInput, QSelect,
} from 'quasar';
import {
  Ref, computed, ref, watch,
} from 'vue';
import { useRouter } from 'vue-router';
import { useApiEventStore } from '@/apiStores/apiEvent.store';
import { useApiPlayerStore } from '@/apiStores/apiPlayer.store';
import { useApiResultStore } from '@/apiStores/apiResult.store';
import DatePicker from '@/components/DatePicker.vue';
import TimePicker from '@/components/TimePicker.vue';
import { required } from '@/constants/rule.constant';
import {
  MenuEnum, SubEventTypeEnum,
} from '@/enums/common.enum';
import { ResultRankingPost } from '@/types/result';

/** base */
const { postResultRankingList } = useApiResultStore();
const { getEventList } = useApiEventStore();
const { eventOptions } = storeToRefs(useApiEventStore());
const { getPlayerList, getDoublePlayerList } = useApiPlayerStore();
const { playerList, doublePlayerList } = storeToRefs(useApiPlayerStore());

const router = useRouter();
const event = ref(null);

void getEventList();
void getPlayerList();
void getDoublePlayerList();

const commonDate = ref('');

const defaultResultRankingPost: ResultRankingPost = {
  event_id: null,
  player_id_a_1: null,
  player_id_a_2: null,
  player_id_b_1: null,
  player_id_b_2: null,
  doublePlayer_id_a: null,
  doublePlayer_id_b: null,
  resultItemList: [],
  resultDateTime: '',
  subEventType: SubEventTypeEnum.Single,
};

interface LocalResultRankingPost extends ResultRankingPost {
  localTime: string;
}

const postList: Ref<LocalResultRankingPost[]> = ref([{ ...defaultResultRankingPost, localTime: '' }]);
const eventRef = ref<QSelect>();

function checkMatchWinner(resultItemList: ResultRankingPost['resultItemList']) {
  const validScores = resultItemList.filter(
    item => !Number.isNaN(item.scoreA) && !Number.isNaN(item.scoreB),
  );

  const aWins = validScores.filter(item => item.scoreA > item.scoreB).length;
  const bWins = validScores.filter(item => item.scoreA < item.scoreB).length;

  return { aWins, bWins, hasWinner: aWins >= 3 || bWins >= 3 };
}

function validateTableTennisScore(scoreA: number, scoreB: number) {
  if (Number.isNaN(scoreA) || Number.isNaN(scoreB)) {
    return true;
  }

  if (scoreA < 0 || scoreB < 0) {
    return false;
  }

  // 如果雙方都超過10分
  if (scoreA >= 10 && scoreB >= 10) {
    // 必須要有2分差距
    const diff = Math.abs(scoreA - scoreB);

    return diff === 2;
  }

  // 獲勝方必須得到11分
  if (scoreA === 11 || scoreB === 11) {
    return true;
  }

  return false;
}

function onReset() {
  postList.value.length = 0;
  postList.value.push({ ...defaultResultRankingPost, localTime: '' });
}

async function onSubmit() {
  if (!event.value) {
    eventRef.value?.focus();
    return;
  }

  const isValid = postList.value.every(post => post.localTime && commonDate.value);

  if (!isValid) {
    Notify.create({
      message: '請確保所有記錄都有日期和時間',
      color: 'negative',
    });
    return;
  }

  // 檢查所有玩家的比分
  const hasInvalidScores = postList.value.some(post => {
    if (post.resultItemList.length === 0) {
      Notify.create({
        message: '每場比賽至少要有一局比分',
        color: 'negative',
      });
      return true;
    }

    // 檢查是否所有局數都已輸入
    const hasEmptyScores = post.resultItemList.some(
      item => Number.isNaN(item.scoreA) || Number.isNaN(item.scoreB),
    );

    if (hasEmptyScores) {
      Notify.create({
        message: '請填寫所有局數的比分',
        color: 'negative',
      });
      return true;
    }

    // 檢查比分是否符合規則
    const hasInvalidScores1 = post.resultItemList.some(
      item => !validateTableTennisScore(item.scoreA, item.scoreB),
    );

    if (hasInvalidScores1) {
      Notify.create({
        message: '請確保所有比分符合桌球規則',
        color: 'negative',
      });
      return true;
    }

    // 檢查是否符合五戰三勝
    const { aWins, bWins } = checkMatchWinner(post.resultItemList);

    if (aWins < 3 && bWins < 3) {
      Notify.create({
        message: '每場比賽必須打到有一方獲得三勝',
        color: 'negative',
      });
      return true;
    }

    return false;
  });

  if (hasInvalidScores) {
    return;
  }

  const postData = postList.value.map(post => ({
    event_id: event.value,
    player_id_a_1: post.player_id_a_1,
    player_id_a_2: post.player_id_a_2,
    player_id_b_1: post.player_id_b_1,
    player_id_b_2: post.player_id_b_2,
    doublePlayer_id_a: post.doublePlayer_id_a,
    doublePlayer_id_b: post.doublePlayer_id_b,
    resultItemList: post.resultItemList,
    resultDateTime: post.resultDateTime,
    subEventType: post.subEventType,
  }));

  const res = await postResultRankingList(postData);

  if (res?.status === HttpStatusCode.Ok) {
    Notify.create({
      message: '新增成功',
      color: 'primary',
    });

    router.push({ name: MenuEnum.Result });
  } else {
    Notify.create({
      message: '新增失敗',
      color: 'negative',
    });
  }
}

function addField() {
  // 檢查當前玩家的所有比分
  const currentResult = postList.value[postList.value.length - 1];

  // 檢查是否有輸入比分
  if (currentResult.resultItemList.length === 0) {
    Notify.create({
      message: '請至少輸入一局比分',
      color: 'warning',
    });
    return;
  }

  // 檢查是否所有局數都已輸入
  const hasEmptyScores = currentResult.resultItemList.some(
    item => Number.isNaN(item.scoreA) || Number.isNaN(item.scoreB),
  );

  if (hasEmptyScores) {
    Notify.create({
      message: '請填寫所有已新增局數的比分',
      color: 'warning',
    });
    return;
  }

  // 檢查比分是否符合規則
  const hasInvalidScores = currentResult.resultItemList.some(
    item => !validateTableTennisScore(item.scoreA, item.scoreB),
  );

  if (hasInvalidScores) {
    Notify.create({
      message: '請確保所有比分符合桌球規則',
      color: 'warning',
    });
    return;
  }

  // 檢查是否符合五戰三勝
  const { aWins, bWins } = checkMatchWinner(currentResult.resultItemList);

  if (aWins < 3 && bWins < 3) {
    Notify.create({
      message: '請先完成當前比賽（需要有一方獲得三勝）',
      color: 'warning',
    });
    return;
  }

  postList.value.push({
    ...defaultResultRankingPost,
    resultItemList: [],
    localTime: '',
  });
}

const tableTennisScoreRule = (val: number) => {
  const score = Number(val);

  if (Number.isNaN(score)) {
    return '請輸入有效數字';
  }

  return true;
};

function addScoreField(list: ResultRankingPost['resultItemList']) {
  if (list.length >= 5) {
    Notify.create({
      message: '最多只能新增五局',
      color: 'warning',
    });
    return;
  }

  // 只有在有比分時才檢查勝負
  if (list.length > 0 && checkMatchWinner(list).hasWinner) {
    Notify.create({
      message: '比賽已經分出勝負，無需再增加比分',
      color: 'warning',
    });
    return;
  }

  if (list.length > 0) {
    const lastScore = list[list.length - 1];

    if (!validateTableTennisScore(lastScore.scoreA, lastScore.scoreB)) {
      Notify.create({
        message: '請確保上一局比分符合桌球規則',
        color: 'warning',
      });
      return;
    }
  }

  list.push({
    matchIndex: list.length + 1,
    scoreA: NaN,
    scoreB: NaN,
  });
}

function removeField(index: number, list: unknown[]) {
  list.splice(index, 1);
}

watch(commonDate, newDate => {
  if (newDate) {
    postList.value.forEach(post => {
      if (post.localTime) {
        post.resultDateTime = `${newDate} ${post.localTime}`;
      }
    });
  }
});

function handleTimeChange(time: string, index: number) {
  if (time) {
    postList.value[index].localTime = time;

    if (commonDate.value) {
      postList.value[index].resultDateTime = `${commonDate.value} ${time}`;
    }
  }
}

// 新增 watch 來處理雙打和單打的值同步
watch(postList, newList => {
  newList.forEach(result => {
    if (result.subEventType === SubEventTypeEnum.Single) {
      // 單打時清空雙打相關欄位
      result.player_id_a_2 = null;
      result.player_id_b_2 = null;
      result.doublePlayer_id_a = null;
      result.doublePlayer_id_b = null;
    } else {
      // 雙打時根據 doublePlayer 設定對應的選手
      if (result.doublePlayer_id_a) {
        const doubleTeamA = doublePlayerList.value.find(
          team => team.id === result.doublePlayer_id_a,
        );

        if (doubleTeamA) {
          result.player_id_a_1 = doubleTeamA.player_id_1;
          result.player_id_a_2 = doubleTeamA.player_id_2;
        }
      }

      if (result.doublePlayer_id_b) {
        const doubleTeamB = doublePlayerList.value.find(
          team => team.id === result.doublePlayer_id_b,
        );

        if (doubleTeamB) {
          result.player_id_b_1 = doubleTeamB.player_id_1;
          result.player_id_b_2 = doubleTeamB.player_id_2;
        }
      }
    }
  });
}, { deep: true });

// #region 可以讓 select 有篩選功能
const filterPlayerList = ref(playerList.value);

function filterPlayerFn(val:string, update: (cb: () => void) => void) {
  if (val === '') {
    update(() => {
      filterPlayerList.value = playerList.value;
    });

    return;
  }

  update(() => {
    const needle = val.toLowerCase();

    filterPlayerList.value = playerList.value.filter(
      v => new RegExp(needle).test(v.name.toLowerCase()),
    );
  });
}

const doublePlayerOptions = computed(() => doublePlayerList.value.map(team => ({
  id: team.id,
  name: `${team.teamName} - (${team.player_name_1}/${team.player_name_2})`,
})));
const filterDoublePlayerList = ref(doublePlayerOptions.value);

function filterDoubleFn(val:string, update: (cb: () => void) => void) {
  if (val === '') {
    update(() => {
      filterDoublePlayerList.value = doublePlayerOptions.value;
    });

    return;
  }

  update(() => {
    const needle = val.toLowerCase();

    filterDoublePlayerList.value = doublePlayerOptions.value.filter(
      v => new RegExp(needle).test(v.name.toLowerCase()),
    );
  });
}
// endregion

</script>

<template>
  <div>
    <q-item>
      <q-item-section>
        <q-select
          ref="eventRef"
          v-model="event"
          :options="eventOptions"
          label="選擇賽事"
          option-label="label"
          option-value="key"
          emit-value
          map-options
          :rules="[required()]"
        />
      </q-item-section>
      <q-item-section>
        <DatePicker
          v-model="commonDate"
          label="設定共用日期"
          :rules="[required()]"
        />
      </q-item-section>
    </q-item>
    <q-form
      @submit="onSubmit"
      @reset="onReset"
    >
      <q-list>
        <div
          v-for="(result, key) in postList"
          :key="key"
          class="row q-pa-md q-col-gutter-md"
        >
          <div class="col-1">
            <q-field>
              <template #control>
                {{ key + 1 }}
              </template>
            </q-field>
          </div>
          <div class="col-2">
            <q-option-group
              v-model="result.subEventType"
              :options="[
                { label: '單打', value: SubEventTypeEnum.Single },
                { label: '雙打', value: SubEventTypeEnum.Double },
              ]"
              color="primary"
              inline
            />
          </div>
          <div class="col-4">
            <q-select
              v-if="result.subEventType === SubEventTypeEnum.Single"
              v-model="result.player_id_a_1"
              :options="filterPlayerList"
              :label="'選擇選手A'"
              option-label="name"
              option-value="id"
              emit-value
              map-options
              use-input
              input-debounce="0"
              @filter="filterPlayerFn"
              :rules="[required()]"
            />
            <q-select
              v-else
              v-model="result.doublePlayer_id_a"
              :options="filterDoublePlayerList"
              :label="'選擇雙打隊伍A'"
              option-label="name"
              option-value="id"
              emit-value
              map-options
              use-input
              input-debounce="0"
              @filter="filterDoubleFn"
              :rules="[required()]"
            />
          </div>
          <div class="col-4">
            <q-select
              v-if="result.subEventType === SubEventTypeEnum.Single"
              v-model="result.player_id_b_1"
              :options="filterPlayerList"
              :label="'選擇選手B'"
              option-label="name"
              option-value="id"
              emit-value
              map-options
              use-input
              input-debounce="0"
              @filter="filterPlayerFn"
              :rules="[required()]"
            />
            <q-select
              v-else
              v-model="result.doublePlayer_id_b"
              :options="filterDoublePlayerList"
              :label="'選擇雙打隊伍B'"
              option-label="name"
              option-value="id"
              emit-value
              map-options
              use-input
              input-debounce="0"
              @filter="filterDoubleFn"
              :rules="[required()]"
            />
          </div>
          <div class="col-1">
            <q-btn
              v-if="key !== 0"
              flat
              icon="mdi-delete"
              color="negative"
              size="md"
              @click="removeField(key, postList)"
            />
          </div>
          <div
            class="col-12 row"
          >
            <div class="col-12 row">
              <div class="col-3">
                <q-btn
                  @click="addScoreField(result.resultItemList)"
                  color="secondary"
                  label="增加比分"
                  class="full-width"
                  :disable="result.resultItemList.length >= 5"
                />
              </div>
              <div class="col-3">
                <TimePicker
                  v-model="result.localTime"
                  label="比賽時間"
                  :rules="[required()]"
                  @update:model-value="(time: string) => handleTimeChange(time, key)"
                />
              </div>
              <div class="col-6 row items-center q-gutter-x-sm">
                <template v-if="result.resultItemList.length > 0">
                  <div
                    v-for="(resultItem, resultItemKey) in result.resultItemList"
                    :key="resultItemKey"
                    class="col-12 row items-center q-my-xs"
                  >
                    <div class="text-caption text-grey-8">
                      {{ resultItem.matchIndex }}.
                    </div>
                    <q-input
                      dense
                      outlined
                      type="number"
                      v-model.number="resultItem.scoreA"
                      class="col-2 q-mx-md"
                      :rules="[required(), tableTennisScoreRule]"
                    />
                    <div class="text-subtitle1">
                      :
                    </div>
                    <q-input
                      dense
                      outlined
                      type="number"
                      v-model.number="resultItem.scoreB"
                      class="col-2 q-mx-md"
                      :rules="[required(), tableTennisScoreRule]"
                    />
                    <q-btn
                      v-if="resultItemKey === result.resultItemList.length - 1"
                      flat
                      dense
                      round
                      icon="mdi-delete"
                      color="negative"
                      size="sm"
                      @click="removeField(resultItemKey, result.resultItemList)"
                      class="q-ml-md"
                    />
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
        <q-item class="row">
          <q-item-section class="col-3">
            <q-btn
              @click="addField()"
              color="secondary"
              label="增加對戰記錄"
            />
          </q-item-section>
          <q-item-section class="col-2 offset-5">
            <q-btn
              label="送出"
              type="submit"
              color="primary"
            />
          </q-item-section>
          <q-item-section class="col-2">
            <q-btn
              label="重置"
              type="reset"
              color="primary"
              flat
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-form>
  </div>
</template>
