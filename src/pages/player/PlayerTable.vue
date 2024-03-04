<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { QTableColumn } from 'quasar';
import { useApiPlayerStore } from '@/apiStores/apiPlayer.store';
import { MenuEnum } from '@/enums/common.enum';

/** base */
const { getPlayerList } = useApiPlayerStore();
const { playerList } = storeToRefs(useApiPlayerStore());

void getPlayerList();

const columns: Array<QTableColumn<any>> = [
  {
    name: 'id',
    label: 'ID',
    align: 'center',
    field: row => row.id,
  },
  {
    name: 'name',
    label: '名稱',
    align: 'center',
    field: row => row.name,
  },
  {
    name: 'score',
    label: '積分',
    align: 'center',
    field: row => row.score,
  },
];

const pagination = {
  rowsPerPage: 50,
};

</script>

<template>
  <div>
    <q-item class="q-pa-none q-mb-md">
      <q-item-section>
        <q-btn
          class="text-capitalize"
          @click="getPlayerList"
          color="primary"
        >
          搜尋
        </q-btn>
      </q-item-section>
      <q-item-section>
        <q-btn
          class="text-capitalize"
          :to="{ name: MenuEnum.PlayerAdd }"
          color="secondary"
        >
          增加
        </q-btn>
      </q-item-section>
    </q-item>
    <q-table
      class="text-capitalize"
      :rows="playerList"
      :columns="columns"
      row-key="name"
      :pagination="pagination"
    />
  </div>
</template>
