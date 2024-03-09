<script lang="ts" setup>
import { defineModel } from 'vue';

const date = defineModel({ required: true, type: String });

</script>
<template>
  <div
    style="max-width: 300px"
  >
    <q-input
      filled
      v-model="date"
    >
      <template #append>
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
              mask="YYYY-MM-DD"
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
    </q-input>
  </div>
</template>
