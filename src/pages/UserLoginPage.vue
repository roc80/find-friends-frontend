<script setup lang="ts">
import myAxios from "@/utils/myAxios";
import {ref} from "vue";
import {showFailToast, showSuccessToast} from "vant";
import {useRoute, useRouter} from "vue-router";
import {useUserStore} from "@/stores/UserLoginState";
import {UserAPI} from "@/api/user";
import {CommonResponse, User} from "@/typing";

const username = ref('');
const password = ref('');
const router = useRouter();
const route = useRoute();
const onSubmit = async () => {
  try {
    const res = await myAxios.post<CommonResponse<User>>(UserAPI.login, {
      username: username.value,
      password: password.value
    });
    if (res.code === 20000) {
      useUserStore().setUser(res.data!)
      const redirect = route.query.redirect as string;
      console.log('after login redirect: ', redirect);
      if (redirect) {
        await router.push(redirect);
      } else {
        await router.push('/');
      }
      showSuccessToast('登录成功');
    } else {
      showFailToast('登录失败');
    }
  } catch (e) {
    console.log(`${UserAPI.login} 请求失败`, e);
    showFailToast('登录失败，请稍后重试');
  }
};
</script>

<template>

  <van-nav-bar id ="nav-bar" :title="route.meta.title as string" />

  <div id="container">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
            v-model="username"
            name="username"
            label="用户名"
            placeholder="用户名"
            :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
            v-model="password"
            type="password"
            name="password"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
        />
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>

</template>

<style scoped>
#nav-bar {
  position: sticky;
  height: 20px;
}
#container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 20px);
}
</style>