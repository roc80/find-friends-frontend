<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import fetchUserInfo, {parseTags} from "@/user/UserUtil";

let currentUser = ref<API.User>({
  userName: '',
  avatarUrl: '',
  userId: 0,
  gender: '',
  email: '',
  phone: '',
  userRole: '',
  createDatetime: '',
  state: '',
  tags: '',
});

onMounted(async () => {
  fetchUserInfo()
      .then((response) => {
        currentUser.value = response?.data
      })
      .catch((error) => {
        console.log(error);
      });
});

const userEditPagePath = '/user/edit';
const router = useRouter()
const goEditPage = (key: string, fieldName: string) => {
  if (key in currentUser.value) {
    const typedKey = key as keyof API.User;
    router.push({
      path: userEditPagePath,
      query: {
        key: key,
        name: fieldName,
        value: currentUser.value[typedKey]
      },
    })
  }
}
</script>

<template>
  <div class="user-profile">
    <!-- 头像 -->
    <div style="display:flex; justify-content: center;">
      <van-image
          :src=currentUser.avatarUrl
          round fill="contain"
          width="100"
          height="100"
      />
    </div>

    <van-cell-group>
      <!-- 用户名 -->
      <van-cell title="用户名" :value=currentUser.userName is-link @click="goEditPage('userName', '用户名')"/>

      <!-- 性别 -->
      <van-cell title="性别" :value="currentUser.gender" is-link @click="goEditPage('gender', '性别')"/>

      <!-- 邮箱 -->
      <van-cell title="邮箱" :value="currentUser.email" is-link @click="goEditPage('email', '邮箱')"/>

      <!-- 电话 -->
      <van-cell title="电话" :value="currentUser.phone" is-link @click="goEditPage('phone', '电话')"/>

      <!-- 用户角色 -->
      <van-cell title="用户角色" :value="currentUser.userRole"/>

      <!-- 创建时间 -->
      <van-cell title="注册时间" :value="currentUser.createDatetime"/>

      <!-- 标签 -->
      <van-cell title="标签" is-link @click="goEditPage('tags', '标签')">
        <template #value>
          <van-tag
              v-for="tag in parseTags(currentUser.tags)"
              type="primary"
              style="margin-right: 5px; margin-bottom: 5px"
          >
            {{ tag }}
          </van-tag>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<style scoped>
</style>