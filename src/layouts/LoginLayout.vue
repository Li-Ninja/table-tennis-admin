<script setup lang="ts">
//
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container class="window-height column justify-center">
      <suspense>
        <router-view />
      </suspense>
    </q-page-container>
  </q-layout>
</template>
