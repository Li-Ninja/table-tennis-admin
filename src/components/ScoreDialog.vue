<script lang="ts" setup>
import {
  useDialogPluginComponent, useQuasar,
} from 'quasar';
import { ref } from 'vue';
import { useResultItemApi } from '@/apis/resultItem.api';
import { required } from '@/constants/rule.constant';
import { ResultItem } from '@/types/resultItem';

const $q = useQuasar();
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent();
const { deleteResultItem } = useResultItemApi();

const props = withDefaults(defineProps<{
  id: number;
  list: ResultItem[];
  playerA1: string | null;
  playerA2: string | null;
  playerB1: string | null;
  playerB2: string | null;
}>(), {
  id: 0,
  list: () => [] as ResultItem[],
  playerA1: null,
  playerA2: null,
  playerB1: null,
  playerB2: null,
});

const localList = ref([...props.list]);

function onReset() {
  onDialogCancel();
}

function onSubmit() {
  if (localList.value.length === 0) {
    return;
  }

  onDialogOK(localList.value);
}

const defaultWordPost: ResultItem = {
  result_Id: 0,
  matchIndex: 0,
  scoreA: 0,
  scoreB: 0,
};

function addField() {
  localList.value.push({
    ...defaultWordPost,
    result_Id: props.id,
    matchIndex: localList.value.length + 1,
  });
}

function removeField(index: number) {
  localList.value.splice(index, 1);
}

function deleteResultItemFn() {
  $q.dialog({
    title: '清空對戰記錄',
    message: '確認要清空此對戰記錄嗎？刪除後無法復原。',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    await deleteResultItem(props.id);
  }).onCancel(() => {
    // console.log('>>>> Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  });
  console.log();
  onDialogOK(null);
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
      <q-card-section class="q-mb-lg row justify-between">
        <div class="col-6 text-weight-medium text-grey-8">
          比分表
        </div>
        <div class="col-6">
          <q-btn
            class="text-capitalize absolute-right"
            @click="addField()"
            color="secondary"
            label="增加"
          />
        </div>
        <q-space />
      </q-card-section>
      <q-separator />
      <q-card-section class="q-mb-lg row justify-between">
        <div class="">
          <q-btn
            color="red"
            icon="mdi-delete"
            @click="deleteResultItemFn()"
            label="清空記錄"
          />
          清空之後重新編輯才會儲存
        </div>
      </q-card-section>
      <q-separator />

      <!-- content -->
      <q-card-section class="q-mb-lg">
        <div class="row">
          <div class="col-6">
            選手A：{{ props.playerA1 }}{{ props.playerA2 ? ' / ' + props.playerA2 : '' }}
          </div>
          <div class="col-6">
            選手B： {{ props.playerB1 }}{{ props.playerB2 ? ' / ' + props.playerB2 : '' }}
          </div>
        </div>
        <!-- TODO 沒有用到 form 的驗證 -->
        <q-form>
          <q-item
            v-for="(resultItem, index) in localList"
            :key="index"
            class="row"
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
                class="text-capitalize"
                filled
                type="number"
                v-model="resultItem.scoreA"
                label="比分A"
                lazy-rules
                :rules="[required()]"
              />
            </q-item-section>
            <q-item-section class="col-5">
              <q-input
                class="text-capitalize"
                filled
                type="number"
                v-model="resultItem.scoreB"
                label="比分B"
                lazy-rules
                :rules="[required()]"
              />
            </q-item-section>

            <q-item-section class="col-1">
              <q-btn
                v-if="index === localList.length - 1"
                flat
                icon="mdi-delete"
                color="negative"
                size="md"
                @click="removeField(index)"
              />
            </q-item-section>
          </q-item>
        </q-form>
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
          @click="onReset"
          class="col no-border-radius text-caption dialog__btn"
        />
        <q-btn
          :ripple="false"
          no-caps
          color="primary"
          label="確認"
          class="col no-border-radius text-caption no-margin text-capitalize dialog__btn"
          type="submit"
          @click="onSubmit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
