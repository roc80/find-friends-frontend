<script setup lang="ts">
import myAxios from "@/utils/myAxios";
import {ref} from "vue";
import {showFailToast, showSuccessToast} from "vant";
import {useRouter} from "vue-router";

const username = ref('');
const password = ref('');
const router = useRouter()
const onSubmit = () => {
  myAxios.post('/user/login', {
    username: username.value,
    password: password.value
  }).then(res => {
    console.log(res);
    if (res.code === 20000) {
      showSuccessToast('登录成功')
      router.replace('/')
    } else {
      showFailToast('登录失败')
    }
  })
};
</script>

<template>
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

</template>

<style scoped>

</style>