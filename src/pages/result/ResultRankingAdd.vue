<script setup lang="ts">
import { HttpStatusCode } from 'axios';
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia';
import {
  Notify, QInput, QSelect,
} from 'quasar';
import {
  Ref, ref,
} from 'vue';
import { useRouter } from 'vue-router';
import { useApiEventStore } from '@/apiStores/apiEvent.store';
import { useApiPlayerStore } from '@/apiStores/apiPlayer.store';
import { useApiResultStore } from '@/apiStores/apiResult.store';
import { required } from '@/constants/rule.constant';
import { MenuEnum } from '@/enums/common.enum';
import { ResultRankingPost } from '@/types/result';

/** base */
const { postResultRankingList } = useApiResultStore();
const { getEventList } = useApiEventStore();
const { eventOptions } = storeToRefs(useApiEventStore());
const { getPlayerList } = useApiPlayerStore();
const { playerList } = storeToRefs(useApiPlayerStore());
const resultDate = ref(dayjs().format('YYYY-MM-DD'));

const router = useRouter();
const event = ref(null);

void getEventList();
void getPlayerList();

const defaultResultRankingPost: ResultRankingPost = {
  event_id: null,
  player_id_a_1: null,
  player_id_b_1: null,
  resultItemList: [],
  resultDate: null,
};
const postList: Ref<ResultRankingPost[]> = ref([{ ...defaultResultRankingPost }]);
const eventRef = ref<QSelect>();
const dateRef = ref<QInput>();

function onReset() {
  postList.value.length = 0;
  postList.value.push({ ...defaultResultRankingPost });
}

async function onSubmit() {
  if (!event.value) {
    eventRef.value?.focus();

    return;
  }

  if (!resultDate.value) {
    dateRef.value?.focus();

    return;
  }

  const postData = postList.value.map(post => ({
    ...post,
    event_id: event.value,
    resultDate: `${resultDate.value}T${post.resultDate}Z`,
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
  postList.value.push({
    ...defaultResultRankingPost,
    resultItemList: [],
  });
}

function addScoreField(list: ResultRankingPost['resultItemList']) {
  list.push({
    matchIndex: list.length + 1,
    scoreA: NaN,
    scoreB: NaN,
  });
}

function removeField(index: number, list: unknown[]) {
  list.splice(index, 1);
}

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
        <q-input
          ref="dateRef"
          filled
          type="date"
          v-model="resultDate"
          label="比賽日期"
          lazy-rules
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
          <div class="col-5">
            <q-select
              v-model="result.player_id_a_1"
              :options="playerList"
              label="選擇選手A"
              option-label="name"
              option-value="id"
              emit-value
              map-options
              :rules="[required()]"
            />
          </div>
          <div class="col-5">
            <q-select
              v-model="result.player_id_b_1"
              :options="playerList"
              label="選擇選手B"
              option-label="name"
              option-value="id"
              emit-value
              map-options
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
              <div class="col-4">
                <q-btn
                  @click="addScoreField(result.resultItemList)"
                  color="secondary"
                  label="增加比分"
                />
              </div>
              <div class="col-4">
                <q-input
                  filled
                  type="time"
                  v-model="result.resultDate"
                  label="比賽時間"
                  lazy-rules
                  :rules="[required()]"
                />
              </div>
            </div>
            <q-item
              v-for="(resultItem, resultItemKey) in result.resultItemList"
              :key="resultItemKey"
              class="row col-12"
            >
              <q-item-section class="col-1">
                <q-field>
                  <template #control>
                    {{ resultItem.matchIndex }}
                  </template>
                </q-field>
              </q-item-section>
              <q-item-section class="col-5">
                <q-input
                  filled
                  type="number"
                  v-model.number="resultItem.scoreA"
                  label="比分A"
                  lazy-rules
                  :rules="[required()]"
                />
              </q-item-section>
              <q-item-section class="col-5">
                <q-input
                  filled
                  type="number"
                  v-model.number="resultItem.scoreB"
                  label="比分B"
                  lazy-rules
                  :rules="[required()]"
                />
              </q-item-section>

              <q-item-section class="col-1">
                <q-btn
                  v-if="resultItemKey === result.resultItemList.length - 1"
                  flat
                  icon="mdi-delete"
                  color="negative"
                  size="md"
                  @click="removeField(resultItemKey, result.resultItemList)"
                />
              </q-item-section>
            </q-item>
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
