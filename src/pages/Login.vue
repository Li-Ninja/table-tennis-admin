<script setup lang="ts">
import { HttpStatusCode } from 'axios';
import { Notify } from 'quasar';
import {
  Ref, ref, shallowRef,
} from 'vue';
import { useRouter } from 'vue-router';
import { useAuthApi } from '@/apis/auth.api';
import { required } from '@/constants/rule.constant';
import { MenuEnum } from '@/enums/common.enum';
import { LoginPost } from '@/types/auth';
import { useLocalStorage } from '@/utils/localStorage.util';

const router = useRouter();
const loginPostData: Ref<LoginPost> = ref({
  account: '',
  password: '',
});
const isPwd = shallowRef(true);

async function login() {
  // TODO any
  const res = await useAuthApi().getLoginToken(loginPostData.value) as any;

  if (res?.status === HttpStatusCode.Ok) {
    if (res.data.res as any === 'success') {
      useLocalStorage().setToken(res.data.token);

      router.push({ name: MenuEnum.Home });
    }
  } else {
    Notify.create({
      message: '登入失敗',
      color: 'primary',
    });
  }
}

</script>

<template>
  <div class="row justify-center">
    <div class="col-12 row justify-center text-capitalize">
      <div class="col-12 row justify-center">
        <q-img
          src="ttt_51_logo.png"
          ratio="1"
          sizes="120px"
          width="120px"
        />
      </div>
      <h1 class="col-12 text-center text-h5">
        桌球神秘 51 區登入後台
      </h1>
      <h2 class="col-12 text-center text-h6">
        登入
      </h2>
    </div>

    <q-form
      class="col-6 row"
      @submit="login"
    >
      <q-input
        class="col-12"
        v-model="loginPostData.account"
        label="帳號"
        :rules="[required()]"
      />
      <q-input
        class="col-12"
        :type="isPwd ? 'password' : 'text'"
        v-model="loginPostData.password"
        label="密碼"
        :rules="[required()]"
      >
        <template #append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
      <div class="col-12 row justify-center">
        <q-btn
          class="q-mt-md"
          type="submit"
          color="primary"
          label="登入"
        />
      </div>
    </q-form>
  </div>
</template>
