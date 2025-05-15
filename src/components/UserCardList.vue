<script setup lang="ts">
import User = API.User;
import {parseTags} from "@/user/UserUtil";

const props = defineProps<{ userList: User[]}>()
</script>

<template>
  <div class="user-list">
    <van-empty v-if="!userList || userList.length == 0" description="未找到用户"/>
    <van-card class="custom-card" v-for="user in userList"
              :thumb=user.avatarUrl
              :title=user.userName
              :desc=user.email
    >
      <template #tags>
        <van-tag v-for="tagName in parseTags(user.tags)" plain type="primary" style="margin-top: 5px; margin-right: 5px">
          {{ tagName }}
        </van-tag>
      </template>
      <template #footer>
        <van-button size="small">更多信息</van-button>
      </template>
    </van-card>
  </div>
</template>

<style scoped>
.custom-card {
  --van-card-thumb-radius: 60px;
  --van-card-thumb-size: 70px;
}
</style>