<script setup lang="ts">
import { storeToRefs } from 'pinia';
import {
  QTableColumn, useQuasar,
} from 'quasar';
import { useApiPlayerStore } from '@/apiStores/apiPlayer.store';
import { useApiResultStore } from '@/apiStores/apiResult.store';
import { useResultApi } from '@/apis/result.api';
import SelectDialog from '@/components/SelectDialog.vue';
import { MenuEnum } from '@/enums/common.enum';
import { Result } from '@/types/result';

/** base */

/** base */
const $q = useQuasar();
const { getResultList } = useApiResultStore();
const { getPlayerList } = useApiPlayerStore();
const { resultList } = storeToRefs(useApiResultStore());
const { playerList } = storeToRefs(useApiPlayerStore());
const { putResult } = useResultApi();

void getResultList();
void getPlayerList();

const columns: Array<QTableColumn<any>> = [
  {
    name: 'event_name',
    label: '賽事名稱',
    align: 'center',
    field: row => row.event_name,
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
    field: row => (row.scoreA ? `${row.scoreA} : ${row.scoreB}` : '-'),
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
  rowsPerPage: 10,
};

async function editPlayer(row: Result) {
  $q.dialog({
    component: SelectDialog,
    componentProps: {
      title: '編輯選手名稱',
      options: playerList.value,
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

    getResultList();
  });
}

</script>

<template>
  <div>
    <q-item class="q-pa-none q-mb-md">
      <q-item-section>
        <q-btn
          class="text-capitalize"
          @click="getResultList"
          color="primary"
        >
          搜尋
        </q-btn>
      </q-item-section>
      <q-item-section>
        <q-btn
          class="text-capitalize"
          :to="{ name: MenuEnum.ResultAdd }"
          color="secondary"
        >
          增加
        </q-btn>
      </q-item-section>
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
    </q-table>
  </div>
</template>
