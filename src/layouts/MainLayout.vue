<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { MenuEnum } from '@/enums/common.enum';

const router = useRouter();

const tabs = [
  {
    name: '首頁',
    icon: 'mdi-home',
    to: MenuEnum.Home,

  },
  {
    name: '選手',
    icon: 'mdi-account',
    to: MenuEnum.Player,

  },
  {
    name: '賽事',
    icon: 'mdi-trophy',
    to: MenuEnum.Result,

  },
];

function moveRoute(key: MenuEnum) {
  return router.push({ name: key });
}

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Table Tennis Admin
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <template
          v-for="tab in tabs"
          :key="tab"
        >
          <q-item
            v-close-popup
            class="dropdown__item"
            active-class="text-negative"
            clickable
            manual-focus
            @click="moveRoute(tab.to)"
          >
            <q-item-section no-wrap>
              {{ tab.name }}
            </q-item-section>
            <q-item-section avatar>
              <q-icon
                :name="tab.icon"
                color="bg-grey-14"
              />
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-drawer>

    <q-page-container class="q-pa-lg q-mt-md">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style lang="scss">
.iconSize [class ~= "q-tab__icon"] {
  font-size: 48px;
}

</style>
