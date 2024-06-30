<script setup lang="ts">
import changelogList from '@/../changelog';

/** base */

</script>

<template>
  <div class="q-px-lg q-py-md">
    <q-timeline color="secondary">
      <q-timeline-entry heading>
        更新日誌
      </q-timeline-entry>

      <q-timeline-entry
        v-for="(log, key) in changelogList"
        :key="key"
        :title="log.version"
        :subtitle="log.date"
        color="orange"
        icon="mdi-check-circle"
      >
        <q-list>
          <q-item
            v-for="(item, itemKey) in log.list"
            :key="itemKey"
            clickable
            v-ripple
          >
            <q-item-section>
              {{ item }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-timeline-entry>
    </q-timeline>
  </div>
</template>
