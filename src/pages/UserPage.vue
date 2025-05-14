<script setup lang="ts">
import {computed, ref} from "vue";
// todo 用户中心和找伙伴 打通，找伙伴页面有登录态，需要能获取到当前登录的用户信息。这里先用假数据。

const currentUser = ref<API.User>({
  userId: 1,
  userName: 'lipeng',
  avatarUrl: 'https://avatars.githubusercontent.com/u/85272827?v=4',
  gender: '男',
  email: '123455677',
  phone: '124892947',
  userRole: '管理员',
  state: '正常',
  createDatetime: '2024-11-08 13:06:20',
  tags: '["Java", "男", "西安"]',
})

// 解析标签JSON
const tagList = computed(() => {
  try {
    return JSON.parse(currentUser.value.tags);
  } catch {
    return [];
  }
});
const userEditPagePath = '/user/edit';
</script>

<template>
  <div class="user-profile">
    <!-- 头像 -->
    <div class="avatar-container" style="display:flex; justify-content: center;">
      <van-image
          round
          fill="contain"
          width="100"
          height="100"
          :src=currentUser.avatarUrl
      />
    </div>

    <van-cell-group>
      <!-- 用户名 -->
      <van-cell title="用户名" :value=currentUser.userName is-link
                :to="{
                  path: userEditPagePath,
                  query: {
                    name: 'userName',
                    value: currentUser.userName,
                    text: '用户名',
                  },
                }"
      />

      <!-- 性别 -->
      <van-cell title="性别" :value=currentUser.gender is-link
                :to="{
                  path: userEditPagePath,
                  query: {
                    name: 'gender',
                    value: currentUser.gender,
                    text: '性别',
                  },
                }"
      />

      <!-- 邮箱 -->
      <van-cell title="邮箱" :value="currentUser.email" is-link
                :to="{
                  path: userEditPagePath,
                  query: {
                    name: 'email',
                    value: currentUser.email,
                    text: '邮箱',
                  },
                }"
      />

      <!-- 电话 -->
      <van-cell title="电话" :value="currentUser.phone" is-link
                :to="{
                  path: userEditPagePath,
                  query: {
                    name: 'phone',
                    value: currentUser.phone,
                    text: '电话',
                  },
                }"
      />

      <!-- 用户角色 -->
      <van-cell title="用户角色" :value="currentUser.userRole"/>

      <!-- 创建时间 -->
      <van-cell title="注册时间" :value="currentUser.createDatetime"/>

      <!-- 标签 -->
      <van-cell title="标签">
        <template #value>
          <van-tag
              v-for="(tag, index) in tagList"
              :key="index"
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