<script setup lang="ts">
import { HttpStatusCode } from 'axios';
import { Notify } from 'quasar';
import {
  Ref, ref,
} from 'vue';
import { useRouter } from 'vue-router';
import { useApiPlayerStore } from '@/apiStores/apiPlayer.store';

import { required } from '@/constants/rule.constant';
import { MenuEnum } from '@/enums/common.enum';
import { PlayerPost } from '@/types/player';

/** base */
const { postPlayerList } = useApiPlayerStore();
const router = useRouter();

const defaultPlayerPost: PlayerPost = {
  name: '',
};
const postList: Ref<PlayerPost[]> = ref([{ ...defaultPlayerPost }]);

function onReset() {
  postList.value.length = 0;
  postList.value.push({ ...defaultPlayerPost });
}

async function onSubmit() {
  const res = await postPlayerList(postList.value);

  if (res?.status === HttpStatusCode.Ok) {
    Notify.create({
      message: '新增成功',
      color: 'primary',
    });

    router.push({ name: MenuEnum.Player });
  } else {
    Notify.create({
      message: '新增失敗',
      color: 'negative',
    });
  }
}

function addField() {
  postList.value.push({ ...defaultPlayerPost });
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
          v-for="(player, key) in postList"
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
            <q-input
              class="text-capitalize"
              filled
              type="text"
              v-model="player.name"
              label="名字"
              lazy-rules
              :rules="[required()]"
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
