<script setup lang="ts">
import { HttpStatusCode } from 'axios';
import { storeToRefs } from 'pinia';
import { Notify } from 'quasar';
import {
  Ref, ref,
} from 'vue';
import { useRouter } from 'vue-router';
import { useApiEventStore } from '@/apiStores/apiEvent.store';
import { useApiResultStore } from '@/apiStores/apiResult.store';
import { required } from '@/constants/rule.constant';
import {
  EventTypeEnum, MenuEnum,
} from '@/enums/common.enum';
import { ResultPost } from '@/types/result';

/** base */
const { postResultList } = useApiResultStore();
const { getEventList } = useApiEventStore();
const { eventList } = storeToRefs(useApiEventStore());
const router = useRouter();

void getEventList();

const defaultResultPost: ResultPost = {
  event_id: null,
  round: null,
  event_type: EventTypeEnum.AnnualSingle,
};
const postList: Ref<ResultPost[]> = ref([{ ...defaultResultPost }]);

function onReset() {
  postList.value.length = 0;
  postList.value.push({ ...defaultResultPost });
}

async function onSubmit() {
  const res = await postResultList(postList.value);

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
  postList.value.push({ ...defaultResultPost });
}

function removeField(index: number) {
  postList.value.splice(index, 1);
}

</script>

<template>
  <div>
    <q-item>
      <q-btn
        class="q-mb-md text-capitalize"
        @click="addField()"
        color="secondary"
        label="增加"
      />
    </q-item>
    <q-form
      @submit="onSubmit"
      @reset="onReset"
    >
      <q-list>
        <q-item
          v-for="(result, key) in postList"
          :key="key"
          class="row"
        >
          <q-item-section class="col-1">
            <q-field>
              <template #control>
                {{ key + 1 }}
              </template>
            </q-field>
          </q-item-section>
          <q-item-section class="col-5">
            <q-select
              v-model="result.event_id"
              :options="eventList"
              label="選擇賽事"
              option-label="name"
              option-value="id"
              emit-value
              map-options
              :rules="[required()]"
            />
          </q-item-section>
          <q-item-section class="col-5">
            <q-input
              class="text-capitalize"
              filled
              type="number"
              v-model="result.round"
              label="幾強賽"
              lazy-rules
              :rules="[required(), (val) => !(val > 0 && (val & (val - 1))) || '請輸入 2、4、8、16 的數字']"
            />
          </q-item-section>
          <q-item-section class="col-1">
            <q-btn
              v-if="key !== 0"
              flat
              icon="mdi-delete"
              color="negative"
              size="md"
              @click="removeField(key)"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-btn
            label="送出"
            class="text-capitalize"
            type="submit"
            color="primary"
          />
          <q-btn
            label="重置"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm text-capitalize"
          />
        </q-item>
      </q-list>
    </q-form>
  </div>
</template>
