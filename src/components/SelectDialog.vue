<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar';
import {
  computed, ref,
} from 'vue';

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const props = withDefaults(defineProps<{
  title?: string;
  isSingleMatch: boolean;
  options: {id: number | null; name: string}[];
  playerIdList:(number | null)[];
}>(), {
  title: '',
  isSingleMatch: false,
  options: undefined,
  playerIdList: undefined,
});

const options = computed(() => [{
  id: null,
  name: '',
},
...props.options,
]);

const result = ref([...props.playerIdList]);

function onCancel() {
  onDialogCancel();
}

function onConfirm() {
  onDialogOK(result.value);
}

</script>

<template>
  <q-dialog
    ref="dialogRef"
    no-backdrop-dismiss
  >
    <q-card
      class="q-pa-xl"
      style="width: 800px"
    >
      <!-- title -->
      <q-card-section class="q-mb-lg">
        <div class="text-weight-medium text-grey-8">
          {{ props.title }}
        </div>
        <q-space />
      </q-card-section>
      <q-separator />

      <!-- content -->
      <q-card-section class="q-mb-lg">
        <template
          v-for="(num, index) in result.length"
          :key="index"
        >
          <!-- TODO label 這邊要在修改 -->
          <q-select
            v-model="result[index]"
            :disable="props.isSingleMatch && num === 2"
            :options="options"
            :label="`選擇選手_${(num === 1 || num === 2) ? 'A_' + num : 'B_' + Math.floor(num / 2)}`"
            option-label="name"
            option-value="id"
            emit-value
            map-options
          />
        </template>
      </q-card-section>

      <q-card-actions
        align="around"
        class="no-padding"
      >
        <q-btn
          :ripple="false"
          no-caps
          color="grey-4"
          text-color="grey-6"
          label="取消"
          class="col no-border-radius text-caption dialog__btn"
          @click="onCancel()"
        />
        <q-btn
          :ripple="false"
          no-caps
          color="primary"
          label="確認"
          class="col no-border-radius text-caption no-margin text-capitalize dialog__btn"
          @click="onConfirm()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
