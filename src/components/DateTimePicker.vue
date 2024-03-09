<script lang="ts" setup>
import { defineModel } from 'vue';
import { required } from '@/constants/rule.constant';

const date = defineModel({ required: true, type: String });

</script>
<template>
  <div
    class="q-pa-md"
    style="max-width: 300px"
  >
    <q-input
      filled
      v-model="date"
      :rules="[required()]"
    >
      <template #prepend>
        <q-icon
          name="event"
          class="cursor-pointer"
        >
          <q-popup-proxy
            cover
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date
              v-model="date"
              mask="YYYY-MM-DD HH:mm"
            >
              <div class="row items-center justify-end">
                <q-btn
                  v-close-popup
                  label="Close"
                  color="primary"
                  flat
                />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>

      <template #append>
        <q-icon
          name="access_time"
          class="cursor-pointer"
        >
          <q-popup-proxy
            cover
            transition-show="scale"
            transition-hide="scale"
          >
            <q-time
              v-model="date"
              mask="YYYY-MM-DD HH:mm"
              format24h
              :rules="[required()]"
            >
              <div class="row items-center justify-end">
                <q-btn
                  v-close-popup
                  label="Close"
                  color="primary"
                  flat
                />
              </div>
            </q-time>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>
