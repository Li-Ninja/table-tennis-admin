<script lang="ts" setup>
import { defineModel } from 'vue';

const time = defineModel({ required: true, type: String });

defineProps({
  label: {
    type: String,
    default: '',
  },
  rules: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <div style="max-width: 300px">
    <q-input
      filled
      v-model="time"
      :label="label"
      :rules="rules"
    >
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
              v-model="time"
              mask="HH:mm"
              format24h
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
