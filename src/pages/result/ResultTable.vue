<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { QTableColumn } from 'quasar';
import { useApiResultStore } from '@/apiStores/apiResult.store';
import { MenuEnum } from '@/enums/common.enum';

/** base */
const { getResultList } = useApiResultStore();
const { resultList } = storeToRefs(useApiResultStore());

void getResultList();

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
  // TODO 顯示大比分
  {
    name: 'result',
    label: '比賽結果',
    align: 'center',
    field: () => '',
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
];

const pagination = {
  rowsPerPage: 10,
};

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
    />
  </div>
</template>
