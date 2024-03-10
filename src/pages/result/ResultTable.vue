<script setup lang="ts">
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { storeToRefs } from 'pinia';
import {
  QTableColumn, useQuasar,
} from 'quasar';
import { reactive } from 'vue';
import { useApiEventStore } from '@/apiStores/apiEvent.store';
import { useApiPlayerStore } from '@/apiStores/apiPlayer.store';
import { useApiResultStore } from '@/apiStores/apiResult.store';
import { useApiResultItemStore } from '@/apiStores/apiResultItem.store';
import { useResultApi } from '@/apis/result.api';
import { useResultItemApi } from '@/apis/resultItem.api';
import DatePicker from '@/components/DatePicker.vue';
import ScoreDialog from '@/components/ScoreDialog.vue';
import SelectDialog from '@/components/SelectDialog.vue';
import { eventTypeOptions } from '@/constants/common.constant';
import {
  EventTypeEnum, MenuEnum,
} from '@/enums/common.enum';
import {
  Result, ResultGet,
} from '@/types/result';
import { ResultItem } from '@/types/resultItem';

/** base */
const $q = useQuasar();
const { getResultList } = useApiResultStore();
const { getPlayerList } = useApiPlayerStore();
const { getResultItemList } = useApiResultItemStore();
const { resultList } = storeToRefs(useApiResultStore());
const { playerList } = storeToRefs(useApiPlayerStore());
const { resultItemList } = storeToRefs(useApiResultItemStore());
const { putResult } = useResultApi();
const { postResultItem, putResultItem } = useResultItemApi();
const { getEventList } = useApiEventStore();
const { eventOptions } = storeToRefs(useApiEventStore());

dayjs.extend(utc);
dayjs.extend(timezone);

const resultData = reactive<ResultGet>({
  event_id: null,
  event_type: EventTypeEnum.Ranking,
  startDate: dayjs().tz('Asia/Taipei').format('YYYY-MM-DD'),
});

void getResultList(resultData);
void getPlayerList();
void getEventList();

const getDate = (dateTime: string) => dayjs(dateTime).tz('Asia/Taipei').format('YYYY-MM-DD');
const getTime = (dateTime: string) => dayjs(dateTime).tz('Asia/Taipei').format('HH:mm');

const columns: Array<QTableColumn<any>> = [
  {
    name: 'event_name',
    label: '賽事名稱',
    align: 'center',
    field: row => row.event_name,
  },
  {
    name: 'resultDateTime',
    label: '日期時間',
    align: 'center',
    field: row => (`${getDate(row.resultDateTime)} ${getTime(row.resultDateTime)}`),
  },
  {
    name: 'round',
    label: '第幾輪',
    align: 'center',
    field: row => row.round,
  },
  {
    name: 'roundIndex',
    label: '此輪場次',
    align: 'center',
    field: row => row.roundIndex,
  },
  {
    name: 'result',
    label: '比賽結果',
    align: 'center',
    field: row => (row.scoreA || row.scoreB ? `${row.scoreA} : ${row.scoreB}` : '-'),
  },
  {
    name: 'round',
    label: '選手A',
    align: 'center',
    field: row => {
      if (row.player_nameA1 && row.player_nameA2) {
        return `${row.player_nameA1} / ${row.player_nameA2}`;
      }

      if (row.player_nameA1 !== null || row.player_nameA2 !== null) {
        return row.player_nameA1 ? row.player_nameA1 : row.player_nameA2;
      }

      return '';
    },
  },
  {
    name: 'round',
    label: '選手B',
    align: 'center',
    field: row => {
      if (row.player_nameB1 && row.player_nameB2) {
        return `${row.player_nameB1} / ${row.player_nameB2}`;
      }

      if (row.player_nameB1 !== null || row.player_nameB2 !== null) {
        return row.player_nameB1 ? row.player_nameB1 : row.player_nameB2;
      }

      return '';
    },
  },
  {
    name: 'editPlayer',
    label: '編輯選手',
    align: 'center',
    field: () => '',
  },
  {
    name: 'editScore',
    label: '編輯比分',
    align: 'center',
    field: () => '',
  },
];

const pagination = {
  rowsPerPage: 30,
};

async function editPlayer(row: Result) {
  $q.dialog({
    component: SelectDialog,
    componentProps: {
      title: '編輯選手名稱',
      options: playerList.value,
      isSingleMatch: row.isSingleMatch,
      playerIdList: [
        row.player_id_a_1,
        row.player_id_a_2,
        row.player_id_b_1,
        row.player_id_b_2,
      ],
    },
  }).onOk(async (player: (number | null)[]) => {
    const putData = {
      id: row.id,
      player_id_a_1: player[0],
      player_id_a_2: player[1],
      player_id_b_1: player[2],
      player_id_b_2: player[3],
    };

    await putResult(putData);

    getResultList(resultData);
  });
}

async function editScore(row: Result) {
  await getResultItemList(row.id);

  $q.dialog({
    component: ScoreDialog,
    componentProps: {
      id: row.id,
      list: resultItemList.value,
      playerA1: row.player_nameA1,
      playerA2: row.player_nameA2,
      playerB1: row.player_nameB1,
      playerB2: row.player_nameB2,
    },
  }).onOk(async (list: ResultItem[] | null) => {
    if (list === null) {
      return;
    }

    const postList = list.map(item => ({
      ...item,
      player_id_a_1: row.player_id_a_1,
      player_id_a_2: row.player_id_a_2,
      player_id_b_1: row.player_id_b_1,
      player_id_b_2: row.player_id_b_2,
    }));

    await (resultItemList.value.length === 0 ? postResultItem(postList) : putResultItem(postList));
    getResultList(resultData);
  });
}

// async function deleteResultFn() {
//   $q.dialog({
//     title: '刪除',
//     message: '確認要刪除賽程嗎？刪除後無法復原。輸入 1 刪除單打，輸入 2 刪除雙打',
//     prompt: {
//       model: '',
//       type: 'number',
//     },
//     cancel: true,
//     persistent: true,
//   }).onOk(async (data: string) => {
//     await deleteResult(Number(data));
//     void getResultList(resultData);
//   }).onCancel(() => {
//     // console.log('>>>> Cancel')
//   }).onDismiss(() => {
//     // console.log('I am triggered on both OK and Cancel')
//   });
// }

</script>

<template>
  <div>
    <q-item class="overflow-auto">
      <q-form
        class="row col-12 q-col-gutter-md"
        @submit="getResultList(resultData)"
      >
        <q-select
          class="col-3"
          v-model="resultData.event_id"
          :options="eventOptions"
          label="選擇賽事"
          option-label="label"
          option-value="key"
          emit-value
          map-options
        />
        <q-select
          class="col-3"
          v-model="resultData.event_type"
          :options="eventTypeOptions"
          option-label="label"
          option-value="key"
          emit-value
          map-options
          label="賽事類型"
        />
        <DatePicker
          class="col-3"
          v-model="resultData.startDate"
        />
        <div class="col-3">
          <q-btn
            class="fit"
            type="submit"
            color="primary"
          >
            搜尋
          </q-btn>
        </div>
      </q-form>
    </q-item>
    <q-item class="q-ma-md q-pa-none overflow-auto">
      <div class="row col-12 q-col-gutter-md">
        <div class="col-4">
          <q-btn
            class="fit"
            :to="{ name: MenuEnum.ResultAdd }"
            color="secondary"
          >
            增加單淘汰賽事
          </q-btn>
        </div>
        <div class="col-4">
          <q-btn
            class="fit"
            :to="{ name: MenuEnum.ResultRankingAdd }"
            color="secondary"
          >
            增加積分賽結果
          </q-btn>
        </div>
      </div>
    </q-item>
    <q-table
      class="text-capitalize"
      :rows="resultList"
      :columns="columns"
      row-key="name"
      :pagination="pagination"
    >
      <template #body-cell-editPlayer="props">
        <q-td
          key="editPlayer"
          :props="props"
        >
          <q-btn
            dense
            flat
            round
            color="primary"
            icon="mdi-pencil"
            @click="editPlayer(props.row)"
          />
        </q-td>
      </template>
      <template #body-cell-editScore="props">
        <q-td
          key="editScore"
          :props="props"
        >
          <q-btn
            dense
            flat
            round
            color="secondary"
            icon="mdi-pencil"
            @click="editScore(props.row)"
          />
        </q-td>
      </template>
    </q-table>

    <!-- TODO 重新調整此功能後再開啟 -->
    <!-- <q-btn
      class="q-mt-xl"
      color="red"
      icon="mdi-delete"
      @click="deleteResultFn()"
      label="刪除賽程"
    /> -->
  </div>
</template>
